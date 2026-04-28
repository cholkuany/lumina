'use client'

import { useState, useCallback } from 'react'

interface UseReviewReportOptions {
  reviewId: string
  userId?: string
}

export function useReviewReport({ reviewId, userId }: UseReviewReportOptions) {
  const [isReported, setIsReported] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reportReview = useCallback(
    async (reason: string, details?: string) => {
      if (!userId) {
        setError('Please log in to report')
        return false
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/reviews/${reviewId}/report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, reason, details }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to submit report')
        }

        setIsReported(true)
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to submit report')
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [reviewId, userId]
  )

  return {
    isReported,
    isLoading,
    error,
    reportReview,
  }
}