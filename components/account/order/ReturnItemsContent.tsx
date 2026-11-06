'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'
import { submitReturnRequest } from './Actions'
import { Button } from '@/components/ui/Button'
import {
  MAX_RETURN_REASON_LENGTH,
  RETURN_WINDOW_DAYS,
  getReturnedQuantities,
  type CustomerReturn,
} from '@/lib/returnTypes'
import type { TOrderProps } from '@/lib/types'
import { ProductThumbFrame } from '@/components/ui/ProductThumb'

interface Line {
  checked: boolean
  quantity: number
  reason: string
}

type Props = {
  order: TOrderProps
  returns: CustomerReturn[]
  onClose: () => void
}

export function ReturnItemsContent({ order, returns, onClose }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Only items that still have quantity not covered by an open or completed return.
  const returned = getReturnedQuantities(returns)
  const items = order.items
    .map((item) => ({ item, remaining: item.quantity - (returned[item.id] ?? 0) }))
    .filter((row) => row.remaining > 0)

  const [lines, setLines] = useState<Record<string, Line>>(() =>
    Object.fromEntries(items.map(({ item }) => [item.id, { checked: false, quantity: 1, reason: '' }]))
  )
  const [error, setError] = useState<string | null>(null)
  const [returnNumber, setReturnNumber] = useState<string | null>(null)

  const update = (id: string, patch: Partial<Line>) => {
    setError(null)
    setLines((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const selected = items.filter(({ item }) => lines[item.id]?.checked)
    if (selected.length === 0) return setError('Select at least one item to return.')

    const missing = selected.find(({ item }) => !lines[item.id].reason.trim())
    if (missing) return setError(`Tell us why you're returning ${missing.item.product.name}.`)

    setError(null)
    startTransition(async () => {
      const result = await submitReturnRequest({
        orderNumber: order.orderNumber,
        items: selected.map(({ item }) => ({
          orderItemId: item.id,
          quantity: lines[item.id].quantity,
          reason: lines[item.id].reason.trim(),
        })),
      })

      if (result.ok) {
        setReturnNumber(result.returnNumber)
        router.refresh() // re-fetch the order page so the new return shows up
      } else {
        setError(result.error)
      }
    })
  }

  if (returnNumber) {
    return (
      <div className="text-center space-y-4 py-2">
        <CheckCircle className="w-12 h-12 text-success mx-auto" />
        <div>
          <p className="font-medium text-foreground">Return request submitted</p>
          <p className="text-sm text-border-dark mt-1">
            Your request number is <span className="font-mono">{returnNumber}</span>. We&apos;ll review it
            and you can follow its status on this page.
          </p>
        </div>
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-border-dark">Every item in this order already has a return request.</p>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-sm text-border-dark">
        Choose the items you&apos;d like to send back and tell us why.
        {RETURN_WINDOW_DAYS !== null && ` Returns can be requested within ${RETURN_WINDOW_DAYS} days of delivery.`}
      </p>

      <ul className="space-y-3">
        {items.map(({ item, remaining }) => {
          const line = lines[item.id]
          return (
            <li
              key={item.id}
              className={`rounded-brand border p-4 transition-colors ${line.checked ? 'border-primary bg-primary-light/30' : 'border-border-light'
                }`}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={line.checked}
                  onChange={(e) => update(item.id, { checked: e.target.checked })}
                  className="mt-1 size-4 accent-primary"
                />
                <ProductThumbFrame
                  image={item.product.images?.[0]?.secure_url}
                  name={item.product.name}
                  className="w-14 h-14"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-foreground line-clamp-2">{item.product.name}</span>
                  <span className="block text-sm text-border-dark">
                    {[item.product.color, item.product.size].filter(Boolean).join(' · ')}
                    {(item.product.color || item.product.size) && ' · '}
                    Qty {remaining}
                  </span>
                </span>
              </label>

              {line.checked && (
                <div className="mt-4 space-y-3 pl-7">
                  {remaining > 1 && (
                    <label className="flex items-center gap-3 text-sm text-foreground">
                      Quantity to return
                      <select
                        value={line.quantity}
                        onChange={(e) => update(item.id, { quantity: Number(e.target.value) })}
                        className="form-control h-9 w-20"
                      >
                        {Array.from({ length: remaining }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label className="block text-sm text-foreground">
                    Reason for return
                    <textarea
                      value={line.reason}
                      onChange={(e) => update(item.id, { reason: e.target.value })}
                      maxLength={MAX_RETURN_REASON_LENGTH}
                      rows={2}
                      placeholder="e.g. Wrong size, arrived damaged"
                      className="form-control mt-1 h-auto py-2 resize-y"
                    />
                    <span className="block text-right text-xs text-border-dark">
                      {line.reason.length}/{MAX_RETURN_REASON_LENGTH}
                    </span>
                  </label>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {error && (
        <p role="alert" className="rounded-brand bg-danger-light px-3 py-2 text-sm font-medium text-danger-dark">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose} disabled={isPending} className='flex-1'>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="flex flex-1 items-center justify-center gap-2">
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? 'Submitting...' : 'Submit return request'}
        </Button>
      </div>
    </form>
  )
}