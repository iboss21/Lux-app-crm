'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Star,
  Download,
  Filter,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Mock data for analytics - in production this would come from the database
const mockStats = {
  revenue: {
    current: 45750,
    previous: 38200,
    change: 19.8,
  },
  bookings: {
    current: 127,
    previous: 98,
    change: 29.6,
  },
  customers: {
    current: 312,
    previous: 287,
    change: 8.7,
  },
  avgRating: {
    current: 4.8,
    previous: 4.6,
    change: 4.3,
  },
}

const mockRevenueByService = [
  { name: 'Deep Clean', revenue: 18500, bookings: 42 },
  { name: 'Standard Clean', revenue: 12300, bookings: 56 },
  { name: 'Move Out Clean', revenue: 8900, bookings: 15 },
  { name: 'Office Clean', revenue: 4200, bookings: 8 },
  { name: 'Window Cleaning', revenue: 1850, bookings: 6 },
]

const mockRevenueByMonth = [
  { month: 'Jul', revenue: 32000 },
  { month: 'Aug', revenue: 35400 },
  { month: 'Sep', revenue: 38200 },
  { month: 'Oct', revenue: 41500 },
  { month: 'Nov', revenue: 43800 },
  { month: 'Dec', revenue: 45750 },
]

const mockTopCleaners = [
  { name: 'Maria Garcia', jobs: 45, revenue: 12500, rating: 4.9 },
  { name: 'Jose Rodriguez', jobs: 38, revenue: 10800, rating: 4.8 },
  { name: 'Ana Martinez', jobs: 32, revenue: 9200, rating: 4.9 },
  { name: 'Carlos Lopez', jobs: 28, revenue: 7800, rating: 4.7 },
  { name: 'Sofia Hernandez', jobs: 24, revenue: 6400, rating: 4.8 },
]

function StatCard({ 
  title, 
  value, 
  change, 
  prefix = '',
  suffix = '',
  icon: Icon 
}: { 
  title: string
  value: number
  change: number
  prefix?: string
  suffix?: string
  icon: React.ElementType
}) {
  const isPositive = change >= 0
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10`}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-gray-900">
          {prefix}{typeof value === 'number' && value >= 1000 
            ? value.toLocaleString() 
            : value}{suffix}
        </div>
        <div className="text-sm text-gray-500 mt-1">{title}</div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d')
  
  const maxRevenue = Math.max(...mockRevenueByMonth.map(m => m.revenue))
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            Analytics
          </h1>
          <p className="text-gray-500 mt-1">
            Track your business performance and trends
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="btn btn-ghost">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={mockStats.revenue.current}
          change={mockStats.revenue.change}
          prefix="$"
          icon={DollarSign}
        />
        <StatCard
          title="Total Bookings"
          value={mockStats.bookings.current}
          change={mockStats.bookings.change}
          icon={Calendar}
        />
        <StatCard
          title="Total Customers"
          value={mockStats.customers.current}
          change={mockStats.customers.change}
          icon={Users}
        />
        <StatCard
          title="Average Rating"
          value={mockStats.avgRating.current}
          change={mockStats.avgRating.change}
          icon={Star}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
              Revenue Trend
            </h2>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              +19.8%
            </div>
          </div>
          <div className="card-body">
            <div className="flex items-end gap-2 h-48">
              {mockRevenueByMonth.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-primary/80 rounded-t hover:bg-primary transition"
                    style={{ height: `${(month.revenue / maxRevenue) * 100}%` }}
                    title={`${month.month}: ${formatCurrency(month.revenue)}`}
                  />
                  <span className="text-xs text-gray-500 mt-2">{month.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Revenue by Service */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
              Revenue by Service
            </h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {mockRevenueByService.map((service, index) => {
                const percentage = (service.revenue / mockStats.revenue.current) * 100
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {service.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(service.revenue)} ({service.bookings} bookings)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Performers */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
            Top Performing Cleaners
          </h2>
        </div>
        <div className="table-container border-0">
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Cleaner</th>
                <th>Jobs Completed</th>
                <th>Revenue Generated</th>
                <th>Avg Rating</th>
              </tr>
            </thead>
            <tbody>
              {mockTopCleaners.map((cleaner, index) => (
                <tr key={index}>
                  <td>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-200 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="font-medium text-gray-900">{cleaner.name}</td>
                  <td>{cleaner.jobs}</td>
                  <td className="font-medium text-green-600">
                    {formatCurrency(cleaner.revenue)}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{cleaner.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/crm/reports" className="card hover:shadow-md transition">
          <div className="card-body flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Detailed Reports</h3>
              <p className="text-sm text-gray-500">Generate custom reports</p>
            </div>
          </div>
        </Link>
        <Link href="/crm/customers" className="card hover:shadow-md transition">
          <div className="card-body flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Customer Insights</h3>
              <p className="text-sm text-gray-500">View customer analytics</p>
            </div>
          </div>
        </Link>
        <Link href="/crm/cleaners" className="card hover:shadow-md transition">
          <div className="card-body flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Team Performance</h3>
              <p className="text-sm text-gray-500">Track team metrics</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
