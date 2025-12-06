'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Plus,
  Filter
} from 'lucide-react'
import { formatDate, getStatusColor } from '@/lib/utils'

// Mock data for calendar - in production this would come from the database
const mockBookings = [
  { id: '1', time: '9:00 AM', customer: 'John Doe', service: 'Deep Clean', status: 'assigned', cleaner: 'Maria G.' },
  { id: '2', time: '11:00 AM', customer: 'Sarah Smith', service: 'Standard Clean', status: 'pending', cleaner: null },
  { id: '3', time: '2:00 PM', customer: 'Mike Johnson', service: 'Move Out Clean', status: 'in-progress', cleaner: 'Jose R.' },
  { id: '4', time: '4:00 PM', customer: 'Emily Brown', service: 'Office Clean', status: 'completed', cleaner: 'Maria G.' },
]

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // Add days from previous month to fill the first week
  const startDayOfWeek = firstDay.getDay()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push(date)
  }
  
  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i))
  }
  
  // Add days from next month to complete the grid
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i))
  }
  
  return days
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week')
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const days = getDaysInMonth(year, month)
  
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }
  
  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }
  
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }
  
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month
  }
  
  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString()
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            Calendar
          </h1>
          <p className="text-gray-500 mt-1">
            View and manage your cleaning schedule
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'month' | 'week' | 'day')}
            className="input py-2 text-sm"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          <Link href="/crm/bookings/new" className="btn btn-primary">
            <Plus className="h-5 w-5" />
            New Booking
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="card">
            {/* Calendar header */}
            <div className="card-header flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h2 className="text-lg font-semibold text-gray-800">
                  {monthName}
                </h2>
                <button 
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <button 
                onClick={goToToday}
                className="btn btn-ghost text-sm"
              >
                Today
              </button>
            </div>
            
            <div className="card-body p-0">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-gray-100">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div 
                    key={day}
                    className="px-2 py-3 text-center text-xs font-semibold text-gray-500 uppercase"
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7">
                {days.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      min-h-[80px] p-2 text-left border-b border-r border-gray-100 hover:bg-gray-50 transition
                      ${!isCurrentMonth(date) ? 'bg-gray-50 text-gray-400' : ''}
                      ${isSelected(date) ? 'bg-primary/5 ring-2 ring-primary ring-inset' : ''}
                    `}
                  >
                    <span className={`
                      inline-flex items-center justify-center w-7 h-7 text-sm rounded-full
                      ${isToday(date) ? 'bg-primary text-white font-semibold' : ''}
                    `}>
                      {date.getDate()}
                    </span>
                    
                    {/* Booking indicators */}
                    {isCurrentMonth(date) && Math.random() > 0.7 && (
                      <div className="mt-1 space-y-1">
                        <div className="h-1.5 rounded bg-blue-400 w-3/4" />
                        {Math.random() > 0.5 && (
                          <div className="h-1.5 rounded bg-green-400 w-1/2" />
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Selected day schedule */}
        <div>
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-800">
                  {formatDate(selectedDate)}
                </h2>
              </div>
            </div>
            
            <div className="card-body p-0">
              {mockBookings.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {mockBookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/crm/bookings/${booking.id}`}
                      className="block p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
                            <Clock className="h-3.5 w-3.5" />
                            {booking.time}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {booking.customer}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.service}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`badge text-xs ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            {booking.cleaner && (
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <User className="h-3 w-3" />
                                {booking.cleaner}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="empty-state py-8">
                  <CalendarIcon className="empty-state-icon h-12 w-12" />
                  <p className="empty-state-title text-sm">No bookings</p>
                  <p className="empty-state-description text-xs">
                    No jobs scheduled for this day
                  </p>
                </div>
              )}
            </div>
            
            <div className="card-footer">
              <Link 
                href="/crm/bookings/new" 
                className="btn btn-secondary w-full text-sm"
              >
                <Plus className="h-4 w-4" />
                Schedule Booking
              </Link>
            </div>
          </div>
          
          {/* Legend */}
          <div className="card mt-4">
            <div className="card-body">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Status Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-accent" />
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-sm text-gray-600">Assigned</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-orange-500" />
                  <span className="text-sm text-gray-600">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-green-600" />
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
