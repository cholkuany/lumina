'use client'

import { SlidersHorizontal } from 'lucide-react'
import { ProductCard } from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

export default function ProductsGrid({
  products,
  viewMode,
  onClearAll
}: {
  products: Product[]
  viewMode: 'grid' | 'flex'
  onClearAll?: () => void
}) {
  if (!products.length) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-linen rounded-full flex items-center justify-center mx-auto mb-6">
          <SlidersHorizontal className="w-8 h-8 text-warm-gray-dark" />
        </div>
        <h2 className="font-serif text-xl text-charcoal mb-2">No products found</h2>
        <p className="text-warm-gray-dark mb-6">
          Try adjusting your filters or search terms.
        </p>
        <Button variant="secondary" onClick={onClearAll}>
          Clear All Filters
        </Button>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'gap-4 lg:gap-6',
          viewMode === 'grid'
            ? 'grid grid-cols-2 lg:grid-cols-3'
            : 'flex flex-col'
        )}
      >
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination placeholder */}
      <div className="mt-12 text-center">
        <Button variant="secondary" size="lg">
          Load More Products
        </Button>
      </div>
    </>
  )
}