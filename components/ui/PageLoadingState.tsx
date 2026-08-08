type SkeletonProps = {
  className?: string
}

function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded-lg bg-border-light ${className}`} />
}

export function StorefrontPageLoadingState() {
  return (
    <main className="min-h-[60vh] pb-16" aria-busy="true" aria-label="Loading page">
      <span className="sr-only">Loading page…</span>
      <div className="container-lumina py-4">
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="container-lumina space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-4 rounded-xl border border-border-light bg-white p-6">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-4 rounded-xl border border-border-light bg-white p-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      </div>
    </main>
  )
}

export function ProductDetailLoadingState() {
  return (
    <main className="min-h-[60vh] pb-16" aria-busy="true" aria-label="Loading product">
      <span className="sr-only">Loading product…</span>
      <div className="container-lumina py-4"><Skeleton className="h-4 w-52" /></div>
      <div className="container-lumina grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="grid gap-4 sm:grid-cols-[5rem_1fr]">
          <div className="hidden space-y-3 sm:block">
            {[0, 1, 2, 3].map(item => <Skeleton key={item} className="aspect-square w-full" />)}
          </div>
          <Skeleton className="aspect-square w-full" />
        </div>
        <div className="space-y-5 py-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </main>
  )
}

export function AdminPageLoadingState() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard page">
      <span className="sr-only">Loading dashboard page…</span>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2"><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-72 max-w-full" /></div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map(item => <Skeleton key={item} className="h-28 w-full" />)}
      </div>
      <div className="rounded-xl border border-border-light bg-white p-5">
        <div className="mb-5 flex gap-3"><Skeleton className="h-10 flex-1" /><Skeleton className="h-10 w-36" /></div>
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map(item => <Skeleton key={item} className="h-16 w-full" />)}
        </div>
      </div>
    </div>
  )
}
