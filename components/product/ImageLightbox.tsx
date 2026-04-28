// components/product/ImageLightbox.tsx
'use client'

import { Fragment, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageLightboxProps {
  images: string[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
  alt?: string
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  alt = 'Review image',
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setIsZoomed(false)
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    setIsZoomed(false)
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
        case 'Escape':
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, goToPrevious, goToNext, onClose])

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  const handleDownload = async () => {
    const image = images[currentIndex]
    try {
      const response = await fetch(image)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `review-image-${currentIndex + 1}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-charcoal/95" />
        </Transition.Child>

        {/* Modal */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-charcoal/50">
                  <span className="text-white text-sm">
                    {currentIndex + 1} of {images.length}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Zoom Toggle */}
                    <button
                      onClick={() => setIsZoomed(!isZoomed)}
                      className="p-2 text-white/70 hover:text-white transition-colors"
                      title={isZoomed ? 'Zoom out' : 'Zoom in'}
                    >
                      {isZoomed ? (
                        <ZoomOut className="w-5 h-5" />
                      ) : (
                        <ZoomIn className="w-5 h-5" />
                      )}
                    </button>

                    {/* Download */}
                    <button
                      onClick={handleDownload}
                      className="p-2 text-white/70 hover:text-white transition-colors"
                      title="Download image"
                    >
                      <Download className="w-5 h-5" />
                    </button>

                    {/* Close */}
                    <button
                      onClick={onClose}
                      className="p-2 text-white/70 hover:text-white transition-colors"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Main Image Area */}
                <div className="flex-1 relative flex items-center justify-center p-4">
                  {/* Previous Button */}
                  {images.length > 1 && (
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/20 
                                 rounded-full text-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}

                  {/* Image Container */}
                  <div
                    className={cn(
                      'relative w-full h-full max-w-4xl max-h-[70vh] overflow-hidden',
                      isZoomed ? 'cursor-move' : 'cursor-zoom-in'
                    )}
                    onClick={() => !isZoomed && setIsZoomed(true)}
                    onMouseMove={handleZoomMove}
                  >
                    <Image
                      src={images[currentIndex]}
                      alt={`${alt} ${currentIndex + 1}`}
                      fill
                      className={cn(
                        'object-contain transition-transform duration-200',
                        isZoomed && 'scale-200'
                      )}
                      style={
                        isZoomed
                          ? {
                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          }
                          : undefined
                      }
                    />
                  </div>

                  {/* Next Button */}
                  {images.length > 1 && (
                    <button
                      onClick={goToNext}
                      className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/20 
                                 rounded-full text-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex items-center justify-center gap-2 px-4 py-4 bg-charcoal/50">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentIndex(index)
                          setIsZoomed(false)
                        }}
                        className={cn(
                          'relative w-16 h-16 rounded-lg overflow-hidden transition-all',
                          currentIndex === index
                            ? 'ring-2 ring-gold'
                            : 'opacity-50 hover:opacity-100'
                        )}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}