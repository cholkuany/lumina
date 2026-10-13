import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingSummaryProps {
  rating: number
  reviewCount?: number
  isCompact?: boolean
  className?: string
}

export function RatingSummary({
  rating,
  reviewCount,
  isCompact = false,
  className,
}: RatingSummaryProps) {
  const starSize = isCompact ? 'h-3 w-3' : 'h-4 w-4'
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      <div
        className="flex items-center text-xs text-secondary tracking-tighter"
        role="img"
        aria-label={`Rated ${rating} out of 5`}
      >
        {[...Array(5)].map((_, i) => {
          const fill = Math.max(0, Math.min(1, rating - i)) * 100
          return (
            <span key={i} className={`relative ${starSize}`}>
              <Star className={`absolute inset-0 fill-white text-amber-400 ${starSize}`} />
              <span className='absolute inset-0 overflow-hidden' style={{ width: `${fill}%` }}>
                <Star className={`${starSize} text-amber-400 fill-amber-400`} />
              </span>
            </span>
          )
        })}
      </div>

      {reviewCount !== undefined && (
        <span className="text-xs text-muted">({reviewCount})</span>
      )}
    </div>
  )
}