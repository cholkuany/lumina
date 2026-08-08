'use client'

import { SortDropdown } from '@/components/filters/SortDropdown'
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
  sortBy,
  setSortBy,
  setMobileFiltersOpen,
  categories,
  selectedFilters
}: {
  sortBy: string
  setSortBy: (val: string) => void
  setMobileFiltersOpen: (val: boolean) => void
  categories: NestedCategory[]
  selectedFilters: Record<string, string[]>
}) {
  return (
    <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 mb-6 pb-4 border-b border-border-light">
      {/* Mobile Filter Button */}
      <MobileFilterButton
        setMobileFiltersOpen={setMobileFiltersOpen}
        categories={categories}
        selectedFilters={selectedFilters}
      />

      {/* Sort */}
      <SortDropdown
        options={sortOptions}
        value={sortBy}
        onChange={setSortBy}
      />
    </div>
  )
}