'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  User, 
  Calendar, 
  Map, 
  FileText, 
  DollarSign, 
  Star, 
  BarChart3, 
  Settings,
  MessageSquare,
  Bell,
  Zap,
  BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/crm', icon: LayoutDashboard },
  { name: 'Bookings', href: '/crm/bookings', icon: ClipboardList },
  { name: 'Customers', href: '/crm/customers', icon: Users },
  { name: 'Cleaners', href: '/crm/cleaners', icon: User },
  { name: 'Calendar', href: '/crm/calendar', icon: Calendar },
  { name: 'Routes', href: '/crm/routes', icon: Map },
  { name: 'Invoices', href: '/crm/invoices', icon: FileText },
  { name: 'Payouts', href: '/crm/payouts', icon: DollarSign },
  { name: 'Reviews', href: '/crm/reviews', icon: Star },
  { name: 'Leads', href: '/crm/leads', icon: MessageSquare },
  { name: 'Automations', href: '/crm/automations', icon: Zap },
  { name: 'Analytics', href: '/crm/analytics', icon: BarChart3 },
  { name: 'Info Portal', href: '/crm/info-portal', icon: BookOpen },
  { name: 'Settings', href: '/crm/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        ✨ EcoShine Pro
      </div>
      
      {/* Navigation */}
      <nav className="sidebar-nav">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/crm' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn('sidebar-link', isActive && 'active')}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
      
      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-2 text-white/60 text-sm">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium text-white">Admin</p>
            <p className="truncate text-xs">admin@ecoshine.pro</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
