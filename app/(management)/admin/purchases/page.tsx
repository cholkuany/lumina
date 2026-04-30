'use client'

import { useState } from 'react'
// import Link from 'next/link'
import { DataTable } from '@/components/admin/DataTable'
import { SearchFilter } from '@/components/admin/SearchFilter'
import { Pagination } from '@/components/admin/Pagination'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

import { Clipboard, Box, Truck, Check, CircleDollarSign, Plus, Upload, Printer, Mail, Building, Download, X, Eye } from 'lucide-react'

// Mock data - Purchases from suppliers/vendors
const purchases = [
  {
    id: '1',
    purchaseNumber: 'PO-2401-001',
    supplier: { name: 'Nordic Furniture Co.', email: 'orders@nordicfurniture.com' },
    items: 25,
    total: 12500.00,
    status: 'received' as const,
    expectedDate: '2024-01-20',
    receivedDate: '2024-01-18',
    date: '2024-01-10T10:30:00Z',
  },
  {
    id: '2',
    purchaseNumber: 'PO-2401-002',
    supplier: { name: 'Lumina Lighting Ltd.', email: 'wholesale@luminalighting.com' },
    items: 50,
    total: 8750.00,
    status: 'in_transit' as const,
    expectedDate: '2024-01-25',
    receivedDate: null,
    date: '2024-01-12T14:15:00Z',
  },
  {
    id: '3',
    purchaseNumber: 'PO-2401-003',
    supplier: { name: 'Artisan Ceramics', email: 'sales@artisanceramics.com' },
    items: 100,
    total: 3200.00,
    status: 'pending' as const,
    expectedDate: '2024-02-01',
    receivedDate: null,
    date: '2024-01-14T09:00:00Z',
  },
  {
    id: '4',
    purchaseNumber: 'PO-2401-004',
    supplier: { name: 'Premium Textiles Inc.', email: 'orders@premiumtextiles.com' },
    items: 200,
    total: 5600.00,
    status: 'ordered' as const,
    expectedDate: '2024-01-30',
    receivedDate: null,
    date: '2024-01-15T11:30:00Z',
  },
  {
    id: '5',
    purchaseNumber: 'PO-2401-005',
    supplier: { name: 'Stone & Marble Works', email: 'info@stonemarbleworks.com' },
    items: 10,
    total: 15000.00,
    status: 'cancelled' as const,
    expectedDate: '2024-01-28',
    receivedDate: null,
    date: '2024-01-08T16:45:00Z',
  },
]

const purchaseStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'ordered', label: 'Ordered' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'received', label: 'Received' },
  { value: 'cancelled', label: 'Cancelled' },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-gray-100 text-gray-700' },
  ordered: { label: 'Ordered', className: 'bg-blue-100 text-blue-700' },
  in_transit: { label: 'In Transit', className: 'bg-amber-100 text-amber-700' },
  received: { label: 'Received', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
}

export default function PurchasesPage() {
  const [selectedPurchases, setSelectedPurchases] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [purchaseDetail, setPurchaseDetail] = useState<(typeof purchases)[0] | null>(null)
  const [cancelModal, setCancelModal] = useState<{ open: boolean; purchaseId?: string }>({
    open: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (query: string) => {
    console.log('Search:', query)
  }

  const handleFilterChange = (filters: Record<string, string>) => {
    console.log('Filters:', filters)
  }

  const handleCancelPurchase = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setCancelModal({ open: false })
  }

  const columns = [
    {
      key: 'purchase',
      title: 'Purchase Order',
      render: (purchase: (typeof purchases)[0]) => (
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setPurchaseDetail(purchase)
            }}
            className="font-medium text-charcoal hover:text-gold transition-colors"
          >
            {purchase.purchaseNumber}
          </button>
          <p className="text-xs text-warm-gray-dark">
            {new Date(purchase.date).toLocaleDateString()}
          </p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'supplier',
      title: 'Supplier',
      render: (purchase: (typeof purchases)[0]) => (
        <div>
          <p className="text-sm font-medium text-charcoal">{purchase.supplier.name}</p>
          <p className="text-xs text-warm-gray-dark">{purchase.supplier.email}</p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'items',
      title: 'Items',
      render: (purchase: (typeof purchases)[0]) => (
        <span className="text-charcoal">{purchase.items}</span>
      ),
    },
    {
      key: 'total',
      title: 'Total',
      render: (purchase: (typeof purchases)[0]) => (
        <span className="font-medium text-charcoal">
          ${purchase.total.toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'expected',
      title: 'Expected',
      render: (purchase: (typeof purchases)[0]) => (
        <span className="text-sm text-warm-gray-dark">
          {new Date(purchase.expectedDate).toLocaleDateString()}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'status',
      title: 'Status',
      render: (purchase: (typeof purchases)[0]) => {
        const config = statusConfig[purchase.status]
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
    },
    {
      key: 'actions',
      title: '',
      render: (purchase: (typeof purchases)[0]) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setPurchaseDetail(purchase)
            }}
            className="p-2 text-warm-gray-dark hover:text-gold hover:bg-linen rounded-lg transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {purchase.status !== 'received' && purchase.status !== 'cancelled' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCancelModal({ open: true, purchaseId: purchase.id })
              }}
              className="p-2 text-warm-gray-dark hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Cancel order"
            >
              <X className="w-4 h-4" />
            </button>
          )}
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
          <h1 className="text-2xl font-semibold text-charcoal">Purchases</h1>
          <p className="text-warm-gray-dark mt-1">
            Manage purchase orders from suppliers
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Upload className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Purchase Order
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white rounded-brand border border-warm-gray p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Clipboard className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-charcoal">3</p>
              <p className="text-xs text-warm-gray-dark">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-brand border border-warm-gray p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Box className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-charcoal">8</p>
              <p className="text-xs text-warm-gray-dark">Ordered</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-brand border border-warm-gray p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-charcoal">5</p>
              <p className="text-xs text-warm-gray-dark">In Transit</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-brand border border-warm-gray p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-charcoal">142</p>
              <p className="text-xs text-warm-gray-dark">Received</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-brand border border-warm-gray p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
              <CircleDollarSign className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-charcoal">$45K</p>
              <p className="text-xs text-warm-gray-dark">This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <SearchFilter
        searchPlaceholder="Search purchases..."
        onSearchChange={handleSearch}
        filters={[
          { key: 'status', label: 'Status', options: purchaseStatuses },
        ]}
        onFilterChange={handleFilterChange}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={purchases}
        keyExtractor={(purchase) => purchase.id}
        onRowClick={(purchase) => setPurchaseDetail(purchase)}
        selectable
        onSelectionChange={setSelectedPurchases}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
        totalItems={158}
        itemsPerPage={10}
      />

      {/* Purchase Detail Drawer */}
      {purchaseDetail && (
        <PurchaseDetailDrawer
          purchase={purchaseDetail}
          onClose={() => setPurchaseDetail(null)}
        />
      )}

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={cancelModal.open}
        onClose={() => setCancelModal({ open: false })}
        onConfirm={handleCancelPurchase}
        title="Cancel Purchase Order"
        message="Are you sure you want to cancel this purchase order? The supplier will be notified."
        confirmLabel="Cancel Order"
        variant="danger"
        isLoading={isLoading}
        action='cancel'
        resource='product'
      />
    </div>
  )
}

// Purchase Detail Drawer
function PurchaseDetailDrawer({
  purchase,
  onClose,
}: {
  purchase: (typeof purchases)[0]
  onClose: () => void
}) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsUpdating(false)
  }

  // Mock purchase items
  const purchaseItems = [
    { name: 'Velvet Armchair - Navy', sku: 'VA-NVY-001', qty: 10, unitPrice: 180, total: 1800 },
    { name: 'Velvet Armchair - Gray', sku: 'VA-GRY-001', qty: 10, unitPrice: 180, total: 1800 },
    { name: 'Wooden Side Table', sku: 'WST-OAK-001', qty: 5, unitPrice: 120, total: 600 },
  ]

  const statusSteps = [
    { status: 'pending', label: 'Order Created', completed: true },
    { status: 'ordered', label: 'Order Confirmed', completed: purchase.status !== 'pending' },
    { status: 'in_transit', label: 'In Transit', completed: purchase.status === 'in_transit' || purchase.status === 'received' },
    { status: 'received', label: 'Received', completed: purchase.status === 'received' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-135 bg-white shadow-xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-warm-gray">
          <div>
            <h2 className="text-lg font-semibold text-charcoal">
              {purchase.purchaseNumber}
            </h2>
            <p className="text-sm text-warm-gray-dark">
              Created on {new Date(purchase.date).toLocaleDateString('en-US', {
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-warm-gray-dark">Status</p>
                <span
                  className={cn(
                    'inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full',
                    statusConfig[purchase.status].className
                  )}
                >
                  {statusConfig[purchase.status].label}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-warm-gray-dark">Expected Delivery</p>
                <p className="font-medium text-charcoal mt-1">
                  {new Date(purchase.expectedDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mt-4">
              {statusSteps.map((step, index) => (
                <div key={step.status} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                        step.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-warm-gray-light text-warm-gray-dark'
                      )}
                    >
                      {step.completed ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="text-xs text-warm-gray-dark mt-1 text-center max-w-15">
                      {step.label}
                    </span>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={cn(
                        'w-12 h-0.5 mx-1 -mt-5',
                        step.completed ? 'bg-green-500' : 'bg-warm-gray-light'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Supplier Info */}
          <div>
            <h3 className="text-sm font-semibold text-charcoal mb-3">Supplier</h3>
            <div className="p-4 bg-white border border-warm-gray rounded-brand">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                    <Building className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">{purchase.supplier.name}</p>
                    <p className="text-sm text-warm-gray-dark">{purchase.supplier.email}</p>
                  </div>
                </div>
                <button className="p-2 text-warm-gray-dark hover:text-gold hover:bg-linen rounded-lg transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-semibold text-charcoal mb-3">
              Items ({purchase.items})
            </h3>
            <div className="space-y-3">
              {purchaseItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white border border-warm-gray rounded-brand"
                >
                  <div className="w-12 h-12 rounded-lg bg-linen shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal truncate">{item.name}</p>
                    <p className="text-xs text-warm-gray-dark">
                      SKU: {item.sku} • Qty: {item.qty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-charcoal">${item.total.toLocaleString()}</p>
                    <p className="text-xs text-warm-gray-dark">${item.unitPrice}/unit</p>
                  </div>
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
                <span className="text-charcoal">${(purchase.total - 500).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-warm-gray-dark">Shipping</span>
                <span className="text-charcoal">$500.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-warm-gray-dark">Tax</span>
                <span className="text-charcoal">$0.00</span>
              </div>
              <div className="border-t border-warm-gray-light pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Total</span>
                  <span className="font-semibold text-charcoal">
                    ${purchase.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm font-semibold text-charcoal mb-3">Notes</h3>
            <div className="p-4 bg-linen rounded-brand">
              <p className="text-sm text-charcoal/80">
                Please ensure all items are inspected upon delivery. Contact supplier immediately
                if any items are damaged or missing.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-warm-gray bg-linen">
          <div className="flex gap-3">
            {purchase.status === 'pending' && (
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => handleUpdateStatus('ordered')}
                isLoading={isUpdating}
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm Order
              </Button>
            )}
            {purchase.status === 'in_transit' && (
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => handleUpdateStatus('received')}
                isLoading={isUpdating}
              >
                <Box className="w-4 h-4 mr-2" />
                Mark as Received
              </Button>
            )}
            <Button variant="secondary">
              <Printer className="w-4 h-4 mr-2" />
              Print PO
            </Button>
            <Button variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
