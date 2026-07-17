'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'

type CheckoutSuccessClientProps = {
  sessionId?: string
}

export function CheckoutSuccessClient({ sessionId }: CheckoutSuccessClientProps) {
  const { clearCart } = useCart()
  const [orderError, setOrderError] = useState('')

  useEffect(() => {
    if (!sessionId) return

    const createOrder = async () => {
      try {
        const response = await fetch('/api/checkout/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Could not create your order.')
        }

        clearCart()
      } catch (error) {
        setOrderError(error instanceof Error ? error.message : 'Could not create your order.')
      }
    }

    void createOrder()
  }, [clearCart, sessionId])

  if (!orderError) return null

  return (
    <p className="max-w-lg mx-auto mb-6 rounded-brand bg-red-50 p-4 text-center text-sm text-red-700">
      Your payment succeeded, but we could not finish processing the order. Please contact support
      with your Stripe confirmation number. Your cart has not been cleared.
    </p>
  )
}
