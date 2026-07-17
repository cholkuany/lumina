import mongoose from 'mongoose'
import dbConnect from '@/lib/db/connection'
import Order, { type IOrder, type IOrderItem } from '@/lib/db/models/Order'
import type { TOrder, TOrderProps, TShippingAddress } from '@/lib/types'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function mapShippingAddress(address: IOrder['shippingAddress']): TShippingAddress {
  return {
    id: '',
    firstName: address.firstName,
    lastName: address.lastName,
    street: address.street,
    apartment: address.apartment,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    country: address.country,
    phone: address.phone,
    isDefault: false,
  }
}

function getSelectedVariant(item: IOrderItem, key: string) {
  return item.selectedVariants?.get(key) || null
}

function mapOrderSummary(order: IOrder): TOrder {
  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    date: formatDate(order.createdAt),
    status: order.status,
    total: order.total,
    trackingNumber: order.trackingNumber,
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    shippingAddress: mapShippingAddress(order.shippingAddress),
    items: order.items.map((item) => ({
      id: item._id?.toString() || `${item.product.toString()}-${item.variant?.toString() || ''}`,
      product: {
        id: item.product.toString(),
        name: item.productSnapshot.name,
        variant: {
          id: item.variant?.toString() || '',
          attributes: {
            color: getSelectedVariant(item, 'color') || '',
            size: getSelectedVariant(item, 'size') || '',
            material: getSelectedVariant(item, 'material') || '',
          },
          price: item.productSnapshot.price,
          stock: 0,
          sku: item.productSnapshot.sku || '',
          images: [{
            secure_url: item.productSnapshot.image || '/grocery.svg',
            public_id: '',
          }],
        },
      },
      quantity: item.quantity,
    })),
  }
}

function mapOrderDetails(order: IOrder): TOrderProps {
  const shippingAddress = mapShippingAddress(order.shippingAddress)
  const billingAddress = order.billingAddress || order.shippingAddress
  const statusHistory = new Map(
    order.statusHistory.map((entry) => [entry.status, entry.timestamp])
  )
  const shippedAt = statusHistory.get('shipped')
  const deliveredAt = statusHistory.get('delivered')

  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    date: formatDate(order.createdAt),
    dateRaw: order.createdAt.toISOString(),
    status: order.status,
    total: order.total,
    trackingNumber: order.trackingNumber,
    items: order.items.map((item) => ({
      id: item._id?.toString() || `${item.product.toString()}-${item.variant?.toString() || ''}`,
      product: {
        id: item.product.toString(),
        name: item.productSnapshot.name,
        images: [{
          secure_url: item.productSnapshot.image || '/grocery.svg',
          public_id: '',
        }],
        price: item.productSnapshot.price,
        color: getSelectedVariant(item, 'color'),
        size: getSelectedVariant(item, 'size'),
        sku: item.productSnapshot.sku || '',
      },
      quantity: item.quantity,
    })),
    shippingAddress,
    billingAddress: {
      id: '',
      firstName: billingAddress.firstName,
      lastName: billingAddress.lastName,
      street: billingAddress.street,
      apartment: billingAddress.apartment,
      city: billingAddress.city,
      state: billingAddress.state,
      zipCode: billingAddress.zipCode,
      country: billingAddress.country,
    },
    paymentMethod: {
      type: order.paymentMethod.type,
      brand: order.paymentMethod.brand,
      last4: order.paymentMethod.last4,
      expiryMonth: order.paymentMethod.expiryMonth || 0,
      expiryYear: order.paymentMethod.expiryYear || 0,
    },
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    discount: order.discount,
    timeline: [
      { status: 'ordered', date: formatDateTime(order.createdAt), completed: true },
      { status: 'confirmed', date: formatDateTime(order.createdAt), completed: true },
      {
        status: 'processing',
        date: formatDateTime(statusHistory.get('processing') || order.createdAt),
        completed: order.status !== 'cancelled',
      },
      {
        status: 'shipped',
        date: shippedAt ? formatDateTime(shippedAt) : 'Pending',
        completed: Boolean(shippedAt),
      },
      {
        status: 'delivered',
        date: deliveredAt ? formatDateTime(deliveredAt) : 'Pending',
        completed: Boolean(deliveredAt),
      },
    ],
  }
}

export async function getOrdersForUser(userId: string, limit?: number): Promise<TOrder[]> {
  if (!mongoose.isValidObjectId(userId)) return []

  await dbConnect()

  const query = Order.find({ user: userId }).sort({ createdAt: -1 })
  if (limit) query.limit(limit)

  const orders = await query
  return orders.map((order) => mapOrderSummary(order))
}

export async function getOrderForUser(userId: string, orderId: string): Promise<TOrderProps | null> {
  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(orderId)) return null

  await dbConnect()

  const order = await Order.findOne({ _id: orderId, user: userId })
  return order ? mapOrderDetails(order) : null
}
