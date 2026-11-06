import type { TOrderProps } from '@/lib/types'
import { formatPrice } from './orderConfig'

type Props = {
  order: Pick<TOrderProps, 'subtotal' | 'shipping' | 'discount' | 'tax' | 'total'>
}

export function OrderSummary({ order }: Props) {
  return (
    <div className="p-6 bg-surface space-y-2">
      <div className="flex justify-between text-border-dark">
        <span>Subtotal</span>
        <span>{formatPrice(order.subtotal)}</span>
      </div>
      <div className="flex justify-between text-border-dark">
        <span>Shipping</span>
        <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
      </div>
      {order.discount > 0 && (
        <div className="flex justify-between text-success-dark">
          <span>Discount</span>
          <span>-{formatPrice(order.discount)}</span>
        </div>
      )}
      <div className="flex justify-between text-border-dark">
        <span>Tax</span>
        <span>{formatPrice(order.tax)}</span>
      </div>
      <div className="flex justify-between text-foreground font-medium text-lg pt-2 border-t border-border">
        <span>Total</span>
        <span>{formatPrice(order.total)}</span>
      </div>
    </div>
  )
}