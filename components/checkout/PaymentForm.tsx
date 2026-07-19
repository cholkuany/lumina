// components/checkout/PaymentForm.tsx
'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { TPaymentFormData, TPaymentFormProps, TPaymentMethod } from '@/lib/types'

export function PaymentForm({ onSubmit, onBack, isProcessing = false }: TPaymentFormProps) {
  const [formData, setFormData] = useState<TPaymentFormData>({
    paymentMethod: 'stripe',
    sameAsShipping: true,
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
  })

  const handleChange = (field: string, value: boolean | string | TPaymentMethod) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="font-serif text-lg text-text-primary mb-4">Payment Method</h3>
        <div className="bg-surface rounded-brand p-6">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-success-600 mt-0.5" />
            <div>
              <p className="text-text-primary font-medium">Secure card payment</p>
              <p className="text-sm text-border-dark mt-1">
                You&apos;ll review your order here, then continue to Stripe&apos;s hosted checkout.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div>
        <h3 className="font-serif text-lg text-text-primary mb-4">Billing Address</h3>
        <Checkbox
          id="sameAsShipping"
          label="Same as shipping address"
          checked={formData.sameAsShipping}
          onChange={(checked) => handleChange('sameAsShipping', checked)}
        />

        {!formData.sameAsShipping && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="sm:col-span-2">
              <Input
                label="Billing Address"
                value={formData.billingAddress}
                onChange={(e) => handleChange('billingAddress', e.target.value)}
                required
              />
            </div>
            <Input
              label="City"
              value={formData.billingCity}
              onChange={(e) => handleChange('billingCity', e.target.value)}
              required
            />
            <Input
              label="State"
              value={formData.billingState}
              onChange={(e) => handleChange('billingState', e.target.value)}
              required
            />
            <Input
              label="ZIP Code"
              value={formData.billingZip}
              onChange={(e) => handleChange('billingZip', e.target.value)}
              required
            />
          </div>
        )}
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
          Back to Shipping
        </Button>
        <Button type="submit" size="lg" className="sm:flex-1" disabled={isProcessing}>
          {isProcessing ? 'Preparing Checkout...' : 'Review Order'}
        </Button>
      </div>
    </form>
  )
}
