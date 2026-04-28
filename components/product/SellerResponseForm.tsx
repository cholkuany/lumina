// components/product/SellerResponseForm.tsx
'use client'

import { useState } from 'react'
import { Store, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface SellerResponseFormProps {
  reviewId: string
  onSubmit: (response: string) => Promise<void>
  onCancel: () => void
  existingResponse?: string
}

export function SellerResponseForm({
  // reviewId,
  onSubmit,
  onCancel,
  existingResponse,
}: SellerResponseFormProps) {
  const [response, setResponse] = useState(existingResponse || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (response.trim().length < 10) {
      setError('Response must be at least 10 characters')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await onSubmit(response)
    } catch {
      setError('Failed to submit response. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="ml-14 mt-4 bg-linen rounded-brand p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center shrink-0">
          <Store className="w-4 h-4 text-white" />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-charcoal mb-2">
            {existingResponse ? 'Edit Response' : 'Write a Response'}
          </label>

          <textarea
            value={response}
            onChange={(e) => {
              setResponse(e.target.value)
              setError('')
            }}
            placeholder="Thank the customer for their feedback and address any concerns..."
            rows={4}
            maxLength={1000}
            className={cn(
              'w-full px-4 py-3 bg-white border rounded-brand text-sm text-charcoal',
              'placeholder:text-warm-gray-dark resize-none',
              'focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold',
              error ? 'border-red-400' : 'border-warm-gray'
            )}
          />

          <div className="flex items-center justify-between mt-2">
            <div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <p className="text-xs text-warm-gray-dark">{response.length}/1000</p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                <Send className="w-4 h-4 mr-1" />
                {isSubmitting ? 'Sending...' : 'Send Response'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}