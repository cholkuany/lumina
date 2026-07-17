import mongoose from 'mongoose'
import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-server'
import dbConnect from '@/lib/db/connection'
import { Order } from '@/lib/db/models'
import type { AdminOrderStatus } from '@/lib/types'

const ORDER_STATUSES: AdminOrderStatus[] = [
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
  }

  let body: { status?: AdminOrderStatus }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.status || !ORDER_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid order status' }, { status: 400 })
  }

  await dbConnect()

  const order = await Order.findById(id)
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (order.status !== body.status) {
    order.status = body.status
    await order.save()
  }

  return NextResponse.json({
    id: order._id.toString(),
    status: order.status,
    statusHistory: order.statusHistory.map((entry) => ({
      status: entry.status,
      date: entry.timestamp.toISOString(),
      note: entry.note,
    })),
  })
}
