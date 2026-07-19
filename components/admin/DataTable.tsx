'use client'

import { cn } from '@/lib/utils'

import { Inbox, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

export type Primitive = string | number | boolean | null | undefined
export type PrimitiveKeys<T> = Extract<
  {
    [K in keyof T]: T[K] extends Primitive ? K : never
  }[keyof T],
  string
>

export type Column<T> = {
  key: PrimitiveKeys<T> | string
  title: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
  className?: string
}


export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  selectable?: boolean
  onSelectionChange?: (selectedIds: string[]) => void
  emptyMessage?: string
  isLoading?: boolean
}

export function SortIcon({
  active,
  direction,
}: {
  active: boolean
  direction?: 'asc' | 'desc'
}) {
  return (
    <svg
      className={cn(
        'w-4 h-4 transition-colors',
        active ? 'text-primary' : 'text-border-dark'
      )}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {direction === 'asc' ? (
        <ChevronDown />
      ) : direction === 'desc' ? (
        <ChevronUp />
      ) : (
        <ArrowUpDown />
      )}
    </svg>
  )
}

export const CheckBox = ({ checked, onChange }: { checked: boolean; onChange: React.ChangeEventHandler<HTMLInputElement> }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
  />
)

export function getItemValue<T>(item: T, key: keyof T): React.ReactNode {
  if (item !== null && typeof item === 'object' && key in item) {
    const value = item[key]
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return String(value)
    }
  }
  return null
}

export const DataTableSkeleton = () => (
  <div className="bg-white rounded-brand border border-border overflow-hidden">
    <div className="animate-pulse">
      <div className="h-12 bg-surface border-b border-border" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 border-b border-border-light last:border-b-0">
          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 bg-border-light rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-border-light rounded w-1/3" />
              <div className="h-3 bg-border-light rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export const EmptyTableResult = ({ emptyMessage }: { emptyMessage: string }) => (
  <div className="bg-white rounded-brand border border-border p-12 text-center">
    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
      <Inbox className="w-8 h-8 text-border-dark" />
    </div>
    <p className="text-text-primary font-medium">{emptyMessage}</p>
    <p className="text-sm text-border-dark mt-1">
      Try adjusting your filters or search terms
    </p>
  </div>
)