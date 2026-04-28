import Link from 'next/link'
import { StatsCard } from '@/components/admin/StatsCard'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { getServerSession } from '@/lib/auth-server'
import { AccessDenied } from '@/components/Access-Denied'

import { UserRound, Handbag, Box, CircleDollarSignIcon, Clock, Star, Bell, UserPlus, Plus, Download } from 'lucide-react';

// Mock data - replace with actual data fetching
const stats = {
  totalRevenue: 124500,
  totalOrders: 1284,
  totalUsers: 3420,
  totalProducts: 156,
  pendingOrders: 12,
  pendingReviews: 5,
}

const recentOrders = [
  {
    id: '1',
    orderNumber: 'LUM-2401-ABC123',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    total: 299.99,
    status: 'processing',
    date: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    orderNumber: 'LUM-2401-DEF456',
    customer: 'Michael Chen',
    email: 'michael@example.com',
    total: 549.00,
    status: 'shipped',
    date: '2024-01-15T09:15:00Z',
  },
  {
    id: '3',
    orderNumber: 'LUM-2401-GHI789',
    customer: 'Emily Davis',
    email: 'emily@example.com',
    total: 189.50,
    status: 'delivered',
    date: '2024-01-14T16:45:00Z',
  },
  {
    id: '4',
    orderNumber: 'LUM-2401-JKL012',
    customer: 'James Wilson',
    email: 'james@example.com',
    total: 725.00,
    status: 'processing',
    date: '2024-01-14T14:20:00Z',
  },
  {
    id: '5',
    orderNumber: 'LUM-2401-MNO345',
    customer: 'Anna Martinez',
    email: 'anna@example.com',
    total: 149.99,
    status: 'cancelled',
    date: '2024-01-14T11:00:00Z',
  },
]

const recentActivity = [
  {
    id: '1',
    type: 'order',
    message: 'New order placed by Sarah Johnson',
    time: '5 minutes ago',
  },
  {
    id: '2',
    type: 'review',
    message: 'New 5-star review on "Lumina Pendant Light"',
    time: '15 minutes ago',
  },
  {
    id: '3',
    type: 'user',
    message: 'New user registration: michael@example.com',
    time: '1 hour ago',
  },
  {
    id: '4',
    type: 'product',
    message: 'Product "Velvet Armchair" is low on stock (3 left)',
    time: '2 hours ago',
  },
  {
    id: '5',
    type: 'order',
    message: 'Order #LUM-2401-XYZ shipped',
    time: '3 hours ago',
  },
]

const topProducts = [
  { id: '1', name: 'Lumina Pendant Light', sales: 128, revenue: 25600, image: '/products/pendant.jpg' },
  { id: '2', name: 'Velvet Armchair', sales: 96, revenue: 38400, image: '/products/chair.jpg' },
  { id: '3', name: 'Marble Coffee Table', sales: 84, revenue: 33600, image: '/products/table.jpg' },
  { id: '4', name: 'Ceramic Vase Set', sales: 156, revenue: 12480, image: '/products/vase.jpg' },
  { id: '5', name: 'Linen Throw Pillow', sales: 234, revenue: 11700, image: '/products/pillow.jpg' },
]

export default async function AdminDashboard() {
  const session = await getServerSession()
  if (!session?.user) {
    return (
      <AccessDenied />
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            Welcome back, {session.user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-warm-gray-dark mt-1">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
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
          change={{ value: 12.5, type: 'increase' }}
          icon={<CircleDollarSignIcon className="w-6 h-6 text-gold" />}
          iconBg="bg-gold/10"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          change={{ value: 8.2, type: 'increase' }}
          icon={<Handbag className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change={{ value: 5.1, type: 'increase' }}
          icon={<UserRound className="w-6 h-6 text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          change={{ value: 2.3, type: 'decrease' }}
          icon={<Box className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-100"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/orders?status=processing"
          className="flex items-center gap-3 p-4 bg-white rounded-brand border border-warm-gray hover:border-gold hover:shadow-soft transition-all"
        >
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-charcoal">{stats.pendingOrders}</p>
            <p className="text-xs text-warm-gray-dark">Pending Orders</p>
          </div>
        </Link>

        <Link
          href="/admin/reviews?status=pending"
          className="flex items-center gap-3 p-4 bg-white rounded-brand border border-warm-gray hover:border-gold hover:shadow-soft transition-all"
        >
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Star className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-charcoal">{stats.pendingReviews}</p>
            <p className="text-xs text-warm-gray-dark">Pending Reviews</p>
          </div>
        </Link>

        <Link
          href="/admin/products?stock=low"
          className="flex items-center gap-3 p-4 bg-white rounded-brand border border-warm-gray hover:border-gold hover:shadow-soft transition-all"
        >
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-charcoal">8</p>
            <p className="text-xs text-warm-gray-dark">Low Stock Items</p>
          </div>
        </Link>

        <Link
          href="/admin/users?status=new"
          className="flex items-center gap-3 p-4 bg-white rounded-brand border border-warm-gray hover:border-gold hover:shadow-soft transition-all"
        >
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-charcoal">24</p>
            <p className="text-xs text-warm-gray-dark">New Users Today</p>
          </div>
        </Link>
      </div>

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
                        href={`/admin/orders/${order.id}`}
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
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-brand border border-warm-gray">
          <div className="flex items-center justify-between p-4 border-b border-warm-gray">
            <h2 className="font-semibold text-charcoal">Recent Activity</h2>
            <button className="text-sm text-gold hover:text-gold-dark font-medium">
              View all
            </button>
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
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
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
                        <div className="w-full h-full bg-warm-gray-light" />
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
                      href={`/admin/products/${product.id}/edit`}
                      className="text-sm text-gold hover:text-gold-dark font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
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
