import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DBReviewInput } from "@/lib/queries/get.reviews";
import { AllReviewsResult } from "@/lib/queries/get.reviews";
import { ReviewData } from "@/lib/validations/review.validation";
import { ApiError } from '@/lib/types'

export const useProductReviews = (productId: string) =>
  useQuery({
    queryKey: ['productReviews', productId],
    queryFn: async () => {
      console.log('Fetching reviews for product ID:', productId)
      const reviewResult = await fetch(`/api/products/${productId}/reviews`)
      if (!reviewResult.ok) {
        throw new Error('Error fetching reviews')
      }
      return reviewResult.json() as Promise<DBReviewInput[]>
    },
    staleTime: 5 * 60 * 1000,
  })

export const useReviewById = (reviewId: string) =>
  useQuery({
    queryKey: ['reviewById', reviewId],
    queryFn: async () => {
      const reviewResult = await fetch(`/api/reviews/${reviewId}`)
      if (!reviewResult.ok) {
        throw new Error('Error fetching review')
      }
      if (!reviewResult) {
        throw new Error('No review found')
      }
      return reviewResult.json() as Promise<DBReviewInput>
    },
    staleTime: 5 * 60 * 1000,
  })

export const useAllReviews = () =>
  useQuery<AllReviewsResult>({
    queryKey: ['allReviews'],
    queryFn: async () => {
      const res = await fetch('/api/reviews')
      if (!res.ok) throw new Error('Error fetching reviews')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
  })

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation<unknown, ApiError, ReviewData>({
    mutationFn: async (reviewData) => {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw {
          message: result.message || 'Something went wrong',
          errors: result.errors
        }
      }

      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}