'use client'

import { useState, useMemo } from 'react'
import { Star, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { WriteReviewModal } from './WriteReviewModal'
// import { ReviewData } from './WriteReviewForm'
import { ReviewCard } from './ReviewCard'
import { DBReviewInput } from '@/lib/queries/get.reviews'
import { cn } from '@/lib/utils'

interface ReviewSectionProps {
  productId: string
  productName: string
  reviews: DBReviewInput[]
  averageRating: number
  totalReviews: number
}

export function ReviewSection({
  productId,
  productName,
  reviews,
  averageRating,
  totalReviews,
}: ReviewSectionProps) {
  const [sortBy, setSortBy] = useState('newest')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [visibleCount, setVisibleCount] = useState(5)
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false)
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, 'up' | 'down'>>({})

  // Reviews rating breakdown
  const ratingBreakdown = useMemo(() => {
    return [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((review) => review.rating === stars).length
      const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0

      return {
        stars,
        count,
        percentage
      }
    })
  }, [reviews, totalReviews])

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => (filterRating ? review.rating === filterRating : true))
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        case 'helpful':
          return b.helpful - a.helpful
        default:
          return 0
      }
    })

  // const handleWriteReview = async (reviewData: ReviewData) => {
  //   console.log('Submitted review:', reviewData)
  //   try {
  //     const response = await fetch('/api/reviews', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         ...reviewData,
  //         product: productId,
  //       }),
  //     })
  //     if (!response.ok) {
  //       const errorData = await response.json()
  //       console.error('Failed to create review:', errorData)
  //     }

  //     const data = await response.json()
  //     console.log('Review created successfully:', data)

  //   } catch (error: unknown) {
  //     console.error('Error submitting review:', (error as Error).message)
  //   }
  // }

  const handleHelpful = (reviewId: string, type: 'up' | 'down') => {
    console.log(`Marked review ${reviewId} as ${type}helpful`)
    setHelpfulReviews((prev) => {
      const updated = { ...prev };
      delete updated[reviewId];
      return updated;
    }
    )
  }

  const handleFilterByRating = (stars: number) => {
    setFilterRating(filterRating === stars ? null : stars)
  }

  return (
    <div className="space-y-8">
      <Header title="Customer Ratings & Reviews" as="h2" />
      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Average Rating */}
        <div className="lg:col-span-3 text-center lg:text-left">
          <div className="text-5xl font-serif font-semibold text-charcoal mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-5 h-5',
                  i < Math.floor(averageRating)
                    ? 'fill-gold text-gold'
                    : i < averageRating
                      ? 'fill-gold/50 text-gold'
                      : 'fill-warm-gray-light text-warm-gray-light'
                )}
              />
            ))}
          </div>
          <p className="text-sm text-warm-gray-dark">
            Based on {totalReviews} reviews
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="lg:col-span-5 space-y-2">
          {ratingBreakdown.map(({ stars, percentage, count }) => (
            <button
              key={stars}
              onClick={() => handleFilterByRating(stars)}
              className={cn(
                'flex items-center gap-3 w-full group transition-colors rounded p-1 -mx-1',
                filterRating === stars && 'bg-linen'
              )}
            >
              <span className="text-sm text-warm-gray-dark w-12 text-left group-hover:text-gold transition-colors">
                {stars} star
              </span>
              <div className="flex-1 h-2.5 bg-warm-gray-light rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-warm-gray-dark w-12 text-right group-hover:text-gold transition-colors">
                {count}
              </span>
            </button>
          ))}

          {filterRating && (
            <button
              onClick={() => setFilterRating(null)}
              className="text-sm text-gold hover:underline mt-2"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Write Review CTA */}
        <div className="lg:col-span-4">
          <div className="bg-linen rounded-brand p-6 text-center">
            <h4 className="font-medium text-charcoal mb-2">Share your thoughts</h4>
            <p className="text-sm text-warm-gray-dark mb-4">
              If you&apos;ve used this product, help others by sharing your experience.
            </p>
            <Button onClick={() => setIsWriteReviewOpen(true)} className="w-full">
              Write a Review
            </Button>
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-warm-gray-light">
        <h3 className="font-serif text-xl text-charcoal">
          Customer Reviews
          {filterRating && (
            <span className="text-gold text-base font-normal ml-2">
              ({filterRating} stars)
            </span>
          )}
        </h3>
        <Select
          options={[
            { value: 'newest', label: 'Newest First' },
            { value: 'oldest', label: 'Oldest First' },
            { value: 'highest', label: 'Highest Rated' },
            { value: 'lowest', label: 'Lowest Rated' },
            { value: 'helpful', label: 'Most Helpful' },
          ]}
          value={sortBy}
          onChange={setSortBy}
          className="w-44"
        />
      </div>

      {/* Reviews List */}
      {filteredReviews.length > 0 ? (
        <div className="divide-y divide-warm-gray-light">
          {filteredReviews.slice(0, visibleCount).map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              helpfulStatus={helpfulReviews[review.id]}
              onHelpful={(type) => handleHelpful(review.id, type)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-warm-gray-dark">
            {filterRating
              ? `No ${filterRating}-star reviews yet.`
              : 'No reviews yet. Be the first to review this product!'}
          </p>
          {!filterRating && (
            <Button
              onClick={() => setIsWriteReviewOpen(true)}
              className="mt-4"
            >
              Write the First Review
            </Button>
          )}
        </div>
      )}

      {/* Load More */}
      {visibleCount < filteredReviews.length && (
        <div className="text-center pt-4">
          <Button
            variant="secondary"
            onClick={() => setVisibleCount((prev) => prev + 5)}
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            Show More Reviews ({filteredReviews.length - visibleCount} remaining)
          </Button>
        </div>
      )}

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
        productId={productId}
        productName={productName}
      // onSubmit={handleWriteReview}
      />
    </div>
  )
}

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
interface HeadingProps {
  as: HeadingType;
  title: string;
}
export const Header = ({ title, as: Tag }: HeadingProps) => {
  return (
    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-warm-gray-light'>
      <Tag className="font-serif text-xl text-charcoal">
        {title}
      </Tag>
    </div>
  )
}
