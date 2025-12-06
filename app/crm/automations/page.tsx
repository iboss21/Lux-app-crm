import Link from 'next/link'
import { 
  Plus, 
  Zap,
  Play,
  Pause,
  Edit,
  Trash2,
  Calendar,
  Mail,
  Bell,
  MessageSquare,
  Clock,
  CheckCircle
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { automations } from '@/lib/schema'
import { desc } from 'drizzle-orm'
import { formatDate } from '@/lib/utils'

interface AutomationData {
  id: string
  name: string
  trigger: string | null
  isActive: boolean | null
  executionCount: number | null
  lastExecutedAt: Date | null
  createdAt: Date
}

async function getAutomations(): Promise<AutomationData[]> {
  const db = getDb()
  if (!db) return []
  
  try {
    const allAutomations = await db
      .select()
      .from(automations)
      .orderBy(desc(automations.createdAt))
      .limit(100)
    
    return allAutomations.map(automation => ({
      id: automation.id,
      name: automation.name,
      trigger: automation.trigger,
      isActive: automation.isActive,
      executionCount: automation.executionCount,
      lastExecutedAt: automation.lastExecutedAt,
      createdAt: automation.createdAt,
    }))
  } catch (error) {
    console.error('Error fetching automations:', error)
    return []
  }
}

function getTriggerIcon(trigger: string | null) {
  switch (trigger) {
    case 'booking.created':
    case 'booking.status_changed':
      return <Calendar className="h-5 w-5 text-blue-500" />
    case 'invoice.created':
    case 'invoice.paid':
      return <Mail className="h-5 w-5 text-green-500" />
    case 'lead.created':
    case 'lead.status_changed':
      return <MessageSquare className="h-5 w-5 text-purple-500" />
    case 'reminder':
    case 'scheduled':
      return <Clock className="h-5 w-5 text-orange-500" />
    default:
      return <Zap className="h-5 w-5 text-yellow-500" />
  }
}

function getTriggerLabel(trigger: string | null) {
  const labels: Record<string, string> = {
    'booking.created': 'New Booking',
    'booking.status_changed': 'Booking Status Change',
    'invoice.created': 'Invoice Created',
    'invoice.paid': 'Invoice Paid',
    'lead.created': 'New Lead',
    'lead.status_changed': 'Lead Status Change',
    'reminder': 'Scheduled Reminder',
    'customer.inactive': 'Inactive Customer',
  }
  return labels[trigger || ''] || trigger || 'Custom Trigger'
}

// Example automation templates
const automationTemplates = [
  {
    name: 'Booking Confirmation Email',
    trigger: 'booking.created',
    description: 'Send confirmation email when a new booking is created',
    icon: Mail,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    name: '24h Reminder',
    trigger: 'reminder',
    description: 'Send reminder 24 hours before scheduled service',
    icon: Bell,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    name: 'Post-Service Follow-up',
    trigger: 'booking.status_changed',
    description: 'Send thank you email after job completion',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600',
  },
  {
    name: 'Lead Follow-up',
    trigger: 'lead.created',
    description: 'Send welcome email to new leads',
    icon: MessageSquare,
    color: 'bg-purple-100 text-purple-600',
  },
]

export default async function AutomationsPage() {
  const allAutomations = await getAutomations()
  const db = getDb()
  
  const activeCount = allAutomations.filter(a => a.isActive).length
  const totalExecutions = allAutomations.reduce((sum, a) => sum + (a.executionCount || 0), 0)
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            Automations
          </h1>
          <p className="text-gray-500 mt-1">
            Set up automated workflows to save time
          </p>
        </div>
        <Link href="/crm/automations/new" className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Create Automation
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-primary">{allAutomations.length}</div>
          <div className="text-sm text-gray-500">Total Automations</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          <div className="text-sm text-gray-500">Active</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{totalExecutions}</div>
          <div className="text-sm text-gray-500">Total Executions</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-gray-600">
            {allAutomations.length - activeCount}
          </div>
          <div className="text-sm text-gray-500">Inactive</div>
        </div>
      </div>
      
      {/* Quick templates */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
            Quick Start Templates
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {automationTemplates.map((template, index) => (
              <button
                key={index}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition group"
              >
                <div className={`w-10 h-10 rounded-lg ${template.color} flex items-center justify-center mb-3`}>
                  <template.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-primary transition">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Automations list */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
            Your Automations
          </h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {allAutomations.length > 0 ? (
            allAutomations.map((automation) => (
              <div key={automation.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      automation.isActive ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {getTriggerIcon(automation.trigger)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800">
                          {automation.name}
                        </h3>
                        <span className={`badge text-xs ${
                          automation.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {automation.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>Trigger: {getTriggerLabel(automation.trigger)}</span>
                        <span>•</span>
                        <span>{automation.executionCount || 0} executions</span>
                        {automation.lastExecutedAt && (
                          <>
                            <span>•</span>
                            <span>Last run: {formatDate(automation.lastExecutedAt)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      className={`p-2 rounded-lg transition ${
                        automation.isActive 
                          ? 'hover:bg-yellow-50 text-yellow-600' 
                          : 'hover:bg-green-50 text-green-600'
                      }`}
                      title={automation.isActive ? 'Pause' : 'Activate'}
                    >
                      {automation.isActive ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </button>
                    <Link
                      href={`/crm/automations/${automation.id}/edit`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4 text-gray-500" />
                    </Link>
                    <button
                      className="p-2 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state py-12">
              <Zap className="empty-state-icon" />
              <p className="empty-state-title">No automations yet</p>
              <p className="empty-state-description">
                {db ? 'Create your first automation to streamline your workflow' : 'Connect your database to view automations'}
              </p>
              <Link href="/crm/automations/new" className="btn btn-primary mt-4">
                <Plus className="h-4 w-4" />
                Create Automation
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
