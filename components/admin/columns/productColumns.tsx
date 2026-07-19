import type { ColumnDef } from '@tanstack/react-table'

import type { TProduct } from '@/lib/types'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ProductCell } from '../products/ProductCell'
import { ProductActions } from '../products/ProductAction'
import { ActionType } from '@/lib/types'
import { getProductPrice, getProductStock } from '@/lib/utils'

export function useProductColumns({
  onDelete,
}: {
  onDelete: (
    type: ActionType,
    ids: string | string[]
  ) => void
}): ColumnDef<TProduct>[] {
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
        <span className="font-medium text-text-primary">
          ${getProductPrice(row.original).toFixed(2)}
        </span>
      ),
      enableSorting: true,
    },

    {
      accessorKey: 'stockCount',
      header: 'Stock',
      cell: ({ row }) => {
        const product = row.original
        const stock = getProductStock(product)
        return (
          <div className="flex items-center gap-2">
            <span className="text-text-primary">
              {stock}
            </span>

            <StatusBadge
              status={
                (stock ?? 0) > 100
                  ? 'in_stock'
                  : (stock ?? 0) > 0
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
        <span className="text-text-primary">
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
