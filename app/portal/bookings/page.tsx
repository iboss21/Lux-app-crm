import Link from 'next/link'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { bookings } from '@/lib/schema'
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils'

interface BookingData {
  id: string
  serviceType: string | null
  status: string | null
  scheduledDate: Date | null
  scheduledTime: string | null
  estimatedPrice: string | null
  address: string | null
  createdAt: Date
}

async function getCustomerBookings(): Promise<BookingData[]> {
  // In production, this would filter by authenticated customer
  const db = getDb()
  if (!db) return []
  
  try {
    const allBookings = await db
      .select({
        id: bookings.id,
        serviceType: bookings.serviceType,
        status: bookings.status,
        scheduledDate: bookings.specificDate,
        scheduledTime: bookings.specificTime,
        estimatedPrice: bookings.estimatedPrice,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .limit(10)
    
    return allBookings.map(b => ({
      ...b,
      address: '123 Customer St, Los Angeles, CA', // Placeholder
    }))
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
}

function getStatusIcon(status: string | null) {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'cancelled':
      return <XCircle className="h-5 w-5 text-red-500" />
    case 'in-progress':
    case 'en-route':
      return <AlertCircle className="h-5 w-5 text-orange-500" />
    default:
      return <Clock className="h-5 w-5 text-blue-500" />
  }
}

export default async function CustomerBookingsPage() {
  const customerBookings = await getCustomerBookings()
  
  const upcomingBookings = customerBookings.filter(b => 
    b.status !== 'completed' && b.status !== 'cancelled'
  )
  const pastBookings = customerBookings.filter(b => 
    b.status === 'completed' || b.status === 'cancelled'
  )
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/portal/dashboard" className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold font-serif text-accent">
            My Bookings
          </h1>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Quick book CTA */}
        <Link
          href="/portal/book"
          className="block w-full p-4 rounded-xl text-white text-center font-semibold"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
        >
          <Plus className="h-5 w-5 inline mr-2" />
          Book New Cleaning
        </Link>
        
        {/* Upcoming bookings */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming</h2>
          
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/portal/bookings/${booking.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4">
                    {getStatusIcon(booking.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">
                          {booking.serviceType || 'Standard Clean'}
                        </h3>
                        <span className={`badge text-xs ${getStatusColor(booking.status || 'pending')}`}>
                          {booking.status || 'Pending'}
                        </span>
                      </div>
                      
                      <div className="mt-2 space-y-1 text-sm text-gray-500">
                        {booking.scheduledDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(booking.scheduledDate)}</span>
                            {booking.scheduledTime && (
                              <span>at {booking.scheduledTime}</span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.address}</span>
                        </div>
                      </div>
                      
                      {booking.estimatedPrice && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-sm text-gray-500">Estimated</span>
                          <span className="font-semibold text-primary">
                            {formatCurrency(booking.estimatedPrice)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming bookings</p>
              <Link href="/portal/book" className="text-primary font-medium hover:underline">
                Book your next cleaning
              </Link>
            </div>
          )}
        </div>
        
        {/* Past bookings */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Past Bookings</h2>
          
          {pastBookings.length > 0 ? (
            <div className="space-y-3">
              {pastBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/portal/bookings/${booking.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(booking.status)}
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {booking.serviceType || 'Standard Clean'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(booking.scheduledDate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`badge text-xs ${getStatusColor(booking.status || 'pending')}`}>
                        {booking.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-gray-500">No past bookings yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
