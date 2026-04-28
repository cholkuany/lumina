// components/product/QuickReview.tsx
'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StarRatingInput } from '@/components/ui/StarRatingInput'

interface QuickReviewProps {
  productId: string
  productName: string
  onSubmit: (rating: number, comment?: string) => Promise<void>
  onClose?: () => void
  showComment?: boolean
}

export function QuickReview({
  // productId,
  // productName,
  onSubmit,
  onClose,
  showComment = true,
}: QuickReviewProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)
    try {
      await onSubmit(rating, comment)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Failed to submit review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-brand p-4 text-center">
        <p className="text-green-700 font-medium">Thanks for your feedback!</p>
      </div>
    )
  }

  return (
    <div className="bg-linen rounded-brand p-4">
      {onClose && (
        <div className="flex justify-end -mt-2 -mr-2 mb-2">
          <button
            onClick={onClose}
            className="p-1 text-warm-gray-dark hover:text-charcoal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="text-center">
        <p className="text-sm text-charcoal font-medium mb-3">
          How would you rate this product?
        </p>

        <div className="flex justify-center mb-4">
          <StarRatingInput
            value={rating}
            onChange={setRating}
            size="md"
            showLabel={false}
          />
        </div>

        {showComment && rating > 0 && (
          <div className="mb-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a quick comment (optional)"
              rows={2}
              className="w-full px-3 py-2 text-sm bg-white border border-warm-grayrounded-lg 
                         focus:outline-none focus:border-gold resize-none"
              maxLength={200}
            />
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          size="sm"
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </Button>
      </div>
    </div>
  )
}