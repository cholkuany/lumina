import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { StatusBadge } from '@/components/admin/StatusBadge'
import { TOrder } from '@/app/(management)/admin/orders/page'
import { cn } from '@/lib/utils'
import { Eye, Printer } from 'lucide-react'


export function useOrderColumns({
  setOrderDetail,
}: {
  setOrderDetail: (val: TOrder) => void
}): ColumnDef<TOrder>[] {
  return useMemo(() => [
    {
      accessorKey: 'id',
      header: 'Order',
      cell: ({ row }) => (
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setOrderDetail(row.original)
            }}
            className="font-medium text-charcoal hover:text-gold transition-colors"
          >
            {row.original.orderNumber}
          </button>
          <p className="text-xs text-warm-gray-dark">
            {new Date(row.original.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorFn: (row) => `${row.customer.name} ${row.customer.email}`,
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-charcoal">{row.original.customer.name}</p>
          <p className="text-xs text-warm-gray-dark">{row.original.customer.email}</p>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'items',
      header: 'Items',
      cell: ({ row }) => (
        <span className="text-charcoal">{row.original.items}</span>
      ),
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => (
        <span className="font-medium text-charcoal">${row.original.total.toFixed(2)}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'payment',
      header: 'Payment',
      cell: ({ row }) => (
        <span
          className={cn(
            'px-2 py-1 text-xs font-medium rounded-full capitalize',
            row.original.paymentStatus === 'paid' && 'bg-green-100 text-green-700',
            row.original.paymentStatus === 'pending' && 'bg-amber-100 text-amber-700',
            row.original.paymentStatus === 'failed' && 'bg-red-100 text-red-700',
            row.original.paymentStatus === 'refunded' && 'bg-gray-100 text-gray-700'
          )}
        >
          {row.original.paymentStatus}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} size="sm" />,
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setOrderDetail(row.original)
            }}
            className="p-2 text-warm-gray-dark hover:text-gold hover:bg-linen rounded-lg transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Handle print
            }}
            className="p-2 text-warm-gray-dark hover:text-gold hover:bg-linen rounded-lg transition-colors"
            title="Print invoice"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      ),
      meta: {
        className: 'w-24',
      }
    },
  ], [setOrderDetail])
}