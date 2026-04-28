'use client'

import { useState } from 'react'
// import Link from 'next/link'
import { DataTable } from '@/components/admin/DataTable'
import { SearchFilter } from '@/components/admin/SearchFilter'
import { Pagination } from '@/components/admin/Pagination'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

import { Eye, Printer, X, Mail, Check, Truck, Clock, Upload } from 'lucide-react'

// Mock data
const orders = [
  {
    id: '1',
    orderNumber: 'LUM-2401-ABC123',
    customer: { name: 'Sarah Johnson', email: 'sarah@example.com' },
    items: 3,
    total: 299.99,
    status: 'processing' as const,
    paymentStatus: 'paid',
    date: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    orderNumber: 'LUM-2401-DEF456',
    customer: { name: 'Michael Chen', email: 'michael@example.com' },
    items: 1,
    total: 549.00,
    status: 'shipped' as const,
    paymentStatus: 'paid',
    date: '2024-01-15T09:15:00Z',
  },
  {
    id: '3',
    orderNumber: 'LUM-2401-GHI789',
    customer: { name: 'Emily Davis', email: 'emily@example.com' },
    items: 2,
    total: 189.50,
    status: 'delivered' as const,
    paymentStatus: 'paid',
    date: '2024-01-14T16:45:00Z',
  },
  {
    id: '4',
    orderNumber: 'LUM-2401-JKL012',
    customer: { name: 'James Wilson', email: 'james@example.com' },
    items: 5,
    total: 725.00,
    status: 'processing' as const,
    paymentStatus: 'paid',
    date: '2024-01-14T14:20:00Z',
  },
  {
    id: '5',
    orderNumber: 'LUM-2401-MNO345',
    customer: { name: 'Anna Martinez', email: 'anna@example.com' },
    items: 1,
    total: 149.99,
    status: 'cancelled' as const,
    paymentStatus: 'refunded',
    date: '2024-01-14T11:00:00Z',
  },
  {
    id: '6',
    orderNumber: 'LUM-2401-PQR678',
    customer: { name: 'Robert Brown', email: 'robert@example.com' },
    items: 4,
    total: 890.00,
    status: 'shipped' as const,
    paymentStatus: 'paid',
    date: '2024-01-13T15:30:00Z',
  },
]

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

export default function OrdersPage() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [orderDetail, setOrderDetail] = useState<(typeof orders)[0] | null>(null)

  const handleSearch = (query: string) => {
    console.log('Search:', query)
  }

  const handleFilterChange = (filters: Record<string, string>) => {
    console.log('Filters:', filters)
  }

  const columns = [
    {
      key: 'order',
      title: 'Order',
      render: (order: (typeof orders)[0]) => (
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setOrderDetail(order)
            }}
            className="font-medium text-charcoal hover:text-gold transition-colors"
          >
            {order.orderNumber}
          </button>
          <p className="text-xs text-warm-gray-dark">
            {new Date(order.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (order: (typeof orders)[0]) => (
        <div>
          <p className="text-sm font-medium text-charcoal">{order.customer.name}</p>
          <p className="text-xs text-warm-gray-dark">{order.customer.email}</p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'items',
      title: 'Items',
      render: (order: (typeof orders)[0]) => (
        <span className="text-charcoal">{order.items}</span>
      ),
    },
    {
      key: 'total',
      title: 'Total',
      render: (order: (typeof orders)[0]) => (
        <span className="font-medium text-charcoal">${order.total.toFixed(2)}</span>
      ),
      sortable: true,
    },
    {
      key: 'payment',
      title: 'Payment',
      render: (order: (typeof orders)[0]) => (
        <span
          className={cn(
            'px-2 py-1 text-xs font-medium rounded-full capitalize',
            order.paymentStatus === 'paid' && 'bg-green-100 text-green-700',
            order.paymentStatus === 'pending' && 'bg-amber-100 text-amber-700',
            order.paymentStatus === 'failed' && 'bg-red-100 text-red-700',
            order.paymentStatus === 'refunded' && 'bg-gray-100 text-gray-700'
          )}
        >
          {order.paymentStatus}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (order: (typeof orders)[0]) => <StatusBadge status={order.status} size="sm" />,
    },
    {
      key: 'actions',
      title: '',
      render: (order: (typeof orders)[0]) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setOrderDetail(order)
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
      className: 'w-24',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Orders</h1>
          <p className="text-warm-gray-dark mt-1">
            Manage and track customer orders
          </p>
        </div>
        <Button variant="secondary">
          <Upload className="w-4 h-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-brand border border-warm-gray p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-charcoal">12</p>
              <p className="text-xs text-warm-gray-dark">Processing</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-brand border border-warm-gray p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-charcoal">28</p>
              <p className="text-xs text-warm-gray-dark">Shipped</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-brand border border-warm-gray p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-charcoal">1,156</p>
              <p className="text-xs text-warm-gray-dark">Delivered</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-brand border border-warm-gray p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-charcoal">23</p>
              <p className="text-xs text-warm-gray-dark">Cancelled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <SearchFilter
        searchPlaceholder="Search orders..."
        onSearchChange={handleSearch}
        filters={[
          { key: 'status', label: 'Status', options: orderStatuses },
          { key: 'payment', label: 'Payment', options: paymentStatuses },
        ]}
        onFilterChange={handleFilterChange}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={orders}
        keyExtractor={(order) => order.id}
        onRowClick={(order) => setOrderDetail(order)}
        selectable
        onSelectionChange={setSelectedOrders}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={50}
        onPageChange={setCurrentPage}
        totalItems={1284}
        itemsPerPage={10}
      />

      {/* Order Detail Drawer */}
      {orderDetail && (
        <OrderDetailDrawer
          order={orderDetail}
          onClose={() => setOrderDetail(null)}
        />
      )}
    </div>
  )
}

// Order Detail Drawer
function OrderDetailDrawer({
  order,
  onClose,
}: {
  order: (typeof orders)[0]
  onClose: () => void
}) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsUpdating(false)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-120 bg-white shadow-xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-warm-gray">
          <div>
            <h2 className="text-lg font-semibold text-charcoal">
              Order {order.orderNumber}
            </h2>
            <p className="text-sm text-warm-gray-dark">
              {new Date(order.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-warm-gray-dark hover:text-charcoal hover:bg-linen rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Status */}
          <div className="bg-linen rounded-brand p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-warm-gray-dark">Order Status</p>
                <div className="mt-1">
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-warm-gray-dark">Payment</p>
                <span
                  className={cn(
                    'inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full capitalize',
                    order.paymentStatus === 'paid' && 'bg-green-100 text-green-700',
                    order.paymentStatus === 'refunded' && 'bg-gray-100 text-gray-700'
                  )}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="text-sm font-semibold text-charcoal mb-3">Customer</h3>
            <div className="flex items-center gap-3 p-3 bg-white border border-warm-gray rounded-brand">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <span className="text-gold font-semibold text-sm">
                  {order.customer.name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-charcoal">{order.customer.name}</p>
                <p className="text-sm text-warm-gray-dark">{order.customer.email}</p>
              </div>
              <button className="p-2 text-warm-gray-dark hover:text-gold hover:bg-linen rounded-lg transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-sm font-semibold text-charcoal mb-3">Shipping Address</h3>
            <div className="p-3 bg-white border border-warm-gray rounded-brand">
              <p className="text-sm text-charcoal">{order.customer.name}</p>
              <p className="text-sm text-warm-gray-dark mt-1">
                123 Main Street, Apt 4B<br />
                New York, NY 10001<br />
                United States
              </p>
              <p className="text-sm text-warm-gray-dark mt-2">+1 (555) 123-4567</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-semibold text-charcoal mb-3">
              Order Items ({order.items})
            </h3>
            <div className="space-y-3">
              {/* Mock items */}
              {[
                { name: 'Lumina Pendant Light', variant: 'Brass', qty: 1, price: 199.99 },
                { name: 'Ceramic Vase Set', variant: 'White', qty: 2, price: 49.99 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white border border-warm-gray rounded-brand"
                >
                  <div className="w-14 h-14 rounded-lg bg-linen shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal truncate">{item.name}</p>
                    <p className="text-xs text-warm-gray-dark">
                      {item.variant} • Qty: {item.qty}
                    </p>
                  </div>
                  <p className="font-medium text-charcoal">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-sm font-semibold text-charcoal mb-3">Order Summary</h3>
            <div className="p-4 bg-white border border-warm-gray rounded-brand space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-warm-gray-dark">Subtotal</span>
                <span className="text-charcoal">${(order.total - 15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-warm-gray-dark">Shipping</span>
                <span className="text-charcoal">$15.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-warm-gray-dark">Tax</span>
                <span className="text-charcoal">$0.00</span>
              </div>
              <div className="border-t border-warm-gray-light pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Total</span>
                  <span className="font-semibold text-charcoal">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-charcoal mb-3">Order Timeline</h3>
            <div className="space-y-4">
              {[
                { status: 'Order placed', date: order.date, completed: true },
                { status: 'Payment confirmed', date: order.date, completed: true },
                { status: 'Processing', date: order.date, completed: order.status !== 'processing' },
                { status: 'Shipped', date: null, completed: order.status === 'shipped' || order.status === 'delivered' },
                { status: 'Delivered', date: null, completed: order.status === 'delivered' },
              ].map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full',
                        step.completed ? 'bg-green-500' : 'bg-warm-gray-light'
                      )}
                    />
                    {index < 4 && (
                      <div
                        className={cn(
                          'w-0.5 h-8 mt-1',
                          step.completed ? 'bg-green-500' : 'bg-warm-gray-light'
                        )}
                      />
                    )}
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        step.completed ? 'text-charcoal' : 'text-warm-gray-dark'
                      )}
                    >
                      {step.status}
                    </p>
                    {step.date && (
                      <p className="text-xs text-warm-gray-dark">
                        {new Date(step.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-warm-gray bg-linen">
          <div className="flex gap-3">
            {order.status === 'processing' && (
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => handleUpdateStatus('shipped')}
                isLoading={isUpdating}
              >
                <Truck className="w-4 h-4 mr-2" />
                Mark as Shipped
              </Button>
            )}
            {order.status === 'shipped' && (
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => handleUpdateStatus('delivered')}
                isLoading={isUpdating}
              >
                <Check className="w-4 h-4 mr-2" />
                Mark as Delivered
              </Button>
            )}
            <Button variant="secondary">
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
