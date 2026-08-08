const productPlaceholders = Array.from({ length: 10 }, (_, index) => index)
const filterPlaceholders = Array.from({ length: 5 }, (_, index) => index)

export function ProductsLoadingState() {
  return (
    <main
      className="min-h-[60vh] pb-16"
      aria-busy="true"
      aria-label="Loading products"
    >
      <span className="sr-only">Loading products…</span>

      <div className="container-lumina py-4">
        <div className="h-4 w-28 animate-pulse rounded-full bg-border-light" />
      </div>

      <div className="container-lumina">
        <div className="mb-8 space-y-3">
          <div className="h-10 w-56 max-w-full animate-pulse rounded-lg bg-border-light" />
          <div className="h-4 w-28 animate-pulse rounded-full bg-border-light" />
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="rounded-xl border border-border-light bg-white p-5">
              <div className="mb-6 h-6 w-20 animate-pulse rounded bg-border-light" />
              <div className="space-y-5">
                {filterPlaceholders.map(item => (
                  <div key={item} className="space-y-3">
                    <div className="h-4 w-24 animate-pulse rounded bg-border-light" />
                    <div className="h-9 w-full animate-pulse rounded-lg bg-surface" />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between border-b border-border-light pb-4">
              <div className="h-9 w-24 animate-pulse rounded-lg bg-border-light lg:hidden" />
              <div className="hidden h-9 w-20 animate-pulse rounded-lg bg-border-light sm:block" />
              <div className="ml-auto h-10 w-36 animate-pulse rounded-lg bg-border-light" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
              {productPlaceholders.map(item => (
                <div
                  key={item}
                  className="overflow-hidden rounded-xl border border-border-light bg-white"
                >
                  <div className="aspect-square animate-pulse bg-border-light" />
                  <div className="space-y-3 p-3">
                    <div className="h-3 w-16 animate-pulse rounded bg-border-light" />
                    <div className="h-4 w-full animate-pulse rounded bg-border-light" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-border-light" />
                    <div className="h-5 w-20 animate-pulse rounded bg-border-light" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
