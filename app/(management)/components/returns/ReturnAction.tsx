'use client'

import { useActionState } from 'react'
import { processReturnAction, type ProcessReturnState } from '../../admin/returns/actions'
import {
  RETURN_ACTION_LABELS,
  RETURN_TRANSITIONS,
  type ReturnRequestStatus
} from '@/lib/returnTypes'

const initialState: ProcessReturnState = { ok: false }

export default function ReturnActions({
  returnId,
  status,
  adminNote,
}: {
  returnId: string
  status: ReturnRequestStatus
  adminNote?: string
}) {
  const [state, formAction, pending] = useActionState(processReturnAction, initialState)
  const next = RETURN_TRANSITIONS[status]

  if (next.length === 0) {
    return (
      <div className="rounded-xl bg-surface p-4 text-sm text-foreground-secondary">
        This return is {status}. No further action is needed.
        {adminNote && (
          <p className="mt-2 text-foreground">
            <span className="font-bold">Note:</span> {adminNote}
          </p>
        )}
      </div>
    )
  }

  return (
    // Re-mount after a successful change so the textarea clears.
    <form key={`${returnId}-${status}`} action={formAction} className="space-y-3">
      <input type="hidden" name="returnId" value={returnId} />

      <label className="block">
        <span className="heading-label">Note to customer / internal</span>
        <textarea
          name="note"
          rows={3}
          maxLength={500}
          defaultValue={adminNote}
          placeholder={
            status === 'pending'
              ? 'Required when rejecting. Optional when approving.'
              : 'Optional note, e.g. condition of items received'
          }
          className="form-control mt-1.5 h-auto resize-y py-2"
        />
      </label>

      {state.error && (
        <p role="alert" className="rounded-xl bg-danger-light px-3 py-2 text-sm font-semibold text-danger-dark">
          {state.error}
        </p>
      )}
      {state.ok && state.message && (
        <p role="status" className="rounded-xl bg-success-light px-3 py-2 text-sm font-semibold text-success-dark">
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {next.map((to) => {
          const destructive = to === 'rejected'
          return (
            <button
              key={to}
              type="submit"
              name="status"
              value={to}
              disabled={pending}
              className={
                destructive
                  ? 'btn-outline h-10 px-5 text-sm text-danger-dark hover:border-danger disabled:opacity-60'
                  : 'btn-primary h-10 px-5 text-sm disabled:opacity-60'
              }
            >
              {pending ? 'Saving…' : RETURN_ACTION_LABELS[to]}
            </button>
          )
        })}
      </div>
    </form>
  )
}