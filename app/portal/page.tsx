import Link from 'next/link'
import { 
  Calendar, 
  Image, 
  Star, 
  CreditCard, 
  User, 
  LogIn,
  Clock,
  RefreshCw
} from 'lucide-react'

export default function PortalHomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 bg-primary text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-serif text-accent">
            ✨ EcoShine Pro
          </h1>
          <Link 
            href="/portal/login"
            className="flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-serif text-primary">
              Customer Portal
            </h2>
            <p className="text-gray-600 mt-2">
              Manage your bookings, view service history, and leave reviews
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-4">
            <FeatureCard
              icon={Calendar}
              title="Booking History"
              description="View all your past and upcoming bookings"
            />
            <FeatureCard
              icon={RefreshCw}
              title="Rebook Services"
              description="Quickly rebook your favorite services"
            />
            <FeatureCard
              icon={Image}
              title="Before/After Photos"
              description="See the transformation of your space"
            />
            <FeatureCard
              icon={Star}
              title="Leave Reviews"
              description="Rate your experience and help others"
            />
            <FeatureCard
              icon={CreditCard}
              title="Payment Methods"
              description="Manage your payment options"
            />
            <FeatureCard
              icon={User}
              title="Profile"
              description="Update your contact and address info"
            />
          </div>
          
          {/* Login CTA */}
          <div className="pt-6">
            <Link
              href="/portal/login"
              className="w-full block text-center py-4 rounded-xl font-semibold text-white transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
            >
              Login to Continue
            </Link>
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{' '}
              <Link href="/booking" className="text-primary hover:underline font-medium">
                Book your first cleaning
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-500 border-t border-gray-200">
        © 2024 EcoShine Pro. All rights reserved.
      </footer>
    </div>
  )
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  )
}
