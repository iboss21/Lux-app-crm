'use client'

import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  ChevronRight,
  User,
  Home,
  Briefcase,
  Settings
} from 'lucide-react'
import { useState } from 'react'

// Mock data for demo
const mockJobs = [
  {
    id: '1',
    customerName: 'John Smith',
    address: '123 Main St, Los Angeles, CA 90001',
    serviceType: 'Deep Clean',
    scheduledTime: '9:00 AM - 12:00 PM',
    status: 'pending',
    estimatedPrice: 180,
  },
  {
    id: '2',
    customerName: 'Sarah Johnson',
    address: '456 Oak Ave, Los Angeles, CA 90002',
    serviceType: 'Standard Clean',
    scheduledTime: '1:00 PM - 3:00 PM',
    status: 'assigned',
    estimatedPrice: 120,
  },
  {
    id: '3',
    customerName: 'Mike Wilson',
    address: '789 Pine Rd, Los Angeles, CA 90003',
    serviceType: 'Move Out Clean',
    scheduledTime: '4:00 PM - 7:00 PM',
    status: 'assigned',
    estimatedPrice: 250,
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700'
    case 'in-progress':
      return 'bg-orange-100 text-orange-700'
    case 'assigned':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-amber-100 text-amber-700'
  }
}

export default function CleanerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'completed'>('today')
  
  const todayJobs = mockJobs.filter(j => j.status !== 'completed')
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="font-semibold">JD</span>
            </div>
            <div>
              <p className="font-semibold">Welcome back</p>
              <p className="text-sm text-white/70">John Doe</p>
            </div>
          </div>
          <Link href="/cleaner/settings" className="p-2 hover:bg-white/10 rounded-lg">
            <Settings className="h-5 w-5" />
          </Link>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{todayJobs.length}</div>
            <div className="text-xs text-white/70">Today&apos;s Jobs</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">4.9</div>
            <div className="text-xs text-white/70">Rating</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">$850</div>
            <div className="text-xs text-white/70">This Week</div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="p-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(['today', 'upcoming', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Jobs list */}
        <div className="space-y-4">
          {activeTab === 'today' && todayJobs.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800">All done for today!</h3>
              <p className="text-sm text-gray-500 mt-1">No more jobs scheduled</p>
            </div>
          )}
          
          {activeTab === 'today' && todayJobs.map((job) => (
            <Link
              key={job.id}
              href={`/cleaner/jobs/${job.id}`}
              className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{job.customerName}</h3>
                  <p className="text-sm text-gray-500">{job.serviceType}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{job.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{job.scheduledTime}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="font-semibold text-primary">${job.estimatedPrice}</span>
                <div className="flex items-center gap-1 text-sm text-primary">
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
          
          {activeTab === 'upcoming' && (
            <div className="bg-white rounded-xl p-8 text-center">
              <Calendar className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800">Upcoming Jobs</h3>
              <p className="text-sm text-gray-500 mt-1">3 jobs scheduled this week</p>
            </div>
          )}
          
          {activeTab === 'completed' && (
            <div className="bg-white rounded-xl p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800">12 jobs completed</h3>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </div>
          )}
        </div>
        
        {/* Available jobs */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">Available Jobs</h2>
            <Link href="/cleaner/available" className="text-sm text-primary">
              View all
            </Link>
          </div>
          
          <div className="bg-gradient-to-r from-accent/20 to-primary/10 rounded-xl p-4 border border-accent/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">5 jobs available</h3>
                <p className="text-sm text-gray-600">In your service area</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </main>
      
      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around">
          <Link href="/cleaner/dashboard" className="flex flex-col items-center gap-1 text-primary">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/cleaner/jobs" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <Briefcase className="h-5 w-5" />
            <span className="text-xs">Jobs</span>
          </Link>
          <Link href="/cleaner/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
