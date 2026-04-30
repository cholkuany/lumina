'use client'

import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { Product } from '@/lib/types'

export function ProductCard({
  product
}: { product: Product }) {
  const { addItem } = useWishlist()
  const { addItem: addItemToCart, state: { items } } = useCart()

  const currentVariant = product.variants.find(variant => variant.stock > 0) || product.variants[0]

  const handleAddToCart = () => {
    addItemToCart(product, 1, currentVariant.attributes, currentVariant.images[0]?.secure_url)
  }

  // Check if product is in the cart
  const cartItem = items?.find(
    (item) => item.product.id === product.id
  )
  const quantity = cartItem?.quantity || 0
  const isInCart = quantity > 0

  console.log('Cart Items:', cartItem)

  const isCurrentVariantInCart = cartItem?.product.variant.attributes
    ? JSON.stringify(cartItem.product.variant.attributes) === JSON.stringify(currentVariant.attributes)
    : false

  const isCurrrentVariantInstock = isCurrentVariantInCart
    ? (cartItem?.quantity ?? 0) < currentVariant.stock
    : currentVariant.stock > 0

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="card-hover bg-white rounded-brand overflow-hidden border border-warm-gray-light">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-linen">
          <Image
            src={product.variants[0].images[0].secure_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNewArrival && (
              <span className="bg-charcoal text-white text-xs font-medium px-2.5 py-1 rounded-full">
                NEW
              </span>
            )}
            {product.isSale && (
              <span className="bg-gold text-white text-xs font-medium px-2.5 py-1 rounded-full">
                SALE
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold hover:text-white"
            onClick={(e) => {
              e.preventDefault()
              addItem({
                ...product
              })
            }}
          >
            <Heart className="w-4 h-4" />
          </button>

          {/* Quick Add */}
          <div
            className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            <button
              disabled={!isCurrrentVariantInstock}
              className="w-full bg-charcoal/95 backdrop-blur-sm text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gold transition-colors"
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
        <div className="p-4 relative">
          <h3 className="font-sans font-medium text-charcoal text-sm leading-tight mb-1 line-clamp-1">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-warm-gray-dark text-xs mb-2 line-clamp-1">
              {product.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-3.5 h-3.5',
                    i < Math.floor(product.rating)
                      ? 'fill-gold text-gold'
                      : 'fill-warm-gray-light text-warm-gray-light'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-warm-gray-dark">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-charcoal">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-warm-gray-dark line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {/* Cart Indicator - Minimalist Shopping Bag */}
          {isInCart && (
            <div className="absolute top-3 right-3 z-10">
              <div className="relative">
                <div className="flex items-center justify-center w-9 h-9 bg-charcoal text-white rounded-full shadow-lg">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-gold text-white text-[10px] font-bold rounded-full shadow-sm">
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