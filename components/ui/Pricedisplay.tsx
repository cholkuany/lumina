import { cn, formatPrice } from '@/lib/utils'

interface PriceDisplayProps {
  price: number
  originalPrice?: number | null
  isCompact?: boolean
  className?: string
}

export function PriceDisplay({
  price,
  originalPrice,
  isCompact = false,
  className,
}: PriceDisplayProps) {
  return (
    <div className={cn('mb-1 flex items-baseline gap-1.5 tracking-tighter', className)}>
      <span
        className={cn(
          "text-foreground text-base",
          isCompact ? 'text-sm font-semibold' : 'font-extrabold'
        )}
      >
        {formatPrice(price)}
      </span>

      {originalPrice && (
        <span className="text-xs text-muted line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  )
}
