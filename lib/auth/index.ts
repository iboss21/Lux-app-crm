import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { env } from '@/lib/env'
import type { UserRole, UserType, TokenPayload, UserSession } from './roles'
import { getRolePermissions } from './roles'

const JWT_SECRET = new TextEncoder().encode(env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production')
const TOKEN_EXPIRY = '7d'

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Create JWT token
export async function createToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

// Get current user session from cookies
export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) return null
    
    const payload = await verifyToken(token)
    if (!payload) return null
    
    return {
      id: payload.sub,
      email: payload.email,
      firstName: '',
      lastName: '',
      role: payload.role,
      userType: payload.userType,
      permissions: getRolePermissions(payload.role),
    }
  } catch {
    return null
  }
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

// Clear auth cookie
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

// Authentication result type
export interface AuthResult {
  success: boolean
  user?: UserSession
  token?: string
  error?: string
}

// Require authentication (for server components)
export async function requireAuth(allowedRoles?: UserRole[]): Promise<UserSession> {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    throw new Error('Forbidden')
  }
  
  return session
}

// Export types and utilities from roles
export * from './roles'
