'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { OrderCard } from '@/components/account/OrderCard'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { TOrder } from '@/lib/types'

const filterOptions = [
  { value: 'all', label: 'All Orders' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function OrdersClient({ orders }: { orders: TOrder[] }) {
  const [filter, setFilter] = useState('all')
  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((order) => order.status === filter)

  return (
    <main className="pb-16">
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
          <aside className="hidden lg:block">
            <AccountSidebar />
          </aside>

          <div className="lg:col-span-3">
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
