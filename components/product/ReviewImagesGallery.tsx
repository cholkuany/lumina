// components/product/ReviewImagesGallery.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Camera, ChevronRight } from 'lucide-react'
import { ImageLightbox } from './ImageLightbox'
import { Button } from '@/components/ui/Button'
import { Review } from '@/lib/types'

interface ReviewImagesGalleryProps {
  reviews: Review[]
}

export function ReviewImagesGallery({ reviews }: ReviewImagesGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [showAll, setShowAll] = useState(false)

  // Collect all images from reviews
  const allImages = reviews.flatMap((review) =>
    (review.images || []).map((image) => ({
      image,
      reviewId: review.id,
      author: review.author,
    }))
  )

  if (allImages.length === 0) return null

  const displayImages = showAll ? allImages : allImages.slice(0, 6)
  const remainingCount = allImages.length - 6

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg text-charcoal flex items-center gap-2">
          <Camera className="w-5 h-5 text-gold" />
          Customer Photos ({allImages.length})
        </h3>

        {allImages.length > 6 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="text-sm text-gold hover:underline flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
        {displayImages.map((item, index) => (
          <button
            key={`${item.reviewId}-${index}`}
            onClick={() => openLightbox(index)}
            className="relative aspect-square rounded-lg overflow-hidden bg-linen 
                       hover:opacity-90 transition-opacity group"
          >
            <Image
              src={item.image}
              alt={`Photo by ${item.author}`}
              fill
              className="object-cover"
            />

            {/* Show remaining count on last visible item */}
            {!showAll && index === 5 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-charcoal/70 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  +{remainingCount}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {showAll && allImages.length > 6 && (
        <div className="text-center mt-4">
          <Button variant="ghost" size="sm" onClick={() => setShowAll(false)}>
            Show Less
          </Button>
        </div>
      )}

      {/* Lightbox */}
      {
        lightboxOpen &&
        (
          <ImageLightbox
            images={allImages.map((item) => item.image)}
            initialIndex={lightboxIndex}
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            alt="Customer review photo"
          />
        )}
    </div>
  )
}