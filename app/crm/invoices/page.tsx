import Link from 'next/link'
import { 
  Plus, 
  Search, 
  FileText,
  Mail,
  DollarSign,
  Calendar,
  Eye,
  Send,
  MoreHorizontal,
  Download,
  CheckCircle
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { invoices, customers, bookings } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'

interface InvoiceData {
  id: string
  invoiceNumber: string | null
  customerName: string
  bookingId: string | null
  subtotal: string | null
  tax: string | null
  total: string | null
  status: string | null
  dueDate: Date | null
  paidDate: Date | null
  createdAt: Date
}

async function getInvoices(): Promise<InvoiceData[]> {
  const db = getDb()
  if (!db) return []
  
  try {
    const allInvoices = await db
      .select()
      .from(invoices)
      .orderBy(desc(invoices.createdAt))
      .limit(100)
    
    const result: InvoiceData[] = []
    
    for (const invoice of allInvoices) {
      let customerName = 'Unknown Customer'
      
      if (invoice.customerId) {
        const customer = await db
          .select({ firstName: customers.firstName, lastName: customers.lastName })
          .from(customers)
          .where(eq(customers.id, invoice.customerId))
          .limit(1)
        if (customer.length > 0) {
          customerName = `${customer[0].firstName} ${customer[0].lastName}`
        }
      }
      
      result.push({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        customerName,
        bookingId: invoice.bookingId,
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        total: invoice.total,
        status: invoice.status,
        dueDate: invoice.dueDate,
        paidDate: invoice.paidDate,
        createdAt: invoice.createdAt,
      })
    }
    
    return result
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return []
  }
}

function getInvoiceStatusColor(status: string | null) {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-700'
    case 'sent':
      return 'bg-blue-100 text-blue-700'
    case 'overdue':
      return 'bg-red-100 text-red-700'
    case 'draft':
      return 'bg-gray-100 text-gray-700'
    case 'cancelled':
      return 'bg-gray-400 text-white'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default async function InvoicesPage() {
  const allInvoices = await getInvoices()
  const db = getDb()
  
  const statusCounts = {
    draft: allInvoices.filter(i => i.status === 'draft').length,
    sent: allInvoices.filter(i => i.status === 'sent').length,
    paid: allInvoices.filter(i => i.status === 'paid').length,
    overdue: allInvoices.filter(i => i.status === 'overdue').length,
  }
  
  const totalRevenue = allInvoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + parseFloat(i.total || '0'), 0)
  
  const pendingAmount = allInvoices
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + parseFloat(i.total || '0'), 0)
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            Invoices
          </h1>
          <p className="text-gray-500 mt-1">
            Manage invoices and track payments
          </p>
        </div>
        <Link href="/crm/invoices/new" className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Create Invoice
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
          <div className="text-sm text-gray-500">Total Collected</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.sent}</div>
          <div className="text-sm text-gray-500">Awaiting Payment</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-red-600">{statusCounts.overdue}</div>
          <div className="text-sm text-gray-500">Overdue</div>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="input py-2 text-sm">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="btn btn-ghost text-sm">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
      
      {/* Invoices table */}
      <div className="card">
        <div className="table-container border-0">
          {allInvoices.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Paid Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <div className="font-medium text-gray-900">
                        {invoice.invoiceNumber || `INV-${invoice.id.slice(0, 8)}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created {formatDate(invoice.createdAt)}
                      </div>
                    </td>
                    <td>{invoice.customerName}</td>
                    <td>
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(invoice.total)}
                      </div>
                      {invoice.tax && (
                        <div className="text-xs text-gray-500">
                          Tax: {formatCurrency(invoice.tax)}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getInvoiceStatusColor(invoice.status)}`}>
                        {invoice.status || 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {invoice.dueDate ? formatDate(invoice.dueDate) : 'Not set'}
                      </div>
                    </td>
                    <td>
                      {invoice.paidDate ? (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle className="h-3.5 w-3.5" />
                          {formatDate(invoice.paidDate)}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/crm/invoices/${invoice.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          title="View Invoice"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Link>
                        {invoice.status === 'draft' && (
                          <button
                            className="p-2 hover:bg-blue-50 rounded-lg transition"
                            title="Send Invoice"
                          >
                            <Send className="h-4 w-4 text-blue-500" />
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
              <FileText className="empty-state-icon" />
              <p className="empty-state-title">No invoices yet</p>
              <p className="empty-state-description">
                {db ? 'Create your first invoice to start tracking payments' : 'Connect your database to view invoices'}
              </p>
              <Link href="/crm/invoices/new" className="btn btn-primary mt-4">
                <Plus className="h-4 w-4" />
                Create Invoice
              </Link>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {allInvoices.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {allInvoices.length} invoices
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
