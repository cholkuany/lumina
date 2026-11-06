import { RotateCcw } from 'lucide-react'

import { ReturnStatusBadge } from './ReturnStatusBadge'
import { RETURN_CUSTOMER_MESSAGES, type CustomerReturn } from '@/lib/returnTypes'
import { InfoCard } from './InfoCard'

const date = (iso: string) =>
  new Date(iso).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/Toronto',
  })

// Shows the customer where each of their return requests stands. Renders nothing if there are none.
export function ReturnRequestsCard({ returns }: { returns: CustomerReturn[] }) {
  if (returns.length === 0) return null

  return (
    <InfoCard icon={RotateCcw} title="Returns">
      <ul className="divide-y divide-border-light">
        {returns.map((r) => (
          <li key={r.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">{r.returnNumber}</p>
                <p className="text-sm text-border-dark">Requested {date(r.createdAt)}</p>
              </div>
              <ReturnStatusBadge status={r.status} />
            </div>

            <p className="mt-2 text-sm text-border-dark">{RETURN_CUSTOMER_MESSAGES[r.status]}</p>
            {r.adminNote && (
              <p className="mt-1 text-sm text-foreground">
                <span className="font-medium">Note from us:</span> {r.adminNote}
              </p>
            )}

            <ul className="mt-3 space-y-1 text-sm text-border-dark">
              {r.items.map((item) => (
                <li key={item.orderItemId}>
                  {item.quantity} × {item.productName}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </InfoCard>
  )
}