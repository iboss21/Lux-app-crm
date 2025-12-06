import Link from 'next/link'
import { 
  Map,
  Search,
  Plus,
  Calendar,
  Clock,
  User,
  MapPin,
  Navigation,
  Eye,
  MoreHorizontal,
  Filter
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { routes, cleaners } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { formatDate } from '@/lib/utils'

interface RouteData {
  id: string
  cleanerName: string
  date: Date | null
  jobCount: number
  totalDistance: string | null
  totalTime: number | null
  status: string | null
  createdAt: Date
}

async function getRoutes(): Promise<RouteData[]> {
  const db = getDb()
  if (!db) return []
  
  try {
    const allRoutes = await db
      .select()
      .from(routes)
      .orderBy(desc(routes.date))
      .limit(100)
    
    const result: RouteData[] = []
    
    for (const route of allRoutes) {
      let cleanerName = 'Unknown Cleaner'
      
      if (route.cleanerId) {
        const cleaner = await db
          .select({ firstName: cleaners.firstName, lastName: cleaners.lastName })
          .from(cleaners)
          .where(eq(cleaners.id, route.cleanerId))
          .limit(1)
        if (cleaner.length > 0) {
          cleanerName = `${cleaner[0].firstName} ${cleaner[0].lastName}`
        }
      }
      
      result.push({
        id: route.id,
        cleanerName,
        date: route.date,
        jobCount: route.jobs?.length || 0,
        totalDistance: route.totalDistance,
        totalTime: route.totalTime,
        status: route.status,
        createdAt: route.createdAt,
      })
    }
    
    return result
  } catch (error) {
    console.error('Error fetching routes:', error)
    return []
  }
}

function getRouteStatusBadge(status: string | null) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700'
    case 'in-progress':
      return 'bg-orange-100 text-orange-700'
    case 'planned':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default async function RoutesPage() {
  const allRoutes = await getRoutes()
  const db = getDb()
  
  const statusCounts = {
    planned: allRoutes.filter(r => r.status === 'planned').length,
    inProgress: allRoutes.filter(r => r.status === 'in-progress').length,
    completed: allRoutes.filter(r => r.status === 'completed').length,
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            Routes
          </h1>
          <p className="text-gray-500 mt-1">
            Plan and optimize cleaner routes
          </p>
        </div>
        <Link href="/crm/routes/new" className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Create Route
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-primary">{allRoutes.length}</div>
          <div className="text-sm text-gray-500">Total Routes</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.planned}</div>
          <div className="text-sm text-gray-500">Planned</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-orange-600">{statusCounts.inProgress}</div>
          <div className="text-sm text-gray-500">In Progress</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search routes..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="input py-2 text-sm">
            <option value="">All Statuses</option>
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <input type="date" className="input py-2 text-sm" />
          <button className="btn btn-ghost text-sm">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>
      
      {/* Routes list */}
      <div className="card">
        <div className="table-container border-0">
          {allRoutes.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Cleaner</th>
                  <th>Date</th>
                  <th>Jobs</th>
                  <th>Distance</th>
                  <th>Est. Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allRoutes.map((route) => (
                  <tr key={route.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {route.cleanerName}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {route.date ? formatDate(route.date) : 'Not set'}
                      </div>
                    </td>
                    <td>
                      <span className="font-medium">{route.jobCount} jobs</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <Navigation className="h-3.5 w-3.5 text-gray-400" />
                        {route.totalDistance ? `${route.totalDistance} mi` : 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        {route.totalTime ? `${route.totalTime} min` : 'N/A'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getRouteStatusBadge(route.status)}`}>
                        {route.status || 'Planned'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/crm/routes/${route.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          title="View Route"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Link>
                        <button
                          className="p-2 hover:bg-blue-50 rounded-lg transition"
                          title="View on Map"
                        >
                          <Map className="h-4 w-4 text-blue-500" />
                        </button>
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
              <Map className="empty-state-icon" />
              <p className="empty-state-title">No routes yet</p>
              <p className="empty-state-description">
                {db ? 'Create your first route to optimize cleaner schedules' : 'Connect your database to view routes'}
              </p>
              <Link href="/crm/routes/new" className="btn btn-primary mt-4">
                <Plus className="h-4 w-4" />
                Create Route
              </Link>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {allRoutes.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {allRoutes.length} routes
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
      
      {/* Map placeholder */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
            Route Map
          </h2>
        </div>
        <div className="card-body">
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Map view requires Google Maps API key</p>
              <p className="text-sm">Configure in Settings → Integrations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
