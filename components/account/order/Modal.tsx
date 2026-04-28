// app/account/orders/[slug]/page.tsx
'use client'

import { X } from 'lucide-react'

// Modal Component
export function Modal({
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
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-charcoal/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-brand shadow-hover max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-warm-gray-light">
            <h2 className="font-serif text-xl text-charcoal">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-linen rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-warm-gray-dark" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}