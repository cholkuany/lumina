export function RelatedProductsSkeleton() {
  return (
    <section className="container-lumina mt-16">
      <div className="h-8 w-48 rounded bg-warm-gray-light animate-pulse mb-8" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-64 rounded bg-warm-gray-light animate-pulse"
          />
        ))}
      </div>
    </section>
  )
}