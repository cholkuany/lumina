// components/checkout/ShippingForm.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { Button } from '@/components/ui/Button'

interface ShippingFormProps {
  onSubmit: (data: unknown) => void
}

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
]

const shippingMethods = [
  {
    value: 'standard',
    label: 'Standard Shipping (5-7 business days)',
    description: 'Free on orders over $50, otherwise $5.99'
  },
  {
    value: 'express',
    label: 'Express Shipping (2-3 business days)',
    description: '$12.99'
  },
  {
    value: 'overnight',
    label: 'Overnight Shipping (Next business day)',
    description: '$24.99'
  },
]

export function ShippingForm({ onSubmit }: ShippingFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'us',
    phone: '',
    shippingMethod: 'standard',
    saveAddress: false,
    createAccount: false,
  })

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information */}
      <div>
        <h3 className="font-serif text-lg text-charcoal mb-4">Contact Information</h3>
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="your@email.com"
            required
          />
          <Checkbox
            id="createAccount"
            label="Create an account for faster checkout next time"
            checked={formData.createAccount}
            onChange={(checked) => handleChange('createAccount', checked)}
          />
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <h3 className="font-serif text-lg text-charcoal mb-4">Shipping Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
          />
          <div className="sm:col-span-2">
            <Input
              label="Street Address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="123 Main Street"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Apartment, suite, etc. (optional)"
              value={formData.apartment}
              onChange={(e) => handleChange('apartment', e.target.value)}
              placeholder="Apt 4B"
            />
          </div>
          <Input
            label="City"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            required
          />
          <Input
            label="State / Province"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            required
          />
          <Input
            label="ZIP / Postal Code"
            value={formData.zipCode}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            required
          />
          <Select
            label="Country"
            options={countries}
            value={formData.country}
            onChange={(value) => handleChange('country', value)}
          />
          <div className="sm:col-span-2">
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <Checkbox
            id="saveAddress"
            label="Save this address for future orders"
            checked={formData.saveAddress}
            onChange={(checked) => handleChange('saveAddress', checked)}
          />
        </div>
      </div>

      {/* Shipping Method */}
      <div>
        <h3 className="font-serif text-lg text-charcoal mb-4">Shipping Method</h3>
        <RadioGroup
          name="shippingMethod"
          options={shippingMethods}
          value={formData.shippingMethod}
          onChange={(value) => handleChange('shippingMethod', value)}
        />
      </div>

      <Button type="submit" size="lg" className="w-full">
        Continue to Payment
      </Button>
    </form>
  )
}