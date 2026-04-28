'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

import { Inbox, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

interface Column<T> {
  key: string
  title: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  selectable?: boolean
  onSelectionChange?: (selectedIds: string[]) => void
  emptyMessage?: string
  isLoading?: boolean
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  selectable = false,
  onSelectionChange,
  emptyMessage = 'No data found',
  isLoading = false,
}: DataTableProps<T>) {

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSelectAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set())
      onSelectionChange?.([])
    } else {
      const allIds = new Set(data.map(keyExtractor))
      setSelectedIds(allIds)
      onSelectionChange?.(Array.from(allIds))
    }
  }

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
    onSelectionChange?.(Array.from(newSelected))
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  if (isLoading) {
    return <DataTableSkeleton />
  }

  if (!data || data.length === 0) {
    return <EmptyTableResult emptyMessage={emptyMessage} />
  }

  return (
    <div className="bg-white rounded-brand border border-warm-gray overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-linen border-b border-warm-gray">
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <CheckBox checked={selectedIds.size === data.length} onChange={handleSelectAll} />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:bg-warm-gray-light/50 transition-colors',
                    column.className
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {column.title}
                    {column.sortable && (
                      <SortIcon
                        active={sortColumn === column.key}
                        direction={sortColumn === column.key ? sortDirection : undefined}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-gray-light">
            {data.map((item) => {
              const id = keyExtractor(item)
              const isSelected = selectedIds.has(id)

              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer',
                    isSelected ? 'bg-gold/5' : 'hover:bg-linen/50'
                  )}
                >
                  {selectable && (
                    <td className="w-12 px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <CheckBox checked={isSelected} onChange={() => handleSelectRow(id)} />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn('px-4 py-4 text-sm text-charcoal', column.className)}
                    >
                      {column.render
                        ? column.render(item)
                        : getItemValue(item, column.key)
                      }
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SortIcon({
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
        active ? 'text-gold' : 'text-warm-gray-dark'
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

const CheckBox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    className="w-4 h-4 rounded border-warm-gray text-gold focus:ring-gold/30"
  />
)

function getItemValue(item: unknown, key: string): React.ReactNode {
  if (item !== null && typeof item === 'object' && key in item) {
    const value = (item as Record<string, unknown>)[key]
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

const DataTableSkeleton = () => (
  <div className="bg-white rounded-brand border border-warm-gray overflow-hidden">
    <div className="animate-pulse">
      <div className="h-12 bg-linen border-b border-warm-gray" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 border-b border-warm-gray-light last:border-b-0">
          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 bg-warm-gray-light rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-warm-gray-light rounded w-1/3" />
              <div className="h-3 bg-warm-gray-light rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const EmptyTableResult = ({ emptyMessage }: { emptyMessage: string }) => (
  <div className="bg-white rounded-brand border border-warm-gray p-12 text-center">
    <div className="w-16 h-16 bg-linen rounded-full flex items-center justify-center mx-auto mb-4">
      <Inbox className="w-8 h-8 text-warm-gray-dark" />
    </div>
    <p className="text-charcoal font-medium">{emptyMessage}</p>
    <p className="text-sm text-warm-gray-dark mt-1">
      Try adjusting your filters or search terms
    </p>
  </div>
)