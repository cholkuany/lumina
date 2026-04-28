// components/account/OrderCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Package, Truck, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Order } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface OrderCardProps {
  order: Order
}

const statusConfig = {
  processing: {
    label: 'Processing',
    variant: 'warning' as const,
    icon: Package,
  },
  shipped: {
    label: 'Shipped',
    variant: 'gold' as const,
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    variant: 'success' as const,
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'error' as const,
    icon: XCircle,
  },
}

export function OrderCard({ order }: OrderCardProps) {
  const status = statusConfig[order.status]
  const StatusIcon = status.icon

  return (
    <div className="border border-warm-gray-light rounded-brand overflow-hidden">
      {/* Header */}
      <div className="bg-linen px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
          <div>
            <p className="text-xs text-warm-gray-dark">Order Number</p>
            <p className="font-medium text-charcoal">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-xs text-warm-gray-dark">Date Placed</p>
            <p className="font-medium text-charcoal">{order.date}</p>
          </div>
          <div>
            <p className="text-xs text-warm-gray-dark">Total</p>
            <p className="font-medium text-charcoal">{formatPrice(order.total)}</p>
          </div>
        </div>

        <Badge variant={status.variant} className="flex items-center gap-1.5">
          <StatusIcon className="w-3.5 h-3.5" />
          {status.label}
        </Badge>
      </div>

      {/* Items */}
      <div className="p-4 sm:p-6">
        <div className="space-y-4">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex gap-4">
              <Link
                href={`/products/${item.product.id}`}
                className="relative w-16 h-16 sm:w-20 sm:h-20 bg-linen rounded-lg overflow-hidden shrink-0"
              >
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.id}`}>
                  <h4 className="font-medium text-charcoal text-sm hover:text-gold transition-colors line-clamp-1">
                    {item.product.name}
                  </h4>
                </Link>
                <p className="text-sm text-warm-gray-dark">Qty: {item.quantity}</p>
                <p className="text-sm font-medium text-charcoal">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}

          {order.items.length > 3 && (
            <p className="text-sm text-warm-gray-dark">
              + {order.items.length - 3} more item(s)
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-warm-gray-light">
          <Link href={`/account/orders/${order.id}`}>
            <Button variant="secondary" size="sm">
              View Order Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>

          {order.status === 'shipped' && order.trackingNumber && (
            <Button variant="ghost" size="sm">
              Track Package
            </Button>
          )}

          {order.status === 'delivered' && (
            <Button variant="ghost" size="sm">
              Buy Again
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}