import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Star,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Briefcase,
  Award,
  Clock
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { cleaners, bookings, regions, payouts, cleanerAvailability } from '@/lib/schema'
import { eq, desc, count } from 'drizzle-orm'
import { formatCurrency, formatDate, formatPhone } from '@/lib/utils'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getCleanerDetails(id: string) {
  const db = getDb()
  if (!db) return null
  
  try {
    const cleanerResult = await db
      .select()
      .from(cleaners)
      .where(eq(cleaners.id, id))
      .limit(1)
    
    if (cleanerResult.length === 0) return null
    
    const cleaner = cleanerResult[0]
    
    // Get region info
    let region = null
    if (cleaner.regionId) {
      const regionResult = await db
        .select()
        .from(regions)
        .where(eq(regions.id, cleaner.regionId))
        .limit(1)
      if (regionResult.length > 0) {
        region = regionResult[0]
      }
    }
    
    // Get assigned bookings
    const cleanerBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.assignedTo, id))
      .orderBy(desc(bookings.createdAt))
      .limit(10)
    
    // Get booking stats
    const bookingStats = await db
      .select({ count: count() })
      .from(bookings)
      .where(eq(bookings.assignedTo, id))
    
    // Get payouts
    const cleanerPayouts = await db
      .select()
      .from(payouts)
      .where(eq(payouts.cleanerId, id))
      .orderBy(desc(payouts.createdAt))
      .limit(5)
    
    // Get availability
    const availability = await db
      .select()
      .from(cleanerAvailability)
      .where(eq(cleanerAvailability.cleanerId, id))
    
    return {
      cleaner,
      region,
      bookings: cleanerBookings,
      bookingCount: bookingStats[0]?.count || 0,
      payouts: cleanerPayouts,
      availability,
    }
  } catch (error) {
    console.error('Error fetching cleaner details:', error)
    return null
  }
}

export default async function CleanerDetailPage({ params }: PageProps) {
  const { id } = await params
  const data = await getCleanerDetails(id)
  
  if (!data) {
    notFound()
  }
  
  const { cleaner, region, bookings: cleanerBookings, bookingCount, payouts: cleanerPayouts } = data
  
  const totalEarned = cleanerPayouts
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + parseFloat(p.totalAmount || '0'), 0)
  
  const completedJobs = cleanerBookings.filter(b => b.status === 'completed').length
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/crm/cleaners" 
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-2xl">
                {cleaner.firstName?.[0]}{cleaner.lastName?.[0]}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
                {cleaner.firstName} {cleaner.lastName}
              </h1>
              <p className="text-gray-500 text-sm">
                {cleaner.role?.replace('-', ' ').toUpperCase() || 'CLEANER'} • Member since {formatDate(cleaner.createdAt)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            cleaner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {cleaner.isActive ? 'Active' : 'Inactive'}
          </div>
          <Link href={`/crm/cleaners/${cleaner.id}/edit`} className="btn btn-ghost">
            <Edit className="h-4 w-4" />
            Edit
          </Link>
          <button className="btn btn-ghost text-danger">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-primary">{cleaner.totalJobs || bookingCount}</div>
          <div className="text-sm text-gray-500">Total Jobs</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{completedJobs}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-yellow-500">{cleaner.rating || 'N/A'}</div>
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
          </div>
          <div className="text-sm text-gray-500">Rating</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-accent">{formatCurrency(totalEarned)}</div>
          <div className="text-sm text-gray-500">Total Earned</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned jobs */}
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                Assigned Jobs
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {cleanerBookings.length > 0 ? (
                cleanerBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/crm/bookings/${booking.id}`}
                    className="p-4 hover:bg-gray-50 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {booking.serviceType || 'Standard Clean'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {booking.specificDate ? formatDate(booking.specificDate) : 'Not scheduled'}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`badge text-xs ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'in-progress' ? 'bg-orange-100 text-orange-700' :
                        booking.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {booking.status || 'Pending'}
                      </span>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {booking.estimatedPrice ? formatCurrency(booking.estimatedPrice) : '-'}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No jobs assigned yet</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Payout history */}
          {cleanerPayouts.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                  Payout History
                </h2>
              </div>
              <div className="table-container border-0">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Paid Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cleanerPayouts.map((payout) => (
                      <tr key={payout.id}>
                        <td className="text-sm">
                          {payout.periodStart && payout.periodEnd ? (
                            <>
                              {formatDate(payout.periodStart)} - {formatDate(payout.periodEnd)}
                            </>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="font-semibold">{formatCurrency(payout.totalAmount)}</td>
                        <td>
                          <span className={`badge text-xs ${
                            payout.status === 'paid' ? 'bg-green-100 text-green-700' :
                            payout.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            payout.status === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {payout.status || 'Pending'}
                          </span>
                        </td>
                        <td className="text-sm">
                          {payout.paidDate ? formatDate(payout.paidDate) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact info */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                Contact Information
              </h2>
            </div>
            <div className="card-body space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{cleaner.email}</span>
              </div>
              {cleaner.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{formatPhone(cleaner.phone)}</span>
                </div>
              )}
              {region && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{region.name}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Details */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                Details
              </h2>
            </div>
            <div className="card-body space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Role</span>
                <span className="font-medium capitalize">{cleaner.role?.replace('-', ' ') || 'Cleaner'}</span>
              </div>
              {cleaner.hourlyRate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Hourly Rate</span>
                  <span className="font-medium">${cleaner.hourlyRate}/hr</span>
                </div>
              )}
              {cleaner.commissionRate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Commission</span>
                  <span className="font-medium">{cleaner.commissionRate}%</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Joined</span>
                <span className="font-medium">{formatDate(cleaner.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {/* Skills */}
          {cleaner.skills && cleaner.skills.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                  Skills & Certifications
                </h2>
              </div>
              <div className="card-body">
                <div className="flex flex-wrap gap-2">
                  {cleaner.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm flex items-center gap-2"
                    >
                      <Award className="h-3.5 w-3.5" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Performance */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                Performance
              </h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Completion Rate</span>
                  <span className="font-medium">
                    {bookingCount > 0 ? Math.round((completedJobs / bookingCount) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${bookingCount > 0 ? (completedJobs / bookingCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Customer Rating</span>
                  <span className="font-medium flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                    {cleaner.rating || 'N/A'}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${cleaner.rating ? (parseFloat(cleaner.rating) / 5) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
