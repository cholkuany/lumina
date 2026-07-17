'use client'

import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { TProduct } from '@/lib/types'
// import { WishlistButton } from '../layout/nav/WishlistButton'

interface ProductCardProps {
  product: TProduct
  variant?: 'full' | 'compact'
}

export function ProductCard({
  product,
  variant = 'full',
}: ProductCardProps) {
  const { addItem, state, removeItem } = useWishlist()

  const {
    addItem: addItemToCart,
    state: { items },
  } = useCart()

  const isCompact = variant === 'compact'

  const currentVariant =
    product.variants.find((variant) => variant.stock > 0) ||
    product.variants[0]

  const handleAddToCart = () => {
    addItemToCart(
      product,
      1,
      currentVariant.attributes,
      currentVariant.images[0]?.secure_url
    )
  }

  const isInWishlist = state.items.some((item) => item.product.id === product.id)

  const cartItem = items?.find(
    (item) => item.product.id === product.id
  )

  const quantity = cartItem?.quantity || 0
  const isInCart = quantity > 0

  const isCurrentVariantInCart = cartItem?.product.variant.attributes
    ? JSON.stringify(cartItem.product.variant.attributes) ===
    JSON.stringify(currentVariant.attributes)
    : false

  const isCurrentVariantInStock = isCurrentVariantInCart
    ? (cartItem?.quantity ?? 0) < currentVariant.stock
    : currentVariant.stock > 0

  const image =
    currentVariant?.images?.[0]?.secure_url ||
    '/placeholder-product.jpg'

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block"
    >
      <div
        className={cn(
          'card-hover overflow-hidden rounded-brand border border-gray-100 bg-white',
          isCompact && 'rounded-lg'
        )}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes={isCompact
              ? '(max-width: 768px) 50vw, 180px'
              : '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'}
            className={cn(
              'transition-transform duration-500 group-hover:scale-105',
              isCompact ? 'object-contain p-2' : 'object-cover'
            )}
          />

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.isNewArrival && (
              <span
                className={cn(
                  'rounded-full bg-charcoal text-white',
                  isCompact
                    ? 'px-1.5 py-0.5 text-[10px]'
                    : 'px-2.5 py-1 text-xs'
                )}
              >
                NEW
              </span>
            )}

            {product.isSale && (
              <span
                className={cn(
                  'rounded-full bg-gold text-white',
                  isCompact
                    ? 'px-1.5 py-0.5 text-[10px]'
                    : 'px-2.5 py-1 text-xs'
                )}
              >
                SALE
              </span>
            )}
          </div>

          {/* Add to Wishlist */}
          <button
            className={cn(
              'absolute right-2 top-2 rounded-full bg-white/90 backdrop-blur-sm transition-all',
              isCompact ? 'p-1.5' : 'p-2',
            )}
            onClick={(e) => {
              e.preventDefault()
              if (isInWishlist) {
                removeItem(product.id)
              } else {
                addItem(product)
              }
            }}
          >
            <Heart
              className={cn(
                isCompact ? 'h-4 w-4' : 'h-5 w-5',
              )}
              fill={isInWishlist ? '#B8956C' : 'none'}
              stroke={isInWishlist ? '#B8956C' : 'currentColor'}
            />
          </button>

          {/* Quick Add */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 translate-y-full p-2 transition-transform duration-300 group-hover:translate-y-0',
              !isCompact && 'p-3'
            )}
          >
            <button
              disabled={!isCurrentVariantInStock}
              className={cn(
                'w-full bg-charcoal/95 text-white backdrop-blur-sm transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50',
                isCompact
                  ? 'rounded-md py-1.5 text-xs'
                  : 'rounded-lg py-2.5 text-sm font-medium'
              )}
              onClick={(e) => {
                e.preventDefault()
                handleAddToCart()
              }}
            >
              Quick Add
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className={cn(
            'relative',
            isCompact ? 'p-3' : 'p-4'
          )}
        >
          {/* Title */}
          <h3
            className={cn(
              'font-medium text-charcoal',
              isCompact
                ? 'line-clamp-2 text-sm'
                : 'line-clamp-1 text-sm'
            )}
          >
            {product.name}
          </h3>

          {/* Description (full only) */}
          {!isCompact && product.description && (
            <p className="mb-2 line-clamp-1 text-xs text-warm-gray-dark">
              {product.description}
            </p>
          )}

          {/* Rating */}
          <div
            className={cn(
              'flex items-center gap-1',
              isCompact ? 'mb-1 mt-1' : 'mb-2'
            )}
          >
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    isCompact
                      ? 'h-3 w-3'
                      : 'h-3.5 w-3.5',
                    i < Math.floor(product.rating)
                      ? 'fill-gold text-gold'
                      : 'fill-warm-gray-light text-warm-gray-light'
                  )}
                />
              ))}
            </div>

            <span className="text-xs text-warm-gray-dark">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-charcoal',
                isCompact
                  ? 'text-sm font-bold'
                  : 'font-semibold'
              )}
            >
              {formatPrice(currentVariant.price)}
            </span>

            {currentVariant.originalPrice && (
              <span className="text-xs text-warm-gray-dark line-through">
                {formatPrice(currentVariant.originalPrice)}
              </span>
            )}
          </div>

          {/* Cart Indicator */}
          {isInCart && (
            <div className="absolute right-2 top-2 z-10">
              <div className="relative">
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full bg-charcoal text-white shadow-lg',
                    isCompact
                      ? 'h-7 w-7'
                      : 'h-9 w-9'
                  )}
                >
                  <ShoppingBag
                    className={cn(
                      isCompact
                        ? 'h-3 w-3'
                        : 'h-4 w-4'
                    )}
                  />
                </div>

                <span
                  className={cn(
                    'absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-gold font-bold text-white shadow-sm',
                    isCompact
                      ? 'h-4 w-4 text-[9px]'
                      : 'h-5 w-5 text-[10px]'
                  )}
                >
                  {quantity}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
