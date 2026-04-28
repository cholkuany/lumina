// components/cart/CartItem.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { useCart } from '@/context/CartContext'
import { CartItem as CartItemType } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface CartItemProps {
  item: CartItemType
  showControls?: boolean
}

export function CartItem({ item, showControls = true }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex gap-4 py-4 border-b border-warm-gray-light last:border-0">
      {/* Image */}
      <Link
        href={`/products/${item.product.id}`}
        className="relative w-20 h-20 shrink-0 bg-linen rounded-lg overflow-hidden"
      >
        <Image
          src={item.variantImage || item.product.variants[0].images[0].secure_url}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.id}`}>
          <h4 className="font-medium text-charcoal text-sm leading-tight mb-1 hover:text-gold transition-colors line-clamp-2">
            {item.product.name}
          </h4>
        </Link>

        {/* Variants */}
        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
          <p className="text-xs text-warm-gray-dark mb-2">
            {Object.entries(item.selectedVariants)
              .map(([key, value]) => `${key}: ${value}`)
              .join(' / ')}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          {showControls ? (
            <QuantitySelector
              value={item.quantity}
              onChange={(qty) => updateQuantity(item.id, qty)}
              size="sm"
            />
          ) : (
            <span className="text-sm text-warm-gray-dark">Qty: {item.quantity}</span>
          )}

          <div className="text-right">
            <p className="font-semibold text-charcoal">
              {formatPrice(item.product.price * item.quantity)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-warm-gray-dark">
                {formatPrice(item.product.price)} each
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      {showControls && (
        <button
          onClick={() => removeItem(item.id)}
          className="p-1 text-warm-gray-dark hover:text-red-500 transition-colors self-start"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}