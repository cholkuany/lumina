// app/account/orders/[slug]/page.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  CheckCircle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TOrderProps } from '@/lib/types'

// Return Items Modal Content
export function ReturnItemsContent({
  order,
  onClose,
}: {
  order: TOrderProps
  onClose: () => void
}) {
  const [selectedItems, setSelectedItems] = useState<Record<string, { selected: boolean; quantity: number; reason: string }>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [returnNumber, setReturnNumber] = useState('')
  const [submitError, setSubmitError] = useState('')

  const returnReasons = [
    'Item not as described',
    'Wrong item received',
    'Item damaged or defective',
    'Changed my mind',
    'Item arrived too late',
    'Better price found elsewhere',
    'Other',
  ]

  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: prev[itemId]?.selected
        ? { ...prev[itemId], selected: false }
        : { selected: true, quantity: 1, reason: '' }
    }))
  }

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity }
    }))
  }

  const handleReasonChange = (itemId: string, reason: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], reason }
    }))
  }

  const hasSelectedItems = Object.values(selectedItems).some(item => item.selected)
  const allSelectedHaveReasons = Object.entries(selectedItems)
    .filter(([, item]) => item.selected)
    .every(([, item]) => item.reason)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const items = Object.entries(selectedItems)
        .filter(([, item]) => item.selected)
        .map(([orderItemId, item]) => ({
          orderItemId,
          quantity: item.quantity,
          reason: item.reason,
        }))
      const response = await fetch(`/api/orders/${order.id}/returns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Could not submit the return request')
      }

      setReturnNumber(result.returnNumber)
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not submit the return request')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success-600" />
        </div>
        <h3 className="font-serif text-xl text-text-primary mb-2">Return Request Submitted</h3>
        <p className="text-border-dark mb-6">
          We&apos;ve received your return request. You&apos;ll receive an email with return instructions shortly.
        </p>
        <p className="text-sm text-border-dark mb-6">
          Return ID: <span className="font-mono font-medium">{returnNumber}</span>
        </p>
        <Button onClick={onClose}>Close</Button>
      </div>
    )
  }

  return (
    <div>
      <p className="text-border-dark mb-6">
        Select the items you&apos;d like to return and provide a reason for each.
      </p>

      <div className="space-y-4 mb-6">
        {order.items.map((item) => (
          <div
            key={item.id}
            className={`border rounded-lg p-4 transition-colors ${selectedItems[item.id]?.selected
              ? 'border-primary bg-primary/5'
              : 'border-border-light'
              }`}
          >
            <div className="flex gap-4">
              <div className="relative w-16 h-16 bg-surface rounded-lg overflow-hidden shrink-0">
                <Image
                  src={item.product.images[0].secure_url}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-text-primary text-sm line-clamp-2">
                    {item.product.name}
                  </p>
                  <input
                    type="checkbox"
                    checked={selectedItems[item.id]?.selected || false}
                    onChange={() => handleToggleItem(item.id)}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                </div>
                <p className="text-sm text-border-dark">
                  Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                </p>
              </div>
            </div>

            {selectedItems[item.id]?.selected && (
              <div className="mt-4 pt-4 border-t border-border-light space-y-3">
                {item.quantity > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Quantity to Return
                    </label>
                    <select
                      value={selectedItems[item.id]?.quantity || 1}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:secondary-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {Array.from({ length: item.quantity }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Reason for Return *
                  </label>
                  <select
                    value={selectedItems[item.id]?.reason || ''}
                    onChange={(e) => handleReasonChange(item.id, e.target.value)}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:secondary-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Select a reason</option>
                    {returnReasons.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!hasSelectedItems || !allSelectedHaveReasons || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Return Request'
          )}
        </Button>
      </div>
      {submitError && (
        <p className="mt-3 text-sm text-red-600">{submitError}</p>
      )}
    </div>
  )
}
