// app/account/orders/[slug]/page.tsx
'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Copy,
  ExternalLink,
  MapPin,
  CreditCard,
  Receipt,
  HelpCircle,
  RotateCcw,
  Download,
  Loader2,
} from 'lucide-react'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { generateInvoicePDF } from '@/components/account/order/generateInvoicePDF'
import { ReturnItemsContent } from '@/components/account/order/ReturnItemsContent'
import { Modal } from '@/components/account/order/Modal'
import { CancelOrderContent } from '@/components/account/order/CancelOrderContent'
import { HelpContent } from '@/components/account/order/HelpContent'

import type { OrderStatus } from '@/lib/types'

// Mock orders data
const orders = [
  {
    id: '1',
    orderNumber: 'LUM-12345678',
    date: 'Dec 15, 2024',
    dateRaw: '2024-12-15',
    status: 'shipped' as const,
    total: 329.98,
    trackingNumber: '1Z999AA10123456784',
    carrier: 'UPS',
    estimatedDelivery: 'Dec 18-20, 2024',
    items: [
      {
        id: '1',
        product: {
          id: '1',
          name: 'Wireless Noise-Canceling Headphones',
          images: [{ secure_url: '/3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp', public_id: '3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp' }],
          price: 249.99,
          color: 'Matte Black',
          size: null,
          sku: 'WNC-HP-001',
        },
        quantity: 1,
      },
      {
        id: '2',
        product: {
          id: '3',
          name: 'Organic Cotton Throw Blanket',
          images: [{ secure_url: '/3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp', public_id: '3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp' }],
          price: 79.99,
          color: 'Oatmeal',
          size: '50" x 60"',
          sku: 'OCT-BL-003',
        },
        quantity: 1,
      },
    ],
    shippingAddress: {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      street: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '(555) 123-4567',
      isDefault: true,
    },
    billingAddress: {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      street: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
    },
    paymentMethod: {
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2026,
    },
    subtotal: 329.98,
    shipping: 0,
    tax: 26.40,
    discount: 0,
    timeline: [
      { status: 'ordered', date: 'Dec 15, 2024 at 2:30 PM', completed: true },
      { status: 'confirmed', date: 'Dec 15, 2024 at 2:32 PM', completed: true },
      { status: 'processing', date: 'Dec 15, 2024 at 4:00 PM', completed: true },
      { status: 'shipped', date: 'Dec 16, 2024 at 9:15 AM', completed: true },
      { status: 'delivered', date: 'Expected Dec 18-20', completed: false },
    ],
  },
  {
    id: '2',
    orderNumber: 'LUM-12345679',
    date: 'Dec 10, 2024',
    dateRaw: '2024-12-10',
    status: 'delivered' as const,
    total: 189.99,
    trackingNumber: '1Z999AA10123456785',
    carrier: 'FedEx',
    deliveredDate: 'Dec 13, 2024',
    items: [
      {
        id: '3',
        product: {
          id: '2',
          name: 'Premium Leather Watch',
          images: [
            {
              secure_url: '/3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp',
              public_id: '3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp'
            }],
          price: 189.99,
          color: 'Brown Leather',
          size: null,
          sku: 'PLW-WT-002',
        },
        quantity: 1,
      },
    ],
    shippingAddress: {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      street: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '(555) 123-4567',
      isDefault: true,
    },
    billingAddress: {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      street: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
    },
    paymentMethod: {
      type: 'card',
      brand: 'Mastercard',
      last4: '8888',
      expiryMonth: 6,
      expiryYear: 2025,
    },
    subtotal: 189.99,
    shipping: 0,
    tax: 15.20,
    discount: 0,
    timeline: [
      { status: 'ordered', date: 'Dec 10, 2024 at 10:00 AM', completed: true },
      { status: 'confirmed', date: 'Dec 10, 2024 at 10:02 AM', completed: true },
      { status: 'processing', date: 'Dec 10, 2024 at 11:30 AM', completed: true },
      { status: 'shipped', date: 'Dec 11, 2024 at 8:00 AM', completed: true },
      { status: 'delivered', date: 'Dec 13, 2024 at 3:45 PM', completed: true },
    ],
  },
  {
    id: '3',
    orderNumber: 'LUM-12345680',
    date: 'Nov 28, 2024',
    dateRaw: '2024-11-28',
    status: 'processing' as const,
    total: 129.99,
    items: [
      {
        id: '4',
        product: {
          id: '4',
          name: 'Smart Home Speaker',
          images: [
            {
              secure_url: '/3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp',
              public_id: '3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp'
            },
          ],
          price: 129.99,
          color: 'Charcoal Gray',
          size: null,
          sku: 'SHS-SP-004',
        },
        quantity: 1,
      },
    ],
    shippingAddress: {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      street: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '(555) 123-4567',
      isDefault: true,
    },
    billingAddress: {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      street: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
    },
    paymentMethod: {
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2026,
    },
    subtotal: 129.99,
    shipping: 5.99,
    tax: 10.40,
    discount: 0,
    timeline: [
      { status: 'ordered', date: 'Nov 28, 2024 at 5:00 PM', completed: true },
      { status: 'confirmed', date: 'Nov 28, 2024 at 5:02 PM', completed: true },
      { status: 'processing', date: 'Nov 28, 2024 at 6:30 PM', completed: true },
      { status: 'shipped', date: 'Pending', completed: false },
      { status: 'delivered', date: 'Pending', completed: false },
    ],
  },
]

const statusConfig: Record<OrderStatus, {
  label: string
  color: string
  bgColor: string
  icon: React.ComponentType<{ className?: string }>
}> = {
  processing: {
    label: 'Processing',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    icon: Clock,
  },
  shipped: {
    label: 'Shipped',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    icon: XCircle,
  },
}

const timelineStatusConfig: Record<string, {
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = {
  ordered: { label: 'Order Placed', icon: Receipt },
  confirmed: { label: 'Order Confirmed', icon: CheckCircle },
  processing: { label: 'Processing', icon: Package },
  shipped: { label: 'Shipped', icon: Truck },
  delivered: { label: 'Delivered', icon: CheckCircle },
}

export default function OrderDetailsPage() {
  const params = useParams()
  const [copiedTracking, setCopiedTracking] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Modal states
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  // Find order by order number (slug)
  const order = orders.find(o => o.id === params.id)

  if (!order) {
    return (
      <main className="pb-16">
        <div className="container-lumina py-4">
          <Breadcrumb
            items={[
              { label: 'My Account', href: '/account' },
              { label: 'Orders', href: '/account/orders' },
              { label: 'Order Not Found' },
            ]}
          />
        </div>

        <div className="container-lumina">
          <div className="text-center py-16 bg-linen rounded-brand">
            <Package className="w-16 h-16 text-warm-gray-dark mx-auto mb-4" />
            <h2 className="font-serif text-xl text-charcoal mb-2">
              Order Not Found
            </h2>
            <p className="text-warm-gray-dark mb-6">
              We couldn&apos;t find an order with that number.
            </p>
            <Link href="/account/orders">
              <Button>View All Orders</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const status = statusConfig[order.status]
  const StatusIcon = status.icon

  const handleCopyTracking = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber)
      setCopiedTracking(true)
      setTimeout(() => setCopiedTracking(false), 2000)
    }
  }

  const handleDownloadInvoice = async () => {
    setIsDownloading(true)
    // Small delay for UX feedback
    await new Promise(resolve => setTimeout(resolve, 500))
    generateInvoicePDF(order)
    setIsDownloading(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="container-lumina py-4">
        <Breadcrumb
          items={[
            { label: 'My Account', href: '/account' },
            { label: 'Orders', href: '/account/orders' },
            { label: order.orderNumber },
          ]}
        />
      </div>

      <div className="container-lumina">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <AccountSidebar />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl lg:text-3xl text-charcoal">
                  Order {order.orderNumber}
                </h1>
                <p className="text-warm-gray-dark mt-1">
                  Placed on {order.date}
                </p>
              </div>

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.bgColor}`}>
                <StatusIcon className={`w-4 h-4 ${status.color}`} />
                <span className={`text-sm font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>

            {/* Tracking Information */}
            {order.trackingNumber && (
              <div className="bg-linen rounded-brand p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="font-medium text-charcoal mb-1">
                      Tracking Information
                    </h2>
                    <div className="flex items-center gap-2 text-warm-gray-dark">
                      <span>{order.carrier}</span>
                      <span>•</span>
                      <span className="font-mono text-sm">{order.trackingNumber}</span>
                      <button
                        onClick={handleCopyTracking}
                        className="p-1 hover:bg-warm-gray-light rounded transition-colors"
                        title="Copy tracking number"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {copiedTracking && (
                        <span className="text-xs text-green-600">Copied!</span>
                      )}
                    </div>
                    {order.estimatedDelivery && order.status === 'shipped' && (
                      <p className="text-sm text-warm-gray-dark mt-1">
                        Estimated delivery: {order.estimatedDelivery}
                      </p>
                    )}
                    {order.deliveredDate && order.status === 'delivered' && (
                      <p className="text-sm text-green-700 mt-1">
                        Delivered on {order.deliveredDate}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => window.open(`https://www.ups.com/track?tracknum=${order.trackingNumber}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Track Package
                  </Button>
                </div>
              </div>
            )}

            {/* Order Timeline */}
            <div className="bg-white border border-warm-gray-light rounded-brand p-6">
              <h2 className="font-serif text-lg text-charcoal mb-6">
                Order Timeline
              </h2>
              <div className="relative">
                {order.timeline?.map((event, index) => {
                  const config = timelineStatusConfig[event.status]
                  const Icon = config.icon
                  const isLast = index === (order.timeline?.length ?? 0) - 1

                  return (
                    <div key={event.status} className="flex gap-4">
                      {/* Timeline Line & Dot */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${event.completed
                            ? 'bg-gold text-white'
                            : 'bg-warm-gray-light text-warm-gray-dark'
                            }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {!isLast && (
                          <div
                            className={`w-0.5 h-12 ${event.completed ? 'bg-gold' : 'bg-warm-gray-light'
                              }`}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pb-8">
                        <p
                          className={`font-medium ${event.completed ? 'text-charcoal' : 'text-warm-gray-dark'
                            }`}
                        >
                          {config.label}
                        </p>
                        <p className="text-sm text-warm-gray-dark">
                          {event.date}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-warm-gray-light rounded-brand overflow-hidden">
              <div className="p-6 border-b border-warm-gray-light">
                <h2 className="font-serif text-lg text-charcoal">
                  Items ({order.items.length})
                </h2>
              </div>

              <div className="divide-y divide-warm-gray-light">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-linen rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.product.images[0].secure_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium text-charcoal hover:text-gold transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <div className="mt-1 text-sm text-warm-gray-dark space-y-0.5">
                        {item.product.color && (
                          <p>Color: {item.product.color}</p>
                        )}
                        {item.product.size && (
                          <p>Size: {item.product.size}</p>
                        )}
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-medium text-charcoal">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-warm-gray-dark">
                          {formatPrice(item.product.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="p-6 bg-linen">
                <div className="space-y-2">
                  <div className="flex justify-between text-warm-gray-dark">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-warm-gray-dark">
                    <span>Shipping</span>
                    <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Discount</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-warm-gray-dark">
                    <span>Tax</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal font-medium text-lg pt-2 border-t border-warm-gray">
                    <span>Total</span>
                    <span>{formatPrice(order.total + order.tax)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="bg-white border border-warm-gray-light rounded-brand p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-gold" />
                  <h2 className="font-serif text-lg text-charcoal">
                    Shipping Address
                  </h2>
                </div>
                <address className="not-italic text-warm-gray-dark leading-relaxed">
                  <p className="font-medium text-charcoal">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.street}</p>
                  {order.shippingAddress.apartment && (
                    <p>{order.shippingAddress.apartment}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="mt-2">{order.shippingAddress.phone}</p>
                  )}
                </address>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-warm-gray-light rounded-brand p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-gold" />
                  <h2 className="font-serif text-lg text-charcoal">
                    Payment Method
                  </h2>
                </div>
                <div className="text-warm-gray-dark">
                  <p className="font-medium text-charcoal">
                    {order.paymentMethod.brand} •••• {order.paymentMethod.last4}
                  </p>
                  <p className="text-sm">
                    Expires {order.paymentMethod.expiryMonth}/{order.paymentMethod.expiryYear}
                  </p>
                </div>

                {/* Billing Address */}
                <div className="mt-4 pt-4 border-t border-warm-gray-light">
                  <p className="text-sm font-medium text-charcoal mb-2">Billing Address</p>
                  <address className="not-italic text-sm text-warm-gray-dark leading-relaxed">
                    <p>
                      {order.billingAddress.firstName} {order.billingAddress.lastName}
                    </p>
                    <p>{order.billingAddress.street}</p>
                    <p>
                      {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}
                    </p>
                  </address>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {order.status === 'delivered' && (
                <>
                  <Button
                    variant="secondary"
                    className="flex items-center justify-center gap-2"
                    onClick={() => setShowReturnModal(true)}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Return Items
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex items-center justify-center gap-2"
                    onClick={() => setShowHelpModal(true)}
                  >
                    <HelpCircle className="w-4 h-4" />
                    Get Help
                  </Button>
                </>
              )}
              {order.status === 'processing' && (
                <Button
                  variant="secondary"
                  className="flex items-center justify-center gap-2"
                  onClick={() => setShowCancelModal(true)}
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Order
                </Button>
              )}
              {order.status === 'shipped' && (
                <Button
                  variant="secondary"
                  className="flex items-center justify-center gap-2"
                  onClick={() => setShowHelpModal(true)}
                >
                  <HelpCircle className="w-4 h-4" />
                  Get Help
                </Button>
              )}
              <Button
                variant="secondary"
                className="flex items-center justify-center gap-2"
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        title="Return Items"
      >
        <ReturnItemsContent
          order={order}
          onClose={() => setShowReturnModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
      >
        <CancelOrderContent
          order={order}
          onClose={() => setShowCancelModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title="Get Help"
      >
        <HelpContent
          order={order}
          onClose={() => setShowHelpModal(false)}
        />
      </Modal>
    </main>
  )
}