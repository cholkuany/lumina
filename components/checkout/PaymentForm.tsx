// components/checkout/PaymentForm.tsx
'use client'

import { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { Button } from '@/components/ui/Button'

interface PaymentFormProps {
  onSubmit: (data: unknown) => void
  onBack: () => void
}

const paymentMethods = [
  { value: 'card', label: 'Credit / Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'applepay', label: 'Apple Pay' },
]

export function PaymentForm({ onSubmit, onBack }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    sameAsShipping: true,
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
  })

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Payment Method Selection */}
      <div>
        <h3 className="font-serif text-lg text-charcoal mb-4">Payment Method</h3>
        <RadioGroup
          name="paymentMethod"
          options={paymentMethods}
          value={formData.paymentMethod}
          onChange={(value) => handleChange('paymentMethod', value)}
        />
      </div>

      {/* Card Details */}
      {formData.paymentMethod === 'card' && (
        <div>
          <h3 className="font-serif text-lg text-charcoal mb-4">Card Details</h3>
          <div className="space-y-4">
            <div className="relative">
              <Input
                label="Card Number"
                value={formData.cardNumber}
                onChange={(e) => handleChange('cardNumber', formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                icon={<CreditCard className="w-5 h-5" />}
                required
              />
            </div>
            <Input
              label="Name on Card"
              value={formData.cardName}
              onChange={(e) => handleChange('cardName', e.target.value)}
              placeholder="John Doe"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                value={formData.expiry}
                onChange={(e) => handleChange('expiry', formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                required
              />
              <Input
                label="CVV"
                type="password"
                value={formData.cvv}
                onChange={(e) => handleChange('cvv', e.target.value.replace(/\D/g, ''))}
                placeholder="•••"
                maxLength={4}
                required
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 mt-4 text-sm text-warm-gray-dark">
            <Lock className="w-4 h-4 text-green-600" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </div>
      )}

      {/* PayPal / Apple Pay Messages */}
      {formData.paymentMethod === 'paypal' && (
        <div className="bg-linen rounded-brand p-6 text-center">
          <p className="text-warm-gray-dark">
            You will be redirected to PayPal to complete your purchase securely.
          </p>
        </div>
      )}

      {formData.paymentMethod === 'applepay' && (
        <div className="bg-linen rounded-brand p-6 text-center">
          <p className="text-warm-gray-dark">
            Click continue to pay with Apple Pay.
          </p>
        </div>
      )}

      {/* Billing Address */}
      <div>
        <h3 className="font-serif text-lg text-charcoal mb-4">Billing Address</h3>
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
        <Button type="button" variant="secondary" onClick={onBack} className="sm:flex-1">
          Back to Shipping
        </Button>
        <Button type="submit" size="lg" className="sm:flex-1">
          Review Order
        </Button>
      </div>
    </form>
  )
}