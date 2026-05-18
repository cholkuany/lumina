'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import { Button } from '../ui/Button'

interface ResourceTablePaginationProps<T> {
  table: Table<T>
}

export function ResourceTablePagination<T>({
  table,
}: ResourceTablePaginationProps<T>) {

  const pageIndex = table.getState().pagination.pageIndex
  const totalPages = table.getPageCount()
  const pageSize = table.getState().pagination.pageSize
  const totalCount = table.getFilteredRowModel().rows.length

  const startRow =
    totalCount === 0
      ? 0
      : pageIndex * pageSize + 1

  const endRow = Math.min(
    (pageIndex + 1) * pageSize,
    totalCount
  )

  return (
    <div className="flex flex-col gap-4 border-t border-warm-gray bg-white p-4 md:flex-row md:items-center md:justify-between">
      {/* Left */}
      <div className="text-sm text-warm-gray-dark">
        Showing {startRow} to {endRow} of{' '}
        {totalCount} results
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Page size */}
        <select
          value={pageSize}
          onChange={(e) =>
            table.setPageSize(Number(e.target.value))
          }
          className="rounded-brand border border-warm-gray px-2 py-1 text-sm"
        >
          {[1, 10, 20, 50, 100].map((size) => (
            <option
              key={size}
              value={size}
            >
              {size} / page
            </option>
          ))}
        </select>
        {/* )} */}

        {/* Page info */}
        <span className="text-sm text-charcoal">
          Page {pageIndex + 1} of {totalPages}
        </span>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            size='sm'
            onClick={() =>
              table.previousPage()
            }
            disabled={!table.getCanPreviousPage()}
            className="rounded-brand border border-warm-gray p-2 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            size='sm'
            onClick={() => table.nextPage()
            }
            disabled={
              !table.getCanNextPage()
            }
            className="rounded-brand border border-warm-gray p-2 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}