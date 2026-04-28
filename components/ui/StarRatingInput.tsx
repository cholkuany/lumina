'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingInputProps {
  value: number
  onChange: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  showLabel?: boolean
}

const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

export function StarRatingInput({
  value, onChange,
  size = 'md',
  readonly = false,
  showLabel = true,
}: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState(0)

  const displayValue = hoverValue || value

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  }

  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  }

  return (
    <div className="flex flex-col gap-2">
      <div className={cn('flex items-center', gapClasses[size])}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange(star)}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            className={cn(
              'transition-transform focus:outline-none focus:scale-110',
              !readonly && 'hover:scale-110 cursor-pointer',
              readonly && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors',
                star <= displayValue
                  ? 'fill-gold text-gold'
                  : 'fill-warm-gray-light text-warm-gray-light'
              )}
            />
          </button>
        ))}
      </div>

      {showLabel && displayValue > 0 && (
        <span
          className={cn(
            'text-sm font-medium transition-colors',
            hoverValue ? 'text-gold' : 'text-charcoal'
          )}
        >
          {ratingLabels[displayValue]}
        </span>
      )}
    </div>
  )
}