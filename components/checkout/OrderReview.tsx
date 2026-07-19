// components/checkout/OrderReview.tsx
'use client'

import Image from 'next/image'
import { MapPin, CreditCard, Truck, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

import { TShippingFormData } from '@/lib/types'

interface OrderReviewProps {
  shippingData: TShippingFormData
  onBack: () => void
  onSubmit: () => void
  isProcessing: boolean
}

export function OrderReview({
  shippingData,
  onBack,
  onSubmit,
  isProcessing,
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
          <h3 className="font-serif text-lg text-text-primary">Order Items</h3>
          <span className="text-sm text-border-dark">
            {state.items.length} {state.items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <div className="bg-surface rounded-brand p-4 space-y-4">
          {state.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className='relative w-16 h-16'>
                <div className="w-full h-full bg-white rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={item.product.variant.images[0].secure_url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-text-primary text-white text-xs rounded-full flex items-center justify-center z-10">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-text-primary line-clamp-1">
                  {item.product.name}
                </h4>
                {item.product.variant.attributes && (
                  <p className="text-xs text-border-dark">
                    {Object.values(item.product.variant.attributes).join(' / ')}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium text-text-primary">
                  {formatPrice(item.product.variant.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-text-primary flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Shipping Address
          </h3>
          <button
            onClick={onBack}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
        </div>
        <div className="bg-surface rounded-brand p-4">
          <p className="text-text-primary font-medium">
            {shippingData.firstName} {shippingData.lastName}
          </p>
          <p className="text-border-dark text-sm">
            {shippingData.address}
            {shippingData.apartment && `, ${shippingData.apartment}`}
          </p>
          <p className="text-border-dark text-sm">
            {shippingData.city}, {shippingData.state} {shippingData.zipCode}
          </p>
          <p className="text-border-dark text-sm">{shippingData.phone}</p>
        </div>
      </div>

      {/* Shipping Method */}
      <div>
        <h3 className="font-serif text-lg text-text-primary flex items-center gap-2 mb-4">
          <Truck className="w-5 h-5 text-primary" />
          Shipping Method
        </h3>
        <div className="bg-surface rounded-brand p-4">
          <p className="text-text-primary font-medium capitalize">
            {shippingData.shippingMethod} Shipping
          </p>
          <p className="text-border-dark text-sm">
            {shippingData.shippingMethod === 'standard' && '5-7 business days'}
            {shippingData.shippingMethod === 'express' && '2-3 business days'}
            {shippingData.shippingMethod === 'overnight' && 'Next business day'}
          </p>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-text-primary flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Payment Method
          </h3>
          <button
            onClick={onBack}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
        </div>
        <div className="bg-surface rounded-brand p-4">
          <p className="text-text-primary font-medium">Stripe Checkout</p>
          <p className="text-border-dark text-sm">
            You&apos;ll be redirected to Stripe to enter payment details securely.
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t border-border-light pt-6">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-border-dark">Subtotal</span>
            <span className="text-text-primary">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-border-dark">Shipping</span>
            <span className="text-text-primary">
              {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-border-dark">Tax</span>
            <span className="text-text-primary">{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border-light">
            <span className="text-text-primary">Total</span>
            <span className="text-text-primary">{formatPrice(total)}</span>
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
          {isProcessing ? 'Redirecting...' : `Continue to Stripe - ${formatPrice(total)}`}
        </Button>
      </div>

      {/* Terms */}
      <p className="text-xs text-border-dark text-center">
        By placing your order, you agree to our{' '}
        <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
      </p>
    </div>
  )
}
