'use client'

import { cn } from '@/lib/utils'

import {
  flexRender,
  type Table
} from '@tanstack/react-table'

import { DataTableSkeleton, CheckBox, SortIcon, EmptyTableResult } from '../admin/DataTable'

export interface ResourceTableProps<T> {
  table: Table<T>,
  onRowClick?: (item: T) => void
  selectable?: boolean
  emptyMessage?: string
  isLoading?: boolean
}

export function ResourceTable<T>({
  table,
  onRowClick,
  selectable = false,
  emptyMessage = 'No data found',
  isLoading = false,
}: ResourceTableProps<T>) {

  if (isLoading) {
    return <DataTableSkeleton />
  }

  if (!table) {
    return null;
  }

  const filtered = table.getFilteredRowModel().rows.length
  if (!filtered) {
    return <EmptyTableResult emptyMessage={emptyMessage} />
  }

  return (
    <div className="bg-white rounded-brand border border-warm-gray overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-linen border-b border-warm-gray"
              >
                {selectable && (
                  <th className="w-12 px-4 py-3">
                    <CheckBox
                      checked={table.getIsAllRowsSelected()}
                      onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                  </th>
                )}

                {headerGroup.headers.map((header) => {
                  const meta =
                    header.column.columnDef.meta as {
                      className?: string
                    }

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        'px-4 py-3 text-left text-xs font-semibold text-charcoal uppercase tracking-wider',
                        header.column.getCanSort() &&
                        'cursor-pointer hover:bg-warm-gray-light/50',
                        meta?.className
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1.5">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {header.column.getCanSort() && (
                          <SortIcon
                            active={!!header.column.getIsSorted()}
                            direction={
                              header.column.getIsSorted() as
                              | 'asc'
                              | 'desc'
                              | undefined
                            }
                          />
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-warm-gray-light">
            {table.getRowModel().rows.map((row) => {
              const item = row.original
              const isSelected = row.getIsSelected()

              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer',
                    isSelected
                      ? 'bg-gold/5'
                      : 'hover:bg-linen/50'
                  )}
                >
                  {selectable && (
                    <td
                      className="w-12 px-4 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CheckBox
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                      />
                    </td>
                  )}

                  {row.getVisibleCells().map((cell) => {
                    const meta =
                      cell.column.columnDef.meta as {
                        className?: string
                      }

                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          'px-4 py-4 text-sm text-charcoal',
                          meta?.className
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}