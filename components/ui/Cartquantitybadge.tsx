import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CartQuantityBadgeProps {
  quantity: number
  isCompact?: boolean
  className?: string
}

export function CartQuantityBadge({
  quantity,
  isCompact = false,
  className,
}: CartQuantityBadgeProps) {
  return (
    <div className={cn('absolute right-2 top-2 z-10 bg-black', className)}>
      <div className="relative">
        {/* <div
          className={cn(
            'flex items-center justify-center rounded-full bg-text-primary text-white shadow-lg',
            isCompact ? 'h-7 w-7' : 'h-9 w-9'
          )}
        >
          <ShoppingCart
            aria-hidden="true"
            className={cn(isCompact ? 'h-3 w-3' : 'h-4 w-4')}
          />
        </div> */}

        <span
          aria-hidden="true"
          className={cn(
            'absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-primary font-bold text-white shadow-sm',
            isCompact ? 'h-4 w-4 text-[9px]' : 'h-5 w-5 text-[10px]'
          )}
        >
          {quantity}
        </span>
        <span className="sr-only">{quantity} in cart</span>
      </div>
    </div>
  )
}
