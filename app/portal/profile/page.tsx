'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Lock,
  Save,
  Camera
} from 'lucide-react'

export default function CustomerProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile')
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/portal/dashboard" className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold font-serif text-accent">
            My Profile
          </h1>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Avatar section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
              JD
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">John Doe</h2>
          <p className="text-gray-500">Customer since Jan 2024</p>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-xl p-1 border border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'profile' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User className="h-4 w-4 inline mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'notifications' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bell className="h-4 w-4 inline mr-2" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'security' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Lock className="h-4 w-4 inline mr-2" />
            Security
          </button>
        </div>
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name</label>
                <input
                  type="text"
                  className="input"
                  defaultValue="John"
                />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input
                  type="text"
                  className="input"
                  defaultValue="Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  className="input pl-10"
                  defaultValue="john@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="label">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  className="input pl-10"
                  defaultValue="(555) 123-4567"
                />
              </div>
            </div>
            
            <div>
              <label className="label">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  className="input pl-10 h-24 resize-none"
                  defaultValue="123 Main Street&#10;Los Angeles, CA 90001"
                />
              </div>
            </div>
            
            <button className="w-full btn btn-primary py-3">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        )}
        
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-800">Notification Preferences</h3>
            
            <label className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">Booking Confirmations</p>
                <p className="text-sm text-gray-500">Receive confirmation after booking</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
            </label>
            
            <label className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">Appointment Reminders</p>
                <p className="text-sm text-gray-500">Get reminded 24 hours before</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
            </label>
            
            <label className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">Service Updates</p>
                <p className="text-sm text-gray-500">When cleaner is on the way</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
            </label>
            
            <label className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">Promotional Offers</p>
                <p className="text-sm text-gray-500">Special deals and discounts</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded" />
            </label>
            
            <h3 className="font-semibold text-gray-800 mt-6">Notification Method</h3>
            
            <label className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">Email</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
            </label>
            
            <label className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">SMS</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
            </label>
            
            <button className="w-full btn btn-primary py-3">
              <Save className="h-4 w-4" />
              Save Preferences
            </button>
          </div>
        )}
        
        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="label">Current Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Enter current password"
                  />
                </div>
                
                <div>
                  <label className="label">New Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Enter new password"
                  />
                </div>
                
                <div>
                  <label className="label">Confirm New Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Confirm new password"
                  />
                </div>
                
                <button className="btn btn-primary">
                  Update Password
                </button>
              </div>
            </div>
            
            <hr className="border-gray-200" />
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-500 mb-4">
                Once you delete your account, there is no going back.
              </p>
              <button className="btn btn-danger text-sm">
                Delete Account
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
