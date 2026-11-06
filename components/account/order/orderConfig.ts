import {
  CheckCircle,
  CircleDashed,
  Clock,
  Package,
  Receipt,
  Truck,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import type { OrderStatus } from '@/lib/types'

export const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; icon: LucideIcon }
> = {
  pending: { label: 'Pending', color: 'text-amber-700', bgColor: 'bg-amber-50', icon: CircleDashed },
  processing: { label: 'Processing', color: 'text-amber-700', bgColor: 'bg-amber-50', icon: Clock },
  shipped: { label: 'Shipped', color: 'text-primary-700', bgColor: 'bg-primary-50', icon: Truck },
  delivered: {
    label: 'Delivered',
    color: 'text-success-dark',
    bgColor: 'bg-success-light',
    icon: CheckCircle,
  },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bgColor: 'bg-red-50', icon: XCircle },
}

export const timelineStatusConfig: Record<string, { label: string; icon: LucideIcon }> = {
  ordered: { label: 'Order Placed', icon: Receipt },
  confirmed: { label: 'Order Confirmed', icon: CheckCircle },
  processing: { label: 'Processing', icon: Package },
  shipped: { label: 'Shipped', icon: Truck },
  delivered: { label: 'Delivered', icon: CheckCircle },
}

// Used when the timeline contains a status we have no label for, instead of crashing.
export const fallbackTimelineStatus = { label: 'Update', icon: Package }

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
export const formatPrice = (price: number) => currency.format(price)

const TRACKING_URLS: Record<string, string> = {
  ups: 'https://www.ups.com/track?tracknum=',
  fedex: 'https://www.fedex.com/fedextrack/?trknbr=',
  usps: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
}

// Defaults to UPS, which is what the page did before for every carrier.
export function getTrackingUrl(carrier: string | undefined, trackingNumber: string): string {
  const key = (carrier ?? '').toLowerCase().replace(/[^a-z]/g, '')
  const base = TRACKING_URLS[key] ?? TRACKING_URLS.ups
  return `${base}${encodeURIComponent(trackingNumber)}`
}