import { SlidersHorizontal } from 'lucide-react'

import { activeFilters } from '@/utils/activeFilters'
import { NestedCategory } from '@/hooks/useCategories'

export const MobileFilterButton = (
  { setMobileFiltersOpen,
    categories,
    selectedFilters
  }:
    {
      setMobileFiltersOpen: (val: boolean) => void,
      categories: NestedCategory[],
      selectedFilters: Record<string, string[]>
    }) => {
  const currentFilters = activeFilters(selectedFilters, categories)
  return (
    <button
      onClick={() => setMobileFiltersOpen(true)}
      className="lg:hidden flex items-center gap-2 text-sm font-medium text-charcoal"
    >
      <SlidersHorizontal className="w-4 h-4" />
      Filters
      {currentFilters.length > 0 && (
        <span className="w-5 h-5 bg-gold text-white text-xs rounded-full flex items-center justify-center">
          {currentFilters.length}
        </span>
      )}
    </button>
  )
}