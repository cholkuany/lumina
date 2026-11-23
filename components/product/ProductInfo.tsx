'use client'

import { buildKey } from '@/hooks/useVariant'

import { ShoppingCart, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { VariantSelector } from './VariantSelector'
import { useCartItems, useAddToCart } from '@/stores/cart/cart.selectors'
import { TProduct } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { ImageGallery } from '@/components/product/ImageGallery'
import { useVariantSelector } from '@/hooks/useVariant'
import { ShareDropdown } from './ShareDropdown'
import { RatingSummary } from '../ui/RatingSummary'
import { Badge } from '../ui/Badge'
import { QuantityStepper } from '../ui/QuantityStepper'
import { WishlistButton } from '../layout/nav/WishlistButton'

export function ProductInfo({ product }: { product: TProduct }) {
  const { selectedAttributes, setAttribute, currentVariant } = useVariantSelector(product.variants)

  const addItemToCart = useAddToCart()
  const items = useCartItems()

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

  const canAddMore = cartQuantity < stock

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Image Gallery */}
      <div className="mt-2 lg:top-24 lg:self-start">
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
            <div
              className='relative px-2.5'
            >
              <WishlistButton isCompact={true} product={product} />
            </div>
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
            <span className="text-3xl font-bold text-foreground">{formatPrice(price)}</span>
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
        <DeliveryInfo />
        <ShareDropdown
          productName={product.name}
          productDescription={product.description}
          imageUrl={currentVariant?.images?.[0]?.secure_url ?? ''}
        />
      </div>
    </div>
  )
}

const DELIVERY_ROWS = [
  { icon: Truck, text: 'Free shipping over $50' },
  { icon: RotateCcw, text: '30-day returns' },
  { icon: ShieldCheck, text: 'Secure checkout' },
]

function DeliveryInfo() {
  return (
    <ul className="grid grid-cols-3 gap-3 border-t border-border-light pt-6 text-center text-xs text-muted">
      {DELIVERY_ROWS.map(({ icon: Icon, text }, index) => (
        <li key={index} className="flex flex-col items-center gap-1.5">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
          {text}
        </li>
      ))}
    </ul>
  )
}