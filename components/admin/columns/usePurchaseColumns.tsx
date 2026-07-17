import { useMemo } from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import type { AdminPurchase } from '@/lib/purchase-types'
import { cn } from "@/lib/utils"
import { Eye, X } from "lucide-react"

// Hook parameter types
const statusConfig = {
  pending: { label: 'Draft', className: 'bg-gray-100 text-gray-700' }, ordered: { label: 'Ordered', className: 'bg-blue-100 text-blue-700' },
  in_transit: { label: 'In Transit', className: 'bg-amber-100 text-amber-700' }, received: { label: 'Received', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
}
type UsePurchaseColumnsProps = {
  setPurchaseDetail: (val: AdminPurchase | null) => void
  setCancelModal: (val: { open: boolean; purchaseId?: string }) => void
}

const columnHelper = createColumnHelper<AdminPurchase>()

export const usePurchaseColumns = ({
  setPurchaseDetail,
  setCancelModal,
}: UsePurchaseColumnsProps): ColumnDef<AdminPurchase>[] => {
  return useMemo(() => {
    return [
      // 1. Purchase Order Column
      columnHelper.accessor('purchaseNumber', {
        header: 'Purchase Order',
        enableSorting: true,
        cell: ({ getValue, row }) => (
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setPurchaseDetail(row.original)
              }}
              className="font-medium text-charcoal hover:text-gold transition-colors"
            >
              {getValue()}
            </button>
            <p className="text-xs text-warm-gray-dark">
              {new Date(row.original.date).toLocaleDateString()}
            </p>
          </div>
        ),
      }),

      // 2. Supplier Column (Object data)
      columnHelper.accessor((row) => row.supplier, {
        id: 'supplier',
        header: 'Supplier',
        enableSorting: true,
        cell: ({ getValue }) => {
          const supplier = getValue()
          return (
            <div>
              <p className="text-sm font-medium text-charcoal">{supplier.name}</p>
              <p className="text-xs text-warm-gray-dark">{supplier.email}</p>
            </div>
          )
        },
      }),

      // 3. Items Column
      columnHelper.accessor('itemCount', {
        header: 'Items',
        cell: ({ getValue }) => (
          <span className="text-charcoal">{getValue()}</span>
        ),
      }),

      // 4. Total Column
      columnHelper.accessor('total', {
        header: 'Total',
        enableSorting: true,
        cell: ({ getValue }) => (
          <span className="font-medium text-charcoal">
            ${getValue().toLocaleString()}
          </span>
        ),
      }),

      // 5. Expected Date Column
      columnHelper.accessor('expectedDate', {
        header: 'Expected',
        enableSorting: true,
        cell: ({ getValue }) => (
          <span className="text-sm text-warm-gray-dark">
            {new Date(getValue()).toLocaleDateString()}
          </span>
        ),
      }),

      // 6. Status Column
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue()
          const config = statusConfig[status]
          return (
            <span
              className={cn(
                'px-2 py-1 text-xs font-medium rounded-full',
                config.className
              )}
            >
              {config.label}
            </span>
          )
        },
      }),

      // 7. Actions Column
      columnHelper.display({
        id: 'actions',
        header: '',
        meta: {
          className: 'w-24',
        },
        cell: ({ row }) => {
          const { status, id } = row.original
          const canCancel = status !== 'received' && status !== 'cancelled'

          return (
            <div className="flex items-center justify-end gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setPurchaseDetail(row.original)
                }}
                className="p-2 text-warm-gray-dark hover:text-gold hover:bg-linen rounded-lg transition-colors"
                title="View details"
              >
                <Eye className="w-4 h-4" />
              </button>

              {canCancel && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCancelModal({ open: true, purchaseId: id })
                  }}
                  className="p-2 text-warm-gray-dark hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Cancel order"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )
        },
      }),
    ] as ColumnDef<AdminPurchase>[]
  }, [setPurchaseDetail, setCancelModal])
}
