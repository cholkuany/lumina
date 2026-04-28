// components/checkout/OrderReview.tsx
'use client'

import Image from 'next/image'
import { MapPin, CreditCard, Truck, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

interface OrderReviewProps {
  shippingData: any
  paymentData: any
  onBack: () => void
  onSubmit: () => void
  isProcessing: boolean
}

export function OrderReview({
  shippingData,
  paymentData,
  onBack,
  onSubmit,
  isProcessing
}: OrderReviewProps) {
  const { state, subtotal } = useCart()

  const shippingCost = shippingData.shippingMethod === 'standard'
    ? (subtotal >= 50 ? 0 : 5.99)
    : shippingData.shippingMethod === 'express'
      ? 12.99
      : 24.99

  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  return (
    <div className="space-y-8">
      {/* Order Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-charcoal">Order Items</h3>
          <span className="text-sm text-warm-gray-dark">
            {state.items.length} {state.items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <div className="bg-linen rounded-brand p-4 space-y-4">
          {state.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-charcoal text-white text-xs rounded-full flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-charcoal line-clamp-1">
                  {item.product.name}
                </h4>
                {item.selectedVariants && (
                  <p className="text-xs text-warm-gray-dark">
                    {Object.values(item.selectedVariants).join(' / ')}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium text-charcoal">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-charcoal flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gold" />
            Shipping Address
          </h3>
          <button
            onClick={onBack}
            className="text-sm text-gold hover:underline flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
        </div>
        <div className="bg-linen rounded-brand p-4">
          <p className="text-charcoal font-medium">
            {shippingData.firstName} {shippingData.lastName}
          </p>
          <p className="text-warm-gray-dark text-sm">
            {shippingData.address}
            {shippingData.apartment && `, ${shippingData.apartment}`}
          </p>
          <p className="text-warm-gray-dark text-sm">
            {shippingData.city}, {shippingData.state} {shippingData.zipCode}
          </p>
          <p className="text-warm-gray-dark text-sm">{shippingData.phone}</p>
        </div>
      </div>

      {/* Shipping Method */}
      <div>
        <h3 className="font-serif text-lg text-charcoal flex items-center gap-2 mb-4">
          <Truck className="w-5 h-5 text-gold" />
          Shipping Method
        </h3>
        <div className="bg-linen rounded-brand p-4">
          <p className="text-charcoal font-medium capitalize">
            {shippingData.shippingMethod} Shipping
          </p>
          <p className="text-warm-gray-dark text-sm">
            {shippingData.shippingMethod === 'standard' && '5-7 business days'}
            {shippingData.shippingMethod === 'express' && '2-3 business days'}
            {shippingData.shippingMethod === 'overnight' && 'Next business day'}
          </p>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-charcoal flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gold" />
            Payment Method
          </h3>
          <button
            onClick={onBack}
            className="text-sm text-gold hover:underline flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
        </div>
        <div className="bg-linen rounded-brand p-4">
          {paymentData.paymentMethod === 'card' && (
            <>
              <p className="text-charcoal font-medium">
                •••• •••• •••• {paymentData.cardNumber.slice(-4)}
              </p>
              <p className="text-warm-gray-dark text-sm">{paymentData.cardName}</p>
            </>
          )}
          {paymentData.paymentMethod === 'paypal' && (
            <p className="text-charcoal font-medium">PayPal</p>
          )}
          {paymentData.paymentMethod === 'applepay' && (
            <p className="text-charcoal font-medium">Apple Pay</p>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t border-warm-gray-light pt-6">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-warm-gray-dark">Subtotal</span>
            <span className="text-charcoal">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-warm-gray-dark">Shipping</span>
            <span className="text-charcoal">
              {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-warm-gray-dark">Tax</span>
            <span className="text-charcoal">{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold pt-2 border-t border-warm-gray-light">
            <span className="text-charcoal">Total</span>
            <span className="text-charcoal">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          className="sm:flex-1"
          disabled={isProcessing}
        >
          Back
        </Button>
        <Button
          onClick={onSubmit}
          size="lg"
          className="sm:flex-1"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
        </Button>
      </div>

      {/* Terms */}
      <p className="text-xs text-warm-gray-dark text-center">
        By placing your order, you agree to our{' '}
        <a href="/terms" className="text-gold hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-gold hover:underline">Privacy Policy</a>.
      </p>
    </div>
  )
}