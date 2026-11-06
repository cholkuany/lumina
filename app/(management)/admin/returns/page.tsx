import Link from 'next/link'

import ReturnStatusBadge from '@/components/account/order/ReturnStatusBadge'
import { getReturnCounts, getReturnDetail, getReturns } from '@/lib/queries/return.queries'
import {
  RETURN_STATUSES,
  RETURN_STATUS_LABELS,
  isReturnStatus,
  type ReturnRequestStatus
} from '@/lib/returnTypes'
import { ReturnDetailPanel } from './ReturnDetailPanel'

type SearchParams = Promise<{ status?: string; return?: string; page?: string }>

function href(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) if (value) qs.set(key, value)
  const query = qs.toString()
  return query ? `/admin/returns?${query}` : '/admin/returns'
}

const money = (n: number) => `$${n.toFixed(2)}`
const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/Toronto',
  })

export default async function AdminReturnsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const status: ReturnRequestStatus | undefined = isReturnStatus(sp.status) ? sp.status : undefined
  const page = Math.max(1, Number.parseInt(sp.page ?? '1', 10) || 1)

  const [list, counts, selected] = await Promise.all([
    getReturns({ status, page }),
    getReturnCounts(),
    sp.return ? getReturnDetail(sp.return) : Promise.resolve(null),
  ])

  const allCount = RETURN_STATUSES.reduce((sum, s) => sum + counts[s], 0)
  const tabs: Array<{ key?: ReturnRequestStatus; label: string; count: number }> = [
    { label: 'All', count: allCount },
    ...RETURN_STATUSES.map((s) => ({ key: s, label: RETURN_STATUS_LABELS[s], count: counts[s] })),
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="section-title text-2xl">Returns</h1>
        <p className="mt-1 text-sm text-foreground-secondary">
          Review customer return requests, approve or reject them, and mark approved returns as received.
        </p>
      </header>

      <nav aria-label="Filter returns by status" className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = tab.key === status
          return (
            <Link
              key={tab.label}
              href={href({ status: tab.key })}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${active
                ? 'border-primary bg-primary text-white'
                : 'border-border-light bg-card text-foreground hover:border-primary-light hover:text-primary-dark'
                }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 text-xs ${active ? 'bg-white/20' : 'bg-surface text-foreground-secondary'
                  }`}
              >
                {tab.count}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_28rem]">
        <section aria-label="Return requests" className="space-y-3">
          {list.items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-foreground-secondary">
              No {status ? RETURN_STATUS_LABELS[status].toLowerCase() : ''} return requests.
            </div>
          ) : (
            <ul className="space-y-2">
              {list.items.map((r) => {
                const isSelected = selected?.id === r.id
                return (
                  <li key={r.id}>
                    <Link
                      href={href({
                        status,
                        page: page > 1 ? String(page) : undefined,
                        return: r.id,
                      })}
                      aria-current={isSelected ? 'true' : undefined}
                      className={`grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 rounded-xl border p-4 transition-colors ${isSelected
                        ? 'border-primary bg-primary-light/40'
                        : 'border-border-light bg-card hover:border-primary-light'
                        }`}
                    >
                      <div className="min-w-0">
                        <p className="font-bold">{r.returnNumber}</p>
                        <p className="truncate text-sm text-foreground-secondary">
                          {r.customerName} · Order {r.orderNumber}
                        </p>
                      </div>
                      <ReturnStatusBadge status={r.status} />
                      <p className="text-sm text-foreground-secondary">
                        {r.itemCount} {r.itemCount === 1 ? 'item' : 'items'} · {money(r.estimatedValue)}
                      </p>
                      <p className="text-sm text-foreground-secondary">{shortDate(r.createdAt)}</p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}

          {list.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 text-sm">
              {page > 1 ? (
                <Link
                  href={href({ status, page: page - 1 > 1 ? String(page - 1) : undefined })}
                  className="link-primary"
                >
                  ← Previous
                </Link>
              ) : (
                <span />
              )}
              <span className="text-foreground-secondary">
                Page {list.page} of {list.totalPages}
              </span>
              {page < list.totalPages ? (
                <Link href={href({ status, page: String(page + 1) })} className="link-primary">
                  Next →
                </Link>
              ) : (
                <span />
              )}
            </div>
          )}
        </section>

        <aside className="lg:sticky lg:top-6">
          {selected ? (
            <ReturnDetailPanel detail={selected} />
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-foreground-secondary">
              {sp.return ? 'That return could not be found.' : 'Select a return to review and process it.'}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}