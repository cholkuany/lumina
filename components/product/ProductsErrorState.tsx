'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'

export function ProductsErrorState({
  onRetry,
  isRetrying,
}: {
  onRetry: () => void
  isRetrying: boolean
}) {
  return (
    <main className="flex min-h-[60vh] items-center px-6 py-16">
      <div
        role="alert"
        className="mx-auto w-full max-w-xl rounded-2xl border border-danger/20 bg-white p-8 text-center shadow-soft sm:p-10"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-light">
          <AlertTriangle aria-hidden="true" className="h-7 w-7 text-danger-dark" />
        </div>
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-danger-dark">
          Something went wrong
        </p>
        <h1 className="font-serif text-3xl font-semibold text-text-primary">
          We couldn&apos;t load the products
        </h1>
        <p className="mx-auto mt-3 max-w-md leading-7 text-border-dark">
          There may be a temporary connection problem. Please try again and we&apos;ll
          reload the catalog.
        </p>
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-text-primary px-6 text-sm font-bold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            aria-hidden="true"
            className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`}
          />
          {isRetrying ? 'Trying again…' : 'Try again'}
        </button>
      </div>
    </main>
  )
}
