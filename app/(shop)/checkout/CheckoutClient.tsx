'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps'
import { ShippingForm } from '@/components/checkout/ShippingForm'
import { TShippingFormData } from '@/lib/types'
import { PaymentForm } from '@/components/checkout/PaymentForm'
import { TPaymentFormData } from '@/lib/types'
import { OrderReview } from '@/components/checkout/OrderReview'
import { CartItem } from '@/components/cart/CartItem'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export default function CheckoutClient() {
  const { state, subtotal } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingData, setShippingData] = useState<TShippingFormData | null>(null)
  const [paymentData, setPaymentData] = useState<TPaymentFormData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  const shippingCost = shippingData?.shippingMethod === 'express'
    ? 12.99
    : shippingData?.shippingMethod === 'overnight'
      ? 24.99
      : subtotal >= 50
        ? 0
        : 5.99

  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  const handleShippingSubmit = (data: TShippingFormData) => {
    setShippingData(data)
    setCurrentStep(2)
    window.scrollTo(0, 0)
  }

  const handlePaymentSubmit = (data: TPaymentFormData) => {
    setPaymentData(data)
    setCurrentStep(3)
    setCheckoutError('')
    window.scrollTo(0, 0)
  }

  const handlePlaceOrder = async () => {
    if (!shippingData || !paymentData) return

    setIsProcessing(true)
    setCheckoutError('')

    try {
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
          shippingData,
          paymentData,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Could not start Stripe Checkout.')
      }

      if (!result.url) {
        throw new Error('Stripe Checkout did not return a redirect URL.')
      }

      window.location.assign(result.url)
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Could not start Stripe Checkout.')
      setIsProcessing(false)
    }
  }

  // Empty cart redirect
  if (state.items.length === 0) {
    return (
      <main className="container-lumina py-16 text-center">
        <h1 className="font-serif text-2xl text-charcoal mb-4">Your cart is empty</h1>
        <p className="text-warm-gray-dark mb-8">Add some items to checkout.</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </main>
    )
  }

  return (
    <main className="py-8">
      <div className="container-lumina">
        {/* Back Link */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-warm-gray-dark hover:text-charcoal transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl font-semibold text-charcoal">
              LUMINA
            </span>
          </Link>
        </div>

        {/* Steps */}
        <CheckoutSteps currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <ShippingForm onSubmit={handleShippingSubmit} />
            )}
            {currentStep === 2 && (
              <>
                <PaymentForm
                  onSubmit={handlePaymentSubmit}
                  onBack={() => setCurrentStep(1)}
                  isProcessing={isProcessing}
                />
                {checkoutError && (
                  <p className="mt-4 text-sm text-red-500">{checkoutError}</p>
                )}
              </>
            )}
            {currentStep === 3 && shippingData && paymentData && (
              <>
                <OrderReview
                  shippingData={shippingData}
                  onBack={() => setCurrentStep(2)}
                  onSubmit={handlePlaceOrder}
                  isProcessing={isProcessing}
                />
                {checkoutError && (
                  <p className="mt-4 text-sm text-red-500">{checkoutError}</p>
                )}
              </>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-linen rounded-brand p-6 sticky top-24">
              <h3 className="font-serif text-lg text-charcoal mb-4">
                Order Summary
              </h3>

              {/* Items */}
              <div className="max-h-64 overflow-y-auto mb-4">
                {state.items.map((item) => (
                  <CartItem key={item.id} item={item} showControls={false} />
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-warm-graypt-4 space-y-2">
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
                <div className="flex justify-between font-semibold pt-2 border-t border-warm-gray">
                  <span className="text-charcoal">Total</span>
                  <span className="text-charcoal">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
