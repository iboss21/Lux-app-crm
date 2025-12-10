import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Edit,
  Trash2,
  Plus,
  User,
  Clock
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { customers, bookings, customerReviews, invoices } from '@/lib/schema'
import { eq, desc, count } from 'drizzle-orm'
import { formatCurrency, formatDate, formatPhone } from '@/lib/utils'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getCustomerDetails(id: string) {
  const db = getDb()
  if (!db) return null
  
  try {
    const customerResult = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id))
      .limit(1)
    
    if (customerResult.length === 0) return null
    
    const customer = customerResult[0]
    
    // Get bookings
    const customerBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.customerId, id))
      .orderBy(desc(bookings.createdAt))
      .limit(10)
    
    // Get booking stats
    const bookingStats = await db
      .select({ count: count() })
      .from(bookings)
      .where(eq(bookings.customerId, id))
    
    // Get reviews
    const reviews = await db
      .select()
      .from(customerReviews)
      .where(eq(customerReviews.customerId, id))
      .orderBy(desc(customerReviews.createdAt))
      .limit(5)
    
    // Get invoices
    const customerInvoices = await db
      .select()
      .from(invoices)
      .where(eq(invoices.customerId, id))
      .orderBy(desc(invoices.createdAt))
      .limit(5)
    
    return {
      customer,
      bookings: customerBookings,
      bookingCount: bookingStats[0]?.count || 0,
      reviews,
      invoices: customerInvoices,
    }
  } catch (error) {
    console.error('Error fetching customer details:', error)
    return null
  }
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params
  const data = await getCustomerDetails(id)
  
  if (!data) {
    notFound()
  }
  
  const { customer, bookings: customerBookings, bookingCount, reviews, invoices: customerInvoices } = data
  
  const totalSpent = customerInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + parseFloat(inv.total || '0'), 0)
  
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.filter(r => r.rating).length
    : 0
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/crm/customers" 
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-gray-500 text-sm">
              Customer since {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${
            customer.membershipTier === 'vip' ? 'bg-accent text-primary font-semibold' :
            customer.membershipTier === 'premium' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {customer.membershipTier?.toUpperCase() || 'STANDARD'}
          </span>
          <Link href={`/crm/customers/${customer.id}/edit`} className="btn btn-ghost">
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
          <div className="text-2xl font-bold text-primary">{bookingCount}</div>
          <div className="text-sm text-gray-500">Total Bookings</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalSpent)}</div>
          <div className="text-sm text-gray-500">Total Spent</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-yellow-500">{avgRating.toFixed(1)}</div>
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
          </div>
          <div className="text-sm text-gray-500">Average Rating</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-accent">{formatCurrency(customer.lifetimeValue || 0)}</div>
          <div className="text-sm text-gray-500">Lifetime Value</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent bookings */}
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                Recent Bookings
              </h2>
              <Link href={`/crm/bookings/new?customerId=${customer.id}`} className="btn btn-sm btn-primary">
                <Plus className="h-4 w-4" />
                New Booking
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {customerBookings.length > 0 ? (
                customerBookings.map((booking) => (
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
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No bookings yet</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                  Reviews
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= (review.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-600 text-sm">&ldquo;{review.comment}&rdquo;</p>
                    )}
                  </div>
                ))}
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
                <span className="text-sm">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{formatPhone(customer.phone)}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="text-sm">
                    {customer.address}
                    {customer.aptUnit && `, ${customer.aptUnit}`}
                    <br />
                    {customer.city}, {customer.state} {customer.zipCode}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Additional details */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                Details
              </h2>
            </div>
            <div className="card-body space-y-3 text-sm">
              {customer.source && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Source</span>
                  <span className="font-medium capitalize">{customer.source}</span>
                </div>
              )}
              {customer.referralSource && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Referral From</span>
                  <span className="font-medium">{customer.referralSource}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Account Type</span>
                <span className="font-medium capitalize">{customer.membershipTier || 'Standard'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Joined</span>
                <span className="font-medium">{formatDate(customer.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {/* Recent invoices */}
          {customerInvoices.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                  Recent Invoices
                </h2>
              </div>
              <div className="card-body space-y-3">
                {customerInvoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/crm/invoices/${invoice.id}`}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition"
                  >
                    <div className="text-sm">
                      <div className="font-medium">{invoice.invoiceNumber || `INV-${invoice.id.slice(0, 8)}`}</div>
                      <div className="text-xs text-gray-500">{formatDate(invoice.createdAt)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">{formatCurrency(invoice.total)}</div>
                      <span className={`badge text-xs ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {invoice.status || 'Draft'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
