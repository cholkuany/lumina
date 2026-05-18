'use client'

import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

type ActionsOptions<T> = {
  editHref?: (row: T) => string
  onDelete?: (row: T) => void
  onView?: (row: T) => void
}

export function createActionsColumn<T>(
  options: ActionsOptions<T>
): ColumnDef<T> {
  return {
    id: 'actions',
    header: 'Actions',

    cell: ({ row }) => {
      const original = row.original

      return (
        <div className="flex items-center gap-2">
          {options.editHref && (
            <Link
              href={options.editHref(original)}
              className="text-blue-500"
            >
              Edit
            </Link>
          )}

          {options.onDelete && (
            <button
              onClick={() => options.onDelete?.(original)}
              className="text-red-500"
            >
              Delete
            </button>
          )}

          {options.onView && (
            <button
              onClick={() => options.onView?.(original)}
            >
              View
            </button>
          )}
        </div>
      )
    },
  }
}