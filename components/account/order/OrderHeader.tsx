import type { TOrderProps } from '@/lib/types'
import { OrderStatusBadge } from './OrderStatusBadge'

export function OrderHeader({ order }: { order: Pick<TOrderProps, 'orderNumber' | 'date' | 'status'> }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl text-foreground">Order {order.orderNumber}</h1>
        <p className="text-border-dark mt-1">Placed on {order.date}</p>
      </div>
      <OrderStatusBadge status={order.status} />
    </div>
  )
}