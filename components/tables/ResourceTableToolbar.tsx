'use client'

import { useState } from 'react'

import { SearchComponent } from '../Search'
import { ToggleFilterOptions } from '../admin/ToggleFilterOptions'

import { Filters } from '../Filters'

import { FilterOption } from '@/lib/types'

interface ResourceTableToolbarProps {
  searchPlaceholder?: string
  onSearchChange: (query: string) => void
  filters?: {
    key: string
    label: string
    options: FilterOption[]
  }[]
  onFilterChange?: (filters: Record<string, string>) => void
  actions?: React.ReactNode
  search: string
  filterValues: Record<string, string>
}

export function ResourceTableToolbar({
  searchPlaceholder = 'Search...',
  onSearchChange,
  search,
  filters = [],
  onFilterChange,
  actions,
  filterValues
}: ResourceTableToolbarProps) {

  const [showFilters, setShowFilters] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filterValues, [key]: value }
    if (!value) {
      delete newFilters[key]
    }
    onFilterChange?.(newFilters)
  }

  const clearFilters = () => {
    onFilterChange?.({})
  }

  const activeFilterCount = Object.keys?.(filterValues).length

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <SearchComponent
          searchPlaceholder={searchPlaceholder}
          search={search}
          onSearchChange={onSearchChange}
        />

        {/* Filter toggle */}
        <ToggleFilterOptions
          setShowFilters={setShowFilters}
          showFilters={showFilters}
          activeFilterCount={activeFilterCount}
          filters={filters}
        />
        {/* Actions */}
        {actions}
      </div>

      {/* Filter options */}
      <Filters
        handleFilterChange={handleFilterChange}
        showFilters={showFilters}
        activeFilterCount={activeFilterCount}
        activeFilters={filterValues}
        filters={filters}
        clearFilters={clearFilters}
      />
    </div>
  )
}
