import Link from 'next/link'
import { StatsCard } from '@/components/admin/StatsCard'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { getServerSession } from '@/lib/auth-server'
import { AccessDenied } from '@/components/Access-Denied'
import { getAdminDashboardData } from '@/lib/queries/get.admin.dashboard'

import { UserRound, Handbag, Box, CircleDollarSignIcon, Clock, Star, Bell, Plus, ArrowRight, PackageX } from 'lucide-react';

function formatRelativeTime(date: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000))
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export default async function AdminDashboard() {
  const session = await getServerSession()
  if (!session?.user) {
    return (
      <AccessDenied />
    )
  }

  const { stats, orderStatuses, recentOrders, recentActivity, topProducts } = await getAdminDashboardData()
  const maxOrderStatus = Math.max(...Object.values(orderStatuses), 1)
  const attentionCount = stats.pendingOrders + stats.pendingReviews + stats.lowStockItems + stats.outOfStockItems

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            Welcome back, {session.user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-warm-gray-dark mt-1">
            Your store overview for {new Intl.DateTimeFormat('en-CA', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-2 text-xs text-warm-gray-dark">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Live store data
          </span>
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          description={`$${stats.monthRevenue.toLocaleString()} this month`}
          icon={<CircleDollarSignIcon className="w-6 h-6 text-gold" />}
          iconBg="bg-gold/10"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          description={`${stats.ordersToday} placed today`}
          icon={<Handbag className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          description={`${stats.newUsersToday} joined today`}
          icon={<UserRound className="w-6 h-6 text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          description={`${stats.outOfStockItems} currently out of stock`}
          icon={<Box className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-100"
        />
      </div>

      {/* Attention queue */}
      <section className="space-y-3" aria-labelledby="attention-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="attention-heading" className="text-lg font-semibold text-charcoal">Needs attention</h2>
            <p className="text-sm text-warm-gray-dark">Tasks that may need an admin decision.</p>
          </div>
          <span className="text-sm font-medium text-charcoal">{attentionCount} open</span>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Link
          href="/admin/orders?status=processing"
          className="group flex items-center gap-3 p-4 bg-white rounded-brand border border-warm-gray hover:border-amber-400 hover:shadow-soft transition-all"
        >
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-semibold text-charcoal">{stats.pendingOrders}</p>
            <p className="text-xs text-warm-gray-dark">Orders to process</p>
          </div>
          <ArrowRight className="w-4 h-4 text-warm-gray-dark group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/admin/reviews?status=pending"
          className="group flex items-center gap-3 p-4 bg-white rounded-brand border border-warm-gray hover:border-orange-400 hover:shadow-soft transition-all"
        >
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Star className="w-5 h-5 text-orange-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-semibold text-charcoal">{stats.pendingReviews}</p>
            <p className="text-xs text-warm-gray-dark">Reviews to moderate</p>
          </div>
          <ArrowRight className="w-4 h-4 text-warm-gray-dark group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/admin/products?stock=low"
          className="group flex items-center gap-3 p-4 bg-white rounded-brand border border-warm-gray hover:border-red-400 hover:shadow-soft transition-all"
        >
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-red-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-semibold text-charcoal">{stats.lowStockItems}</p>
            <p className="text-xs text-warm-gray-dark">Products running low</p>
          </div>
          <ArrowRight className="w-4 h-4 text-warm-gray-dark group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/admin/products?stock=out"
          className="group flex items-center gap-3 p-4 bg-white rounded-brand border border-warm-gray hover:border-red-500 hover:shadow-soft transition-all"
        >
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <PackageX className="w-5 h-5 text-red-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-semibold text-charcoal">{stats.outOfStockItems}</p>
            <p className="text-xs text-warm-gray-dark">Products out of stock</p>
          </div>
          <ArrowRight className="w-4 h-4 text-warm-gray-dark group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-brand border border-warm-gray">
          <div className="flex items-center justify-between p-4 border-b border-warm-gray">
            <h2 className="font-semibold text-charcoal">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-gold hover:text-gold-dark font-medium"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-warm-gray-light">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-warm-gray-dark uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-warm-gray-dark uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-warm-gray-dark uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-warm-gray-dark uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-gray-light">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-linen/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href="/admin/orders"
                        className="text-sm font-medium text-charcoal hover:text-gold"
                      >
                        {order.orderNumber}
                      </Link>
                      <p className="text-xs text-warm-gray-dark">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-charcoal">{order.customer}</p>
                      <p className="text-xs text-warm-gray-dark">{order.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-charcoal">
                        ${order.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-warm-gray-dark">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
        {/* Fulfillment snapshot */}
        <div className="bg-white rounded-brand border border-warm-gray">
          <div className="p-4 border-b border-warm-gray">
            <h2 className="font-semibold text-charcoal">Order fulfillment</h2>
            <p className="text-xs text-warm-gray-dark mt-0.5">All-time order status</p>
          </div>
          <div className="p-4 space-y-3">
            {Object.entries(orderStatuses).map(([status, count]) => (
              <div key={status}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="capitalize text-charcoal">{status}</span>
                  <span className="font-semibold text-charcoal">{count}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-linen">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      status === 'processing' && 'bg-blue-500',
                      status === 'shipped' && 'bg-amber-500',
                      status === 'delivered' && 'bg-green-500',
                      status === 'cancelled' && 'bg-red-400'
                    )}
                    style={{ width: `${(count / maxOrderStatus) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-brand border border-warm-gray">
          <div className="flex items-center justify-between p-4 border-b border-warm-gray">
            <h2 className="font-semibold text-charcoal">Recent Activity</h2>
            <span className="text-xs text-warm-gray-dark">Latest 5</span>
          </div>
          <div className="p-4 space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    activity.type === 'order' && 'bg-blue-100',
                    activity.type === 'review' && 'bg-amber-100',
                    activity.type === 'user' && 'bg-green-100',
                    activity.type === 'product' && 'bg-red-100'
                  )}
                >
                  {activity.type === 'order' && (
                    <Handbag className="w-4 h-4 text-blue-600" />
                  )}
                  {activity.type === 'review' && (
                    <Star className="w-4 h-4 text-amber-600" />
                  )}
                  {activity.type === 'user' && (
                    <UserRound className="w-4 h-4 text-green-600" />
                  )}
                  {activity.type === 'product' && (
                    <Bell className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-charcoal">{activity.message}</p>
                  <p className="text-xs text-warm-gray-dark mt-0.5">
                    {formatRelativeTime(activity.date)}
                  </p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="py-4 text-center text-sm text-warm-gray-dark">No recent activity.</p>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-brand border border-warm-gray">
        <div className="flex items-center justify-between p-4 border-b border-warm-gray">
          <h2 className="font-semibold text-charcoal">Top Selling Products</h2>
          <Link
            href="/admin/products"
            className="text-sm text-gold hover:text-gold-dark font-medium"
          >
            View all products
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-warm-gray-light">
                <th className="px-4 py-3 text-left text-xs font-semibold text-warm-gray-dark uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-warm-gray-dark uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-warm-gray-dark uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-warm-gray-dark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-gray-light">
              {topProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-linen/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-warm-gray-dark w-6">
                        #{index + 1}
                      </span>
                      <div className="w-10 h-10 rounded-lg bg-linen shrink-0 overflow-hidden">
                        {product.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-warm-gray-light" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-charcoal">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-charcoal">{product.sales} units</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-charcoal">
                      ${product.revenue.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-sm text-gold hover:text-gold-dark font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {topProducts.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-warm-gray-dark">No product sales yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Order Status Badge Component
function OrderStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    processing: { label: 'Processing', className: 'bg-blue-100 text-blue-700' },
    shipped: { label: 'Shipped', className: 'bg-amber-100 text-amber-700' },
    delivered: { label: 'Delivered', className: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
  }

  const { label, className } = config[status] || config.processing

  return (
    <span className={cn('px-2 py-1 text-xs font-medium rounded-full', className)}>
      {label}
    </span>
  )
}
