import Link from 'next/link'
import { 
  Plus, 
  Search, 
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  Flame,
  ThermometerSun,
  Snowflake,
  User,
  MoreHorizontal
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { leads } from '@/lib/schema'
import { desc } from 'drizzle-orm'
import { formatDate } from '@/lib/utils'

interface LeadData {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  source: string | null
  status: string | null
  temperature: string | null
  score: number | null
  lastContactDate: Date | null
  notes: string | null
  createdAt: Date
}

async function getLeads(): Promise<LeadData[]> {
  const db = getDb()
  if (!db) return []
  
  try {
    const allLeads = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt))
      .limit(100)
    
    return allLeads.map(lead => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
      temperature: lead.temperature,
      score: lead.score,
      lastContactDate: lead.lastContactDate,
      notes: lead.notes,
      createdAt: lead.createdAt,
    }))
  } catch (error) {
    console.error('Error fetching leads:', error)
    return []
  }
}

function getTemperatureIcon(temp: string | null) {
  switch (temp) {
    case 'hot':
      return <Flame className="h-4 w-4 text-red-500" />
    case 'warm':
      return <ThermometerSun className="h-4 w-4 text-orange-500" />
    case 'cold':
      return <Snowflake className="h-4 w-4 text-blue-500" />
    default:
      return <Snowflake className="h-4 w-4 text-gray-400" />
  }
}

function getStatusBadge(status: string | null) {
  const colors: Record<string, string> = {
    'new': 'bg-blue-100 text-blue-700',
    'contacted': 'bg-yellow-100 text-yellow-700',
    'qualified': 'bg-purple-100 text-purple-700',
    'proposal-sent': 'bg-indigo-100 text-indigo-700',
    'won': 'bg-green-100 text-green-700',
    'lost': 'bg-red-100 text-red-700',
  }
  return colors[status || 'new'] || 'bg-gray-100 text-gray-700'
}

export default async function LeadsPage() {
  const allLeads = await getLeads()
  const db = getDb()
  
  const statusCounts = {
    new: allLeads.filter(l => l.status === 'new').length,
    contacted: allLeads.filter(l => l.status === 'contacted').length,
    qualified: allLeads.filter(l => l.status === 'qualified').length,
    won: allLeads.filter(l => l.status === 'won').length,
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            Lead Management
          </h1>
          <p className="text-gray-500 mt-1">
            Track and convert your leads into customers
          </p>
        </div>
        <Link href="/crm/leads/new" className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Add Lead
        </Link>
      </div>
      
      {/* Pipeline stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.new}</div>
          <div className="text-sm text-gray-500">New Leads</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.contacted}</div>
          <div className="text-sm text-gray-500">Contacted</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-purple-600">{statusCounts.qualified}</div>
          <div className="text-sm text-gray-500">Qualified</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{statusCounts.won}</div>
          <div className="text-sm text-gray-500">Won</div>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="input py-2 text-sm">
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal-sent">Proposal Sent</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
          <select className="input py-2 text-sm">
            <option value="">All Temperatures</option>
            <option value="hot">Hot 🔥</option>
            <option value="warm">Warm ☀️</option>
            <option value="cold">Cold ❄️</option>
          </select>
        </div>
      </div>
      
      {/* Leads table */}
      <div className="card">
        <div className="table-container border-0">
          {allLeads.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Contact</th>
                  <th>Source</th>
                  <th>Temperature</th>
                  <th>Status</th>
                  <th>Last Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {lead.name || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Created {formatDate(lead.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        {lead.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3.5 w-3.5 text-gray-400" />
                            {lead.email}
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            {lead.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">
                        {lead.source || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getTemperatureIcon(lead.temperature)}
                        <span className="text-sm capitalize">
                          {lead.temperature || 'cold'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(lead.status)}`}>
                        {lead.status?.replace('-', ' ') || 'New'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        {lead.lastContactDate ? formatDate(lead.lastContactDate) : 'Never'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/crm/leads/${lead.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          title="View Details"
                        >
                          <ArrowRight className="h-4 w-4 text-gray-500" />
                        </Link>
                        <button
                          className="p-2 hover:bg-green-50 rounded-lg transition"
                          title="Convert to Customer"
                        >
                          <User className="h-4 w-4 text-green-500" />
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
              <MessageSquare className="empty-state-icon" />
              <p className="empty-state-title">No leads yet</p>
              <p className="empty-state-description">
                {db ? 'Add your first lead to start tracking prospects' : 'Connect your database to view leads'}
              </p>
              <Link href="/crm/leads/new" className="btn btn-primary mt-4">
                <Plus className="h-4 w-4" />
                Add Lead
              </Link>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {allLeads.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {allLeads.length} leads
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
