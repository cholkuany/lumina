'use client'

import { buildKey } from '@/hooks/useVariant'

import { Heart, ShoppingCart, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { VariantSelector } from './VariantSelector'
import { useCartItems, useAddToCart } from '@/stores/cart/cart.selectors'
import { useAddToWishlist, useRemoveFromWishlist, useIsInWishlist } from '@/stores/wishlist/wishlist.selectors'
import { TProduct } from '@/lib/types'
import { formatPrice, cn } from '@/lib/utils'
import { ImageGallery } from '@/components/product/ImageGallery'
import { useVariantSelector } from '@/hooks/useVariant'
import { ShareDropdown } from './ShareDropdown'
import { RatingSummary } from '../ui/RatingSummary'
import { Badge } from '../ui/Badge'
import { QuantityStepper } from '../ui/QuantityStepper'

/* -------------------------------------------------------------------------- */
/*  ProductInfo                                                                */
/* -------------------------------------------------------------------------- */

export function ProductInfo({ product }: { product: TProduct }) {
  const { selectedAttributes, setAttribute, currentVariant } = useVariantSelector(product.variants)

  const addItemToCart = useAddToCart()
  const items = useCartItems()

  const addToWishlist = useAddToWishlist()
  const removeFromWishlist = useRemoveFromWishlist()
  const isInWishlist = useIsInWishlist(product.id)

  const currentImages = currentVariant?.images ?? []

  const price = currentVariant?.price ?? 0
  const originalPrice = currentVariant?.originalPrice ?? 0
  const hasDiscount = originalPrice > price
  const discount = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const stock = currentVariant?.stock ?? 0
  const isInStock = stock > 0

  const cartQuantity = items.find(
    item => item.product.id === product.id
      && buildKey(item.product.variant.attributes) === buildKey(selectedAttributes)
  )?.quantity || 0

  const changeQuantity = (delta: number) => {
    if (!currentVariant || !isInStock) return
    addItemToCart(product, delta, currentVariant.attributes)
  }

  const toggleWishlist = () => (isInWishlist ? removeFromWishlist(product.id) : addToWishlist(product))

  const canAddMore = cartQuantity < stock

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ImageGallery key={currentVariant?.sku} images={currentImages} productName={product.name} />
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        {/* Title, badges, wishlist */}
        <header className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-serif text-2xl font-semibold leading-tight text-foreground sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>
            <button
              type="button"
              onClick={toggleWishlist}
              aria-pressed={isInWishlist}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              className={cn(
                'shrink-0 rounded-full border p-2.5 transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isInWishlist ? 'border-red-200 bg-red-50' : 'border-border-light hover:border-border'
              )}
            >
              <Heart
                className={cn(
                  'h-5 w-5 transition-colors',
                  isInWishlist ? 'fill-red-500 text-red-500' : 'text-muted'
                )}
              />
            </button>
          </div>

          {(product.isNewArrival || hasDiscount || product.isFeatured) && (
            <div className="flex flex-wrap items-center gap-2">
              {product.isNewArrival && (
                <Badge variant='primary'>New Arrival</Badge>
              )}
              {hasDiscount && (
                <Badge variant='error'>-{discount}%</Badge>
              )}
              {product.isFeatured && (
                <Badge variant='primary'>Bestseller</Badge>
              )}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2">
            <RatingSummary rating={product.rating} reviewCount={product.reviewCount} />
            <span className="text-sm font-medium text-foreground">{product.rating.toFixed(1)}</span>
          </div>
        </header>

        {/* Price */}
        <section aria-label="Price" className="space-y-1 border-y border-border-light py-5">
          <div className="flex items-baseline gap-2 tracking-tighter">
            <span className="text-3xl font-bold text-ink">{formatPrice(price)}</span>
            {hasDiscount && (
              <span className="text-lg text-muted line-through">{formatPrice(originalPrice)}</span>
            )}
          </div>
          {hasDiscount && (
            <p className="text-sm font-medium text-success">
              You save {formatPrice(originalPrice - price)}
            </p>
          )}
        </section>

        <p className="leading-relaxed text-muted">{product.description}</p>

        {/* Variants */}
        {product.variants?.length > 0 && (
          <VariantSelector variants={product.variants} selected={selectedAttributes} onChange={setAttribute} />
        )}

        {/* Cart actions: Add button first, stepper once the item is in the cart */}
        <div className="flex items-center gap-3">
          {cartQuantity === 0 ? (
            <Button
              size="lg"
              className="h-12 flex-1 gap-2 text-base font-semibold"
              onClick={() => changeQuantity(1)}
              disabled={!isInStock}
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.8} />
              {isInStock ? 'Add to cart' : 'Out of stock'}
            </Button>
          ) : (
            <>
              <QuantityStepper
                value={cartQuantity}
                max={stock}
                onChange={(next) => changeQuantity(next - cartQuantity)}
              />
              <div className="flex-1 text-sm">
                <p className="font-medium text-foreground">In your cart</p>
                {!canAddMore && <p className="text-muted">Maximum available reached</p>}
              </div>
            </>
          )}
        </div>
        <Reassurance />
        <ShareDropdown
          productName={product.name}
          productDescription={product.description}
          imageUrl={currentVariant?.images?.[0]?.secure_url ?? ''}
        />
      </div>
    </div>
  )
}

const Reassurance = () => {
  return (
    <ul className="grid grid-cols-3 gap-3 border-t border-border-light pt-6 text-center text-xs text-muted">
      <li className="flex flex-col items-center gap-1.5">
        <Truck className="h-5 w-5" strokeWidth={1.5} />
        Free shipping over $50
      </li>
      <li className="flex flex-col items-center gap-1.5">
        <RotateCcw className="h-5 w-5" strokeWidth={1.5} />
        30-day returns
      </li>
      <li className="flex flex-col items-center gap-1.5">
        <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />
        Secure checkout
      </li>
    </ul>
  )
}
