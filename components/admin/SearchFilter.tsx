'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

import { Funnel, Search, X } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
}

interface SearchFilterProps {
  searchPlaceholder?: string
  onSearchChange: (query: string) => void
  filters?: {
    key: string
    label: string
    options: FilterOption[]
  }[]
  onFilterChange?: (filters: Record<string, string>) => void
  actions?: React.ReactNode
  // handleBulkDelete: () => void
}

export function SearchFilter({
  searchPlaceholder = 'Search...',
  onSearchChange,
  filters = [],
  onFilterChange,
  actions,
}: SearchFilterProps) {

  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearchChange(value)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value }
    if (!value) {
      delete newFilters[key]
    }
    setActiveFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearFilters = () => {
    setActiveFilters({})
    onFilterChange?.({})
  }

  const activeFilterCount = Object.keys(activeFilters).length

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={cn(
              'w-full px-10 py-2.5 text-sm',
              'bg-white border border-warm-gray rounded-brand',
              'placeholder:text-warm-gray-dark text-charcoal',
              'focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20',
              'transition-all duration-200'
            )}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray-dark" />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-linen rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-warm-gray-dark" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        {filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-brand border transition-colors',
              showFilters || activeFilterCount > 0
                ? 'bg-gold/10 border-gold text-gold'
                : 'bg-white border-warm-gray text-charcoal hover:bg-linen'
            )}
          >
            <Funnel className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-gold text-white rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {/* Actions */}
        {actions}
      </div>

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
