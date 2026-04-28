// components/product/ReviewRequestCard.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StarRatingInput } from '@/components/ui/StarRatingInput'
import { WriteReviewModal } from './WriteReviewModal'
import { ReviewData } from './WriteReviewForm'

interface ReviewRequestCardProps {
  orderId: string
  product: {
    id: string
    name: string
    image: string
  }
  purchaseDate: string
  onDismiss: () => void
}

export function ReviewRequestCard({
  orderId,
  product,
  purchaseDate,
  onDismiss,
}: ReviewRequestCardProps) {
  const [quickRating, setQuickRating] = useState(0)
  const [showFullReview, setShowFullReview] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleQuickRate = (rating: number) => {
    setQuickRating(rating)
    // Optionally auto-open full review for low ratings
    if (rating <= 3) {
      setShowFullReview(true)
    }
  }

  const handleSubmitReview = async (reviewData: ReviewData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Review submitted:', { orderId, productId: product.id, ...reviewData })
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-brand p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-green-600 fill-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-700">Thanks for your review!</p>
            <p className="text-sm text-green-600">Your feedback helps other shoppers.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white border border-warm-gray-light rounded-brand p-4 relative">
        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 text-warm-gray-dark hover:text-charcoal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex gap-4">
          {/* Product Image */}
          <Link
            href={`/products/${product.id}`}
            className="relative w-16 h-16 bg-linen rounded-lg overflow-hidden shrink-0"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-warm-gray-dark mb-1">
              Purchased on {purchaseDate}
            </p>
            <Link href={`/products/${product.id}`}>
              <h4 className="font-medium text-charcoal text-sm hover:text-gold transition-colors line-clamp-1 mb-2">
                {product.name}
              </h4>
            </Link>

            <p className="text-sm text-charcoal mb-2">How was your experience?</p>

            {/* Quick Star Rating */}
            <div className="flex items-center gap-4">
              <StarRatingInput
                value={quickRating}
                onChange={handleQuickRate}
                size="sm"
                showLabel={false}
              />

              {quickRating > 0 && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowFullReview(true)}
                >
                  Write Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Review Modal */}
      <WriteReviewModal
        isOpen={showFullReview}
        onClose={() => setShowFullReview(false)}
        productId={product.id}
        productName={product.name}
        onSubmit={handleSubmitReview}
      />
    </>
  )
}