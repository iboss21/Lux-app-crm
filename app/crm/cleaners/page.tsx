import Link from 'next/link'
import { 
  Plus, 
  Search, 
  User,
  Mail,
  Phone,
  MapPin,
  Eye,
  Edit,
  MoreHorizontal,
  Star,
  Calendar,
  CheckCircle,
  XCircle,
  Briefcase
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { cleaners, regions } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { formatCurrency, formatDate, formatPhone } from '@/lib/utils'

interface CleanerWithDetails {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  role: string | null
  skills: string[] | null
  hourlyRate: string | null
  isActive: boolean | null
  rating: string | null
  totalJobs: number | null
  totalRevenue: string | null
  regionName: string | null
  createdAt: Date
}

async function getCleaners(): Promise<CleanerWithDetails[]> {
  const db = getDb()
  if (!db) return []
  
  try {
    const allCleaners = await db
      .select()
      .from(cleaners)
      .orderBy(desc(cleaners.createdAt))
      .limit(100)
    
    const result: CleanerWithDetails[] = []
    
    for (const cleaner of allCleaners) {
      let regionName: string | null = null
      
      if (cleaner.regionId) {
        const region = await db
          .select({ name: regions.name })
          .from(regions)
          .where(eq(regions.id, cleaner.regionId))
          .limit(1)
        if (region.length > 0) {
          regionName = region[0].name
        }
      }
      
      result.push({
        id: cleaner.id,
        firstName: cleaner.firstName,
        lastName: cleaner.lastName,
        email: cleaner.email,
        phone: cleaner.phone,
        role: cleaner.role,
        skills: cleaner.skills,
        hourlyRate: cleaner.hourlyRate,
        isActive: cleaner.isActive,
        rating: cleaner.rating,
        totalJobs: cleaner.totalJobs,
        totalRevenue: cleaner.totalRevenue,
        regionName,
        createdAt: cleaner.createdAt,
      })
    }
    
    return result
  } catch (error) {
    console.error('Error fetching cleaners:', error)
    return []
  }
}

function getRoleBadge(role: string | null) {
  switch (role) {
    case 'supervisor':
      return 'bg-primary text-white'
    case 'lead-cleaner':
      return 'bg-blue-500 text-white'
    default:
      return 'bg-green-100 text-green-700'
  }
}

export default async function CleanersPage() {
  const allCleaners = await getCleaners()
  const db = getDb()
  
  const activeCount = allCleaners.filter(c => c.isActive).length
  const totalRevenue = allCleaners.reduce(
    (sum, c) => sum + parseFloat(c.totalRevenue || '0'), 
    0
  )
  const avgRating = allCleaners.length > 0 
    ? allCleaners.reduce((sum, c) => sum + parseFloat(c.rating || '0'), 0) / allCleaners.filter(c => c.rating).length
    : 0
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            Cleaners
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your cleaning team
          </p>
        </div>
        <Link href="/crm/cleaners/new" className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Add Cleaner
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-primary">{allCleaners.length}</div>
          <div className="text-sm text-gray-500">Total Cleaners</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          <div className="text-sm text-gray-500">Active</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-accent">
            {avgRating ? avgRating.toFixed(1) : 'N/A'}
          </div>
          <div className="text-sm text-gray-500">Avg Rating</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-sm text-gray-500">Total Revenue</div>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cleaners..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="input py-2 text-sm">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select className="input py-2 text-sm">
            <option value="">All Roles</option>
            <option value="cleaner">Cleaner</option>
            <option value="lead-cleaner">Lead Cleaner</option>
            <option value="supervisor">Supervisor</option>
          </select>
          <select className="input py-2 text-sm">
            <option value="">All Regions</option>
            <option value="los-angeles">Los Angeles</option>
            <option value="san-diego">San Diego</option>
            <option value="orange-county">Orange County</option>
          </select>
        </div>
      </div>
      
      {/* Cleaners grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCleaners.length > 0 ? (
          allCleaners.map((cleaner) => (
            <div key={cleaner.id} className="card">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">
                        {cleaner.firstName?.[0]}{cleaner.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {cleaner.firstName} {cleaner.lastName}
                      </div>
                      <span className={`badge text-xs ${getRoleBadge(cleaner.role)}`}>
                        {cleaner.role?.replace('-', ' ').toUpperCase() || 'CLEANER'}
                      </span>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${cleaner.isActive ? 'bg-green-500' : 'bg-gray-300'}`} 
                       title={cleaner.isActive ? 'Active' : 'Inactive'} />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{cleaner.email}</span>
                  </div>
                  {cleaner.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{formatPhone(cleaner.phone)}</span>
                    </div>
                  )}
                  {cleaner.regionName && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{cleaner.regionName}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-semibold">{cleaner.rating || 'N/A'}</span>
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{cleaner.totalJobs || 0}</div>
                    <div className="text-xs text-gray-500">Jobs</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-600">
                      {cleaner.hourlyRate ? `$${cleaner.hourlyRate}/hr` : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">Rate</div>
                  </div>
                </div>
                
                {cleaner.skills && cleaner.skills.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-1">
                      {cleaner.skills.slice(0, 3).map((skill, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {cleaner.skills.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          +{cleaner.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex gap-2">
                  <Link 
                    href={`/crm/cleaners/${cleaner.id}`}
                    className="btn btn-secondary flex-1 text-sm"
                  >
                    View Profile
                  </Link>
                  <button className="btn btn-ghost text-sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="card">
              <div className="empty-state py-12">
                <User className="empty-state-icon" />
                <p className="empty-state-title">No cleaners yet</p>
                <p className="empty-state-description">
                  {db ? 'Add your first cleaner to get started' : 'Connect your database to view cleaners'}
                </p>
                <Link href="/crm/cleaners/new" className="btn btn-primary mt-4">
                  <Plus className="h-4 w-4" />
                  Add Cleaner
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
