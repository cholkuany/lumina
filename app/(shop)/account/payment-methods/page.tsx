// app/account/payment-methods/page.tsx
'use client'

import { useState } from 'react'
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  X,
  Loader2,
  AlertTriangle,
  Shield
} from 'lucide-react'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'

// Types
interface PaymentMethod {
  id: string
  type: 'card'
  brand: 'visa' | 'mastercard' | 'amex' | 'discover'
  last4: string
  expiryMonth: number
  expiryYear: number
  cardholderName: string
  isDefault: boolean
}

// Mock payment methods data
const initialPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    brand: 'visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2026,
    cardholderName: 'Sarah Johnson',
    isDefault: true,
  },
  {
    id: '2',
    type: 'card',
    brand: 'mastercard',
    last4: '8888',
    expiryMonth: 6,
    expiryYear: 2025,
    cardholderName: 'Sarah Johnson',
    isDefault: false,
  },
]

// Card brand logos/icons
const cardBrandConfig: Record<string, { name: string; color: string; bgColor: string }> = {
  visa: { name: 'Visa', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  mastercard: { name: 'Mastercard', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  amex: { name: 'American Express', color: 'text-blue-500', bgColor: 'bg-blue-50' },
  discover: { name: 'Discover', color: 'text-orange-500', bgColor: 'bg-orange-50' },
}

// Modal Component
function Modal({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-charcoal/50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-brand shadow-hover max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-warm-gray-light">
            <h2 className="font-serif text-xl text-charcoal">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-linen rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-warm-gray-dark" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Add Payment Method Form
function AddPaymentMethodForm({
  onClose,
  onSuccess
}: {
  onClose: () => void
  onSuccess: (method: PaymentMethod) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    setAsDefault: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const detectCardBrand = (number: string): 'visa' | 'mastercard' | 'amex' | 'discover' => {
    const cleanNumber = number.replace(/\s/g, '')
    if (/^4/.test(cleanNumber)) return 'visa'
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard'
    if (/^3[47]/.test(cleanNumber)) return 'amex'
    if (/^6(?:011|5)/.test(cleanNumber)) return 'discover'
    return 'visa'
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    let formattedValue = value

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (name === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4)
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue
    }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 15) {
      newErrors.cardNumber = 'Please enter a valid card number'
    }
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required'
    }
    if (!formData.expiryDate || formData.expiryDate.length < 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date'
    } else {
      const [month, year] = formData.expiryDate.split('/')
      const expMonth = parseInt(month)
      const expYear = parseInt('20' + year)
      const now = new Date()
      if (expMonth < 1 || expMonth > 12) {
        newErrors.expiryDate = 'Invalid month'
      } else if (expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)) {
        newErrors.expiryDate = 'Card has expired'
      }
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    const [month, year] = formData.expiryDate.split('/')
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      brand: detectCardBrand(formData.cardNumber),
      last4: formData.cardNumber.replace(/\s/g, '').slice(-4),
      expiryMonth: parseInt(month),
      expiryYear: parseInt('20' + year),
      cardholderName: formData.cardholderName,
      isDefault: formData.setAsDefault,
    }

    setIsSubmitting(false)
    onSuccess(newMethod)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
        <Shield className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-800">Secure Payment</p>
          <p className="text-xs text-green-700 mt-0.5">
            Your card information is encrypted and secure.
          </p>
        </div>
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          Card Number *
        </label>
        <div className="relative">
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors ${errors.cardNumber ? 'border-red-500' : 'border-warm-gray-light'
              }`}
          />
          <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray-dark" />
        </div>
        {errors.cardNumber && (
          <p className="text-sm text-red-600 mt-1">{errors.cardNumber}</p>
        )}
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          Cardholder Name *
        </label>
        <input
          type="text"
          name="cardholderName"
          value={formData.cardholderName}
          onChange={handleChange}
          placeholder="John Smith"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors ${errors.cardholderName ? 'border-red-500' : 'border-warm-gray-light'
            }`}
        />
        {errors.cardholderName && (
          <p className="text-sm text-red-600 mt-1">{errors.cardholderName}</p>
        )}
      </div>

      {/* Expiry & CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Expiry Date *
          </label>
          <input
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            maxLength={5}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors ${errors.expiryDate ? 'border-red-500' : 'border-warm-gray-light'
              }`}
          />
          {errors.expiryDate && (
            <p className="text-sm text-red-600 mt-1">{errors.expiryDate}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            CVV *
          </label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            maxLength={4}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors ${errors.cvv ? 'border-red-500' : 'border-warm-gray-light'
              }`}
          />
          {errors.cvv && (
            <p className="text-sm text-red-600 mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>

      {/* Set as Default */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="setAsDefault"
          checked={formData.setAsDefault}
          onChange={handleChange}
          className="w-5 h-5 rounded border-warm-gray accent-gold"
        />
        <span className="text-sm text-charcoal">Set as default payment method</span>
      </label>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            'Add Card'
          )}
        </Button>
      </div>
    </form>
  )
}

// Delete Confirmation Modal
function DeleteConfirmation({
  method,
  onClose,
  onConfirm,
}: {
  method: PaymentMethod
  onClose: () => void
  onConfirm: () => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const brand = cardBrandConfig[method.brand]

  const handleDelete = async () => {
    setIsDeleting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsDeleting(false)
    onConfirm()
  }

  return (
    <div>
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-red-800">Delete Payment Method</p>
          <p className="text-sm text-red-700 mt-1">
            Are you sure you want to delete this payment method? This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-linen rounded-lg mb-6">
        <div className={`w-12 h-8 ${brand.bgColor} rounded flex items-center justify-center`}>
          <span className={`text-xs font-bold ${brand.color}`}>
            {brand.name.substring(0, 4).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-medium text-charcoal">
            {brand.name} •••• {method.last4}
          </p>
          <p className="text-sm text-warm-gray-dark">
            Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 bg-red-600 hover:bg-red-700"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Deleting...
            </>
          ) : (
            'Delete'
          )}
        </Button>
      </div>
    </div>
  )
}

// Payment Method Card Component
function PaymentMethodCard({
  method,
  onSetDefault,
  onDelete,
}: {
  method: PaymentMethod
  onSetDefault: () => void
  onDelete: () => void
}) {
  const brand = cardBrandConfig[method.brand]
  const isExpiringSoon = () => {
    const now = new Date()
    const expiry = new Date(method.expiryYear, method.expiryMonth - 1)
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return expiry <= threeMonthsFromNow && expiry >= now
  }

  const isExpired = () => {
    const now = new Date()
    const expiry = new Date(method.expiryYear, method.expiryMonth - 1)
    return expiry < now
  }

  return (
    <div className={`bg-white border rounded-brand p-6 transition-all ${method.isDefault ? 'border-gold shadow-soft' : 'border-warm-gray-light hover:border-gold/50'
      }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Card Brand Icon */}
          <div className={`w-14 h-10 ${brand.bgColor} rounded-lg flex items-center justify-center`}>
            <span className={`text-xs font-bold ${brand.color}`}>
              {brand.name.substring(0, 4).toUpperCase()}
            </span>
          </div>

          {/* Card Details */}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-charcoal">
                {brand.name} •••• {method.last4}
              </p>
              {method.isDefault && (
                <span className="px-2 py-0.5 bg-gold/10 text-gold text-xs font-medium rounded-full">
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-warm-gray-dark mt-0.5">
              {method.cardholderName}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <p className={`text-sm ${isExpired() ? 'text-red-600' : isExpiringSoon() ? 'text-amber-600' : 'text-warm-gray-dark'}`}>
                {isExpired() ? 'Expired' : 'Expires'} {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
              </p>
              {isExpiringSoon() && !isExpired() && (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Expiring Soon
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!method.isDefault && (
            <button
              onClick={onSetDefault}
              className="p-2 text-warm-gray-dark hover:text-gold hover:bg-linen rounded-lg transition-colors"
              title="Set as default"
            >
              <Check className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-2 text-warm-gray-dark hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteMethod, setDeleteMethod] = useState<PaymentMethod | null>(null)

  const handleAddMethod = (newMethod: PaymentMethod) => {
    setPaymentMethods(prev => {
      // If new method is default, unset other defaults
      if (newMethod.isDefault) {
        return [...prev.map(m => ({ ...m, isDefault: false })), newMethod]
      }
      return [...prev, newMethod]
    })
    setShowAddModal(false)
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev =>
      prev.map(m => ({ ...m, isDefault: m.id === id }))
    )
  }

  const handleDelete = (id: string) => {
    const methodToDelete = paymentMethods.find(m => m.id === id)
    if (methodToDelete) {
      setDeleteMethod(methodToDelete)
    }
  }

  const confirmDelete = () => {
    if (deleteMethod) {
      setPaymentMethods(prev => {
        const remaining = prev.filter(m => m.id !== deleteMethod.id)
        // If deleted method was default and there are remaining methods, set first as default
        if (deleteMethod.isDefault && remaining.length > 0) {
          remaining[0].isDefault = true
        }
        return remaining
      })
      setDeleteMethod(null)
    }
  }

  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="container-lumina py-4">
        <Breadcrumb
          items={[
            { label: 'My Account', href: '/account' },
            { label: 'Payment Methods' },
          ]}
        />
      </div>

      <div className="container-lumina">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <AccountSidebar />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="font-serif text-2xl lg:text-3xl text-charcoal">
                  Payment Methods
                </h1>
                <p className="text-warm-gray-dark mt-1">
                  Manage your saved payment methods
                </p>
              </div>
              <Button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Card
              </Button>
            </div>

            {/* Payment Methods List */}
            {paymentMethods.length > 0 ? (
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    onSetDefault={() => handleSetDefault(method.id)}
                    onDelete={() => handleDelete(method.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-linen rounded-brand">
                <CreditCard className="w-16 h-16 text-warm-gray-dark mx-auto mb-4" />
                <h2 className="font-serif text-xl text-charcoal mb-2">
                  No Payment Methods
                </h2>
                <p className="text-warm-gray-dark mb-6">
                  Add a payment method for faster checkout.
                </p>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            )}

            {/* Security Info */}
            <div className="mt-8 p-6 bg-linen rounded-brand">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-gold shrink-0" />
                <div>
                  <h3 className="font-medium text-charcoal mb-1">Your payment information is secure</h3>
                  <p className="text-sm text-warm-gray-dark">
                    We use industry-standard encryption to protect your payment details. Your full card number is never stored on our servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Payment Method"
      >
        <AddPaymentMethodForm
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddMethod}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteMethod}
        onClose={() => setDeleteMethod(null)}
        title="Delete Payment Method"
      >
        {deleteMethod && (
          <DeleteConfirmation
            method={deleteMethod}
            onClose={() => setDeleteMethod(null)}
            onConfirm={confirmDelete}
          />
        )}
      </Modal>
    </main>
  )
}