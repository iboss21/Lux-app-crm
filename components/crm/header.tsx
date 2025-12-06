'use client'

import { Bell, Search, Settings, User, ChevronDown, LogOut, Moon, Sun } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  
  return (
    <header className="header">
      {/* Left side - Welcome message and search */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold font-serif" style={{ color: 'var(--primary)' }}>
          Welcome back, Admin
        </h1>
        
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-64">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
      </div>
      
      {/* Right side - Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-icon hover:bg-gray-100 rounded-lg p-2 relative"
          >
            <Bell className="h-5 w-5" style={{ color: 'var(--primary)' }} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          
          {showNotifications && (
            <div className="dropdown-menu w-80 animate-slide-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="py-2">
                <NotificationItem
                  title="New Booking"
                  message="John Doe booked a deep cleaning service"
                  time="5 min ago"
                />
                <NotificationItem
                  title="Job Completed"
                  message="Maria completed the job at 123 Main St"
                  time="1 hour ago"
                />
                <NotificationItem
                  title="New Review"
                  message="5-star review from Sarah Williams"
                  time="2 hours ago"
                />
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button className="text-sm text-primary font-medium hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Settings quick access */}
        <button className="btn-icon hover:bg-gray-100 rounded-lg p-2">
          <Settings className="h-5 w-5" style={{ color: 'var(--primary)' }} />
        </button>
        
        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
            >
              A
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">Admin</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
          
          {showUserMenu && (
            <div className="dropdown-menu animate-slide-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800">Admin User</p>
                <p className="text-sm text-gray-500">admin@ecoshine.pro</p>
              </div>
              <div className="py-1">
                <button className="dropdown-item flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button className="dropdown-item flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button className="dropdown-item flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Dark Mode
                </button>
              </div>
              <div className="py-1 border-t border-gray-100">
                <button className="dropdown-item flex items-center gap-2 text-danger">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function NotificationItem({ 
  title, 
  message, 
  time 
}: { 
  title: string
  message: string
  time: string 
}) {
  return (
    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{message}</p>
      <p className="text-xs text-gray-400 mt-1">{time}</p>
    </div>
  )
}

export default Header
