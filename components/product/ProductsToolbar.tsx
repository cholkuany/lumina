'use client'

import { Grid, LayoutList } from 'lucide-react'
import { SortDropdown } from '@/components/filters/SortDropdown'
import { cn } from '@/lib/utils'
import { MobileFilterButton } from '@/components/product/MobileFilterButton'
import { NestedCategory } from '@/hooks/useCategories'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'bestselling', label: 'Best Selling' },
]

export default function ProductsToolbar({
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  setMobileFiltersOpen,
  categories,
  selectedFilters
}: {
  viewMode: 'grid' | 'flex'
  setViewMode: (mode: 'grid' | 'flex') => void
  sortBy: string
  setSortBy: (val: string) => void
  setMobileFiltersOpen: (val: boolean) => void
  categories: NestedCategory[]
  selectedFilters: Record<string, string[]>
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border-light">
      {/* Mobile Filter Button */}
      <MobileFilterButton
        setMobileFiltersOpen={setMobileFiltersOpen}
        categories={categories}
        selectedFilters={selectedFilters}
      />

      {/* View Mode Toggle */}
      <div className="hidden sm:flex items-center gap-1 border border-borderrounded-lg p-1">
        <button
          onClick={() => setViewMode('grid')}
          className={cn(
            'p-1.5 rounded transition-colors',
            viewMode === 'grid' ? 'bg-text-primary text-white' : 'text-border-dark hover:text-text-primary'
          )}
        >
          <Grid className="w-4 h-4" />
        </button>

        <button
          onClick={() => setViewMode('flex')}
          className={cn(
            'p-1.5 rounded transition-colors',
            viewMode === 'flex' ? 'bg-text-primary text-white' : 'text-border-dark hover:text-text-primary'
          )}
        >
          <LayoutList className="w-4 h-4" />
        </button>
      </div>

      {/* Sort */}
      <SortDropdown
        options={sortOptions}
        value={sortBy}
        onChange={setSortBy}
      />
    </div>
  )
}