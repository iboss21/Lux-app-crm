import Link from 'next/link'
import { 
  Plus, 
  Search, 
  DollarSign,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  MoreHorizontal
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { payouts, cleaners } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { formatCurrency, formatDate } from '@/lib/utils'

interface PayoutData {
  id: string
  cleanerName: string
  periodStart: Date | null
  periodEnd: Date | null
  totalAmount: string | null
  status: string | null
  paidDate: Date | null
  paymentMethod: string | null
  createdAt: Date
}

async function getPayouts(): Promise<PayoutData[]> {
  const db = getDb()
  if (!db) return []
  
  try {
    const allPayouts = await db
      .select()
      .from(payouts)
      .orderBy(desc(payouts.createdAt))
      .limit(100)
    
    const result: PayoutData[] = []
    
    for (const payout of allPayouts) {
      let cleanerName = 'Unknown Cleaner'
      
      if (payout.cleanerId) {
        const cleaner = await db
          .select({ firstName: cleaners.firstName, lastName: cleaners.lastName })
          .from(cleaners)
          .where(eq(cleaners.id, payout.cleanerId))
          .limit(1)
        if (cleaner.length > 0) {
          cleanerName = `${cleaner[0].firstName} ${cleaner[0].lastName}`
        }
      }
      
      result.push({
        id: payout.id,
        cleanerName,
        periodStart: payout.periodStart,
        periodEnd: payout.periodEnd,
        totalAmount: payout.totalAmount,
        status: payout.status,
        paidDate: payout.paidDate,
        paymentMethod: payout.paymentMethod,
        createdAt: payout.createdAt,
      })
    }
    
    return result
  } catch (error) {
    console.error('Error fetching payouts:', error)
    return []
  }
}

function getPayoutStatusBadge(status: string | null) {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-700'
    case 'processing':
      return 'bg-blue-100 text-blue-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    case 'failed':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

function getPayoutStatusIcon(status: string | null) {
  switch (status) {
    case 'paid':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'processing':
      return <Clock className="h-4 w-4 text-blue-500" />
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />
    case 'failed':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-400" />
  }
}

export default async function PayoutsPage() {
  const allPayouts = await getPayouts()
  const db = getDb()
  
  const statusCounts = {
    pending: allPayouts.filter(p => p.status === 'pending').length,
    processing: allPayouts.filter(p => p.status === 'processing').length,
    paid: allPayouts.filter(p => p.status === 'paid').length,
    failed: allPayouts.filter(p => p.status === 'failed').length,
  }
  
  const totalPending = allPayouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.totalAmount || '0'), 0)
  
  const totalPaid = allPayouts
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + parseFloat(p.totalAmount || '0'), 0)
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            Payouts
          </h1>
          <p className="text-gray-500 mt-1">
            Manage cleaner commissions and payouts
          </p>
        </div>
        <Link href="/crm/payouts/new" className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Create Payout
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</div>
          <div className="text-sm text-gray-500">Pending Payouts</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
          <div className="text-sm text-gray-500">Total Paid Out</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.processing}</div>
          <div className="text-sm text-gray-500">Processing</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-red-600">{statusCounts.failed}</div>
          <div className="text-sm text-gray-500">Failed</div>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search payouts..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="input py-2 text-sm">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
          <button className="btn btn-ghost text-sm">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
      
      {/* Payouts table */}
      <div className="card">
        <div className="table-container border-0">
          {allPayouts.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Cleaner</th>
                  <th>Period</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Method</th>
                  <th>Paid Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allPayouts.map((payout) => (
                  <tr key={payout.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {payout.cleanerName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        {payout.periodStart && payout.periodEnd ? (
                          <>
                            {formatDate(payout.periodStart)} - {formatDate(payout.periodEnd)}
                          </>
                        ) : (
                          <span className="text-gray-400">Not set</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(payout.totalAmount)}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getPayoutStatusIcon(payout.status)}
                        <span className={`badge ${getPayoutStatusBadge(payout.status)}`}>
                          {payout.status || 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">
                        {payout.paymentMethod || 'Not specified'}
                      </span>
                    </td>
                    <td>
                      {payout.paidDate ? (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle className="h-3.5 w-3.5" />
                          {formatDate(payout.paidDate)}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/crm/payouts/${payout.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Link>
                        {payout.status === 'pending' && (
                          <button
                            className="p-2 hover:bg-green-50 rounded-lg transition"
                            title="Process Payout"
                          >
                            <DollarSign className="h-4 w-4 text-green-500" />
                          </button>
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
              <DollarSign className="empty-state-icon" />
              <p className="empty-state-title">No payouts yet</p>
              <p className="empty-state-description">
                {db ? 'Create your first payout to start paying your cleaners' : 'Connect your database to view payouts'}
              </p>
              <Link href="/crm/payouts/new" className="btn btn-primary mt-4">
                <Plus className="h-4 w-4" />
                Create Payout
              </Link>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {allPayouts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {allPayouts.length} payouts
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
