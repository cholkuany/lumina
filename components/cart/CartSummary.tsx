// components/cart/CartSummary.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Tag, Truck, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

interface CartSummaryProps {
  showCheckoutButton?: boolean
}

export function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
  const { subtotal } = useCart()

  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')

  const discount = promoApplied ? subtotal * 0.1 : 0
  const shipping = subtotal >= 50 ? 0 : 5.99
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + shipping + tax

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setPromoApplied(true)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code')
      setPromoApplied(false)
    }
  }

  return (
    <div className="bg-linen rounded-brand p-6 lg:p-8 sticky top-24">
      <h3 className="font-serif text-xl text-charcoal mb-6">Order Summary</h3>

      {/* Promo Code */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-charcoal mb-2">
          Promo Code
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-dark" />
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter code"
              className="w-full h-11 pl-10 pr-4 bg-white border border-warm-grayrounded-brand
                         text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <Button variant="secondary" onClick={handleApplyPromo}>
            Apply
          </Button>
        </div>
        {promoError && (
          <p className="text-red-500 text-xs mt-1">{promoError}</p>
        )}
        {promoApplied && (
          <p className="text-green-600 text-xs mt-1">Promo code applied! 10% off</p>
        )}
      </div>

      {/* Summary Lines */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-warm-gray-dark">Subtotal</span>
          <span className="text-charcoal">{formatPrice(subtotal)}</span>
        </div>

        {promoApplied && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount (10%)</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-warm-gray-dark">Shipping</span>
          <span className="text-charcoal">
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-warm-gray-dark">Estimated Tax</span>
          <span className="text-charcoal">{formatPrice(tax)}</span>
        </div>

        <div className="border-t border-warm-graypt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-charcoal">Total</span>
            <span className="font-semibold text-charcoal text-lg">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      {showCheckoutButton && (
        <Link href="/checkout">
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </Link>
      )}

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-warm-grayspace-y-3">
        <div className="flex items-center gap-3 text-sm text-warm-gray-dark">
          <Truck className="w-5 h-5 text-gold" />
          <span>Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-warm-gray-dark">
          <Shield className="w-5 h-5 text-gold" />
          <span>Secure checkout with SSL encryption</span>
        </div>
      </div>
    </div>
  )
}