'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Navigation,
  Camera,
  CheckCircle,
  PlayCircle,
  StopCircle,
  AlertCircle,
  Upload,
  X,
  Image as ImageIcon,
  Home,
  User,
  Briefcase,
  Loader2
} from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

// Mock job data
const mockJob = {
  id: '1',
  customerName: 'John Smith',
  phone: '+1 (555) 123-4567',
  address: '123 Main St',
  city: 'Los Angeles',
  state: 'CA',
  zipCode: '90001',
  serviceType: 'Deep Clean',
  scheduledTime: '9:00 AM - 12:00 PM',
  scheduledDate: 'Today',
  status: 'assigned',
  estimatedPrice: 180,
  bedrooms: 3,
  bathrooms: 2,
  squareFootage: 1800,
  notes: 'Please use eco-friendly products only. Key is under the doormat. Dog is friendly but keep side gate closed.',
  additionalServices: ['Inside Windows', 'Refrigerator', 'Oven'],
}

export default function CleanerJobDetailPage({ params }: PageProps) {
  const [jobId, setJobId] = useState<string>('')
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [clockInTime, setClockInTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  
  const [beforePhotos, setBeforePhotos] = useState<string[]>([])
  const [afterPhotos, setAfterPhotos] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  
  useEffect(() => {
    params.then(p => setJobId(p.id))
  }, [params])
  
  // Timer for elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isClockedIn && clockInTime) {
      interval = setInterval(() => {
        const now = new Date()
        const diff = Math.floor((now.getTime() - clockInTime.getTime()) / 1000)
        setElapsedTime(diff)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isClockedIn, clockInTime])
  
  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          reject(error)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }
  
  const handleClockIn = async () => {
    setIsLoadingLocation(true)
    setLocationError(null)
    
    try {
      const location = await getCurrentLocation()
      setCurrentLocation(location)
      
      // In production, send to API
      // await fetch('/api/cleaner/clock-in', {
      //   method: 'POST',
      //   body: JSON.stringify({ jobId, ...location })
      // })
      
      setIsClockedIn(true)
      setClockInTime(new Date())
    } catch (error) {
      setLocationError('Could not get location. Please enable GPS.')
    } finally {
      setIsLoadingLocation(false)
    }
  }
  
  const handleClockOut = async () => {
    setIsLoadingLocation(true)
    
    try {
      const location = await getCurrentLocation()
      
      // In production, send to API
      // await fetch('/api/cleaner/clock-out', {
      //   method: 'POST',
      //   body: JSON.stringify({ jobId, ...location })
      // })
      
      setIsClockedIn(false)
      // Show completion modal or navigate to summary
    } catch {
      setLocationError('Could not get location for clock out.')
    } finally {
      setIsLoadingLocation(false)
    }
  }
  
  const handlePhotoUpload = async (type: 'before' | 'after', e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setIsUploading(true)
    
    // In production, upload to S3
    // const formData = new FormData()
    // formData.append('file', files[0])
    // formData.append('type', type)
    // formData.append('jobId', jobId)
    // const response = await fetch('/api/cleaner/upload-photo', { method: 'POST', body: formData })
    
    // For demo, create object URL
    const url = URL.createObjectURL(files[0])
    
    if (type === 'before') {
      setBeforePhotos(prev => [...prev, url])
    } else {
      setAfterPhotos(prev => [...prev, url])
    }
    
    setIsUploading(false)
  }
  
  const removePhoto = (type: 'before' | 'after', index: number) => {
    if (type === 'before') {
      // Revoke object URL to prevent memory leak
      URL.revokeObjectURL(beforePhotos[index])
      setBeforePhotos(prev => prev.filter((_, i) => i !== index))
    } else {
      // Revoke object URL to prevent memory leak
      URL.revokeObjectURL(afterPhotos[index])
      setAfterPhotos(prev => prev.filter((_, i) => i !== index))
    }
  }
  
  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      beforePhotos.forEach(url => URL.revokeObjectURL(url))
      afterPhotos.forEach(url => URL.revokeObjectURL(url))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  const openNavigation = () => {
    const address = `${mockJob.address}, ${mockJob.city}, ${mockJob.state} ${mockJob.zipCode}`
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    window.open(url, '_blank')
  }
  
  const callCustomer = () => {
    window.location.href = `tel:${mockJob.phone}`
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="flex items-center gap-3">
          <Link href="/cleaner/dashboard" className="p-2 -ml-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-semibold">Job Details</h1>
            <p className="text-sm text-white/70">{mockJob.serviceType}</p>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="p-4 space-y-4">
        {/* Customer card */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-semibold text-lg text-gray-800">{mockJob.customerName}</h2>
              <p className="text-sm text-gray-500">{mockJob.scheduledDate} • {mockJob.scheduledTime}</p>
            </div>
            <span className="text-xl font-bold text-primary">${mockJob.estimatedPrice}</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-800">{mockJob.address}</p>
                <p className="text-sm text-gray-500">{mockJob.city}, {mockJob.state} {mockJob.zipCode}</p>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={openNavigation}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
            >
              <Navigation className="h-5 w-5" />
              Navigate
            </button>
            <button
              onClick={callCustomer}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
            >
              <Phone className="h-5 w-5" />
              Call
            </button>
          </div>
        </div>
        
        {/* Clock In/Out */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Time Tracking</h3>
          
          {locationError && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-lg mb-4">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{locationError}</span>
            </div>
          )}
          
          {isClockedIn ? (
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-primary mb-2">
                {formatElapsedTime(elapsedTime)}
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Clocked in at {clockInTime?.toLocaleTimeString()}
              </p>
              <button
                onClick={handleClockOut}
                disabled={isLoadingLocation}
                className="w-full flex items-center justify-center gap-2 py-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50"
              >
                {isLoadingLocation ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <StopCircle className="h-6 w-6" />
                )}
                Clock Out
              </button>
            </div>
          ) : (
            <button
              onClick={handleClockIn}
              disabled={isLoadingLocation}
              className="w-full flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition disabled:opacity-50"
            >
              {isLoadingLocation ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <PlayCircle className="h-6 w-6" />
              )}
              Clock In (GPS Verified)
            </button>
          )}
          
          {currentLocation && (
            <p className="text-xs text-gray-400 text-center mt-2">
              📍 {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
            </p>
          )}
        </div>
        
        {/* Photos */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Job Photos</h3>
          
          {/* Before photos */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Before Photos</span>
              <span className="text-xs text-gray-500">{beforePhotos.length}/3</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {beforePhotos.map((photo, i) => (
                <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={photo} alt={`Before ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto('before', i)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {beforePhotos.length < 3 && (
                <label className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition border-2 border-dashed border-gray-300">
                  <Camera className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload('before', e)}
                  />
                </label>
              )}
            </div>
          </div>
          
          {/* After photos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">After Photos</span>
              <span className="text-xs text-gray-500">{afterPhotos.length}/3</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {afterPhotos.map((photo, i) => (
                <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={photo} alt={`After ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto('after', i)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {afterPhotos.length < 3 && (
                <label className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition border-2 border-dashed border-gray-300">
                  <Camera className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload('after', e)}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
        
        {/* Job details */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Property Details</h3>
          
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <div className="text-xl font-bold text-gray-800">{mockJob.bedrooms}</div>
              <div className="text-xs text-gray-500">Bedrooms</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">{mockJob.bathrooms}</div>
              <div className="text-xs text-gray-500">Bathrooms</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">{mockJob.squareFootage}</div>
              <div className="text-xs text-gray-500">Sq Ft</div>
            </div>
          </div>
          
          {mockJob.additionalServices.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Additional Services</p>
              <div className="flex flex-wrap gap-2">
                {mockJob.additionalServices.map((service, i) => (
                  <span key={i} className="px-3 py-1 bg-accent/20 text-primary rounded-full text-sm">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {mockJob.notes && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Special Instructions</p>
              <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                {mockJob.notes}
              </p>
            </div>
          )}
        </div>
        
        {/* Complete button */}
        {isClockedIn && beforePhotos.length >= 1 && afterPhotos.length >= 1 && (
          <button className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition">
            <CheckCircle className="h-6 w-6" />
            Complete Job
          </button>
        )}
      </main>
      
      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-around">
          <Link href="/cleaner/dashboard" className="flex flex-col items-center gap-1 text-gray-400">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/cleaner/jobs" className="flex flex-col items-center gap-1 text-primary">
            <Briefcase className="h-5 w-5" />
            <span className="text-xs">Jobs</span>
          </Link>
          <Link href="/cleaner/profile" className="flex flex-col items-center gap-1 text-gray-400">
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
