'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Building
} from 'lucide-react'

export default function NewCustomerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    aptUnit: '',
    city: '',
    state: '',
    zipCode: '',
    source: 'website',
    membershipTier: 'standard',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In production, this would call an API endpoint
      // const response = await fetch('/api/customers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })
      // const data = await response.json()

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For now, redirect back to customers list
      router.push('/crm/customers')
    } catch (error) {
      console.error('Error creating customer:', error)
      alert('Failed to create customer. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/crm/customers" 
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            New Customer
          </h1>
          <p className="text-gray-500 text-sm">
            Add a new customer to your database
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                  Personal Information
                </h2>
              </div>
              <div className="card-body space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="input pl-10"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input pl-10"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                  Address
                </h2>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="123 Main St"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apt/Unit
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="aptUnit"
                        value={formData.aptUnit}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="Apt 4B"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input"
                      placeholder="Los Angeles"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Select State</option>
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                      {/* Add more states as needed */}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="input"
                      placeholder="90001"
                      maxLength={10}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                  Additional Notes
                </h2>
              </div>
              <div className="card-body">
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="input"
                  placeholder="Add any additional notes about this customer..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
                  Account Settings
                </h2>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Membership Tier
                  </label>
                  <select
                    name="membershipTier"
                    value={formData.membershipTier}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lead Source
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="website">Website</option>
                    <option value="phone">Phone Call</option>
                    <option value="referral">Referral</option>
                    <option value="social-media">Social Media</option>
                    <option value="email">Email Campaign</option>
                    <option value="walk-in">Walk-in</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <div className="card-body space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Customer
                    </>
                  )}
                </button>
                <Link href="/crm/customers" className="btn btn-ghost w-full">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
