// components/product/ReportReviewModal.tsx
'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, AlertTriangle, Flag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { RadioGroup } from '@/components/ui/RadioGroup'

interface ReportReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string, details?: string) => Promise<boolean>
  isLoading?: boolean
}

const reportReasons = [
  { value: 'spam', label: 'Spam or fake review' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'offensive', label: 'Offensive language' },
  { value: 'irrelevant', label: 'Not about the product' },
  { value: 'conflict', label: 'Conflict of interest' },
  { value: 'other', label: 'Other' },
]

export function ReportReviewModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: ReportReviewModalProps) {
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reason) {
      setError('Please select a reason')
      return
    }

    const success = await onSubmit(reason, details)
    if (success) {
      setSubmitted(true)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setReason('')
      setDetails('')
      setError('')
      setSubmitted(false)
      onClose()
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={handleClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-charcoal/50" />
        </Transition.Child>

        {/* Modal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-ivory rounded-brand shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-warm-gray-light">
                  <Dialog.Title className="font-serif text-xl text-charcoal flex items-center gap-2">
                    <Flag className="w-5 h-5 text-red-500" />
                    Report Review
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="p-2 -mr-2 text-warm-gray-dark hover:text-charcoal transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6">
                  {submitted ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Flag className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-medium text-charcoal mb-2">
                        Report Submitted
                      </h3>
                      <p className="text-sm text-warm-gray-dark mb-6">
                        Thank you for helping us maintain quality reviews. We&apos;ll review your report shortly.
                      </p>
                      <Button onClick={handleClose}>Close</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Warning */}
                      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-brand p-4">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">
                          Please only report reviews that violate our guidelines. False reports may result in action against your account.
                        </p>
                      </div>

                      {/* Reason Selection */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">
                          Why are you reporting this review?
                        </label>
                        <RadioGroup
                          name="reportReason"
                          options={reportReasons}
                          value={reason}
                          onChange={setReason}
                        />
                        {error && (
                          <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                      </div>

                      {/* Additional Details */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Additional details (optional)
                        </label>
                        <textarea
                          value={details}
                          onChange={(e) => setDetails(e.target.value)}
                          placeholder="Provide more context about your report..."
                          rows={3}
                          maxLength={500}
                          className="w-full px-4 py-3 bg-white border border-warm-grayrounded-brand 
                                     text-sm text-charcoal placeholder:text-warm-gray-dark resize-none
                                     focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                        />
                        <p className="text-xs text-warm-gray-dark mt-1 text-right">
                          {details.length}/500
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleClose}
                          disabled={isLoading}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1"
                        >
                          {isLoading ? 'Submitting...' : 'Submit Report'}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}