import Link from 'next/link'
import { 
  Star, 
  Search, 
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Eye,
  MoreHorizontal,
  Filter
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { customerReviews, customers, cleaners } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { formatDate } from '@/lib/utils'

interface ReviewData {
  id: string
  customerName: string
  cleanerName: string | null
  rating: number | null
  comment: string | null
  wouldRecommend: boolean | null
  isPublic: boolean | null
  isVerified: boolean | null
  createdAt: Date
}

async function getReviews(): Promise<ReviewData[]> {
  const db = getDb()
  if (!db) return []
  
  try {
    const allReviews = await db
      .select()
      .from(customerReviews)
      .orderBy(desc(customerReviews.createdAt))
      .limit(100)
    
    const result: ReviewData[] = []
    
    for (const review of allReviews) {
      let customerName = 'Unknown Customer'
      let cleanerName: string | null = null
      
      if (review.customerId) {
        const customer = await db
          .select({ firstName: customers.firstName, lastName: customers.lastName })
          .from(customers)
          .where(eq(customers.id, review.customerId))
          .limit(1)
        if (customer.length > 0) {
          customerName = `${customer[0].firstName} ${customer[0].lastName}`
        }
      }
      
      if (review.cleanerId) {
        const cleaner = await db
          .select({ firstName: cleaners.firstName, lastName: cleaners.lastName })
          .from(cleaners)
          .where(eq(cleaners.id, review.cleanerId))
          .limit(1)
        if (cleaner.length > 0) {
          cleanerName = `${cleaner[0].firstName} ${cleaner[0].lastName}`
        }
      }
      
      result.push({
        id: review.id,
        customerName,
        cleanerName,
        rating: review.rating,
        comment: review.comment,
        wouldRecommend: review.wouldRecommend,
        isPublic: review.isPublic,
        isVerified: review.isVerified,
        createdAt: review.createdAt,
      })
    }
    
    return result
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

function StarRating({ rating }: { rating: number | null }) {
  const stars = rating || 0
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= stars 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

export default async function ReviewsPage() {
  const allReviews = await getReviews()
  const db = getDb()
  
  const avgRating = allReviews.length > 0 
    ? allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / allReviews.filter(r => r.rating).length
    : 0
  
  const ratingCounts = {
    five: allReviews.filter(r => r.rating === 5).length,
    four: allReviews.filter(r => r.rating === 4).length,
    three: allReviews.filter(r => r.rating === 3).length,
    low: allReviews.filter(r => r.rating && r.rating <= 2).length,
  }
  
  const wouldRecommend = allReviews.filter(r => r.wouldRecommend).length
  const recommendRate = allReviews.length > 0 
    ? Math.round((wouldRecommend / allReviews.length) * 100)
    : 0
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--primary)' }}>
            Reviews
          </h1>
          <p className="text-gray-500 mt-1">
            Manage customer feedback and ratings
          </p>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-yellow-500">{avgRating.toFixed(1)}</div>
            <Star className="h-6 w-6 text-yellow-400 fill-current" />
          </div>
          <div className="text-sm text-gray-500">Average Rating</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{ratingCounts.five}</div>
          <div className="text-sm text-gray-500">5-Star Reviews</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-primary">{allReviews.length}</div>
          <div className="text-sm text-gray-500">Total Reviews</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{recommendRate}%</div>
          <div className="text-sm text-gray-500">Would Recommend</div>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="input py-2 text-sm">
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <button className="btn btn-ghost text-sm">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>
      
      {/* Reviews list */}
      <div className="card">
        <div className="divide-y divide-gray-100">
          {allReviews.length > 0 ? (
            allReviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">
                          {review.customerName}
                        </span>
                        <StarRating rating={review.rating} />
                        {review.isVerified && (
                          <span className="badge bg-green-100 text-green-700 text-xs">
                            Verified
                          </span>
                        )}
                      </div>
                      
                      {review.cleanerName && (
                        <p className="text-sm text-gray-500 mt-1">
                          Cleaner: {review.cleanerName}
                        </p>
                      )}
                      
                      {review.comment && (
                        <p className="text-gray-600 mt-3 max-w-2xl">
                          &ldquo;{review.comment}&rdquo;
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(review.createdAt)}
                        </span>
                        {review.wouldRecommend !== null && (
                          <span className={`flex items-center gap-1 text-sm ${
                            review.wouldRecommend ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {review.wouldRecommend ? (
                              <>
                                <ThumbsUp className="h-3.5 w-3.5" />
                                Would recommend
                              </>
                            ) : (
                              <>
                                <ThumbsDown className="h-3.5 w-3.5" />
                                Would not recommend
                              </>
                            )}
                          </span>
                        )}
                        {review.isPublic === false && (
                          <span className="text-xs text-gray-400">Private</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/crm/reviews/${review.id}`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4 text-gray-500" />
                    </Link>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title="More Actions"
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state py-12">
              <Star className="empty-state-icon" />
              <p className="empty-state-title">No reviews yet</p>
              <p className="empty-state-description">
                {db ? 'Reviews will appear here when customers submit feedback' : 'Connect your database to view reviews'}
              </p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {allReviews.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {allReviews.length} reviews
            </p>
            <div className="flex items-center gap-2">
              <button className="btn btn-ghost btn-sm" disabled>
                Previous
              </button>
              <button className="btn btn-ghost btn-sm">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
