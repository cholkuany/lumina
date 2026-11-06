import Link from 'next/link'

import ReturnActions from '../../components/returns/ReturnAction'
import ReturnStatusBadge from '@/components/account/order/ReturnStatusBadge'
import type { ReturnDetail } from '@/lib/returnTypes'

const money = (n: number) => `$${n.toFixed(2)}`

const dateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-CA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Toronto',
  })

export function ReturnDetailPanel({ detail }: { detail: ReturnDetail }) {
  return (
    <section
      aria-label={`Return ${detail.returnNumber}`}
      className="space-y-5 rounded-xl border border-border-light bg-card p-5 shadow-shadow-soft"
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="heading-label">Return</p>
          <h2 className="section-title text-xl">{detail.returnNumber}</h2>
          <p className="mt-0.5 text-sm text-foreground-secondary">
            Requested {dateTime(detail.createdAt)}
          </p>
        </div>
        <ReturnStatusBadge status={detail.status} />
      </header>

      <dl className="grid grid-cols-2 gap-3 rounded-xl bg-surface p-4 text-sm">
        <div>
          <dt className="text-foreground-secondary">Customer</dt>
          <dd className="font-semibold">{detail.customerName}</dd>
          {detail.customerEmail && (
            <dd className="break-all text-foreground-secondary">{detail.customerEmail}</dd>
          )}
        </div>
        <div>
          <dt className="text-foreground-secondary">Order</dt>
          <dd>
            {detail.orderId ? (
              <Link href={`/admin/orders/${detail.orderId}`} className="link-primary">
                {detail.orderNumber}
              </Link>
            ) : (
              <span className="font-semibold">{detail.orderNumber}</span>
            )}
          </dd>
          <dd className="text-foreground-secondary">
            Value of returned items: <span className="font-semibold text-foreground">{money(detail.estimatedValue)}</span>
          </dd>
        </div>
      </dl>

      <div>
        <h3 className="heading-label mb-2">Items ({detail.itemCount})</h3>
        <ul className="divide-y divide-border-light rounded-xl border border-border-light">
          {detail.items.map((item, i) => (
            <li key={i} className="flex gap-3 p-3">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.productName}
                  className="size-14 shrink-0 rounded-lg border border-border-light object-cover"
                />
              ) : (
                <div className="size-14 shrink-0 rounded-lg bg-surface" aria-hidden />
              )}
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold">{item.productName}</p>
                <p className="text-foreground-secondary">
                  Qty {item.quantity}
                  {item.unitPrice > 0 && ` × ${money(item.unitPrice)}`}
                </p>
                <p className="mt-1 text-foreground">
                  <span className="font-semibold">Reason:</span> {item.reason}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="heading-label mb-2">History</h3>
        <ol className="space-y-2 border-l-2 border-border-light pl-4">
          {[...detail.statusHistory].reverse().map((h, i) => (
            <li key={i} className="text-sm">
              <div className="flex items-center gap-2">
                <ReturnStatusBadge status={h.status} />
                <span className="text-foreground-secondary">{dateTime(h.timestamp)}</span>
              </div>
              {h.note && <p className="mt-1 text-foreground">{h.note}</p>}
            </li>
          ))}
        </ol>
      </div>

      <ReturnActions returnId={detail.id} status={detail.status} adminNote={detail.adminNote} />
    </section>
  )
}