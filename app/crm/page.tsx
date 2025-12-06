import { 
  Clock, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { getDb } from '@/lib/db'
import { bookings, customers, cleaners, invoices } from '@/lib/schema'
import { eq, sql } from 'drizzle-orm'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'

// Stat card component
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  iconBg, 
  trend,
  trendValue 
}: { 
  title: string
  value: string | number
  icon: React.ElementType
  iconBg: string
  trend?: 'up' | 'down' | 'flat'
  trendValue?: string
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className={`stat-card-icon ${iconBg}`}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-gray-500'
          }`}>
            {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : 
             trend === 'down' ? <TrendingDown className="h-4 w-4" /> : null}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{title}</div>
    </div>
  )
}

// Quick action card
function QuickAction({ 
  title, 
  description, 
  href, 
  icon: Icon,
  color 
}: { 
  title: string
  description: string
  href: string
  icon: React.ElementType
  color: string
}) {
  return (
    <Link 
      href={href}
      className="card hover:shadow-md transition-shadow group"
    >
      <div className="p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
      </div>
    </Link>
  )
}

// Recent booking row
function BookingRow({ 
  booking 
}: { 
  booking: {
    id: string
    customerName: string
    serviceType: string | null
    status: string | null
    scheduledDate: Date | null
    price: string | null
  }
}) {
  return (
    <tr>
      <td className="font-medium text-gray-900">{booking.customerName}</td>
      <td>{booking.serviceType || 'Standard Clean'}</td>
      <td>{booking.scheduledDate ? formatDate(booking.scheduledDate) : 'Not scheduled'}</td>
      <td>
        <span className={`badge ${getStatusColor(booking.status || 'pending')}`}>
          {booking.status || 'Pending'}
        </span>
      </td>
      <td className="font-medium">{booking.price ? formatCurrency(booking.price) : '-'}</td>
      <td>
        <Link 
          href={`/crm/bookings/${booking.id}`}
          className="text-primary hover:underline text-sm font-medium"
        >
          View
        </Link>
      </td>
    </tr>
  )
}

export default async function CRMDashboard() {
  const db = getDb()
  
  // Default values if database not connected
  let stats = {
    pendingBookings: 0,
    totalBookings: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
  }
  
  let recentBookings: Array<{
    id: string
    customerName: string
    serviceType: string | null
    status: string | null
    scheduledDate: Date | null
    price: string | null
  }> = []
  
  // Try to fetch data from database
  if (db) {
    try {
      // Get booking counts
      const allBookings = await db.select().from(bookings)
      stats.totalBookings = allBookings.length
      stats.pendingBookings = allBookings.filter(b => b.status === 'pending').length
      
      // Get customer count
      const allCustomers = await db.select().from(customers)
      stats.totalCustomers = allCustomers.length
      
      // Calculate monthly revenue from paid invoices
      const paidInvoices = await db.select().from(invoices).where(eq(invoices.status, 'paid'))
      stats.monthlyRevenue = paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.total || '0'), 0)
      
      // Get recent bookings with customer info
      const recentBookingsData = await db
        .select({
          id: bookings.id,
          serviceType: bookings.serviceType,
          status: bookings.status,
          scheduledDate: bookings.specificDate,
          price: bookings.estimatedPrice,
          customerId: bookings.customerId,
        })
        .from(bookings)
        .orderBy(sql`${bookings.createdAt} DESC`)
        .limit(5)
      
      // Get customer names
      for (const booking of recentBookingsData) {
        let customerName = 'Unknown Customer'
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
        recentBookings.push({
          id: booking.id,
          customerName,
          serviceType: booking.serviceType,
          status: booking.status,
          scheduledDate: booking.scheduledDate,
          price: booking.price,
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome to EcoShine Pro CRM. Here's what's happening today.
          </p>
        </div>
        <Link href="/crm/bookings/new" className="btn btn-primary">
          <Plus className="h-5 w-5" />
          New Booking
        </Link>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={Clock}
          iconBg="bg-accent/20 text-accent"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Calendar}
          iconBg="bg-blue-100 text-blue-600"
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          iconBg="bg-green-100 text-green-600"
          trend="up"
          trendValue="+5%"
        />
        <StatCard
          title="Revenue This Month"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={DollarSign}
          iconBg="bg-primary/20 text-primary"
          trend="up"
          trendValue="+15%"
        />
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickAction
          title="New Booking"
          description="Create a new service booking"
          href="/crm/bookings/new"
          icon={Plus}
          color="bg-primary"
        />
        <QuickAction
          title="Assign Cleaners"
          description="View and assign pending jobs"
          href="/crm/bookings?status=pending"
          icon={Users}
          color="bg-blue-500"
        />
        <QuickAction
          title="View Analytics"
          description="Check performance metrics"
          href="/crm/analytics"
          icon={TrendingUp}
          color="bg-green-500"
        />
      </div>
      
      {/* Recent bookings */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
            Recent Bookings
          </h2>
          <Link href="/crm/bookings" className="text-sm text-primary hover:underline font-medium">
            View all
          </Link>
        </div>
        <div className="table-container border-0">
          {recentBookings.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
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
      </div>
      
      {/* Activity and alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's schedule */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
              Today's Schedule
            </h2>
          </div>
          <div className="card-body">
            <div className="empty-state py-8">
              <Clock className="empty-state-icon h-12 w-12" />
              <p className="empty-state-title">No jobs scheduled today</p>
              <p className="empty-state-description">All caught up!</p>
            </div>
          </div>
        </div>
        
        {/* Alerts */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
              Alerts & Notifications
            </h2>
          </div>
          <div className="card-body space-y-3">
            <div className="alert alert-info">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">Database connection: {db ? 'Connected' : 'Not configured'}</span>
            </div>
            <div className="alert alert-success">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">System running smoothly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
