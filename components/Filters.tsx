'use client'

import { cn } from '@/lib/utils'
import { FilterOption } from '@/lib/types'

interface FilterProps {
  filters?: {
    key: string
    label: string
    options: FilterOption[]
  }[]
  showFilters: boolean
  handleFilterChange: (key: string, value: string) => void
  activeFilters: Record<string, string>
  activeFilterCount: number
  clearFilters: () => void
}

export function Filters({
  showFilters,
  activeFilterCount,
  activeFilters,
  filters = [],
  handleFilterChange,
  clearFilters
}: FilterProps) {

  return (
    <div className="space-y-4">

      {/* Filter options */}
      {showFilters && filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-brand border border-warm-gray">
          {filters.map((filter) => (
            <div key={filter.key} className="flex items-center gap-2">
              <label className="text-sm text-warm-gray-dark whitespace-nowrap">
                {filter.label}:
              </label>
              <select
                value={activeFilters[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className={cn(
                  'px-3 py-1.5 text-sm',
                  'bg-linen border border-transparent rounded-lg',
                  'text-charcoal',
                  'focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30',
                  'cursor-pointer'
                )}
              >
                <option value="">All</option>
                {filter.options.map((option, idx) => (
                  <option key={option.value + idx} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="ml-auto text-sm text-gold hover:text-gold-dark font-medium"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  )
}
