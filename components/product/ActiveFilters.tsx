'use client'

import { X } from 'lucide-react'
import { NestedCategory } from '@/hooks/useCategories'

export default function ActiveFilters({
  selectedFilters,
  categories,
  onRemove,
  onClearAll,
}: {
  selectedFilters: Record<string, string[]>
  categories: NestedCategory[]
  onRemove: (group: string, value: string) => void
  onClearAll: () => void
}) {

  const activeFilters = Object.entries(selectedFilters).flatMap(
    ([group, values]) =>
      values.map(value => {
        const label =
          categories
            ?.find(cat => cat.name === group)
            ?.children?.find(child => child.name === value)?.name || value

        return {
          group,
          value,
          label,
        }
      })
  )

  if (!activeFilters.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm text-warm-gray-dark">
        Active filters:
      </span>

      {activeFilters.map(({ group, value, label }) => (
        <button
          key={`${group}-${value}`}
          onClick={() => onRemove(group, value)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linen text-sm text-charcoal rounded-full hover:bg-warm-gray-light transition-colors"
        >
          {label}
          <X className="w-3 h-3" />
        </button>
      ))}

      <button
        onClick={onClearAll}
        className="text-sm text-gold hover:underline"
      >
        Clear all
      </button>
    </div>
  )
}