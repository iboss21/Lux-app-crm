import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Home,
  User,
  DollarSign,
  Edit,
  Trash2,
  UserPlus,
  CheckCircle,
  XCircle,
  Camera,
  FileText
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { bookings, customers, cleaners, timeTracking, jobPhotos } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { formatCurrency, formatDate, formatDateTime, formatPhone, getStatusColor } from '@/lib/utils'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getBookingDetails(id: string) {
  const db = getDb()
  if (!db) return null
  
  try {
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1)
    
    if (booking.length === 0) return null
    
    const bookingData = booking[0]
    let customer = null
    let cleaner = null
    let timeRecords: Array<{
      clockIn: Date | null
      clockOut: Date | null
      workTime: number | null
    }> = []
    let photos: Array<{
      id: string
      photoType: string | null
      photoUrl: string
      caption: string | null
    }> = []
    
    if (bookingData.customerId) {
      const customerResult = await db
        .select()
        .from(customers)
        .where(eq(customers.id, bookingData.customerId))
        .limit(1)
      if (customerResult.length > 0) {
        customer = customerResult[0]
      }
    }
    
    if (bookingData.assignedTo) {
      const cleanerResult = await db
        .select()
        .from(cleaners)
        .where(eq(cleaners.id, bookingData.assignedTo))
        .limit(1)
      if (cleanerResult.length > 0) {
        cleaner = cleanerResult[0]
      }
    }
    
    // Get time tracking records
    timeRecords = await db
      .select({
        clockIn: timeTracking.clockIn,
        clockOut: timeTracking.clockOut,
        workTime: timeTracking.workTime,
      })
      .from(timeTracking)
      .where(eq(timeTracking.bookingId, id))
    
    // Get photos
    photos = await db
      .select({
        id: jobPhotos.id,
        photoType: jobPhotos.photoType,
        photoUrl: jobPhotos.photoUrl,
        caption: jobPhotos.caption,
      })
      .from(jobPhotos)
      .where(eq(jobPhotos.bookingId, id))
    
    return {
      booking: bookingData,
      customer,
      cleaner,
      timeRecords,
      photos,
    }
  } catch (error) {
    console.error('Error fetching booking details:', error)
    return null
  }
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params
  const data = await getBookingDetails(id)
  
  if (!data) {
    notFound()
  }
  
  const { booking, customer, cleaner, timeRecords, photos } = data
  
  const beforePhotos = photos.filter(p => p.photoType === 'before')
  const afterPhotos = photos.filter(p => p.photoType === 'after')
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/crm/bookings" 
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
              Booking Details
            </h1>
            <p className="text-gray-500 text-sm">
              ID: {booking.id.slice(0, 8)}...
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge text-base ${getStatusColor(booking.status || 'pending')}`}>
            {booking.status || 'Pending'}
          </span>
          <button className="btn btn-ghost">
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service details card */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                Service Details
              </h2>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Service Type</p>
                  <p className="font-medium">{booking.serviceType || 'Standard Clean'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Property Type</p>
                  <p className="font-medium">{booking.propertyType || 'House'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Frequency</p>
                  <p className="font-medium capitalize">{booking.frequency || 'One-time'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Square Footage</p>
                  <p className="font-medium">{booking.squareFootage ? `${booking.squareFootage} sq ft` : 'N/A'}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="font-medium">{booking.bedrooms || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="font-medium">{booking.bathrooms || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Floors</p>
                  <p className="font-medium">{booking.floors || 1}</p>
                </div>
              </div>
              
              {booking.additionalServices && booking.additionalServices.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-500 mb-2">Additional Services</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.additionalServices.map((service: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-accent/20 text-primary rounded-full text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {booking.notes && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-700">{booking.notes}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Schedule card */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                Schedule & Timing
              </h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Scheduled Date</p>
                    <p className="font-medium">
                      {booking.specificDate ? formatDate(booking.specificDate) : 'Not scheduled'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Preferred Time</p>
                    <p className="font-medium">{booking.preferredTime || booking.specificTime || 'Flexible'}</p>
                  </div>
                </div>
              </div>
              
              {timeRecords.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-500 mb-2">Time Tracking</p>
                  {timeRecords.map((record, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div>
                        <span className="text-sm">Clock In: </span>
                        <span className="font-medium">
                          {record.clockIn ? formatDateTime(record.clockIn) : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm">Clock Out: </span>
                        <span className="font-medium">
                          {record.clockOut ? formatDateTime(record.clockOut) : 'In progress'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm">Duration: </span>
                        <span className="font-medium">
                          {record.workTime ? `${record.workTime} min` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Photos */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                Job Photos
              </h2>
            </div>
            <div className="card-body">
              {photos.length > 0 ? (
                <div className="space-y-6">
                  {beforePhotos.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Before</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {beforePhotos.map((photo) => (
                          <div key={photo.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={photo.photoUrl} 
                              alt={photo.caption || 'Before photo'} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {afterPhotos.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">After</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {afterPhotos.map((photo) => (
                          <div key={photo.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={photo.photoUrl} 
                              alt={photo.caption || 'After photo'} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Camera className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No photos uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer card */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                Customer
              </h2>
            </div>
            <div className="card-body space-y-4">
              {customer ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {customer.firstName?.[0]}{customer.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{customer.firstName} {customer.lastName}</p>
                      <p className="text-sm text-gray-500">Customer</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{formatPhone(customer.phone)}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>
                          {customer.address}
                          {customer.aptUnit && `, ${customer.aptUnit}`}
                          <br />
                          {customer.city}, {customer.state} {customer.zipCode}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    href={`/crm/customers/${customer.id}`}
                    className="btn btn-secondary w-full"
                  >
                    View Customer Profile
                  </Link>
                </>
              ) : (
                <p className="text-gray-500 text-center py-4">No customer assigned</p>
              )}
            </div>
          </div>
          
          {/* Cleaner card */}
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                Assigned Cleaner
              </h2>
            </div>
            <div className="card-body">
              {cleaner ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-semibold">
                        {cleaner.firstName?.[0]}{cleaner.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{cleaner.firstName} {cleaner.lastName}</p>
                      <p className="text-sm text-gray-500 capitalize">{cleaner.role}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    {cleaner.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{formatPhone(cleaner.phone)}</span>
                      </div>
                    )}
                    {cleaner.rating && (
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">★</span>
                        <span>{cleaner.rating} rating</span>
                      </div>
                    )}
                  </div>
                  
                  <button className="btn btn-ghost w-full text-danger">
                    <XCircle className="h-4 w-4" />
                    Unassign
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">No cleaner assigned</p>
                  <Link 
                    href={`/crm/bookings/${booking.id}/assign`}
                    className="btn btn-primary w-full"
                  >
                    <UserPlus className="h-4 w-4" />
                    Assign Cleaner
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Pricing card */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                Pricing
              </h2>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated</span>
                  <span className="font-semibold">
                    {booking.estimatedPrice ? formatCurrency(booking.estimatedPrice) : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Actual</span>
                  <span className="font-semibold">
                    {booking.actualPrice ? formatCurrency(booking.actualPrice) : '-'}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium">{booking.paymentMethod || 'Not specified'}</span>
                </div>
              </div>
              
              <button className="btn btn-accent w-full mt-4">
                <FileText className="h-4 w-4" />
                Generate Invoice
              </button>
            </div>
          </div>
          
          {/* Actions */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                Actions
              </h2>
            </div>
            <div className="card-body space-y-2">
              {booking.status === 'pending' && (
                <button className="btn btn-primary w-full">
                  <CheckCircle className="h-4 w-4" />
                  Mark as Assigned
                </button>
              )}
              {booking.status === 'in-progress' && (
                <button className="btn btn-primary w-full">
                  <CheckCircle className="h-4 w-4" />
                  Mark as Completed
                </button>
              )}
              <button className="btn btn-ghost w-full text-danger">
                <Trash2 className="h-4 w-4" />
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
