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
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-brand border border-border">
          {filters.map((filter) => (
            <div key={filter.key} className="flex items-center gap-2">
              <label className="text-sm text-border-dark whitespace-nowrap">
                {filter.label}:
              </label>
              <select
                value={activeFilters[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className={cn(
                  'px-3 py-1.5 text-sm',
                  'bg-surface border border-transparent rounded-lg',
                  'text-text-primary',
                  'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30',
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
              className="ml-auto text-sm text-primary hover:text-primary-dark font-medium"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  )
}
