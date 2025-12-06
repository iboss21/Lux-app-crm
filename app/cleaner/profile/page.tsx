'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Star,
  Briefcase,
  DollarSign,
  Calendar,
  Save,
  Camera
} from 'lucide-react'

export default function CleanerProfilePage() {
  const [isAvailable, setIsAvailable] = useState(true)
  
  // Mock cleaner data
  const cleanerData = {
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria@ecoshine.pro',
    phone: '(555) 987-6543',
    rating: 4.9,
    totalJobs: 156,
    totalRevenue: 28500,
    skills: ['Deep Cleaning', 'Move Out', 'Office Cleaning'],
    region: 'Los Angeles - West',
    hireDate: 'June 2023',
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <Link href="/cleaner/dashboard" className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold font-serif text-accent">
            My Profile
          </h1>
        </div>
      </header>
      
      <main className="max-w-lg mx-auto p-6 space-y-6">
        {/* Avatar section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {cleanerData.firstName[0]}{cleanerData.lastName[0]}
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {cleanerData.firstName} {cleanerData.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-medium">{cleanerData.rating}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 text-sm">{cleanerData.totalJobs} jobs</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Member since {cleanerData.hireDate}
              </p>
            </div>
          </div>
        </div>
        
        {/* Availability toggle */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Availability</h3>
              <p className="text-sm text-gray-500">
                {isAvailable ? 'You are available for jobs' : 'You are not available'}
              </p>
            </div>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`w-14 h-8 rounded-full transition ${
                isAvailable ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full bg-white shadow transform transition ${
                isAvailable ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-800">{cleanerData.rating}</div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <Briefcase className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-800">{cleanerData.totalJobs}</div>
            <div className="text-xs text-gray-500">Total Jobs</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <DollarSign className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-800">${(cleanerData.totalRevenue / 1000).toFixed(1)}k</div>
            <div className="text-xs text-gray-500">Earned</div>
          </div>
        </div>
        
        {/* Contact info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Contact Information</h3>
          
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                className="input pl-10"
                defaultValue={cleanerData.email}
                readOnly
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
                defaultValue={cleanerData.phone}
              />
            </div>
          </div>
          
          <div>
            <label className="label">Region</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="input pl-10"
                value={cleanerData.region}
                readOnly
                disabled
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Contact admin to change region</p>
          </div>
        </div>
        
        {/* Skills */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-3">Skills & Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {cleanerData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Contact admin to update skills</p>
        </div>
        
        {/* Quick links */}
        <div className="space-y-3">
          <Link
            href="/cleaner/schedule"
            className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium text-gray-800">My Schedule</span>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </Link>
          
          <Link
            href="/cleaner/payouts"
            className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-800">Earnings & Payouts</span>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </Link>
          
          <Link
            href="/cleaner/reviews"
            className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-medium text-gray-800">My Reviews</span>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </Link>
        </div>
        
        {/* Save button */}
        <button className="w-full btn btn-primary py-3">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </main>
    </div>
  )
}
