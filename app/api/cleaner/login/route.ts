import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { cleaners } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    const db = getDb()
    if (!db) {
      // Demo mode - allow demo login
      if (email === 'demo@ecoshine.pro' && password === 'demo123') {
        const token = await createToken({
          sub: 'demo-cleaner-id',
          email: 'demo@ecoshine.pro',
          role: 'technician',
          userType: 'cleaner',
        })
        
        await setAuthCookie(token)
        
        return NextResponse.json({
          success: true,
          user: {
            id: 'demo-cleaner-id',
            email: 'demo@ecoshine.pro',
            firstName: 'Demo',
            lastName: 'Cleaner',
            role: 'technician',
          },
        })
      }
      
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }
    
    // Find cleaner by email
    const cleaner = await db
      .select()
      .from(cleaners)
      .where(eq(cleaners.email, email))
      .limit(1)
    
    if (cleaner.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    const cleanerData = cleaner[0]
    
    // Check if cleaner is active
    if (!cleanerData.isActive) {
      return NextResponse.json(
        { error: 'Account is not active' },
        { status: 401 }
      )
    }
    
    // Verify password
    const isValid = await verifyPassword(password, cleanerData.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Create token
    const token = await createToken({
      sub: cleanerData.id,
      email: cleanerData.email,
      role: 'technician',
      userType: 'cleaner',
    })
    
    await setAuthCookie(token)
    
    return NextResponse.json({
      success: true,
      user: {
        id: cleanerData.id,
        email: cleanerData.email,
        firstName: cleanerData.firstName,
        lastName: cleanerData.lastName,
        role: cleanerData.role,
      },
    })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
