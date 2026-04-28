'use client'

import { ReviewSection } from '@/components/product/ReviewSection'
import { useProductReviews } from '@/hooks/useProductReviews'

type ProductReviewsProps = {
  productId: string
  productName: string
}

export const ProductReviews = ({ productId, productName }: ProductReviewsProps) => {
  console.log('\n\nProductReviews Component - Product ID:', productId, '\nProduct Name:', productName)
  const { data: productReviews, error, isPending } = useProductReviews(productId)

  if (error) return <div>Error loading reviews: {error.message}</div>

  if (isPending) return <div>Loading reviews...</div>

  const reviews = productReviews ?? []
  const numReviews = reviews.length ?? 0
  const averageRating = numReviews > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews) * 10) / 10
    : 0

  console.log('Product Reviews:', reviews)

  return (
    <ReviewSection
      productId={productId}
      productName={productName}
      reviews={reviews}
      averageRating={averageRating}
      totalReviews={numReviews}
    />
  )
}