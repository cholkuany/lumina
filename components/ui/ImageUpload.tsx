'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { X, ImagePlus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  className?: string
  label?: string
  error?: string
  folder?: string
}

export function ImageUpload({
  images,
  onChange,
  maxImages = 5,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const remainingSlots = maxImages - images.length
    const filesToProcess = Array.from(files).slice(0, remainingSlots)

    filesToProcess.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          onChange([...images, result])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const canAddMore = images.length < maxImages

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-3">
        {/* Existing Images */}
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-20 h-20 rounded-lg overflow-hidden bg-linen group"
          >
            <Image
              src={image}
              alt={`Upload ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 p-1 bg-charcoal/80 text-white rounded-full 
              opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Upload Button */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              'w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 transition-colors',
              isDragging
                ? 'border-gold bg-gold/10'
                : 'border-warm-gray hover:border-gold hover:bg-linen'
            )}
          >
            <ImagePlus className="w-5 h-5 text-warm-gray-dark" />
            <span className="text-xs text-warm-gray-dark">Add</span>
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Helper Text */}
      <p className="text-xs text-warm-gray-dark mt-2">
        Add up to {maxImages} {maxImages > 1 ? 'images' : 'image'}. Drag & drop or click to upload.
      </p>
    </div>
  )
}