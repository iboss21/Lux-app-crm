import { 
  Search, 
  Calendar,
  User,
  Clock,
  Shield,
  FileText,
  DollarSign,
  Settings,
  LogIn,
  LogOut,
  Download
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { activityLogs } from '@/lib/schema'
import { desc } from 'drizzle-orm'
import { formatDateTime } from '@/lib/utils'

interface AuditLogData {
  id: string
  userId: string | null
  userType: string | null
  action: string | null
  entity: string | null
  entityId: string | null
  changes: unknown
  ipAddress: string | null
  createdAt: Date
}

async function getAuditLogs(): Promise<AuditLogData[]> {
  const db = getDb()
  if (!db) return []
  
  try {
    const logs = await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(100)
    
    return logs.map(log => ({
      id: log.id,
      userId: log.userId,
      userType: log.userType,
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      changes: log.changes,
      ipAddress: log.ipAddress,
      createdAt: log.createdAt,
    }))
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return []
  }
}

function getActionIcon(action: string | null) {
  switch (action) {
    case 'created':
      return <FileText className="h-4 w-4 text-green-500" />
    case 'updated':
      return <Settings className="h-4 w-4 text-blue-500" />
    case 'deleted':
      return <FileText className="h-4 w-4 text-red-500" />
    case 'login':
      return <LogIn className="h-4 w-4 text-green-500" />
    case 'logout':
      return <LogOut className="h-4 w-4 text-gray-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-400" />
  }
}

function getActionBadge(action: string | null) {
  switch (action) {
    case 'created':
      return 'bg-green-100 text-green-700'
    case 'updated':
      return 'bg-blue-100 text-blue-700'
    case 'deleted':
      return 'bg-red-100 text-red-700'
    case 'login':
      return 'bg-purple-100 text-purple-700'
    case 'logout':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

function getEntityIcon(entity: string | null) {
  switch (entity) {
    case 'booking':
      return <Calendar className="h-4 w-4 text-blue-500" />
    case 'customer':
      return <User className="h-4 w-4 text-green-500" />
    case 'invoice':
      return <DollarSign className="h-4 w-4 text-yellow-500" />
    case 'user':
    case 'admin':
      return <Shield className="h-4 w-4 text-purple-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-400" />
  }
}

export default async function AuditLogsPage() {
  const logs = await getAuditLogs()
  const db = getDb()
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            Audit Logs
          </h1>
          <p className="text-gray-500 mt-1">
            Track all system activity and changes
          </p>
        </div>
        <button className="btn btn-ghost">
          <Download className="h-4 w-4" />
          Export Logs
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="input py-2 text-sm">
            <option value="">All Actions</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="deleted">Deleted</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
          </select>
          <select className="input py-2 text-sm">
            <option value="">All Entities</option>
            <option value="booking">Bookings</option>
            <option value="customer">Customers</option>
            <option value="invoice">Invoices</option>
            <option value="cleaner">Cleaners</option>
            <option value="user">Users</option>
          </select>
          <input type="date" className="input py-2 text-sm" />
        </div>
      </div>
      
      {/* Logs table */}
      <div className="card">
        <div className="table-container border-0">
          {logs.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {formatDateTime(log.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {log.userId ? `User ${log.userId.slice(0, 8)}...` : 'System'}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {log.userType || 'system'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className={`badge text-xs ${getActionBadge(log.action)}`}>
                          {log.action || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getEntityIcon(log.entity)}
                        <span className="text-sm capitalize">
                          {log.entity || 'Unknown'}
                        </span>
                        {log.entityId && (
                          <span className="text-xs text-gray-400">
                            #{log.entityId.slice(0, 8)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {log.changes ? (
                        <button className="text-sm text-primary hover:underline">
                          View Changes
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td>
                      <span className="text-sm text-gray-500 font-mono">
                        {log.ipAddress || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state py-12">
              <Shield className="empty-state-icon" />
              <p className="empty-state-title">No audit logs</p>
              <p className="empty-state-description">
                {db ? 'Activity logs will appear here as actions are performed' : 'Connect your database to view audit logs'}
              </p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {logs.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {logs.length} logs
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
      
      {/* Info box */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="card-body">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">About Audit Logs</h3>
              <p className="text-sm text-blue-700 mt-1">
                Audit logs track all critical actions in the system including booking changes, 
                invoice updates, user role changes, and authentication events. Logs are retained 
                for 90 days for compliance purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
