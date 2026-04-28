// app/account/orders/[slug]/page.tsx
'use client'

import { useState } from 'react'
import {
  CheckCircle,
  Loader2,
  AlertTriangle
} from 'lucide-react'

import type { OrderProps } from '@/lib/types'
import { Button } from '@/components/ui/Button'

// Cancel Order Modal Content
export function CancelOrderContent({
  order,
  onClose
}: {
  order: OrderProps
  onClose: () => void
}) {
  const [reason, setReason] = useState('')
  const [additionalComments, setAdditionalComments] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const cancelReasons = [
    'Changed my mind',
    'Found a better price elsewhere',
    'Ordered by mistake',
    'Shipping time too long',
    'Payment issues',
    'Other',
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-serif text-xl text-charcoal mb-2">Order Cancelled</h3>
        <p className="text-warm-gray-dark mb-6">
          Your order has been successfully cancelled. A refund of {formatPrice(order.total + order.tax)} will be processed within 5-7 business days.
        </p>
        <Button onClick={onClose}>Close</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Are you sure?</p>
            <p className="text-sm text-amber-700 mt-1">
              This action cannot be undone. Your order will be cancelled and a refund will be initiated.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Reason for Cancellation *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-warm-gray-light rounded-lg focus:secondary-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
          >
            <option value="">Select a reason</option>
            {cancelReasons.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Additional Comments (Optional)
          </label>
          <textarea
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            rows={3}
            placeholder="Tell us more about why you're cancelling..."
            className="w-full px-3 py-2 border border-warm-gray-light rounded-lg focus:secondary-none focus:ring-2 focus:ring-gold/20 focus:border-gold resize-none"
          />
        </div>
      </div>

      <div className="bg-linen rounded-lg p-4 mb-6">
        <p className="text-sm text-warm-gray-dark">
          <strong className="text-charcoal">Refund Amount:</strong> {formatPrice(order.total + order.tax)}
        </p>
        <p className="text-sm text-warm-gray-dark mt-1">
          Refunds are typically processed within 5-7 business days.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Keep Order
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!reason || isSubmitting}
          className="flex-1 bg-red-600 hover:bg-red-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Cancelling...
            </>
          ) : (
            'Cancel Order'
          )}
        </Button>
      </div>
    </div>
  )
}