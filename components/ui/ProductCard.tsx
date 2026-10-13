'use client'

import { ProductThumb } from '@/components/ui/ProductThumb'
import { WishlistButton } from '../layout/nav/WishlistButton'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { TProduct } from '@/lib/types'
import { ProductBadges } from './Productbadges'
import { QuickAddButton } from './Quickaddbutton'
import { RatingSummary } from './RatingSummary'
import { PriceDisplay } from './Pricedisplay'
import { CartQuantityBadge } from './Cartquantitybadge'

interface ProductCardProps {
  product: TProduct
  variant?: 'full' | 'compact'
}

import { useProductCardState } from '@/hooks/useProductcardstate'

interface ProductCardProps {
  product: TProduct
  variant?: 'full' | 'compact'
}

export function ProductCard({ product, variant = 'full' }: ProductCardProps) {
  const isCompact = variant === 'compact'

  const { currentVariant, quantity, isInCart, canAdd, addToCart, image } =
    useProductCardState(product)

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div
        className={cn(
          'overflow-hidden rounded-brand border card p-2.5',
          isCompact && 'rounded-lg'
        )}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-brand mb-1.5">
          <ProductThumb image={image} name={product.name} isCompact={isCompact} />
          <ProductBadges
            isSale={product.isSale}
            isNewArrival={product.isNewArrival}
            isCompact={isCompact}
          />
          <WishlistButton product={product} isCompact={isCompact} />
          <QuickAddButton
            onClick={addToCart}
            disabled={!canAdd}
            isCompact={isCompact}
          />
        </div>

        {/* Content */}
        <div className={cn('relative')}>
          <h3
            className={cn(
              'mb-1 h-8 overflow-hidden text-[12.5px] font-medium leading-tight text-ink',
              isCompact ? 'line-clamp-2' : 'line-clamp-1'
            )}
          >
            {product.name}
          </h3>

          {!isCompact && product.description && (
            <p className="mb-2 line-clamp-1 text-xs text-ink">
              {product.description}
            </p>
          )}

          <RatingSummary
            rating={product.rating}
            reviewCount={product.reviewCount}
            isCompact={isCompact}
            className={isCompact ? 'my-1' : 'mb-2'}
          />

          <PriceDisplay
            price={currentVariant.price}
            originalPrice={currentVariant.originalPrice}
            isCompact={isCompact}
          />

          {isInCart && <CartQuantityBadge quantity={quantity} isCompact={isCompact} />}
        </div>
      </div>
    </Link>
  )
}
