'use client'

import { useState } from 'react'
import Image from 'next/image'
import { StatusBadge } from '../../components/StatusBadge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Printer, X, Mail, Check, Truck } from 'lucide-react'
import { printOrderInvoice } from '../../components/orders/printOrderInvoice'
import type {
  OrderStatus,
  ReturnStatus,
  TAdminOrder,
} from '@/lib/types'

// Order Detail Drawer
export function OrderDetailDrawer({
  order,
  onClose,
  onStatusChange,
  onReturnStatusChange,
}: {
  order: TAdminOrder
  onClose: () => void
  onStatusChange: (
    orderId: string,
    status: OrderStatus,
    statusHistory: TAdminOrder['statusHistory']
  ) => void
  onReturnStatusChange: (
    orderId: string,
    returnId: string,
    status: ReturnStatus,
    adminNote?: string
  ) => void
}) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const [returnUpdating, setReturnUpdating] = useState('')
  const [returnError, setReturnError] = useState('')
  const [returnNotes, setReturnNotes] = useState<Record<string, string>>({})

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    setIsUpdating(true)
    setUpdateError('')

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Could not update the order status')
      }

      onStatusChange(order.id, result.status, result.statusHistory)
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Could not update the order status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePrintInvoice = () => {
    setUpdateError('')
    if (!printOrderInvoice(order)) {
      setUpdateError('The invoice window was blocked. Allow pop-ups and try again.')
    }
  }

  const handleReturnStatus = async (returnId: string, status: ReturnStatus) => {
    setReturnUpdating(returnId)
    setReturnError('')

    try {
      const response = await fetch(`/api/admin/returns/${returnId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminNote: returnNotes[returnId],
        }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Could not update the return request')
      }

      onReturnStatusChange(order.id, returnId, result.status, result.adminNote)
    } catch (error) {
      setReturnError(error instanceof Error ? error.message : 'Could not update the return request')
    } finally {
      setReturnUpdating('')
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-text-primary/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-120 bg-white shadow-xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Order {order.orderNumber}
            </h2>
            <p className="text-sm text-border-dark">
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
            className="p-2 text-border-dark hover:text-foreground hover:bg-surface rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Status */}
          <div className="bg-surface rounded-brand p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-border-dark">Order Status</p>
                <div className="mt-1">
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-border-dark">Payment</p>
                <span
                  className={cn(
                    'inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full capitalize',
                    order.paymentStatus === 'paid' && 'bg-success-light text-success-dark',
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
            <h3 className="text-sm font-semibold text-foreground mb-3">Customer</h3>
            <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-brand">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">
                  {order.customer.name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{order.customer.name}</p>
                <p className="text-sm text-border-dark">{order.customer.email}</p>
              </div>
              <button className="p-2 text-border-dark hover:text-primary hover:bg-surface rounded-lg transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Shipping Address</h3>
            <div className="p-3 bg-white border border-border rounded-brand">
              <p className="text-sm text-foreground">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p className="text-sm text-border-dark mt-1">
                {order.shippingAddress.street}
                {order.shippingAddress.apartment ? `, ${order.shippingAddress.apartment}` : ''}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}
              </p>
              <p className="text-sm text-border-dark mt-2">{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Order Items ({order.items})
            </h3>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-white border border-border rounded-brand"
                >
                  <div className="relative w-14 h-14 rounded-lg bg-surface overflow-hidden shrink-0">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-border-dark">
                      {item.variant ? `${item.variant} • ` : ''}Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Order Summary</h3>
            <div className="p-4 bg-white border border-border rounded-brand space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-border-dark">Subtotal</span>
                <span className="text-foreground">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-border-dark">Shipping</span>
                <span className="text-foreground">
                  {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-border-dark">Tax</span>
                <span className="text-foreground">${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border-light pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-semibold text-foreground">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Return Requests */}
          {order.returnRequests.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Return Requests ({order.returnRequests.length})
              </h3>
              <div className="space-y-3">
                {order.returnRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-brand border border-border bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{request.returnNumber}</p>
                        <p className="text-xs text-border-dark">
                          {new Date(request.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className={cn(
                        'rounded-full px-2 py-1 text-xs font-medium capitalize',
                        request.status === 'pending' && 'bg-amber-100 text-amber-700',
                        request.status === 'approved' && 'bg-primary-100 text-primary-700',
                        request.status === 'rejected' && 'bg-red-100 text-red-700',
                        request.status === 'received' && 'bg-success-light text-success-dark'
                      )}>
                        {request.status}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {request.items.map((item) => (
                        <div key={item.orderItemId} className="rounded-lg bg-surface p-3 text-sm">
                          <div className="flex justify-between gap-3">
                            <span className="font-medium text-foreground">{item.productName}</span>
                            <span className="text-foreground">Qty: {item.quantity}</span>
                          </div>
                          <p className="mt-1 text-xs text-border-dark">{item.reason}</p>
                        </div>
                      ))}
                    </div>

                    {(request.status === 'pending' || request.status === 'approved') && (
                      <div className="mt-3">
                        <textarea
                          rows={2}
                          value={returnNotes[request.id] ?? request.adminNote ?? ''}
                          onChange={(event) => setReturnNotes((current) => ({
                            ...current,
                            [request.id]: event.target.value,
                          }))}
                          placeholder="Optional note for this return"
                          className="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm"
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                          {request.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleReturnStatus(request.id, 'approved')}
                                isLoading={returnUpdating === request.id}
                              >
                                Approve Return
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleReturnStatus(request.id, 'rejected')}
                                disabled={Boolean(returnUpdating)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => handleReturnStatus(request.id, 'received')}
                              isLoading={returnUpdating === request.id}
                            >
                              Mark Items Received
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {returnError && (
                <p className="mt-3 text-sm text-red-600">{returnError}</p>
              )}
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Order Timeline</h3>
            <div className="space-y-4">
              {[
                { status: 'Order placed', date: order.date },
                ...order.statusHistory.map((entry) => ({
                  status: entry.status.charAt(0).toUpperCase() + entry.status.slice(1),
                  date: entry.date,
                })),
              ].map((step, index, timeline) => (
                <div key={`${step.status}-${step.date}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full',
                        'bg-success'
                      )}
                    />
                    {index < timeline.length - 1 && (
                      <div
                        className={cn(
                          'w-0.5 h-8 mt-1',
                          'bg-success'
                        )}
                      />
                    )}
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        'text-foreground'
                      )}
                    >
                      {step.status}
                    </p>
                    <p className="text-xs text-border-dark">
                      {new Date(step.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-surface">
          {updateError && (
            <p className="mb-3 text-sm text-red-600">{updateError}</p>
          )}
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
            <Button variant="secondary" onClick={handlePrintInvoice}>
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}