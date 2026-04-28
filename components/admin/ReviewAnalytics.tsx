// components/admin/ReviewAnalytics.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Star,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  ThumbsUp,
  Camera,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewAnalyticsData {
  totalReviews: number
  averageRating: number
  ratingChange: number
  reviewsThisMonth: number
  monthlyChange: number
  verifiedPercentage: number
  withImagesPercentage: number
  averageHelpfulVotes: number
  ratingDistribution: { rating: number; count: number; percentage: number }[]
  monthlyTrend: { month: string; count: number; avgRating: number }[]
  topReviewedProducts: { id: string; name: string; reviewCount: number; avgRating: number }[]
}

export function ReviewAnalytics() {
  const [data, setData] = useState<ReviewAnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    async function fetchAnalytics() {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/admin/reviews/analytics?range=${timeRange}`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalytics()
  }, [timeRange])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-charcoal">Review Analytics</h2>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg transition-colors',
                timeRange === range
                  ? 'bg-charcoal text-white'
                  : 'bg-linen text-charcoal hover:bg-warm-gray-light'
              )}
            >
              {range === '7d' && 'Week'}
              {range === '30d' && 'Month'}
              {range === '90d' && '3 Months'}
              {range === '1y' && 'Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-brand p-5 border border-warm-gray-light">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-5 h-5 text-gold" />
            {data.monthlyChange !== 0 && (
              <span
                className={cn(
                  'flex items-center text-xs font-medium',
                  data.monthlyChange > 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                {data.monthlyChange > 0 ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {Math.abs(data.monthlyChange)}%
              </span>
            )}
          </div>
          <p className="text-3xl font-semibold text-charcoal">{data.totalReviews}</p>
          <p className="text-sm text-warm-gray-dark">Total Reviews</p>
        </div>

        <div className="bg-white rounded-brand p-5 border border-warm-gray-light">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-gold fill-gold" />
            {data.ratingChange !== 0 && (
              <span
                className={cn(
                  'flex items-center text-xs font-medium',
                  data.ratingChange > 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                {data.ratingChange > 0 ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {Math.abs(data.ratingChange).toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-3xl font-semibold text-charcoal">
            {data.averageRating.toFixed(1)}
          </p>
          <p className="text-sm text-warm-gray-dark">Average Rating</p>
        </div>

        <div className="bg-white rounded-brand p-5 border border-warm-gray-light">
          <div className="flex items-center justify-between mb-2">
            <ThumbsUp className="w-5 h-5 text-gold" />
          </div>
          <p className="text-3xl font-semibold text-charcoal">
            {data.verifiedPercentage}%
          </p>
          <p className="text-sm text-warm-gray-dark">Verified Purchases</p>
        </div>

        <div className="bg-white rounded-brand p-5 border border-warm-gray-light">
          <div className="flex items-center justify-between mb-2">
            <Camera className="w-5 h-5 text-gold" />
          </div>
          <p className="text-3xl font-semibold text-charcoal">
            {data.withImagesPercentage}%
          </p>
          <p className="text-sm text-warm-gray-dark">With Photos</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-brand p-6 border border-warm-gray-light">
        <h3 className="font-medium text-charcoal mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {data.ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm text-warm-gray-dark w-12">{rating} star</span>
              <div className="flex-1 h-4 bg-linen rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    rating >= 4 ? 'bg-green-500' : rating >= 3 ? 'bg-amber-500' : 'bg-red-500'
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-charcoal w-16 text-right">
                {count} ({percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-brand p-6 border border-warm-gray-light">
        <h3 className="font-medium text-charcoal mb-4">Monthly Trend</h3>
        <div className="flex items-end gap-2 h-40">
          {data.monthlyTrend.map((month, index) => {
            const maxCount = Math.max(...data.monthlyTrend.map((m) => m.count))
            const height = (month.count / maxCount) * 100

            return (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-charcoal font-medium">{month.count}</div>
                <div
                  className="w-full bg-gold/80 rounded-t-sm transition-all duration-300 hover:bg-gold"
                  style={{ height: `${height}%` }}
                />
                <div className="text-xs text-warm-gray-dark">{month.month}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Reviewed Products */}
      <div className="bg-white rounded-brand p-6 border border-warm-gray-light">
        <h3 className="font-medium text-charcoal mb-4">Top Reviewed Products</h3>
        <div className="space-y-3">
          {data.topReviewedProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between py-2 border-b border-warm-gray-light last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-warm-gray-dark w-6">
                  #{index + 1}
                </span>
                <span className="text-charcoal">{product.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-warm-gray-dark">
                  {product.reviewCount} reviews
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="text-sm font-medium text-charcoal">
                    {product.avgRating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}