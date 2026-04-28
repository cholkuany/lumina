// app/checkout/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps'
import { ShippingForm } from '@/components/checkout/ShippingForm'
import { PaymentForm } from '@/components/checkout/PaymentForm'
import { OrderReview } from '@/components/checkout/OrderReview'
import { CartItem } from '@/components/cart/CartItem'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export default function CheckoutPage() {
  const router = useRouter()
  const { state, subtotal, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingData, setShippingData] = useState(null)
  const [paymentData, setPaymentData] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const handleShippingSubmit = (data: any) => {
    setShippingData(data)
    setCurrentStep(2)
    window.scrollTo(0, 0)
  }

  const handlePaymentSubmit = (data: any) => {
    setPaymentData(data)
    setCurrentStep(3)
    window.scrollTo(0, 0)
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate order number
    const orderNum = `LUM-${Date.now().toString().slice(-8)}`
    setOrderNumber(orderNum)
    setOrderComplete(true)
    clearCart()
    setIsProcessing(false)
  }

  // Empty cart redirect
  if (state.items.length === 0 && !orderComplete) {
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

  // Order Complete
  if (orderComplete) {
    return (
      <main className="container-lumina py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-serif text-3xl text-charcoal mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-warm-gray-dark mb-2">
            Your order has been placed successfully.
          </p>
          <p className="text-charcoal font-medium mb-8">
            Order Number: <span className="text-gold">{orderNumber}</span>
          </p>
          <p className="text-sm text-warm-gray-dark mb-8">
            We've sent a confirmation email with your order details.
            You can track your order status in your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account/orders">
              <Button variant="secondary">View Order</Button>
            </Link>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
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
              <PaymentForm
                onSubmit={handlePaymentSubmit}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && shippingData && paymentData && (
              <OrderReview
                shippingData={shippingData}
                paymentData={paymentData}
                onBack={() => setCurrentStep(2)}
                onSubmit={handlePlaceOrder}
                isProcessing={isProcessing}
              />
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
                    {shippingData?.shippingMethod === 'express'
                      ? formatPrice(12.99)
                      : shippingData?.shippingMethod === 'overnight'
                        ? formatPrice(24.99)
                        : subtotal >= 50
                          ? 'Free'
                          : formatPrice(5.99)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray-dark">Tax</span>
                  <span className="text-charcoal">{formatPrice(subtotal * 0.08)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-warm-gray">
                  <span className="text-charcoal">Total</span>
                  <span className="text-charcoal">
                    {formatPrice(
                      subtotal +
                      (subtotal >= 50 ? 0 : 5.99) +
                      (subtotal * 0.08)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}