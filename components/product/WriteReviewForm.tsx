'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { StarRatingInput } from '@/components/ui/StarRatingInput'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { cn } from '@/lib/utils'
import { SubmissionSuccess } from './SubmissionStatus'
import { useCreateReview } from '@/hooks/useProductReviews'
import { ApiError } from '@/lib/types'
import { ReviewData } from '@/lib/validations/review.validation'

interface WriteReviewFormProps {
  productId: string
  productName: string
  onCancel?: () => void
}

export function WriteReviewForm({
  productId,
  productName,
  onCancel,
}: WriteReviewFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const [formData, setFormData] = useState<ReviewData>({
    rating: 0,
    title: '',
    content: '',
    images: [],
    product: productId,
  })

  const reviewMutation = useCreateReview()

  const handleChange = (field: keyof ReviewData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    reviewMutation.mutate(
      { ...formData, product: productId },
      {
        onSuccess: () => {
          setIsSubmitted(true)
        },
        onError: (error: ApiError) => {
          console.log('Error submitting review:', error?.errors?.fieldErrors || error.message)
          const fieldErrors = error?.errors?.fieldErrors || {}
          if (error.errors) {
            setErrors(fieldErrors)
          } else {
            setErrors({ submit: [error.message] })
          }
        },
      })
  }

  // Success State
  if (isSubmitted) {
    return (
      <SubmissionSuccess
        title="Thank You for Your Review!"
        description="Your review has been submitted and is pending approval. It will appear on the product page shortly."
        onClose={onCancel}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Info */}
      <div className="pb-4 border-b border-warm-gray-light">
        <p className="text-sm text-warm-gray-dark">Reviewing:</p>
        <p className="font-medium text-charcoal">{productName}</p>
      </div>

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-3">
          Overall Rating <span className="text-red-500">*</span>
        </label>
        <StarRatingInput
          value={formData.rating}
          onChange={(rating) => handleChange('rating', rating)}
          size="lg"
        />
        {errors.rating && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.rating?.[0]}
          </p>
        )}
      </div>

      {/* Review Title */}
      <div>
        <Input
          label="Review Title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Summarize your experience"
          error={errors.title?.[0]}
          maxLength={100}
        />
        <p className="text-xs text-warm-gray-dark mt-1 text-right">
          {formData.title.length}/100
        </p>
      </div>

      {/* Review Content */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="What did you like or dislike about this product? How did it meet your expectations?"
          rows={5}
          maxLength={2000}
          className={cn(
            'w-full px-4 py-3 bg-white border rounded-brand text-charcoal placeholder:text-warm-gray-dark',
            'focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none',
            errors.content ? 'border-red-400' : 'border-warm-gray'
          )}
        />
        <div className="flex justify-between mt-1">
          {errors.content ? (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.content?.[0]}
            </p>
          ) : (
            <span />
          )}
          <p className="text-xs text-warm-gray-dark">
            {formData.content.length}/500
          </p>
        </div>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Add Photos (Optional)
        </label>
        <ImageUpload
          images={formData.images ? formData.images : []}
          onChange={(images) => handleChange('images', images)}
          maxImages={5}
        />
      </div>

      {/* Recommendation */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-3">
          Would you recommend this product?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleChange('recommendProduct', true)}
            className={cn(
              'flex-1 py-3 px-4 border rounded-brand text-sm font-medium transition-all',
              formData.recommendProduct === true
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-warm-grayhover:border-green-300 text-charcoal'
            )}
          >
            👍 Yes, I recommend it
          </button>
          <button
            type="button"
            onClick={() => handleChange('recommendProduct', false)}
            className={cn(
              'flex-1 py-3 px-4 border rounded-brand text-sm font-medium transition-all',
              formData.recommendProduct === false
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-warm-grayhover:border-red-300 text-charcoal'
            )}
          >
            👎 No, I don&apos;t
          </button>
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-linen rounded-brand p-4">
        <h4 className="font-medium text-charcoal text-sm mb-2">
          Review Guidelines
        </h4>
        <ul className="text-xs text-warm-gray-dark space-y-1">
          <li>• Be honest and specific about your experience</li>
          <li>• Focus on the product&apos;s features and quality</li>
          <li>• Avoid inappropriate language or personal information</li>
          <li>• Photos should clearly show the product</li>
        </ul>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-brand flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errors.submit}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={reviewMutation.isPending}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={reviewMutation.isPending}
          className="flex-1"
        >
          {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  )
}