import Link from 'next/link'
import type { TOrderProps } from '@/lib/types'
import { formatPrice } from './orderConfig'
import { ProductThumbFrame } from '@/components/ui/ProductThumb'

type Item = TOrderProps['items'][number]

export function OrderItemRow({ item, returnedQuantity = 0 }: { item: Item; returnedQuantity?: number }) {
  return (
    <div className="p-6 flex gap-4">
      <ProductThumbFrame
        image={item.product.images?.[0]?.secure_url}
        name={item.product.name}
        className="w-20 h-20 sm:w-24 sm:h-24"
      />

      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.product.id}`}
          className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
        >
          {item.product.name}
        </Link>
        <div className="mt-1 text-sm text-border-dark space-y-0.5">
          {item.product.color && <p>Color: {item.product.color}</p>}
          {item.product.size && <p>Size: {item.product.size}</p>}
          <p>Qty: {item.quantity}</p>
        </div>
        {returnedQuantity > 0 && (
          <p className="mt-2 inline-block rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-foreground">
            Return requested{item.quantity > 1 ? ` for ${returnedQuantity}` : ''}
          </p>
        )}
      </div>

      <div className="text-right">
        <p className="font-medium text-foreground">{formatPrice(item.product.price * item.quantity)}</p>
        {item.quantity > 1 && (
          <p className="text-sm text-border-dark">{formatPrice(item.product.price)} each</p>
        )}
      </div>
    </div>
  )
}