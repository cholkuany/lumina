'use client'

import { useState } from 'react'

import { useResourceController, useTableInstanceController } from '@/hooks/useResourceController'
import { useOrderColumns } from '../../components/columns/orderColumns'

import { ConfirmModal } from '../../components/ConfirmModal'
import { OrderDetailDrawer } from './OrderDetailDrawer'
import { ResourceTableToolbar } from '@/app/(management)/components/tables/ResourceTableToolbar'
import { ResourceTablePagination } from '@/app/(management)/components/tables/ResourceTablePagination'
import { ResourceHeader } from '../../components/resource/ResourceHeader'
import { BulkActions } from '../../components/resource/ResourceBulkActions'
import { ResourceTable } from '@/app/(management)/components/tables/ResourceTable'

import type { AdminOrderStats, OrderStatus, ReturnStatus, TAdminOrder } from '@/lib/types'
import { Stats } from './Stats'

const orderStatuses = [
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const paymentStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
]

function calculateStats(orders: TAdminOrder[]): AdminOrderStats {
  return orders.reduce<AdminOrderStats>((counts, order) => {
    counts[order.status] += 1
    return counts
  }, { processing: 0, shipped: 0, delivered: 0, cancelled: 0, pending: 0 })
}

export function AdminOrdersClient({
  initialOrders,
  initialStats,
}: {
  initialOrders: TAdminOrder[]
  initialStats: AdminOrderStats
}) {
  const [orders, setOrders] = useState(initialOrders)
  const [stats, setStats] = useState(initialStats)
  const [orderDetail, setOrderDetail] = useState<TAdminOrder | null>(null)

  const {
    filterValues,
    setFilterValues,

    confirm,
    mutation,
    handleDelete,

    pagination,
    setPagination,

    rowSelection,
    setRowSelection,

    globalFilter,
    setGlobalFilter
  } = useResourceController('order')

  const columns = useOrderColumns({ setOrderDetail })

  const filteredOrders = orders.filter((order) => (
    (!filterValues.status || order.status === filterValues.status)
    && (!filterValues.payment || order.paymentStatus === filterValues.payment)
  ))

  const handleOrderStatusChange = (
    orderId: string,
    status: OrderStatus,
    statusHistory: TAdminOrder['statusHistory']
  ) => {
    const updatedOrders = orders.map((order) => (
      order.id === orderId ? { ...order, status, statusHistory } : order
    ))

    setOrders(updatedOrders)
    setStats(calculateStats(updatedOrders))
    setOrderDetail((current) => (
      current?.id === orderId ? { ...current, status, statusHistory } : current
    ))
  }

  const handleReturnStatusChange = (
    orderId: string,
    returnId: string,
    status: ReturnStatus,
    adminNote?: string
  ) => {
    const updateOrder = (order: TAdminOrder) => ({
      ...order,
      returnRequests: order.returnRequests.map((request) => (
        request.id === returnId ? { ...request, status, adminNote } : request
      )),
    })

    setOrders((current) => current.map((order) => (
      order.id === orderId ? updateOrder(order) : order
    )))
    setOrderDetail((current) => (
      current?.id === orderId ? updateOrder(current) : current
    ))
  }

  const { table } = useTableInstanceController(
    columns,
    filteredOrders,
    rowSelection,
    setRowSelection,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
    (order) => order.id
  )

  const selectedIds =
    table
      .getSelectedRowModel()
      .rows.map((row) =>
        row.original.id
      )

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      handleDelete('delete', selectedIds)

    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <ResourceHeader
        title='Orders'
        description='Manage and track customer orders'
        exportText='Export Orders'
      />

      {/* Stats */}
      <Stats stats={stats} />

      <ResourceTableToolbar
        searchPlaceholder="Search orders..."
        search={globalFilter}
        onSearchChange={setGlobalFilter}
        filters={[
          { key: 'status', label: 'Status', options: orderStatuses },
          { key: 'payment', label: 'Payment', options: paymentStatuses },
        ]}
        onFilterChange={setFilterValues}
        filterValues={filterValues}
        actions={<BulkActions onDelete={handleBulkDelete} selected={selectedIds} />}
      />

      <ResourceTable
        table={table}
        onRowClick={setOrderDetail}
        selectable={true}
      />

      <ResourceTablePagination table={table} />

      {/* Order Detail Drawer */}
      {orderDetail && (
        <OrderDetailDrawer
          order={orderDetail}
          onClose={() => setOrderDetail(null)}
          onStatusChange={handleOrderStatusChange}
          onReturnStatusChange={handleReturnStatusChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirm.state.open}
        onClose={confirm.close}
        onConfirm={confirm.confirm}
        title="Delete Order"
        confirmLabel="Delete"
        variant="danger"
        action={confirm.state.type}
        count={confirm.state.ids.length}
        isLoading={mutation.isPending}
        resource={confirm.state.resource}
      />
    </div>
  )
}