import dbConnect from '@/lib/db/connection'
import Order, { type IOrderItem } from '@/lib/db/models/Order'
import ReturnRequest from '@/lib/db/models/ReturnRequest'
import type { AdminOrderStats, TAdminOrder } from '@/lib/types'

function getVariantLabel(item: IOrderItem) {
  if (!item.selectedVariants) return ''
  return [...item.selectedVariants.values()].filter(Boolean).join(' / ')
}

export async function getAdminOrders(): Promise<{
  orders: TAdminOrder[]
  stats: AdminOrderStats
}> {
  await dbConnect()

  const documents = await Order.find().sort({ createdAt: -1 })
  const returnRequests = await ReturnRequest.find({
    order: { $in: documents.map((order) => order._id) },
  }).sort({ createdAt: -1 })
  const returnsByOrder = new Map<string, typeof returnRequests>()

  for (const returnRequest of returnRequests) {
    const orderId = returnRequest.order.toString()
    const existing = returnsByOrder.get(orderId) || []
    existing.push(returnRequest)
    returnsByOrder.set(orderId, existing)
  }
  const stats: AdminOrderStats = {
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  }

  const orders = documents.map<TAdminOrder>((order) => {
    stats[order.status] += 1

    return {
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      customer: {
        name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        email: order.customerEmail || '',
      },
      items: order.items.reduce((sum, item) => sum + item.quantity, 0),
      orderItems: order.items.map((item) => ({
        id: item._id?.toString() || `${item.product.toString()}-${item.variant?.toString() || ''}`,
        productId: item.product.toString(),
        name: item.productSnapshot.name,
        variant: getVariantLabel(item),
        quantity: item.quantity,
        price: item.productSnapshot.price,
        image: item.productSnapshot.image,
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      discount: order.discount,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      date: order.createdAt.toISOString(),
      shippingAddress: {
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        street: order.shippingAddress.street,
        apartment: order.shippingAddress.apartment,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zipCode: order.shippingAddress.zipCode,
        country: order.shippingAddress.country,
        phone: order.shippingAddress.phone,
      },
      statusHistory: order.statusHistory.map((entry) => ({
        status: entry.status,
        date: entry.timestamp.toISOString(),
        note: entry.note,
      })),
      returnRequests: (returnsByOrder.get(order._id.toString()) || []).map((request) => ({
        id: request._id.toString(),
        returnNumber: request.returnNumber,
        status: request.status,
        adminNote: request.adminNote,
        createdAt: request.createdAt.toISOString(),
        items: request.items.map((item) => ({
          orderItemId: item.orderItem.toString(),
          productName: item.productName,
          image: item.image,
          quantity: item.quantity,
          reason: item.reason,
        })),
      })),
    }
  })

  return { orders, stats }
}
