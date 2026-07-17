import mongoose from 'mongoose'
import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-server'
import dbConnect from '@/lib/db/connection'
import { Order, ReturnRequest } from '@/lib/db/models'

type RouteContext = {
  params: Promise<{ id: string }>
}

type ReturnRequestBody = {
  items?: Array<{
    orderItemId?: string
    quantity?: number
    reason?: string
  }>
}

export async function POST(request: Request, { params }: RouteContext) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(session.user.id)) {
    return NextResponse.json({ error: 'Invalid order' }, { status: 400 })
  }

  let body: ReturnRequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'Select at least one item to return' }, { status: 400 })
  }

  await dbConnect()

  const order = await Order.findOne({ _id: id, user: session.user.id })
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (order.status !== 'delivered') {
    return NextResponse.json({ error: 'Only delivered orders can be returned' }, { status: 409 })
  }

  const requestedItems = new Map<string, { quantity: number; reason: string }>()

  for (const item of body.items) {
    const orderItemId = item.orderItemId
    const reason = item.reason?.trim()

    if (
      !orderItemId ||
      !mongoose.isValidObjectId(orderItemId) ||
      !Number.isInteger(item.quantity) ||
      (item.quantity || 0) < 1 ||
      !reason ||
      reason.length > 300
    ) {
      return NextResponse.json({ error: 'Invalid returned item' }, { status: 400 })
    }

    if (requestedItems.has(orderItemId)) {
      return NextResponse.json({ error: 'Each order item can only appear once' }, { status: 400 })
    }

    requestedItems.set(orderItemId, { quantity: item.quantity!, reason })
  }

  const activeRequests = await ReturnRequest.find({
    order: order._id,
    status: { $in: ['pending', 'approved', 'received'] },
  }).select('items')
  const alreadyRequested = new Map<string, number>()

  for (const returnRequest of activeRequests) {
    for (const item of returnRequest.items) {
      const key = item.orderItem.toString()
      alreadyRequested.set(key, (alreadyRequested.get(key) || 0) + item.quantity)
    }
  }

  const returnItems = []

  for (const [orderItemId, requested] of requestedItems) {
    const orderItem = order.items.find(
      (item) => item._id?.toString() === orderItemId
    )

    if (!orderItem || !orderItem._id) {
      return NextResponse.json({ error: 'An item does not belong to this order' }, { status: 400 })
    }

    const remainingQuantity = orderItem.quantity - (alreadyRequested.get(orderItemId) || 0)
    if (requested.quantity > remainingQuantity) {
      return NextResponse.json({
        error: `Only ${Math.max(remainingQuantity, 0)} item(s) remain eligible for return`,
      }, { status: 409 })
    }

    returnItems.push({
      orderItem: orderItem._id,
      product: orderItem.product,
      variant: orderItem.variant,
      productName: orderItem.productSnapshot.name,
      image: orderItem.productSnapshot.image,
      quantity: requested.quantity,
      reason: requested.reason,
    })
  }

  const returnRequest = await ReturnRequest.create({
    order: order._id,
    user: session.user.id,
    items: returnItems,
  })

  return NextResponse.json({
    id: returnRequest._id.toString(),
    returnNumber: returnRequest.returnNumber,
    status: returnRequest.status,
  }, { status: 201 })
}
