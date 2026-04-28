// app/account/orders/[slug]/page.tsx
'use client'

import { useState } from 'react'
import {
  Package,
  Truck,
  CheckCircle,
  CreditCard,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { OrderProps } from '@/lib/types'

// Help Modal Content
export function HelpContent({
  order,
  onClose
}: {
  order: OrderProps
  onClose: () => void
}) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [ticketId] = useState(() => `TKT-${Date.now()}`)

  const helpTopics = [
    { id: 'tracking', label: 'Tracking & Delivery', icon: Truck },
    { id: 'product', label: 'Product Issue', icon: Package },
    { id: 'refund', label: 'Refund Status', icon: CreditCard },
    { id: 'other', label: 'Other', icon: HelpCircle },
  ]

  const handleSubmit = async () => {
    setIsSubmitting(true)
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
        <h3 className="font-serif text-xl text-charcoal mb-2">Message Sent</h3>
        <p className="text-warm-gray-dark mb-6">
          We&apos;ve received your message and will respond within 24 hours. Check your email for updates.
        </p>
        <p className="text-sm text-warm-gray-dark mb-6">
          Ticket ID: <span className="font-mono font-medium">{ticketId}</span>
        </p>
        <Button onClick={onClose}>Close</Button>
      </div>
    )
  }

  return (
    <div>
      <p className="text-warm-gray-dark mb-6">
        How can we help you with order {order.orderNumber}?
      </p>

      {/* Quick Contact Options */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <a
          href="tel:1-800-LUMINA"
          className="flex flex-col items-center gap-2 p-4 border border-warm-gray-light rounded-lg hover:border-gold hover:bg-gold/5 transition-colors"
        >
          <Phone className="w-5 h-5 text-gold" />
          <span className="text-xs text-center text-charcoal">Call Us</span>
        </a>
        <a
          href="mailto:support@lumina.com"
          className="flex flex-col items-center gap-2 p-4 border border-warm-gray-light rounded-lg hover:border-gold hover:bg-gold/5 transition-colors"
        >
          <Mail className="w-5 h-5 text-gold" />
          <span className="text-xs text-center text-charcoal">Email</span>
        </a>
        <button
          className="flex flex-col items-center gap-2 p-4 border border-warm-gray-light rounded-lg hover:border-gold hover:bg-gold/5 transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-gold" />
          <span className="text-xs text-center text-charcoal">Live Chat</span>
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-warm-gray-light" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-warm-gray-dark">or send us a message</span>
        </div>
      </div>

      {/* Help Topics */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Select a Topic
          </label>
          <div className="grid grid-cols-2 gap-2">
            {helpTopics.map((topic) => {
              const Icon = topic.icon
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`flex items-center gap-2 p-3 border rounded-lg transition-colors ${selectedTopic === topic.id
                    ? 'border-gold bg-gold/5'
                    : 'border-warm-gray-light hover:border-gold/50'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${selectedTopic === topic.id ? 'text-gold' : 'text-warm-gray-dark'}`} />
                  <span className={`text-sm ${selectedTopic === topic.id ? 'text-charcoal' : 'text-warm-gray-dark'}`}>
                    {topic.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Your Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Describe your issue or question..."
            className="w-full px-3 py-2 border border-warm-gray-light rounded-lg focus:secondary-none focus:ring-2 focus:ring-gold/20 focus:border-gold resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedTopic || !message.trim() || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </Button>
      </div>
    </div>
  )
}