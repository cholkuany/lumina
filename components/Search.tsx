'use client'

import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'

interface SearchProps {
  searchPlaceholder?: string
  onSearchChange: (query: string) => void
  search: string
}

export function SearchComponent({
  searchPlaceholder = 'Search...',
  onSearchChange,
  search
}: SearchProps) {

  return (
    <div className="relative flex-1">
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className={cn(
          'w-full px-10 py-2.5 text-sm',
          'bg-white border border-warm-gray rounded-brand',
          'placeholder:text-warm-gray-dark text-charcoal',
          'focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20',
          'transition-all duration-200'
        )}
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray-dark" />
      {search && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-linen rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-warm-gray-dark" />
        </button>
      )}
    </div>
  )
}
