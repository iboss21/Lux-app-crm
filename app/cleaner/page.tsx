import Link from 'next/link'
import { 
  Briefcase, 
  Clock, 
  MapPin, 
  Camera, 
  User, 
  LogIn 
} from 'lucide-react'

export default function CleanerHomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 bg-primary text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-serif text-accent">
            ✨ EcoShine Pro
          </h1>
          <Link 
            href="/cleaner/login"
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
              Cleaner App
            </h2>
            <p className="text-gray-600 mt-2">
              Manage your cleaning jobs, clock in/out, and upload photos
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-4">
            <FeatureCard
              icon={Briefcase}
              title="Today's Jobs"
              description="View and manage your assigned cleaning jobs"
            />
            <FeatureCard
              icon={Clock}
              title="GPS Clock In/Out"
              description="Track your time with location verification"
            />
            <FeatureCard
              icon={MapPin}
              title="Navigation"
              description="Get directions to your next job"
            />
            <FeatureCard
              icon={Camera}
              title="Photo Upload"
              description="Capture before and after photos"
            />
            <FeatureCard
              icon={User}
              title="Profile"
              description="Manage your profile and availability"
            />
          </div>
          
          {/* Login CTA */}
          <div className="pt-6">
            <Link
              href="/cleaner/login"
              className="w-full block text-center py-4 rounded-xl font-semibold text-white transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
            >
              Login to Continue
            </Link>
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
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  )
}
