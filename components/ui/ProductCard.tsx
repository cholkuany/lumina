'use client'

import Link from 'next/link'
import { ProductThumb } from '@/components/ui/ProductThumb'
import { WishlistButton } from '../layout/nav/WishlistButton'
import { ProductBadges } from './Productbadges'
import { RatingSummary } from './RatingSummary'
import { PriceDisplay } from './Pricedisplay'
import { QuantityStepper } from './QuantityStepper'
import { useProductCardState } from '@/hooks/useProductcardstate'
import { useUpdateCartQuantity } from '@/stores/cart/cart.selectors'
import { cn, getDefaultVariant } from '@/lib/utils'
import type { TProduct } from '@/lib/types'

interface ProductCardProps {
  product: TProduct
  variant?: 'full' | 'compact'
}

export function ProductCard({ product, variant = 'full' }: ProductCardProps) {
  const isCompact = variant === 'compact'

  const { currentVariant, quantity, isInCart, canAdd, addToCart, image } =
    useProductCardState(product)
  const updateQuantity = useUpdateCartQuantity()
  const defVariant = getDefaultVariant(product)
  const href = `/products/${product.id}`

  return (
    <article className="group min-w-0">
      {/* Image tile: light surface so product photos pop */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-card">
        <Link href={href} aria-label={product.name} className="relative block h-full w-full">
          <ProductThumb image={image} name={product.name} isCompact={isCompact} />
        </Link>
        <ProductBadges
          isSale={product.isSale}
          isNewArrival={product.isNewArrival}
          isCompact={isCompact}
        />
        <WishlistButton product={product} isCompact={isCompact} />
      </div>

      {/* Details */}
      <div className="mt-3 min-w-0">
        {/* Name + price on one row */}
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              'min-w-0 line-clamp-2 font-medium leading-snug text-foreground',
              isCompact ? 'text-sm' : 'text-base sm:text-lg'
            )}
          >
            <Link href={href} className="hover:underline">
              {product.name}
            </Link>
          </h3>

          <div
            className={cn(
              'shrink-0 font-semibold leading-snug text-foreground',
              isCompact ? 'text-sm' : 'text-base sm:text-lg'
            )}
          >
            <PriceDisplay
              price={currentVariant.price}
              originalPrice={currentVariant.originalPrice}
              isCompact={isCompact}
            />
          </div>
        </div>

        {!isCompact && product.description && (
          <p className="mt-1 line-clamp-1 text-xs text-foreground/80">
            {product.description}
          </p>
        )}

        <RatingSummary
          rating={product.rating}
          reviewCount={product.reviewCount}
          isCompact={isCompact}
          className="mt-2"
        />

        {/* Outlined pill; becomes a stepper once in cart */}
        <div className="mt-3 flex min-h-10 items-center">
          {isInCart ? (
            <QuantityStepper
              min={0}
              max={defVariant.stock}
              size="sm"
              value={quantity}
              onChange={(qty) => updateQuantity(defVariant, qty)}
            />
          ) : (
            <button
              type="button"
              onClick={addToCart}
              disabled={!canAdd}
              className={cn(
                'rounded-full border border-foreground bg-transparent font-medium text-foreground',
                'transition-colors hover:border-primary hover:bg-primary hover:text-white',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                isCompact ? 'px-4 py-1.5 text-xs' : 'px-6 py-2 text-sm'
              )}
            >
              {canAdd ? 'Add to Cart' : 'Out of Stock'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}