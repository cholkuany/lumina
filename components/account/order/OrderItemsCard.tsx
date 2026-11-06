import type { TOrderProps } from '@/lib/types'
import { OrderItemRow } from './OrderItemRow'
import { OrderSummary } from './OrderSummary'

type Props = {
  order: TOrderProps
  // order item id -> quantity currently covered by a return request
  returnedQuantities?: Record<string, number>
}

export function OrderItemsCard({ order, returnedQuantities = {} }: Props) {
  return (
    <div className="bg-white border border-border-light rounded-brand overflow-hidden">
      <div className="p-6 border-b border-border-light">
        <h2 className="font-serif text-lg text-foreground">Items ({order.items.length})</h2>
      </div>

      <div className="divide-y divide-border-light">
        {order.items.map((item) => (
          <OrderItemRow key={item.id} item={item} returnedQuantity={returnedQuantities[item.id]} />
        ))}
      </div>

      <OrderSummary order={order} />
    </div>
  )
}