'use client'

import Link from 'next/link'
import { ChevronLeft, X } from 'lucide-react'
import { CategoryFilter } from '@/components/filters/sidebar/CategoryFilter'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { NestedCategory } from '@/hooks/useCategories'

interface FilterSidebarProps {
  filters: NestedCategory[]
  currentCategory?: NestedCategory
  parentCategory?: NestedCategory
  selectedFilters: Record<string, string[]>
  onFilterChange: (groupId: string, value: string, checked: boolean) => void
  onClearAll: () => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
  isMobile?: boolean
  onClose?: () => void
}

export function FilterSidebar({
  filters,
  currentCategory,
  parentCategory,
  selectedFilters,
  onClearAll,
  isMobile,
  onClose,
}: FilterSidebarProps) {

  const hasActiveFilters = Object.values(selectedFilters).some(arr => arr.length > 0)
  const isLeafCategory = Boolean(currentCategory && currentCategory.children.length === 0)
  const backHref = parentCategory
    ? `/products?category=${encodeURIComponent(parentCategory.name)}&id=${parentCategory.id}`
    : '/products'

  return (
    <div className={cn(isMobile && 'bg-white fixed inset-0 z-50 overflow-y-auto')}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 bg-white border-b border-border-light px-4 py-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-text-primary">Filters</h2>
          <button onClick={onClose} className="p-2 -mr-2">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className={cn('space-y-6', isMobile ? 'p-4' : 'pr-8')}>
        <section aria-labelledby="category-filter-heading">
          <h2 id="category-filter-heading" className="mb-4 text-base font-semibold text-text-primary">
            Categories
          </h2>

          {isLeafCategory && (
            <Link
              href={backHref}
              className="mb-3 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              All Categories
            </Link>
          )}

          <div className="space-y-2">
            {filters.map((category) => (
              <CategoryFilter
                key={category.id}
                category={category}
                isCurrent={category.id === currentCategory?.id}
              />
            ))}
          </div>
        </section>

        {/* Clear All */}
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-sm text-primary hover:underline"
          >
            Clear all filters
          </button>
        )}

      </div>

      {/* Mobile Apply Button */}
      {isMobile && (
        <div className="sticky bottom-0 bg-white border-t border-border-light p-4">
          <Button onClick={onClose} className="w-full">
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  )
}
