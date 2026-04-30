// app/account/orders/page.tsx
'use client'

import { useState } from 'react'
import { Package } from 'lucide-react'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { OrderCard } from '@/components/account/OrderCard'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

// Mock orders data
export const orders = [
  {
    id: '1',
    orderNumber: 'LUM-12345678',
    date: 'Dec 15, 2024',
    status: 'shipped' as const,
    total: 329.98,
    trackingNumber: '1Z999AA10123456784',
    items: [
      {
        id: '1',
        product: {
          id: '1',
          name: 'Wireless Noise-Canceling Headphones',
          price: 249.99,
          variant: {
            id: "",
            attributes: {
              color: "",
              size: "",
              material: "",
            },
            price: 0,
            originalPrice: 0,
            quantity: 5,
            sku: "",
            images: [
              {
                secure_url: '/3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp',
                public_id: '3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp'
              }
            ],
          }
        },
        quantity: 1,
      },
      {
        id: '2',
        product: {
          id: '3',
          name: 'Organic Cotton Throw Blanket',
          price: 79.99,
          variant: {
            id: "",
            attributes: {
              color: "",
              size: "",
              material: "",
            },
            price: 0,
            originalPrice: 0,
            quantity: 1,
            sku: "",
            images: [
              {
                secure_url: '/3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp',
                public_id: '3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp'
              }
            ],
          }
        },
        quantity: 1,
      },
    ],
    shippingAddress: {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '(555) 123-4567',
      isDefault: true,
    },
    subtotal: 329.98,
    shipping: 0,
    tax: 26.40,
  },
  {
    id: '2',
    orderNumber: 'LUM-12345679',
    date: 'Dec 10, 2024',
    status: 'delivered' as const,
    total: 189.99,
    items: [
      {
        id: '3',
        product: {
          id: '2',
          name: 'Premium Leather Watch',
          price: 189.99,
          variant: {
            id: "",
            attributes: {
              color: "",
              size: "",
              material: "",
            },
            price: 0,
            originalPrice: 0,
            quantity: 3,
            sku: "",
            images: [
              {
                secure_url: '/3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp',
                public_id: '3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp'
              }
            ],
          }
        },
        quantity: 1,
      },
    ],
    shippingAddress: {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '(555) 123-4567',
      isDefault: true,
    },
    subtotal: 189.99,
    shipping: 0,
    tax: 15.20,
  },
  {
    id: '3',
    orderNumber: 'LUM-12345680',
    date: 'Nov 28, 2024',
    status: 'processing' as const,
    total: 129.99,
    items: [
      {
        id: '4',
        product: {
          id: '4',
          name: 'Smart Home Speaker',
          price: 129.99,
          variant: {
            id: "",
            attributes: {
              color: "",
              size: "",
              material: "",
            },
            price: 0,
            originalPrice: 0,
            quantity: 1,
            sku: "",
            images: [
              {
                secure_url: '/3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp',
                public_id: '3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp'
              }
            ],
          }
        },
        quantity: 1,
      },
    ],
    shippingAddress: {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '(555) 123-4567',
      isDefault: true,
    },
    subtotal: 129.99,
    shipping: 5.99,
    tax: 10.40,
  },
];

const filterOptions = [
  { value: 'all', label: 'All Orders' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function OrdersPage() {
  const [filter, setFilter] = useState('all')

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter)

  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="container-lumina py-4">
        <Breadcrumb
          items={[
            { label: 'My Account', href: '/account' },
            { label: 'Orders' },
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
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="font-serif text-2xl lg:text-3xl text-charcoal">
                My Orders
              </h1>
              <Select
                options={filterOptions}
                value={filter}
                onChange={setFilter}
                className="w-full sm:w-48"
              />
            </div>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-linen rounded-brand">
                <Package className="w-16 h-16 text-warm-gray-dark mx-auto mb-4" />
                <h2 className="font-serif text-xl text-charcoal mb-2">
                  No orders found
                </h2>
                <p className="text-warm-gray-dark mb-6">
                  {filter === 'all'
                    ? "You haven't placed any orders yet."
                    : `No ${filter} orders found.`}
                </p>
                <Link href="/products">
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}