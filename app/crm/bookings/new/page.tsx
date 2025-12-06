'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

export default function NewBookingPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    // Customer info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    aptUnit: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Service details
    serviceType: 'standard',
    propertyType: 'house',
    squareFootage: '',
    bedrooms: '2',
    bathrooms: '1',
    floors: '1',
    
    // Schedule
    frequency: 'one-time',
    preferredDay: '',
    preferredTime: 'morning',
    specificDate: '',
    
    // Pricing
    estimatedPrice: '',
    paymentMethod: 'card',
    
    // Notes
    notes: '',
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          squareFootage: formData.squareFootage ? parseInt(formData.squareFootage) : undefined,
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          floors: parseInt(formData.floors),
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking')
      }
      
      router.push(`/crm/bookings/${data.booking.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/crm/bookings" 
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            New Booking
          </h1>
          <p className="text-gray-500 text-sm">
            Create a new service booking
          </p>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
              Customer Information
            </h2>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="label">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
            
            <div>
              <label className="label">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input"
                placeholder="123 Main Street"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="label">Apt/Unit</label>
                <input
                  type="text"
                  name="aptUnit"
                  value={formData.aptUnit}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="input"
                  placeholder="CA"
                />
              </div>
              <div>
                <label className="label">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Service Details */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
              Service Details
            </h2>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Service Type</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="standard">Standard Clean</option>
                  <option value="deep">Deep Clean</option>
                  <option value="move-out">Move Out Clean</option>
                  <option value="move-in">Move In Clean</option>
                  <option value="office">Office Clean</option>
                  <option value="post-construction">Post Construction</option>
                </select>
              </div>
              <div>
                <label className="label">Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="office">Office</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="label">Square Footage</label>
              <input
                type="number"
                name="squareFootage"
                value={formData.squareFootage}
                onChange={handleChange}
                className="input"
                placeholder="1500"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Bedrooms</label>
                <select
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="input"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Bathrooms</label>
                <select
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="input"
                >
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Floors</label>
                <select
                  name="floors"
                  value={formData.floors}
                  onChange={handleChange}
                  className="input"
                >
                  {[1, 2, 3, 4].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Schedule */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
              Schedule
            </h2>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Frequency</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="one-time">One-time</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="label">Preferred Day</label>
                <select
                  name="preferredDay"
                  value={formData.preferredDay}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Any day</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  name="specificDate"
                  value={formData.specificDate}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Preferred Time</label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="morning">Morning (8am - 12pm)</option>
                  <option value="afternoon">Afternoon (12pm - 5pm)</option>
                  <option value="evening">Evening (5pm - 8pm)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pricing & Notes */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
              Pricing & Notes
            </h2>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Estimated Price</label>
                <input
                  type="number"
                  name="estimatedPrice"
                  value={formData.estimatedPrice}
                  onChange={handleChange}
                  className="input"
                  placeholder="150.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="label">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="card">Credit Card</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="ach">ACH/Bank Transfer</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="label">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input min-h-[100px]"
                placeholder="Any special instructions or notes..."
              />
            </div>
          </div>
        </div>
        
        {/* Submit */}
        <div className="lg:col-span-2 flex justify-end gap-4">
          <Link href="/crm/bookings" className="btn btn-ghost">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Booking
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
