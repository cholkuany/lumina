'use client'

import { useMemo } from 'react'
import { Heart, Star, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { VariantSelector } from './VariantSelector'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { TProduct } from '@/lib/types'
import { formatPrice, cn } from '@/lib/utils'
import { ImageGallery } from '@/components/product/ImageGallery'
import { useVariantSelector } from '@/hooks/useVariant'
import { ShareDropdown } from './ShareDropdown'

export function ProductInfo({ product }: { product: TProduct }) {

  const {
    selectedVariants,
    setAttribute,
    currentVariant,
  } = useVariantSelector(product.variants)

  const { addItem, state } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  // Get images for the current color
  const currentImages = useMemo(() => {
    if (!currentVariant) return []
    return currentVariant?.images || []
  },
    [currentVariant]
  )

  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (q: number) => {
    if (!currentVariant || currentVariant.stock === 0) return
    addItem(product, q, selectedVariants, currentVariant.images[0]?.secure_url)
  }

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const displayPrice = currentVariant?.price ?? 0
  const displayOriginalPrice = currentVariant?.originalPrice ?? 0

  const discount = displayOriginalPrice && displayOriginalPrice > displayPrice
    ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
    : 0

  const isInStock = currentVariant ? currentVariant.stock > 0 : false
  const stockCount = currentVariant?.stock ?? 0
  const cartQuantity = state.items.find(
    item => item.product.id === product.id
      && JSON.stringify(item.product.variant.attributes) === JSON.stringify(selectedVariants)
  )?.quantity || 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ImageGallery
          key={currentVariant?.sku}
          images={currentImages}
          productName={product.name}
        />
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        {/* Title & Badges */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-text-primary font-semibold leading-tight">
              {product.name}
            </h1>
            <button
              onClick={handleWishlistToggle}
              className={cn(
                'p-2 rounded-full border transition-all duration-200 shrink-0',
                inWishlist
                  ? 'border-red-200 bg-red-50'
                  : 'border-border-light hover:border-border'
              )}
            >
              <Heart className={cn(
                'w-5 h-5 transition-colors',
                inWishlist ? 'fill-red-500 text-red-500' : 'text-border-dark'
              )} />
            </button>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mt-3">
            {product.isNewArrival && (
              <span className="bg-text-primary text-white text-xs font-medium px-2.5 py-1 rounded">
                NEW ARRIVAL
              </span>
            )}
            {product.isSale && discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded">
                -{discount}%
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-primary/20 text-primary text-xs font-medium px-2.5 py-1 rounded border border-primary/30">
                BESTSELLER
              </span>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3 pb-4 border-b border-border-light">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-4 h-4',
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : i < product.rating
                      ? 'fill-amber-400/50 text-amber-400'
                      : 'fill-gray-200 text-gray-200'
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-text-primary">{product.rating.toFixed(1)}</span>
          <span className="text-sm text-border-dark">
            ({product.reviewCount.toLocaleString()} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-text-primary">
              {formatPrice(displayPrice)}
            </span>
            {displayOriginalPrice && displayOriginalPrice > displayPrice && (
              <span className="text-lg text-border line-through">
                {formatPrice(displayOriginalPrice)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <p className="text-sm text-success-600 font-medium">
              You save {formatPrice(displayOriginalPrice! - displayPrice)} ({discount}% off)
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-border-dark leading-relaxed">
          {product.description}
        </p>

        {/* Variant Selector */}
        {product.variants && product.variants.length > 0 && (
          <div className="pt-4 border-t border-border-light">
            <VariantSelector
              variants={product.variants}
              selected={selectedVariants}
              onChange={setAttribute}
            />
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-border-light rounded-lg">
              <button
                onClick={() => handleAddToCart(-1)}
                disabled={cartQuantity === 0}
                className="p-3 text-text-primary hover:bg-border-light/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium text-text-primary">
                {cartQuantity > 0 ? cartQuantity : 1}
              </span>
              <button
                onClick={() => handleAddToCart(1)}
                disabled={cartQuantity === stockCount}
                className="p-3 text-text-primary hover:bg-border-light/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className={cn(
                'flex-1 gap-2 h-12 text-base font-semibold',
                !isInStock && 'bg-border cursor-not-allowed'
              )}
              onClick={() => handleAddToCart(1)}
              disabled={!isInStock || cartQuantity === stockCount}
            >
              <ShoppingBag className="w-5 h-5" />
              {isInStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>

        {/* Share */}
        <ShareDropdown
          productName={product.name}
          productDescription={product.description}
          imageUrl={currentVariant?.images[0]?.secure_url || ''}
        />
      </div>
    </div>
  )
}
