import mongoose from 'mongoose'
import dbConnect from '../db/connection'
import ReturnRequest from '../db/models/ReturnRequest'

export const RETURNS_PAGE_SIZE = 20

import {
  MAX_RETURN_REASON_LENGTH,
  RETURN_STATUSES,
  RETURN_WINDOW_DAYS,
  canTransition,
  getReturnedQuantities,
  type CustomerReturn,
  type ReturnDetail,
  type ReturnListItem,
  type ReturnRequestStatus,
  type SubmitReturnInput,
  type SubmitReturnResult,
} from '@/lib/returnTypes'

import { Order } from '../db/models'


// Only the order fields the admin page needs.
const ORDER_SELECT = [
  'orderNumber',
  'customerEmail',
  'total',
  'shippingAddress.firstName',
  'shippingAddress.lastName',
  'items._id',
  'items.quantity',
  'items.productSnapshot.price',
].join(' ')

interface RawOrder {
  _id: mongoose.Types.ObjectId
  orderNumber: string
  customerEmail?: string
  shippingAddress?: { firstName?: string; lastName?: string }
  items?: Array<{
    _id: mongoose.Types.ObjectId
    quantity: number
    productSnapshot?: { price?: number }
  }>
}

interface RawReturn {
  _id: mongoose.Types.ObjectId
  returnNumber: string
  status: ReturnRequestStatus
  order: RawOrder | null
  items: Array<{
    orderItem: mongoose.Types.ObjectId
    productName: string
    image?: string
    quantity: number
    reason: string
  }>
  statusHistory: Array<{ status: ReturnRequestStatus; timestamp: Date; note?: string }>
  adminNote?: string
  createdAt: Date
}

function unitPriceFor(order: RawOrder | null, orderItemId: mongoose.Types.ObjectId): number {
  const match = order?.items?.find((i) => String(i._id) === String(orderItemId))
  return match?.productSnapshot?.price ?? 0
}

function toListItem(raw: RawReturn): ReturnListItem {
  const order = raw.order
  const first = order?.shippingAddress?.firstName ?? ''
  const last = order?.shippingAddress?.lastName ?? ''

  return {
    id: String(raw._id),
    returnNumber: raw.returnNumber,
    status: raw.status,
    createdAt: raw.createdAt.toISOString(),
    orderId: order ? String(order._id) : '',
    orderNumber: order?.orderNumber ?? 'Deleted order',
    customerName: `${first} ${last}`.trim() || 'Unknown customer',
    customerEmail: order?.customerEmail,
    itemCount: raw.items.reduce((n, i) => n + i.quantity, 0),
    estimatedValue: raw.items.reduce(
      (sum, i) => sum + unitPriceFor(order, i.orderItem) * i.quantity,
      0
    ),
  }
}

function toDetail(raw: RawReturn): ReturnDetail {
  return {
    ...toListItem(raw),
    items: raw.items.map((i) => ({
      productName: i.productName,
      image: i.image,
      quantity: i.quantity,
      reason: i.reason,
      unitPrice: unitPriceFor(raw.order, i.orderItem),
    })),
    statusHistory: raw.statusHistory.map((h) => ({
      status: h.status,
      timestamp: new Date(h.timestamp).toISOString(),
      note: h.note,
    })),
    adminNote: raw.adminNote,
  }
}

export interface ReturnsPage {
  items: ReturnListItem[]
  total: number
  page: number
  totalPages: number
}

export async function getReturns(
  opts: { status?: ReturnRequestStatus; page?: number } = {}
): Promise<ReturnsPage> {
  await dbConnect()

  const page = Math.max(1, opts.page ?? 1)
  const filter = opts.status ? { status: opts.status } : {}
  // Work the pending queue oldest-first; everything else newest-first.
  const sort = opts.status === 'pending' ? 1 : -1

  const [docs, total] = await Promise.all([
    ReturnRequest.find(filter)
      .sort({ createdAt: sort })
      .skip((page - 1) * RETURNS_PAGE_SIZE)
      .limit(RETURNS_PAGE_SIZE)
      .populate({ path: 'order', select: ORDER_SELECT })
      .lean<RawReturn[]>(),
    ReturnRequest.countDocuments(filter),
  ])

  return {
    items: docs.map(toListItem),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / RETURNS_PAGE_SIZE)),
  }
}

export async function getReturnCounts(): Promise<Record<ReturnRequestStatus, number>> {
  await dbConnect()

  const rows: Array<{ _id: ReturnRequestStatus; count: number }> = await ReturnRequest.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])

  const counts = Object.fromEntries(RETURN_STATUSES.map((s) => [s, 0])) as Record<
    ReturnRequestStatus,
    number
  >
  for (const row of rows) counts[row._id] = row.count
  return counts
}

export async function getReturnDetail(id: string): Promise<ReturnDetail | null> {
  if (!mongoose.isValidObjectId(id)) return null
  await dbConnect()

  const raw = await ReturnRequest.findById(id)
    .populate({ path: 'order', select: ORDER_SELECT })
    .lean<RawReturn>()

  return raw ? toDetail(raw) : null
}

export type ProcessReturnResult =
  | { ok: true; returnNumber: string; status: ReturnRequestStatus }
  | { ok: false; error: string }

export async function processReturn(input: {
  id: string
  to: ReturnRequestStatus
  note?: string
}): Promise<ProcessReturnResult> {
  if (!mongoose.isValidObjectId(input.id)) return { ok: false, error: 'Return not found.' }

  const note = input.note?.trim() ?? ''
  if (input.to === 'rejected' && !note) {
    return { ok: false, error: 'Add a note explaining why the return was rejected.' }
  }
  if (note.length > 500) {
    return { ok: false, error: 'Notes are limited to 500 characters.' }
  }

  await dbConnect()

  const doc = await ReturnRequest.findById(input.id)
  if (!doc) return { ok: false, error: 'Return not found.' }

  if (!canTransition(doc.status, input.to)) {
    return {
      ok: false,
      error: `A ${doc.status} return can't be changed to ${input.to}. Refresh the page and try again.`,
    }
  }

  doc.status = input.to
  // Overwrite on every transition so a stale note isn't copied into the new history entry.
  doc.adminNote = note || undefined
  await doc.save()

  return { ok: true, returnNumber: doc.returnNumber, status: doc.status }
}

// ---------------------------------------------------------------------------
// Customer side
// ---------------------------------------------------------------------------

interface OrderForReturn {
  _id: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  status: string
  updatedAt: Date
  statusHistory?: Array<{ status: string; timestamp: Date }>
  items: Array<{
    _id: mongoose.Types.ObjectId
    product: mongoose.Types.ObjectId
    variant?: mongoose.Types.ObjectId
    quantity: number
    productSnapshot: { name: string; image: string }
  }>
}

export async function getCustomerReturnsForOrder(
  orderId: string,
  userId: string
): Promise<CustomerReturn[]> {
  if (!mongoose.isValidObjectId(orderId) || !mongoose.isValidObjectId(userId)) return []
  await dbConnect()

  const docs = await ReturnRequest.find({ order: orderId, user: userId })
    .sort({ createdAt: -1 })
    .lean<RawReturn[]>()

  return docs.map((d) => ({
    id: String(d._id),
    returnNumber: d.returnNumber,
    status: d.status,
    createdAt: d.createdAt.toISOString(),
    items: d.items.map((i) => ({
      orderItemId: String(i.orderItem),
      productName: i.productName,
      quantity: i.quantity,
      reason: i.reason,
    })),
    adminNote: d.adminNote,
  }))
}

// Creates a return request for a delivered order. Everything is re-checked against the
// database: the client only sends item ids, quantities and reasons.
export async function createReturnRequest(
  input: SubmitReturnInput & { userId: string }
): Promise<SubmitReturnResult> {
  if (!mongoose.isValidObjectId(input.userId)) return { ok: false, error: 'Please sign in again.' }
  if (input.items.length === 0) return { ok: false, error: 'Select at least one item to return.' }

  await dbConnect()

  const order = await Order.findOne({ orderNumber: input.orderNumber, user: input.userId })
    .lean<OrderForReturn>()
  if (!order) return { ok: false, error: 'Order not found.' }
  if (order.status !== 'delivered') {
    return { ok: false, error: 'Only delivered orders can be returned.' }
  }

  if (RETURN_WINDOW_DAYS !== null) {
    const deliveredAt =
      [...(order.statusHistory ?? [])].reverse().find((h) => h.status === 'delivered')?.timestamp ??
      order.updatedAt
    const deadline = new Date(deliveredAt).getTime() + RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000
    if (Date.now() > deadline) {
      return { ok: false, error: `The ${RETURN_WINDOW_DAYS}-day return window for this order has closed.` }
    }
  }

  const existing = await ReturnRequest.find({ order: order._id, status: { $ne: 'rejected' } })
    .select('status items.orderItem items.quantity')
    .lean<Array<{ status: ReturnRequestStatus; items: Array<{ orderItem: mongoose.Types.ObjectId; quantity: number }> }>>()

  const used = getReturnedQuantities(
    existing.map((r) => ({
      status: r.status,
      items: r.items.map((i) => ({ orderItemId: String(i.orderItem), quantity: i.quantity })),
    }))
  )

  const seen = new Set<string>()
  const lines = []
  for (const line of input.items) {
    if (seen.has(line.orderItemId)) return { ok: false, error: 'Each item can only be listed once.' }
    seen.add(line.orderItemId)

    const orderItem = order.items.find((i) => String(i._id) === line.orderItemId)
    if (!orderItem) return { ok: false, error: "One of the selected items isn't part of this order." }

    const name = orderItem.productSnapshot.name
    const remaining = orderItem.quantity - (used[line.orderItemId] ?? 0)
    if (remaining <= 0) return { ok: false, error: `${name} already has a return request.` }
    if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > remaining) {
      return { ok: false, error: `You can return between 1 and ${remaining} of ${name}.` }
    }

    const reason = line.reason.trim()
    if (!reason) return { ok: false, error: `Tell us why you're returning ${name}.` }
    if (reason.length > MAX_RETURN_REASON_LENGTH) {
      return { ok: false, error: `Reasons are limited to ${MAX_RETURN_REASON_LENGTH} characters.` }
    }

    lines.push({
      orderItem: orderItem._id,
      product: orderItem.product,
      variant: orderItem.variant,
      productName: name,
      image: orderItem.productSnapshot.image,
      quantity: line.quantity,
      reason,
    })
  }

  // create() runs the model's save hooks: status history and the admin notification.
  const created = await ReturnRequest.create({ order: order._id, user: order.user, items: lines })
  return { ok: true, returnNumber: created.returnNumber }
}