'use client'

import { useState, type ComponentProps, type ReactNode } from 'react'
import { Download, HelpCircle, Loader2, RotateCcw, XCircle, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { generateInvoicePDF } from '@/components/account/order/generateInvoicePDF'
import type { TOrderProps } from '@/lib/types'

type ActionButtonProps = {
  icon: LucideIcon;
  children: ReactNode;
} & Omit<ComponentProps<typeof Button>, 'variant' | 'className'>;

function ActionButton({
  icon: Icon,
  children,
  ...props
}: ActionButtonProps) {
  return (
    <Button variant="secondary" className="flex items-center justify-center gap-2" {...props} leftIcon={<Icon className="w-4 h-4" />}>
      {children}
    </Button>
  )
}

type Props = {
  order: TOrderProps
  canReturn: boolean
  onReturn: () => void
  onCancel: () => void
  onHelp: () => void
}

export function OrderActions({ order, canReturn, onReturn, onCancel, onHelp }: Props) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadInvoice = async () => {
    setIsDownloading(true)
    try {
      // Small delay so the spinner is visible.
      await new Promise((resolve) => setTimeout(resolve, 500))
      generateInvoicePDF(order)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {order.status === 'delivered' && (
        <>
          {canReturn && (
            <ActionButton icon={RotateCcw} onClick={onReturn}>
              Return Items
            </ActionButton>
          )}
          <ActionButton icon={HelpCircle} onClick={onHelp}>
            Get Help
          </ActionButton>
        </>
      )}
      {order.status === 'processing' && (
        <ActionButton icon={XCircle} onClick={onCancel}>
          Cancel Order
        </ActionButton>
      )}
      {order.status === 'shipped' && (
        <ActionButton icon={HelpCircle} onClick={onHelp}>
          Get Help
        </ActionButton>
      )}
      <Button
        variant="secondary"
        className="flex items-center justify-center gap-2"
        onClick={handleDownloadInvoice}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download Invoice
          </>
        )}
      </Button>
    </div>
  )
}