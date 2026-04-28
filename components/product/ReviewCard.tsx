'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  CheckCircle,
  MessageSquare,
} from 'lucide-react'
import { SellerResponse } from './SellerResponse'
import { SellerResponseForm } from './SellerResponseForm'
import { ImageLightbox } from './ImageLightbox'
import { DBReviewInput } from '@/lib/queries/get.reviews'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

interface ReviewCardProps {
  review: DBReviewInput
  helpfulStatus?: 'up' | 'down'
  onHelpful: (type: 'up' | 'down') => void
  isSellerView?: boolean
  onSellerRespond?: (reviewId: string, response: string) => Promise<void>
}

export function ReviewCard({
  review,
  helpfulStatus,
  onHelpful,
  isSellerView = false,
  onSellerRespond,
}: ReviewCardProps) {
  const [showFullContent, setShowFullContent] = useState(false)
  const [reportedReview, setReportedReview] = useState(false)
  const [showResponseForm, setShowResponseForm] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const isLongReview = review.content.length > 300
  const displayContent = showFullContent
    ? review.content
    : review.content.slice(0, 300)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const handleSellerRespond = async (response: string) => {
    if (onSellerRespond) {
      await onSellerRespond(review.id, response)
      setShowResponseForm(false)
    }
  }

  return (
    <div className="py-6 first:pt-0">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 bg-linen rounded-full flex items-center justify-center shrink-0">
          {review.avatar ? (
            <Image
              src={review.avatar}
              alt={review.authorName}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <span className="text-sm font-medium text-warm-gray-dark">
              {review.authorName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-medium text-charcoal">{review.authorName}</span>
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Verified Purchase
              </span>
            )}
          </div>

          {/* Rating & Date */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < review.rating
                      ? 'fill-gold text-gold'
                      : 'fill-warm-gray-light text-warm-gray-light'
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-warm-gray-dark">{formatDate(review.createdAt)}</span>
          </div>

          {/* Title */}
          <h4 className="font-medium text-charcoal mb-2">{review.title}</h4>

          {/* Recommendation Badge */}
          {review.recommendProduct !== undefined && (
            <div className="mb-3">
              {review.recommendProduct ? (
                <span className="inline-flex items-center gap-1 text-xs text-green-700">
                  👍 Recommends this product
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-red-600">
                  👎 Does not recommend this product
                </span>
              )}
            </div>
          )}

          {/* Content */}
          <p className="text-sm text-warm-gray-dark leading-relaxed mb-3 whitespace-pre-line">
            {displayContent}
            {isLongReview && !showFullContent && '...'}
          </p>

          {isLongReview && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-sm text-gold hover:underline mb-3"
            >
              {showFullContent ? 'Show less' : 'Read more'}
            </button>
          )}

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {review.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="relative w-16 h-16 rounded-lg overflow-hidden bg-linen 
                             hover:opacity-90 transition-opacity ring-2 ring-transparent 
                             hover:ring-gold focus:ring-gold focus:outline-none"
                >
                  <Image
                    src={image}
                    alt={`Review image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-sm text-warm-gray-dark">Was this helpful?</span>

            <button
              onClick={() => onHelpful('up')}
              className={cn(
                'flex items-center gap-1.5 text-sm transition-colors',
                helpfulStatus === 'up'
                  ? 'text-green-600'
                  : 'text-warm-gray-dark hover:text-charcoal'
              )}
            >
              <ThumbsUp
                className={cn('w-4 h-4', helpfulStatus === 'up' && 'fill-current')}
              />
              Yes ({review.helpful + (helpfulStatus === 'up' ? 1 : 0)})
            </button>

            <button
              onClick={() => onHelpful('down')}
              className={cn(
                'flex items-center gap-1.5 text-sm transition-colors',
                helpfulStatus === 'down'
                  ? 'text-red-600'
                  : 'text-warm-gray-dark hover:text-charcoal'
              )}
            >
              <ThumbsDown
                className={cn('w-4 h-4', helpfulStatus === 'down' && 'fill-current')}
              />
              No
            </button>

            <span className="text-warm-gray-light">|</span>

            <button
              onClick={() => setReportedReview(true)}
              disabled={reportedReview}
              className={cn(
                'flex items-center gap-1.5 text-sm transition-colors',
                reportedReview
                  ? 'text-warm-gray-dark cursor-default'
                  : 'text-warm-gray-dark hover:text-red-500'
              )}
            >
              <Flag className="w-4 h-4" />
              {reportedReview ? 'Reported' : 'Report'}
            </button>

            {/* Seller Response Button */}
            {isSellerView && !review.response && !showResponseForm && (
              <>
                <span className="text-warm-gray-light">|</span>
                <button
                  onClick={() => setShowResponseForm(true)}
                  className="flex items-center gap-1.5 text-sm text-gold hover:underline"
                >
                  <MessageSquare className="w-4 h-4" />
                  Respond
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Seller Response */}
      {review.response && (
        <SellerResponse
          sellerName={review.response.author}
          content={review.response.content}
          date={review.response.date.toLocaleDateString()}
        />
      )}

      {/* Seller Response Form */}
      {isSellerView && showResponseForm && (
        <SellerResponseForm
          reviewId={review.id}
          onSubmit={handleSellerRespond}
          onCancel={() => setShowResponseForm(false)}
        />
      )}

      {/* Image Lightbox */}
      {review.images && review.images.length > 0 && lightboxOpen && (
        <ImageLightbox
          images={review.images}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          alt={`${review.author}'s review photos`}
        />
      )}
    </div>
  )
}