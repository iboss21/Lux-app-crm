'use client'

import { useState } from 'react'
import { 
  Building,
  CreditCard,
  Bell,
  Users,
  Clock,
  Shield,
  Save,
  Upload
} from 'lucide-react'

type SettingsTab = 'company' | 'services' | 'payments' | 'notifications' | 'team' | 'security'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('company')
  
  const tabs = [
    { id: 'company' as const, label: 'Company', icon: Building },
    { id: 'services' as const, label: 'Services', icon: Clock },
    { id: 'payments' as const, label: 'Payments', icon: CreditCard },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'team' as const, label: 'Team', icon: Users },
    { id: 'security' as const, label: 'Security', icon: Shield },
  ]
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
          Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your company settings and preferences
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card">
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                    activeTab === tab.id 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Content area */}
        <div className="flex-1">
          {activeTab === 'company' && <CompanySettings />}
          {activeTab === 'services' && <ServicesSettings />}
          {activeTab === 'payments' && <PaymentSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'team' && <TeamSettings />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  )
}

function CompanySettings() {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-lg font-semibold text-gray-800">Company Information</h2>
      </div>
      <div className="card-body space-y-6">
        {/* Logo upload */}
        <div>
          <label className="label">Company Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
              ✨
            </div>
            <button className="btn btn-secondary text-sm">
              <Upload className="h-4 w-4" />
              Upload Logo
            </button>
          </div>
        </div>
        
        {/* Company name */}
        <div>
          <label className="label">Company Name</label>
          <input
            type="text"
            className="input"
            defaultValue="EcoShine Pro"
          />
        </div>
        
        {/* Contact info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              defaultValue="hello@ecoshine.pro"
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              type="tel"
              className="input"
              defaultValue="(555) 123-4567"
            />
          </div>
        </div>
        
        {/* Address */}
        <div>
          <label className="label">Business Address</label>
          <input
            type="text"
            className="input"
            defaultValue="123 Clean Street, Los Angeles, CA 90001"
          />
        </div>
        
        {/* Default city/region */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Default City</label>
            <input
              type="text"
              className="input"
              defaultValue="Los Angeles"
            />
          </div>
          <div>
            <label className="label">Time Zone</label>
            <select className="input">
              <option>America/Los_Angeles (PST)</option>
              <option>America/New_York (EST)</option>
              <option>America/Chicago (CST)</option>
            </select>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <button className="btn btn-primary">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function ServicesSettings() {
  const services = [
    { name: 'Standard Clean', duration: '2-3 hours', basePrice: 150 },
    { name: 'Deep Clean', duration: '4-5 hours', basePrice: 280 },
    { name: 'Move Out Clean', duration: '5-6 hours', basePrice: 350 },
    { name: 'Office Clean', duration: '2-4 hours', basePrice: 200 },
    { name: 'Window Cleaning', duration: '1-2 hours', basePrice: 100 },
  ]
  
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Service Catalog</h2>
          <button className="btn btn-primary text-sm">
            Add Service
          </button>
        </div>
        <div className="table-container border-0">
          <table className="table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Duration</th>
                <th>Base Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index}>
                  <td className="font-medium text-gray-900">{service.name}</td>
                  <td>{service.duration}</td>
                  <td>${service.basePrice}</td>
                  <td>
                    <button className="text-primary hover:underline text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-800">Working Hours</h2>
        </div>
        <div className="card-body space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Time</label>
              <input type="time" className="input" defaultValue="08:00" />
            </div>
            <div>
              <label className="label">End Time</label>
              <input type="time" className="input" defaultValue="18:00" />
            </div>
          </div>
          <div>
            <label className="label">Working Days</label>
            <div className="flex gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <button
                  key={day}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    index < 5 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <button className="btn btn-primary">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PaymentSettings() {
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-800">Payment Settings</h2>
        </div>
        <div className="card-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Currency</label>
              <select className="input">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="label">Tax Rate (%)</label>
              <input type="number" className="input" defaultValue="8.25" />
            </div>
          </div>
          
          <div>
            <label className="label">Payment Terms</label>
            <select className="input">
              <option>Due on receipt</option>
              <option>Net 7</option>
              <option>Net 15</option>
              <option>Net 30</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-800">Stripe Integration</h2>
        </div>
        <div className="card-body space-y-4">
          <div className="alert alert-warning">
            <Shield className="h-5 w-5" />
            <span>Stripe is not configured. Add your API keys to enable online payments.</span>
          </div>
          
          <div>
            <label className="label">Stripe Publishable Key</label>
            <input
              type="text"
              className="input"
              placeholder="pk_live_..."
            />
          </div>
          <div>
            <label className="label">Stripe Secret Key</label>
            <input
              type="password"
              className="input"
              placeholder="sk_live_..."
            />
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <button className="btn btn-primary">
              <Save className="h-4 w-4" />
              Save Stripe Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-lg font-semibold text-gray-800">Notification Preferences</h2>
      </div>
      <div className="card-body space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Email Notifications</h3>
          
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Booking Confirmations</p>
              <p className="text-sm text-gray-500">Send confirmation email to customers</p>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">24h Reminders</p>
              <p className="text-sm text-gray-500">Remind customers 24 hours before service</p>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Invoice Emails</p>
              <p className="text-sm text-gray-500">Send invoices to customers automatically</p>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Review Requests</p>
              <p className="text-sm text-gray-500">Ask for reviews after completed jobs</p>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
          </label>
        </div>
        
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <h3 className="font-medium text-gray-700">SMS Notifications</h3>
          
          <div className="alert alert-info">
            <Bell className="h-5 w-5" />
            <span>SMS is not configured. Add Twilio credentials to enable SMS notifications.</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <button className="btn btn-primary">
            <Save className="h-4 w-4" />
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}

function TeamSettings() {
  const teamMembers = [
    { name: 'Admin User', email: 'admin@ecoshine.pro', role: 'admin' },
    { name: 'Manager', email: 'manager@ecoshine.pro', role: 'manager' },
    { name: 'Support Rep', email: 'csr@ecoshine.pro', role: 'csr' },
  ]
  
  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Team Members</h2>
        <button className="btn btn-primary text-sm">
          Invite User
        </button>
      </div>
      <div className="table-container border-0">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member, index) => (
              <tr key={index}>
                <td className="font-medium text-gray-900">{member.name}</td>
                <td>{member.email}</td>
                <td>
                  <span className="badge bg-primary/10 text-primary">
                    {member.role.toUpperCase()}
                  </span>
                </td>
                <td>
                  <button className="text-primary hover:underline text-sm">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-800">Password & Authentication</h2>
        </div>
        <div className="card-body space-y-4">
          <button className="btn btn-secondary">
            Change Password
          </button>
          
          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded" />
            </label>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-800">Session Management</h2>
        </div>
        <div className="card-body">
          <p className="text-gray-600 mb-4">
            You&apos;re currently signed in on this device.
          </p>
          <button className="btn btn-danger text-sm">
            Sign Out All Other Sessions
          </button>
        </div>
      </div>
    </div>
  )
}
