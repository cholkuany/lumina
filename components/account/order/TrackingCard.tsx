'use client'

import { useEffect, useRef, useState } from 'react'
import { Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { TOrderProps } from '@/lib/types'
import { getTrackingUrl } from './orderConfig'

type Props = {
  order: Pick<
    TOrderProps,
    'trackingNumber' | 'carrier' | 'estimatedDelivery' | 'deliveredDate' | 'status'
  >
}

export function TrackingCard({ order }: Props) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const trackingNumber = order.trackingNumber
  if (!trackingNumber) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackingNumber)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission); nothing to do.
    }
  }

  return (
    <div className="bg-surface rounded-brand p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-medium text-foreground mb-1">Tracking Information</h2>
          <div className="flex items-center gap-2 text-border-dark">
            <span>{order.carrier}</span>
            <span>•</span>
            <span className="font-mono text-sm">{trackingNumber}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 hover:bg-border-light rounded transition-colors"
              title="Copy tracking number"
              aria-label="Copy tracking number"
            >
              <Copy className="w-4 h-4" />
            </button>
            {copied && (
              <span role="status" className="text-xs text-success">
                Copied!
              </span>
            )}
          </div>
          {order.estimatedDelivery && order.status === 'shipped' && (
            <p className="text-sm text-border-dark mt-1">Estimated delivery: {order.estimatedDelivery}</p>
          )}
          {order.deliveredDate && order.status === 'delivered' && (
            <p className="text-sm text-success-dark mt-1">Delivered on {order.deliveredDate}</p>
          )}
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
          onClick={() =>
            window.open(getTrackingUrl(order.carrier, trackingNumber), '_blank', 'noopener,noreferrer')
          }
        >
          <ExternalLink className="w-4 h-4" />
          Track Package
        </Button>
      </div>
    </div>
  )
}