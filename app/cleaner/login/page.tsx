'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function CleanerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/cleaner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }
      
      router.push('/cleaner/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-4">
        <Link 
          href="/cleaner"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-serif text-primary">
              ✨ EcoShine Pro
            </h1>
            <p className="text-gray-600 mt-2">Cleaner Login</p>
          </div>
          
          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/cleaner/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign In
                </>
              )}
            </button>
          </form>
          
          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-600">Email: demo@ecoshine.pro</p>
            <p className="text-xs text-blue-600">Password: demo123</p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-500">
        © 2024 EcoShine Pro. All rights reserved.
      </footer>
    </div>
  )
}
