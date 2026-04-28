'use client'

import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/ui/StarRating'
import { DBReview } from '@/lib/queries/get.reviews'

import Image from 'next/image'

import { Check, X, Flag, BadgeCheck, ThumbsUp } from "lucide-react"

export function ReviewDetailModal({
  review,
  onClose,
  onApprove,
  onReject,
}: {
  review: DBReview
  onClose: () => void
  onApprove: () => void
  onReject: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-brand shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-warm-gray">
          <h2 className="text-lg font-semibold text-charcoal">Review Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-warm-gray-dark hover:text-charcoal hover:bg-linen rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Product */}
          <div className="flex items-center gap-4 p-4 bg-linen rounded-brand">
            {review.productInfo.image ? (
              <Image
                src={review.productInfo.image}
                alt={review.productInfo.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-warm-gray-light shrink-0" />
            )}
            <div>
              <p className="font-medium text-charcoal">{review.productInfo.name}</p>
              <p className="text-sm text-warm-gray-dark">Product ID: {review.productInfo.id}</p>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <span className="text-gold font-semibold text-sm">
                  {review.authorName.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-charcoal">{review.authorName}</p>
                  {review.verified && (
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                {/* <p className="text-sm text-warm-gray-dark">{review.email}</p> */}
              </div>
            </div>
            <div className="text-right">
              <StarRating value={review.rating} readonly size="md" />
              <p className="text-xs text-warm-gray-dark mt-1">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Review Content */}
          <div>
            <h3 className="font-semibold text-charcoal text-lg">{review.title}</h3>
            <p className="text-charcoal/80 mt-2 whitespace-pre-wrap">{review.content}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 py-4 border-t border-b border-warm-gray-light">
            <div className="flex items-center gap-2 text-sm text-warm-gray-dark">
              <ThumbsUp className="w-4 h-4" />
              {review.helpful} found helpful
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={review.status} />
            </div>
            {review.reports.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <Flag className="w-4 h-4" />
                Reported
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {review.status === 'pending' && (
          <div className="p-4 border-t border-warm-gray bg-linen flex gap-3">
            <Button variant="secondary" onClick={onReject} className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button variant="primary" onClick={onApprove} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}