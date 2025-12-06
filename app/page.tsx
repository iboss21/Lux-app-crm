import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
          ✨ EcoShine Pro
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Uber-style luxury cleaning marketplace. Premium eco-friendly cleaning services at your fingertips.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link 
            href="/crm"
            className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            Admin CRM →
          </Link>
          <Link 
            href="/cleaner"
            className="px-8 py-3 rounded-lg font-semibold border-2 transition-all hover:bg-primary hover:text-white"
            style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
          >
            Cleaner App →
          </Link>
          <Link 
            href="/portal"
            className="px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--text)' }}
          >
            Customer Portal →
          </Link>
        </div>
        
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
              🏢 CRM Dashboard
            </h3>
            <p className="text-sm text-gray-500">
              Manage bookings, customers, and cleaners. Full admin control.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
              📱 Cleaner App
            </h3>
            <p className="text-sm text-gray-500">
              GPS clock in/out, photo uploads, and job management on the go.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
              👤 Customer Portal
            </h3>
            <p className="text-sm text-gray-500">
              Book services, view history, and manage your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
