'use client'

import { FilterOption } from "@/lib/types"
import { cn } from '@/lib/utils'
import { Funnel } from 'lucide-react'

interface ToggleFilterProps {
  activeFilterCount: number
  showFilters: boolean
  setShowFilters: (val: boolean) => void
  filters: {
    key: string;
    label: string;
    options: FilterOption[];
  }[]
}

export const ToggleFilterOptions = ({ activeFilterCount, showFilters, setShowFilters, filters }: ToggleFilterProps) => {
  return (
    filters?.length > 0 && (
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-brand border transition-colors',
          showFilters || activeFilterCount > 0
            ? 'bg-primary/10 border-primary text-primary'
            : 'bg-white border-border text-text-primary hover:bg-surface'
        )}
      >
        <Funnel className="w-5 h-5" />
        Filters
        {activeFilterCount > 0 && (
          <span className="px-1.5 py-0.5 text-xs bg-primary text-white rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>
    )
  )
}