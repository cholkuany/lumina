// app/account/page.tsx
import Link from 'next/link'
import { Package, MapPin, Heart, CreditCard, ChevronRight } from 'lucide-react'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { OrderCard } from '@/components/account/OrderCard'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Order, LoginUser } from '@/lib/types'
import Image from 'next/image'

import { getServerSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

// Mock recent orders
const recentOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'LUM-12345678',
    date: 'Dec 15, 2024',
    status: 'shipped' as const,
    total: 329.98,
    items: [
      {
        id: '1',
        product: {
          id: '1',
          name: 'Wireless Noise-Canceling Headphones',
          images: ['/images/products/headphones.jpg'],
          price: 249.99
        },
        quantity: 1,
      },
    ],
    subtotal: 329.98,
    shipping: 57697857,
    tax: 67800,
    shippingAddress: {
      id: "33",
      firstName: "John",
      lastName: "Smith",
      street: "1001 Main Street",
      city: "London",
      state: "Ontario",
      zipCode: "T4R 3G7",
      country: "Canada",
      phone: "444-000-5555",
      isDefault: true
    },
    trackingNumber: 'LUM-4576-TR'
  },
]

const quickActions = [
  { icon: Package, label: 'Orders', href: '/account/orders', count: 5 },
  { icon: MapPin, label: 'Addresses', href: '/account/addresses', count: 2 },
  { icon: Heart, label: 'Wishlist', href: '/wishlist', count: 8 },
  { icon: CreditCard, label: 'Payment', href: '/account/payment-methods', count: 1 },
]

export default async function AccountPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }
  const userSession: LoginUser = session.user as LoginUser;
  const [firstName, lastName] = userSession.name ? userSession.name.split(" ") : ["User", ""];
  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="container-lumina py-4">
        <Breadcrumb items={[{ label: 'My Account' }]} />
      </div>

      <div className="container-lumina">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <AccountSidebar />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div className="bg-linen rounded-brand p-6 lg:p-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-white text-xl font-serif font-semibold">
                  {
                    userSession.image ? (
                      <Image
                        src={userSession.image}
                        alt={userSession.name || 'User Avatar'}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) :
                      firstName.charAt(0).toLocaleUpperCase() + lastName.charAt(0).toLocaleUpperCase()
                  }
                </div>
                <div>
                  <h1 className="font-serif text-2xl text-charcoal">
                    Welcome back, {firstName}!
                  </h1>
                  <p className="text-warm-gray-dark">
                    Member since {userSession.createdAt.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="font-serif text-xl text-charcoal mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="bg-white border border-warm-gray-light rounded-brand p-4 
                               hover:border-gold hover:shadow-soft transition-all text-center"
                  >
                    <div className="w-12 h-12 bg-linen rounded-full flex items-center justify-center mx-auto mb-3">
                      <action.icon className="w-6 h-6 text-gold" />
                    </div>
                    <p className="font-medium text-charcoal text-sm">{action.label}</p>
                    <p className="text-xs text-warm-gray-dark">{action.count} items</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl text-charcoal">Recent Orders</h2>
                <Link
                  href="/account/orders"
                  className="text-sm text-gold hover:underline flex items-center gap-1 group"
                >
                  View All
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5" />
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-linen rounded-brand">
                  <Package className="w-12 h-12 text-warm-gray-dark mx-auto mb-4" />
                  <p className="text-warm-gray-dark mb-4">No orders yet</p>
                  <Link href="/products">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden">
              <h2 className="font-serif text-xl text-charcoal mb-4">Account Menu</h2>
              <AccountSidebar />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}