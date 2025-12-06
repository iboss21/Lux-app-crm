import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  UserPlus,
  Check,
  X
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { bookings, customers, cleaners } from '@/lib/schema'
import { eq, sql, desc } from 'drizzle-orm'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'

interface BookingWithDetails {
  id: string
  serviceType: string | null
  status: string | null
  scheduledDate: Date | null
  estimatedPrice: string | null
  customerName: string
  cleanerName: string | null
  createdAt: Date
}

async function getBookings(): Promise<BookingWithDetails[]> {
  const db = getDb()
  if (!db) return []
  
  try {
    const allBookings = await db
      .select({
        id: bookings.id,
        serviceType: bookings.serviceType,
        status: bookings.status,
        scheduledDate: bookings.specificDate,
        estimatedPrice: bookings.estimatedPrice,
        customerId: bookings.customerId,
        assignedTo: bookings.assignedTo,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .orderBy(desc(bookings.createdAt))
      .limit(100)
    
    const result: BookingWithDetails[] = []
    
    for (const booking of allBookings) {
      let customerName = 'Unknown Customer'
      let cleanerName: string | null = null
      
      if (booking.customerId) {
        const customer = await db
          .select({ firstName: customers.firstName, lastName: customers.lastName })
          .from(customers)
          .where(eq(customers.id, booking.customerId))
          .limit(1)
        if (customer.length > 0) {
          customerName = `${customer[0].firstName} ${customer[0].lastName}`
        }
      }
      
      if (booking.assignedTo) {
        const cleaner = await db
          .select({ firstName: cleaners.firstName, lastName: cleaners.lastName })
          .from(cleaners)
          .where(eq(cleaners.id, booking.assignedTo))
          .limit(1)
        if (cleaner.length > 0) {
          cleanerName = `${cleaner[0].firstName} ${cleaner[0].lastName}`
        }
      }
      
      result.push({
        id: booking.id,
        serviceType: booking.serviceType,
        status: booking.status,
        scheduledDate: booking.scheduledDate,
        estimatedPrice: booking.estimatedPrice,
        customerName,
        cleanerName,
        createdAt: booking.createdAt,
      })
    }
    
    return result
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
}

export default async function BookingsPage() {
  const allBookings = await getBookings()
  const db = getDb()
  
  // Get counts
  const pendingCount = allBookings.filter(b => b.status === 'pending').length
  const assignedCount = allBookings.filter(b => b.status === 'assigned').length
  const inProgressCount = allBookings.filter(b => b.status === 'in-progress').length
  const completedCount = allBookings.filter(b => b.status === 'completed').length
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            Bookings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage all service bookings
          </p>
        </div>
        <Link href="/crm/bookings/new" className="btn btn-primary">
          <Plus className="h-5 w-5" />
          New Booking
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{assignedCount}</div>
          <div className="text-sm text-gray-500">Assigned</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-orange-600">{inProgressCount}</div>
          <div className="text-sm text-gray-500">In Progress</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="input py-2 text-sm">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select className="input py-2 text-sm">
            <option value="">All Services</option>
            <option value="standard">Standard Clean</option>
            <option value="deep">Deep Clean</option>
            <option value="move-out">Move Out</option>
            <option value="office">Office Clean</option>
          </select>
          <button className="btn btn-ghost text-sm">
            <Filter className="h-4 w-4" />
            More Filters
          </button>
        </div>
      </div>
      
      {/* Bookings table */}
      <div className="card">
        <div className="table-container border-0">
          {allBookings.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <button className="flex items-center gap-1 hover:text-gray-800">
                      Customer
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th>Service</th>
                  <th>
                    <button className="flex items-center gap-1 hover:text-gray-800">
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="font-medium text-gray-900">{booking.customerName}</div>
                      <div className="text-xs text-gray-500">
                        Created {formatDate(booking.createdAt)}
                      </div>
                    </td>
                    <td>{booking.serviceType || 'Standard Clean'}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {booking.scheduledDate ? formatDate(booking.scheduledDate) : 'Not scheduled'}
                      </div>
                    </td>
                    <td>
                      {booking.cleanerName ? (
                        <span className="text-gray-900">{booking.cleanerName}</span>
                      ) : (
                        <span className="text-gray-400 text-sm italic">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getStatusColor(booking.status || 'pending')}`}>
                        {booking.status || 'Pending'}
                      </span>
                    </td>
                    <td className="font-medium">
                      {booking.estimatedPrice ? formatCurrency(booking.estimatedPrice) : '-'}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/crm/bookings/${booking.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Link>
                        {!booking.cleanerName && (
                          <Link
                            href={`/crm/bookings/${booking.id}/assign`}
                            className="p-2 hover:bg-blue-50 rounded-lg transition"
                            title="Assign Cleaner"
                          >
                            <UserPlus className="h-4 w-4 text-blue-500" />
                          </Link>
                        )}
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          title="More Actions"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state py-12">
              <Calendar className="empty-state-icon" />
              <p className="empty-state-title">No bookings yet</p>
              <p className="empty-state-description">
                {db ? 'Create your first booking to get started' : 'Connect your database to view bookings'}
              </p>
              <Link href="/crm/bookings/new" className="btn btn-primary mt-4">
                <Plus className="h-4 w-4" />
                Create Booking
              </Link>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {allBookings.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {allBookings.length} bookings
            </p>
            <div className="flex items-center gap-2">
              <button className="btn btn-ghost btn-sm" disabled>
                Previous
              </button>
              <button className="btn btn-ghost btn-sm">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
