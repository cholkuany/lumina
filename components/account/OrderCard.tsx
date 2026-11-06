import Link from 'next/link'
import { ChevronRight, Package, Truck, CheckCircle, XCircle, CircleDashed } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TOrder } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { OrderStatus } from '@/lib/types'
import { ProductThumbFrame } from '../ui/ProductThumb'

interface OrderCardProps {
  order: TOrder
}

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'warning' as const,
    icon: CircleDashed,
  },
  processing: {
    label: 'Processing',
    variant: 'warning' as const,
    icon: Package,
  },
  shipped: {
    label: 'Shipped',
    variant: 'primary' as const,
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

  return (
    <div className="border border-border-light rounded-brand overflow-hidden">
      {/* Header */}
      <OrderHeader
        date={order.date}
        total={order.total}
        orderNumber={order.orderNumber}
        status={order.status}
      />

      {/* Items */}
      <div className="p-4 sm:p-6">
        <div className="space-y-4">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex gap-4">
              <ProductThumbFrame
                image={item.product.variant.images[0].secure_url}
                name={item.product.name}
                className='w-16 h-16 sm:w-20 sm:h-20'
              />
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.id}`}>
                  <h4 className="font-medium text-foreground text-sm hover:text-primary transition-colors line-clamp-1">
                    {item.product.name}
                  </h4>
                </Link>
                <p className="text-sm text-border-dark">Qty: {item.quantity}</p>
                <p className="text-sm font-medium text-foreground">
                  {formatPrice(item.product.variant.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}

          {order.items.length > 3 && (
            <p className="text-sm text-border-dark">
              + {order.items.length - 3} more item(s)
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-border-light">
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

const OrderHeader = ({ date, total, orderNumber, status }: {
  date: string,
  total: number,
  orderNumber: string,
  status: OrderStatus
}) => {
  const currentStatus = statusConfig[status]
  const StatusIcon = currentStatus.icon || statusConfig.pending.icon
  return (
    <div className="bg-surface px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4 sm:gap-8">
        <HeaderCell label='Order Number' value={orderNumber} />
        <HeaderCell label='Date Placed' value={date} />
        <HeaderCell label='Total' value={formatPrice(total)} />
      </div>

      <Badge variant={currentStatus.variant} className="flex items-center gap-1.5">
        <StatusIcon className="w-3.5 h-3.5" />
        {currentStatus.label}
      </Badge>
    </div>
  )
}

const HeaderCell = ({ label, value }: { label: string, value: string | number }) => {
  return (
    <div>
      <p className="text-xs text-border-dark capitalize">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  )
}