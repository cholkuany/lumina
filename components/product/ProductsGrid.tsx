'use client'

import { SlidersHorizontal } from 'lucide-react'
import { ProductCard } from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { TProduct } from '@/lib/types'

export default function ProductsGrid({
  products,
  viewMode,
  onClearAll
}: {
  products: TProduct[]
  viewMode: 'grid' | 'flex'
  onClearAll?: () => void
}) {
  if (!products.length) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
          <SlidersHorizontal className="w-8 h-8 text-border-dark" />
        </div>
        <h2 className="font-serif text-xl text-text-primary mb-2">No products found</h2>
        <p className="text-border-dark mb-6">
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
          'gap-3 lg:gap-4',
          viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            : 'flex flex-col'
        )}
      >
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            variant={viewMode === 'grid' ? 'compact' : 'full'}
          />
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
