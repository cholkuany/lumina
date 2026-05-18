import type { ColumnDef } from '@tanstack/react-table'

import type { Product } from '@/lib/types'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ProductCell } from '../products/ProductCell'
import { ProductActions } from '../products/ProductAction'
import { ActionType } from '@/lib/types'

export function useProductColumns({
  onDelete,
}: {
  onDelete: (
    type: ActionType,
    ids: string | string[]
  ) => void
}): ColumnDef<Product>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Product',
      cell: ({ row }) => (
        <ProductCell
          product={row.original}
        />
      ),
      enableSorting: true,
    },

    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => (
        <span className="font-medium text-charcoal">
          ${row.original.price.toFixed(2)}
        </span>
      ),
      enableSorting: true,
    },

    {
      accessorKey: 'stockCount',
      header: 'Stock',
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex items-center gap-2">
            <span className="text-charcoal">
              {product.stockCount}
            </span>

            <StatusBadge
              status={
                (product.stockCount ?? 0) > 100
                  ? 'in_stock'
                  : (product.stockCount ?? 0) > 0
                    ? 'low_stock'
                    : 'out_of_stock'
              }
              size="sm"
            />
          </div>
        )
      },
      enableSorting: true,
    },

    {
      accessorKey: 'unitsSold',
      header: 'Sales',
      cell: ({ row }) => (
        <span className="text-charcoal">
          {row.original.unitsSold} units
        </span>
      ),
      enableSorting: true,
    },

    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <ProductActions
          id={row.original.id}
          actionText="delete"
          onDelete={onDelete}
        />
      ),
      meta: {
        className: 'w-24',
      },
    },
  ]
}
