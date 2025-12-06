'use client'

import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  Star, 
  CreditCard, 
  User, 
  LogOut,
  ChevronRight,
  Plus,
  CheckCircle,
  Image as ImageIcon,
  Settings,
  Bell,
  RefreshCw
} from 'lucide-react'
import { useState } from 'react'

// Mock data
const mockBookings = [
  {
    id: '1',
    serviceType: 'Deep Clean',
    date: '2024-12-15',
    time: '9:00 AM',
    status: 'upcoming',
    price: 180,
    cleanerName: 'Maria Garcia',
  },
  {
    id: '2',
    serviceType: 'Standard Clean',
    date: '2024-12-01',
    time: '2:00 PM',
    status: 'completed',
    price: 120,
    cleanerName: 'John Smith',
    rating: 5,
  },
  {
    id: '3',
    serviceType: 'Standard Clean',
    date: '2024-11-15',
    time: '10:00 AM',
    status: 'completed',
    price: 120,
    cleanerName: 'Maria Garcia',
    rating: 5,
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700'
    case 'upcoming':
      return 'bg-blue-100 text-blue-700'
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function PortalDashboardPage() {
  const upcomingBookings = mockBookings.filter(b => b.status === 'upcoming')
  const completedBookings = mockBookings.filter(b => b.status === 'completed')
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="font-semibold">JS</span>
            </div>
            <div>
              <p className="font-semibold">Welcome back</p>
              <p className="text-sm text-white/70">John Smith</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-lg relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
            <Link href="/portal/settings" className="p-2 hover:bg-white/10 rounded-lg">
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="p-4 space-y-6">
        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/portal/book"
            className="bg-gradient-to-r from-primary to-secondary p-4 rounded-xl text-white hover:opacity-90 transition"
          >
            <Plus className="h-6 w-6 mb-2" />
            <h3 className="font-semibold">Book a Cleaning</h3>
            <p className="text-xs text-white/70 mt-1">Schedule your next service</p>
          </Link>
          <Link
            href="/portal/rebook"
            className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition"
          >
            <RefreshCw className="h-6 w-6 mb-2 text-primary" />
            <h3 className="font-semibold text-gray-800">Rebook Service</h3>
            <p className="text-xs text-gray-500 mt-1">Repeat a previous booking</p>
          </Link>
        </div>
        
        {/* Upcoming bookings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">Upcoming Bookings</h2>
            <Link href="/portal/bookings" className="text-sm text-primary">
              View all
            </Link>
          </div>
          
          {upcomingBookings.length > 0 ? (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/portal/bookings/${booking.id}`}
                  className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{booking.serviceType}</h3>
                      <p className="text-sm text-gray-500">{booking.cleanerName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {booking.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {booking.time}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="font-semibold text-primary">${booking.price}</span>
                    <div className="flex items-center gap-1 text-sm text-primary">
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming bookings</p>
              <Link
                href="/portal/book"
                className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90"
              >
                Book Now
              </Link>
            </div>
          )}
        </div>
        
        {/* Past bookings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">Past Bookings</h2>
            <Link href="/portal/bookings?status=completed" className="text-sm text-primary">
              View all
            </Link>
          </div>
          
          <div className="space-y-3">
            {completedBookings.slice(0, 2).map((booking) => (
              <Link
                key={booking.id}
                href={`/portal/bookings/${booking.id}`}
                className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{booking.serviceType}</h3>
                    <p className="text-sm text-gray-500">{booking.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {booking.rating && (
                      <>
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{booking.rating}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{booking.cleanerName}</span>
                  <div className="flex items-center gap-2">
                    <button className="text-sm text-primary hover:underline">
                      View Photos
                    </button>
                    {!booking.rating && (
                      <button className="text-sm text-accent font-medium hover:underline">
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/portal/payment-methods"
            className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Payment Methods</h3>
              <p className="text-xs text-gray-500">Manage cards</p>
            </div>
          </Link>
          <Link
            href="/portal/profile"
            className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">My Profile</h3>
              <p className="text-xs text-gray-500">Edit info</p>
            </div>
          </Link>
        </div>
        
        {/* Membership */}
        <div className="bg-gradient-to-r from-accent/20 to-primary/10 rounded-xl p-4 border border-accent/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Upgrade to Premium</h3>
              <p className="text-sm text-gray-600 mt-1">Get 15% off all bookings + priority scheduling</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </main>
    </div>
  )
}
