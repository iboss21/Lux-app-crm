import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Sidebar } from '@/components/crm/sidebar'
import { Header } from '@/components/crm/header'

export const metadata: Metadata = {
  title: 'EcoShine Pro CRM',
  description: 'Admin & Operations CRM for EcoShine Pro luxury cleaning services',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#4a1e2b',
}

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="ml-64">
        {/* Header */}
        <Header />
        
        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
