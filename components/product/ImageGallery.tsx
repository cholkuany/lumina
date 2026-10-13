'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IImage } from '@/lib/db/models/Product'
import { NavArrows } from '../ui/NavArrows'
import { useZoom } from '@/hooks/useZoom'

interface ImageGalleryProps {
  images: IImage[]
  productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { isZoomed, toggle, reset, containerProps, imageStyle } = useZoom({ scale: 1.75 })

  const hasMultiple = images.length > 1

  const goTo = (index: number) => {
    setActiveIndex(index)
    reset()
  }

  const prev = () => goTo(activeIndex === 0 ? images.length - 1 : activeIndex - 1)
  const next = () => goTo(activeIndex === images.length - 1 ? 0 : activeIndex + 1)


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultiple) return
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'Escape') reset()
  }

  if (!images.length) return null

  return (
    <div
      className="flex flex-col-reverse gap-3 lg:flex-row lg:items-start"
      onKeyDown={handleKeyDown}
    >
      {/* Thumbnails: horizontal strip on mobile, vertical column on desktop */}
      {hasMultiple && (
        <div
          className={cn(
            'flex gap-2 pb-1',
            'lg:flex-col lg:pb-0 lg:max-h-110',
            'scrollHiddened overflow-x-auto lg:overflow-y-auto'
          )}
          role="tablist"
          aria-label="Product images"
        >
          {images.map((image, index) => (
            <button
              key={image.secure_url ?? index}
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={`View image ${index + 1}`}
              onClick={() => goTo(index)}
              className={cn(
                'relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-surface transition-all sm:h-16 sm:w-16',
                'ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary',
                activeIndex === index
                  ? 'ring-2 ring-text-primary'
                  : 'opacity-60 hover:opacity-100'
              )}
            >
              <Image
                src={image.secure_url}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div
        {...containerProps}
        className="group relative aspect-square w-full max-w-110 overflow-hidden rounded-brand bg-surface lg:mx-0"
      >
        <Image
          src={images[activeIndex].secure_url}
          alt={`${productName} - Image ${activeIndex + 1}`}
          fill
          priority={activeIndex === 0}
          sizes="(min-width: 1024px) 440px, 100vw"
          className={cn(
            'object-cover transition-transform duration-300 ease-out',
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          )}
          style={imageStyle}
          onClick={toggle}
        />

        {/* Navigation Arrows */}
        {hasMultiple && (
          <NavArrows
            showOnGroupHover
            onPrev={prev}
            onNext={next}
            prevLabel="Previous image"
            nextLabel="Next image"
          />
        )}

        {/* Zoom toggle */}
        <button
          type="button"
          onClick={toggle}
          aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 opacity-0 shadow-sm transition-opacity hover:bg-white focus-visible:opacity-100 group-hover:opacity-100"
        >
          {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
        </button>

        {/* Image Counter */}
        {hasMultiple && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  )
}