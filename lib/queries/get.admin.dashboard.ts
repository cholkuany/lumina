import mongoose from 'mongoose'

import dbConnect from '@/lib/db/connection'
import Notification from '@/lib/db/models/Notification'
import Order from '@/lib/db/models/Order'
import Product from '@/lib/db/models/Product'
import Review from '@/lib/db/models/Review'

export async function getAdminDashboardData() {
  await dbConnect()

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1)
  const users = mongoose.connection.db?.collection('user')

  const [revenue, monthRevenue, totalOrders, totalUsers, totalProducts, pendingOrders,
    pendingReviews, lowStockItems, outOfStockItems, newUsersToday, ordersToday,
    orderStatusCounts, orders, notifications, products] =
    await Promise.all([
      Order.aggregate<{ total: number }>([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate<{ total: number }>([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.countDocuments(),
      users?.countDocuments() ?? Promise.resolve(0),
      Product.countDocuments(),
      Order.countDocuments({ status: 'processing' }),
      Review.countDocuments({ status: 'pending' }),
      Product.countDocuments({ variants: { $elemMatch: { stock: { $gt: 0, $lte: 10 } } } }),
      Product.countDocuments({ variants: { $not: { $elemMatch: { stock: { $gt: 0 } } } } }),
      users?.countDocuments({ createdAt: { $gte: startOfToday } }) ?? Promise.resolve(0),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.aggregate<{ _id: string; count: number }>([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
      Notification.find().sort({ createdAt: -1 }).limit(5).lean(),
      Order.aggregate<{
        _id: mongoose.Types.ObjectId; name: string; sales: number; revenue: number; image?: string
      }>([
        { $match: { status: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            name: { $first: '$items.productSnapshot.name' },
            image: { $first: '$items.productSnapshot.image' },
            sales: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.quantity', '$items.productSnapshot.price'] } },
          }
        },
        { $sort: { sales: -1 } },
        { $limit: 5 },
        {
          $project: {
            name: 1,
            sales: 1,
            revenue: 1,
            image: 1,
          }
        },
      ]),
    ])

  const types = { ORDER: 'order', REVIEW: 'review', USER: 'user', SYSTEM: 'product' } as const
  const orderStatuses = { processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
  for (const status of orderStatusCounts) {
    if (status._id in orderStatuses) {
      orderStatuses[status._id as keyof typeof orderStatuses] = status.count
    }
  }

  return {
    stats: {
      totalRevenue: revenue[0]?.total ?? 0,
      monthRevenue: monthRevenue[0]?.total ?? 0,
      totalOrders, totalUsers, totalProducts, pendingOrders, pendingReviews,
      lowStockItems, outOfStockItems, newUsersToday, ordersToday,
    },
    orderStatuses,
    recentOrders: orders.map((order) => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      customer: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      email: order.customerEmail || '',
      total: order.total,
      status: order.status,
      date: order.createdAt.toISOString(),
    })),
    recentActivity: notifications.map((notification) => ({
      id: notification._id.toString(),
      type: types[notification.type],
      message: notification.message,
      date: notification.createdAt.toISOString(),
      link: notification.link,
    })),
    topProducts: products.map((product) => ({
      id: product._id.toString(), name: product.name, sales: product.sales,
      revenue: product.revenue, image: product.image || null,
    })),
  }
}
