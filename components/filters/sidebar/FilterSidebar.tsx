// components/filters/FilterSidebar.tsx
'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { ToggleButton } from '@/components/filters/sidebar/ToggleButton'
import { CategoryFilter } from '@/components/filters/sidebar/CategoryFilter'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { NestedCategory } from '@/hooks/useCategories'

// interface FilterOption {
//   value: string
//   label: string
//   count?: number
// }

// interface FilterGroup {
//   id: string
//   name: string
//   options: FilterOption[]
// }

interface FilterSidebarProps {
  // filters: FilterGroup[]
  filters: NestedCategory[]
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
  selectedFilters,
  onFilterChange,
  onClearAll,
  priceRange,
  onPriceChange,
  isMobile,
  onClose,
}: FilterSidebarProps) {

  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    filters.map(f => f.name)
  )

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const hasActiveFilters = Object.values(selectedFilters).some(arr => arr.length > 0)

  return (
    <div className={cn(
      'bg-white',
      isMobile && 'fixed inset-0 z-50 overflow-y-auto'
    )}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 bg-white border-b border-warm-gray-light px-4 py-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-charcoal">Filters</h2>
          <button onClick={onClose} className="p-2 -mr-2">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className={cn('space-y-6', isMobile ? 'p-4' : 'pr-8')}>
        {/* Clear All */}
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-sm text-gold hover:underline"
          >
            Clear all filters
          </button>
        )}

        {/* Price Range */}
        <div>
          <ToggleButton
            id='price'
            included={expandedGroups.includes('price')}
            toggleGroup={toggleGroup}
            label='Price'
          />

          {expandedGroups.includes('price') && (
            <div className="pt-4 pb-2">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs text-warm-gray-dark">Min</label>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
                    className="w-full h-10 px-3 border border-warm-grayrounded-lg text-sm focus:outline-none focus:border-gold"
                    min={0}
                  />
                </div>
                <span className="text-warm-gray-dark mt-4">—</span>
                <div className="flex-1">
                  <label className="text-xs text-warm-gray-dark">Max</label>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-10 px-3 border border-warm-grayrounded-lg text-sm focus:outline-none focus:border-gold"
                    min={0}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Groups */}
        {filters.map((category) => (
          <div
            key={category.id}
            className="border-t border-warm-gray-light pt-4"
          >
            <CategoryFilter
              key={category.id}
              category={category}
              expandedGroups={expandedGroups}
              toggleGroup={toggleGroup}
              selectedFilters={selectedFilters}
              onFilterChange={onFilterChange}
              level={0}
            />
          </div>
        ))}

      </div>

      {/* Mobile Apply Button */}
      {isMobile && (
        <div className="sticky bottom-0 bg-white border-t border-warm-gray-light p-4">
          <Button onClick={onClose} className="w-full">
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  )
}

