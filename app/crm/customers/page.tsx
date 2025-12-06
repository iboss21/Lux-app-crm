import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Users,
  Mail,
  Phone,
  MapPin,
  Eye,
  Edit,
  MoreHorizontal,
  Star,
  Calendar,
  DollarSign
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { customers, bookings } from '@/lib/schema'
import { eq, sql, desc, count } from 'drizzle-orm'
import { formatCurrency, formatDate, formatPhone } from '@/lib/utils'

interface CustomerWithStats {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  membershipTier: string | null
  lifetimeValue: string | null
  source: string | null
  createdAt: Date
  bookingsCount: number
}

async function getCustomers(): Promise<CustomerWithStats[]> {
  const db = getDb()
  if (!db) return []
  
  try {
    const allCustomers = await db
      .select()
      .from(customers)
      .orderBy(desc(customers.createdAt))
      .limit(100)
    
    const result: CustomerWithStats[] = []
    
    for (const customer of allCustomers) {
      // Get bookings count
      const bookingsResult = await db
        .select({ count: count() })
        .from(bookings)
        .where(eq(bookings.customerId, customer.id))
      
      const bookingsCount = bookingsResult[0]?.count || 0
      
      result.push({
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        membershipTier: customer.membershipTier,
        lifetimeValue: customer.lifetimeValue,
        source: customer.source,
        createdAt: customer.createdAt,
        bookingsCount,
      })
    }
    
    return result
  } catch (error) {
    console.error('Error fetching customers:', error)
    return []
  }
}

function getMembershipBadge(tier: string | null) {
  switch (tier) {
    case 'vip':
      return 'bg-accent text-primary font-semibold'
    case 'premium':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default async function CustomersPage() {
  const allCustomers = await getCustomers()
  const db = getDb()
  
  const totalValue = allCustomers.reduce(
    (sum, c) => sum + parseFloat(c.lifetimeValue || '0'), 
    0
  )
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            Customers
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your customer database
          </p>
        </div>
        <Link href="/crm/customers/new" className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Add Customer
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-primary">{allCustomers.length}</div>
          <div className="text-sm text-gray-500">Total Customers</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-accent">
            {allCustomers.filter(c => c.membershipTier === 'vip').length}
          </div>
          <div className="text-sm text-gray-500">VIP Members</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalValue)}
          </div>
          <div className="text-sm text-gray-500">Total Lifetime Value</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">
            {allCustomers.filter(c => c.source === 'website').length}
          </div>
          <div className="text-sm text-gray-500">From Website</div>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="input py-2 text-sm">
            <option value="">All Memberships</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="vip">VIP</option>
          </select>
          <select className="input py-2 text-sm">
            <option value="">All Sources</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="phone">Phone</option>
          </select>
        </div>
      </div>
      
      {/* Customers list */}
      <div className="card">
        <div className="table-container border-0">
          {allCustomers.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Membership</th>
                  <th>Bookings</th>
                  <th>Lifetime Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">
                            {customer.firstName?.[0]}{customer.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            Since {formatDate(customer.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            {formatPhone(customer.phone)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      {customer.city && customer.state ? (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          {customer.city}, {customer.state}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getMembershipBadge(customer.membershipTier)}`}>
                        {customer.membershipTier?.toUpperCase() || 'STANDARD'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {customer.bookingsCount}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 font-medium">
                        <DollarSign className="h-3.5 w-3.5 text-green-500" />
                        {customer.lifetimeValue ? formatCurrency(customer.lifetimeValue) : '$0.00'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/crm/customers/${customer.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          title="View Profile"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Link>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          title="More"
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
              <Users className="empty-state-icon" />
              <p className="empty-state-title">No customers yet</p>
              <p className="empty-state-description">
                {db ? 'Add your first customer to get started' : 'Connect your database to view customers'}
              </p>
              <Link href="/crm/customers/new" className="btn btn-primary mt-4">
                <Plus className="h-4 w-4" />
                Add Customer
              </Link>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {allCustomers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {allCustomers.length} customers
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
