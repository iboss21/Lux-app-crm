import Link from 'next/link'
import { 
  BookOpen,
  Search,
  FileText,
  Video,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  CheckCircle,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { kbArticles, kbCategories } from '@/lib/schema'
import { desc } from 'drizzle-orm'

interface ArticleData {
  id: string
  title: string
  category: string | null
  views: number | null
  createdAt: Date
}

async function getArticles(): Promise<ArticleData[]> {
  const db = getDb()
  if (!db) return []
  
  try {
    const articles = await db
      .select({
        id: kbArticles.id,
        title: kbArticles.title,
        category: kbArticles.category,
        views: kbArticles.views,
        createdAt: kbArticles.createdAt,
      })
      .from(kbArticles)
      .orderBy(desc(kbArticles.views))
      .limit(10)
    
    return articles
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

// Default content for staff documentation
const defaultCategories = [
  {
    name: 'Getting Started',
    icon: Sparkles,
    color: 'bg-purple-100 text-purple-600',
    articles: [
      'Welcome to EcoShine Pro',
      'Setting Up Your Account',
      'Understanding the Dashboard',
      'Your First Booking',
    ],
  },
  {
    name: 'Booking Management',
    icon: Calendar,
    color: 'bg-blue-100 text-blue-600',
    articles: [
      'Creating a New Booking',
      'Assigning Cleaners',
      'Managing Recurring Bookings',
      'Handling Cancellations',
    ],
  },
  {
    name: 'Customer Service',
    icon: Users,
    color: 'bg-green-100 text-green-600',
    articles: [
      'Customer Communication Best Practices',
      'Handling Complaints',
      'Managing Customer Expectations',
      'Building Customer Loyalty',
    ],
  },
  {
    name: 'Billing & Payments',
    icon: DollarSign,
    color: 'bg-yellow-100 text-yellow-600',
    articles: [
      'Creating Invoices',
      'Processing Payments',
      'Handling Refunds',
      'Managing Overdue Accounts',
    ],
  },
]

const cleaningGuides = [
  {
    title: 'Standard Cleaning Checklist',
    description: 'Step-by-step guide for standard cleaning services',
    downloadUrl: '#',
  },
  {
    title: 'Deep Cleaning Protocol',
    description: 'Comprehensive deep cleaning procedures',
    downloadUrl: '#',
  },
  {
    title: 'Move-Out Cleaning Guide',
    description: 'Detailed checklist for move-out cleanings',
    downloadUrl: '#',
  },
  {
    title: 'Commercial Cleaning Standards',
    description: 'Office and commercial space cleaning guide',
    downloadUrl: '#',
  },
]

const quickLinks = [
  { title: 'Company Policies', href: '#' },
  { title: 'Equipment Manuals', href: '#' },
  { title: 'Safety Protocols', href: '#' },
  { title: 'Training Videos', href: '#' },
  { title: 'FAQ', href: '#' },
  { title: 'Contact HR', href: '#' },
]

export default async function InfoPortalPage() {
  const articles = await getArticles()
  const db = getDb()
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            Info Portal
          </h1>
          <p className="text-gray-500 mt-1">
            Internal documentation and resources for staff
          </p>
        </div>
      </div>
      
      {/* Search */}
      <div className="card">
        <div className="card-body">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-3">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documentation, guides, and resources..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {defaultCategories.map((category, index) => (
          <div key={index} className="card hover:shadow-md transition">
            <div className="card-body">
              <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">{category.name}</h3>
              <ul className="space-y-2">
                {category.articles.map((article, articleIndex) => (
                  <li key={articleIndex}>
                    <Link
                      href={`/crm/info-portal/article/${articleIndex}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition"
                    >
                      <ChevronRight className="h-3 w-3" />
                      {article}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cleaning Guides */}
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
              Cleaning Guides & Checklists
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {cleaningGuides.map((guide, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{guide.title}</h3>
                      <p className="text-sm text-gray-500">{guide.description}</p>
                    </div>
                  </div>
                  <button className="btn btn-ghost text-sm">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
              Quick Links
            </h2>
          </div>
          <div className="card-body">
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <span className="text-gray-700 group-hover:text-primary">
                      {link.title}
                    </span>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Popular Articles from DB */}
      {articles.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold font-serif" style={{ color: 'var(--primary)' }}>
              Popular Articles
            </h2>
          </div>
          <div className="table-container border-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <Link 
                        href={`/crm/info-portal/${article.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {article.title}
                      </Link>
                    </td>
                    <td>
                      <span className="badge bg-gray-100 text-gray-700">
                        {article.category || 'General'}
                      </span>
                    </td>
                    <td className="text-gray-500">{article.views || 0} views</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Help Banner */}
      <div className="card bg-gradient-to-r from-primary to-secondary text-white">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold font-serif text-accent mb-2">
                Need Help?
              </h3>
              <p className="text-white/80">
                Can't find what you're looking for? Contact the support team.
              </p>
            </div>
            <button className="btn bg-white text-primary hover:bg-white/90">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
