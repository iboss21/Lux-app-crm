'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  ArrowRight,
  Check,
  Home,
  Building,
  CheckCircle
} from 'lucide-react'

type BookingStep = 'service' | 'property' | 'datetime' | 'extras' | 'summary'

const services = [
  { id: 'standard', name: 'Standard Clean', description: 'Regular cleaning for maintained homes', price: 150, duration: '2-3 hours' },
  { id: 'deep', name: 'Deep Clean', description: 'Thorough cleaning including hard-to-reach areas', price: 280, duration: '4-5 hours' },
  { id: 'moveout', name: 'Move Out Clean', description: 'Complete cleaning for moving properties', price: 350, duration: '5-6 hours' },
  { id: 'office', name: 'Office Clean', description: 'Professional office and workspace cleaning', price: 200, duration: '2-4 hours' },
]

const extras = [
  { id: 'windows', name: 'Window Cleaning', price: 50 },
  { id: 'fridge', name: 'Inside Fridge', price: 35 },
  { id: 'oven', name: 'Inside Oven', price: 35 },
  { id: 'laundry', name: 'Laundry Service', price: 25 },
  { id: 'cabinets', name: 'Inside Cabinets', price: 40 },
  { id: 'organizing', name: 'Organizing', price: 60 },
]

const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
]

export default function BookingPage() {
  const [step, setStep] = useState<BookingStep>('service')
  const [selectedService, setSelectedService] = useState<string>('')
  const [propertyType, setPropertyType] = useState<string>('')
  const [bedrooms, setBedrooms] = useState(2)
  const [bathrooms, setBathrooms] = useState(2)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  
  const steps: BookingStep[] = ['service', 'property', 'datetime', 'extras', 'summary']
  const currentStepIndex = steps.indexOf(step)
  
  const service = services.find(s => s.id === selectedService)
  const extrasTotal = selectedExtras.reduce((sum, id) => {
    const extra = extras.find(e => e.id === id)
    return sum + (extra?.price || 0)
  }, 0)
  const total = (service?.price || 0) + extrasTotal
  
  const canContinue = () => {
    switch (step) {
      case 'service': return !!selectedService
      case 'property': return !!propertyType && bedrooms > 0 && bathrooms > 0
      case 'datetime': return !!selectedDate && !!selectedTime
      case 'extras': return true
      case 'summary': return true
      default: return false
    }
  }
  
  const nextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex])
    }
  }
  
  const prevStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setStep(steps[prevIndex])
    }
  }
  
  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => 
      prev.includes(id) 
        ? prev.filter(e => e !== id)
        : [...prev, id]
    )
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/portal" className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold font-serif text-accent">
            Book a Cleaning
          </h1>
        </div>
      </header>
      
      {/* Progress */}
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index < currentStepIndex 
                    ? 'bg-green-500 text-white' 
                    : index === currentStepIndex 
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStepIndex ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 md:w-20 h-1 mx-1 ${
                    index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Service</span>
            <span>Property</span>
            <span>Date/Time</span>
            <span>Extras</span>
            <span>Summary</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <main className="max-w-2xl mx-auto p-6">
        {step === 'service' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Choose Your Service</h2>
            <p className="text-gray-500">Select the type of cleaning you need</p>
            
            <div className="space-y-3">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${
                    selectedService === s.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{s.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{s.description}</p>
                      <p className="text-sm text-gray-400 mt-1">{s.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">${s.price}</p>
                      {selectedService === s.id && (
                        <CheckCircle className="h-5 w-5 text-primary mt-2" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {step === 'property' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Property Details</h2>
              <p className="text-gray-500">Tell us about your property</p>
            </div>
            
            <div>
              <label className="label">Property Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPropertyType('house')}
                  className={`p-4 rounded-xl border-2 flex items-center gap-3 ${
                    propertyType === 'house' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200'
                  }`}
                >
                  <Home className="h-6 w-6 text-primary" />
                  <span className="font-medium">House</span>
                </button>
                <button
                  onClick={() => setPropertyType('apartment')}
                  className={`p-4 rounded-xl border-2 flex items-center gap-3 ${
                    propertyType === 'apartment' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200'
                  }`}
                >
                  <Building className="h-6 w-6 text-primary" />
                  <span className="font-medium">Apartment</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Bedrooms</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">{bedrooms}</span>
                  <button 
                    onClick={() => setBedrooms(bedrooms + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Bathrooms</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">{bathrooms}</span>
                  <button 
                    onClick={() => setBathrooms(bathrooms + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step === 'datetime' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Select Date & Time</h2>
              <p className="text-gray-500">Choose when you&apos;d like us to come</p>
            </div>
            
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="input"
              />
            </div>
            
            <div>
              <label className="label">Preferred Time</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition ${
                      selectedTime === time 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {step === 'extras' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Add Extras</h2>
              <p className="text-gray-500">Optional add-ons for a deeper clean</p>
            </div>
            
            <div className="space-y-3">
              {extras.map((extra) => (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(extra.id)}
                  className={`w-full p-4 rounded-xl border-2 flex items-center justify-between ${
                    selectedExtras.includes(extra.id)
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      selectedExtras.includes(extra.id)
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    }`}>
                      {selectedExtras.includes(extra.id) && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-gray-800">{extra.name}</span>
                  </div>
                  <span className="font-semibold text-primary">+${extra.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {step === 'summary' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Booking Summary</h2>
              <p className="text-gray-500">Review your booking details</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Service</h3>
                <p className="font-semibold text-gray-800">{service?.name}</p>
                <p className="text-sm text-gray-500">{service?.duration}</p>
              </div>
              
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Property</h3>
                <p className="font-semibold text-gray-800 capitalize">{propertyType}</p>
                <p className="text-sm text-gray-500">{bedrooms} bed, {bathrooms} bath</p>
              </div>
              
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Date & Time</h3>
                <p className="font-semibold text-gray-800">{selectedDate}</p>
                <p className="text-sm text-gray-500">{selectedTime}</p>
              </div>
              
              {selectedExtras.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Extras</h3>
                  <ul className="space-y-1">
                    {selectedExtras.map(id => {
                      const extra = extras.find(e => e.id === id)
                      return (
                        <li key={id} className="flex justify-between text-sm">
                          <span>{extra?.name}</span>
                          <span className="text-primary">+${extra?.price}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
              
              <div className="p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-primary">${total}</span>
                </div>
              </div>
            </div>
            
            <button className="w-full btn btn-primary py-4 text-lg">
              Confirm Booking
            </button>
          </div>
        )}
        
        {/* Navigation */}
        {step !== 'summary' && (
          <div className="flex gap-4 mt-8">
            {currentStepIndex > 0 && (
              <button
                onClick={prevStep}
                className="flex-1 btn btn-secondary py-3"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={!canContinue()}
              className={`flex-1 btn btn-primary py-3 ${
                !canContinue() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
