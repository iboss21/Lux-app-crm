// Role-based access control types and utilities
// Roles: ADMIN, MANAGER, TECHNICIAN, CSR, CUSTOMER

export type UserRole = 'admin' | 'manager' | 'technician' | 'csr' | 'customer'

export type UserType = 'admin' | 'cleaner' | 'customer'

// Permission definitions
export const PERMISSIONS = {
  // Booking permissions
  'bookings.view': ['admin', 'manager', 'csr', 'technician'],
  'bookings.create': ['admin', 'manager', 'csr'],
  'bookings.edit': ['admin', 'manager', 'csr'],
  'bookings.delete': ['admin', 'manager'],
  'bookings.assign': ['admin', 'manager', 'csr'],
  
  // Customer permissions
  'customers.view': ['admin', 'manager', 'csr'],
  'customers.create': ['admin', 'manager', 'csr'],
  'customers.edit': ['admin', 'manager', 'csr'],
  'customers.delete': ['admin', 'manager'],
  
  // Cleaner permissions
  'cleaners.view': ['admin', 'manager'],
  'cleaners.create': ['admin', 'manager'],
  'cleaners.edit': ['admin', 'manager'],
  'cleaners.delete': ['admin'],
  
  // Invoice permissions
  'invoices.view': ['admin', 'manager', 'csr'],
  'invoices.create': ['admin', 'manager', 'csr'],
  'invoices.edit': ['admin', 'manager'],
  'invoices.delete': ['admin'],
  
  // Payout permissions
  'payouts.view': ['admin', 'manager'],
  'payouts.create': ['admin'],
  'payouts.edit': ['admin'],
  
  // Settings permissions
  'settings.view': ['admin', 'manager'],
  'settings.edit': ['admin'],
  
  // Analytics permissions
  'analytics.view': ['admin', 'manager'],
  'analytics.export': ['admin', 'manager'],
  
  // Audit log permissions
  'audit.view': ['admin'],
} as const

export type Permission = keyof typeof PERMISSIONS

// Check if a role has a specific permission
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission]
  return allowedRoles.includes(role as never)
}

// Get all permissions for a role
export function getRolePermissions(role: UserRole): Permission[] {
  return Object.entries(PERMISSIONS)
    .filter(([_, roles]) => roles.includes(role as never))
    .map(([permission]) => permission as Permission)
}

// User session type
export interface UserSession {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  userType: UserType
  avatar?: string
  permissions: Permission[]
}

// Auth token payload
export interface TokenPayload {
  sub: string // user id
  email: string
  role: UserRole
  userType: UserType
  iat: number
  exp: number
}

// Role display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  technician: 'Technician',
  csr: 'Customer Service',
  customer: 'Customer',
}

// Role colors for UI
export const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-primary text-white',
  manager: 'bg-blue-600 text-white',
  technician: 'bg-green-600 text-white',
  csr: 'bg-purple-600 text-white',
  customer: 'bg-gray-600 text-white',
}
