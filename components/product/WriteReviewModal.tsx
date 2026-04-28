'use client'

import { Fragment } from 'react'
import { Dialog, Transition, TransitionChild, DialogTitle, DialogPanel } from '@headlessui/react'
import { X } from 'lucide-react'
import { WriteReviewForm } from './WriteReviewForm'

interface WriteReviewModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productName: string
  productImage?: string
  // onSubmit: (review: ReviewData) => Promise<void>
}

export function WriteReviewModal({
  isOpen,
  onClose,
  productId,
  productName,
  // productImage,
  // onSubmit,
}: WriteReviewModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-charcoal/50" />
        </TransitionChild>

        {/* Modal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-lg bg-ivory rounded-brand shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-warm-gray-light">
                  <DialogTitle className="font-serif text-xl text-charcoal">
                    Write a Review
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="p-2 -mr-2 text-warm-gray-dark hover:text-charcoal transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                  <WriteReviewForm
                    productId={productId}
                    productName={productName}
                    // onSubmit={onSubmit}
                    onCancel={onClose}
                  />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}