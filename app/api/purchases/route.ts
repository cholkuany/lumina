import mongoose from 'mongoose'
import { NextRequest } from 'next/server'
import { z } from 'zod'

import { getServerSession } from '@/lib/auth-server'
import dbConnect from '@/lib/db/connection'
import Product from '@/lib/db/models/Product'
import Purchase from '@/lib/db/models/Purchase'
import { purchaseSchema } from '@/lib/validations/purchase.validation'

async function requireAdmin() {
  const session = await getServerSession()
  return session?.user?.role === 'admin'
}

function serializePurchase(purchase: InstanceType<typeof Purchase>) {
  return {
    id: purchase._id.toString(),
    purchaseNumber: purchase.purchaseNumber,
    supplier: purchase.supplier,
    items: purchase.items.map((item) => {
      const product = item.product as unknown as {
        _id: mongoose.Types.ObjectId
        name: string
        variants: Array<{ _id: mongoose.Types.ObjectId; sku: string; attributes: Map<string, string> | Record<string, string>; images: Array<{ secure_url: string }> }>
      }
      const variantId = item.variant?.toString() || ''
      const variant = product?.variants?.find((entry) => entry._id.toString() === variantId)
      const attributes = variant?.attributes instanceof Map
        ? [...variant.attributes.values()]
        : Object.values(variant?.attributes || {})

      return {
        id: (item as unknown as { _id: mongoose.Types.ObjectId })._id.toString(),
        productId: product?._id?.toString() || '',
        variantId,
        name: product?.name || 'Deleted product',
        sku: variant?.sku || '',
        variantLabel: attributes.filter(Boolean).join(' / '),
        image: variant?.images?.[0]?.secure_url || null,
        quantity: item.quantity,
        cost: item.cost,
      }
    }),
    itemCount: purchase.items.reduce((sum, item) => sum + item.quantity, 0),
    total: purchase.total,
    status: purchase.status,
    expectedDate: purchase.expectedDate.toISOString(),
    receivedDate: purchase.receivedDate?.toISOString() || null,
    inventoryAppliedAt: purchase.inventoryAppliedAt?.toISOString() || null,
    date: purchase.date.toISOString(),
    notes: purchase.notes,
  }
}

export async function GET() {
  if (!(await requireAdmin())) return Response.json({ message: 'Unauthorized' }, { status: 401 })
  await dbConnect()

  const purchases = await Purchase.find().populate('items.product').sort({ date: -1 })
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const stats = { pending: 0, ordered: 0, in_transit: 0, received: 0, cancelled: 0, monthSpend: 0 }
  for (const purchase of purchases) {
    stats[purchase.status] += 1
    if (purchase.date >= monthStart && purchase.status !== 'cancelled') stats.monthSpend += purchase.total
  }

  return Response.json({ purchases: purchases.map(serializePurchase), stats })
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return Response.json({ message: 'Unauthorized' }, { status: 401 })
  await dbConnect()

  const parsed = purchaseSchema.safeParse(await req.json())
  if (!parsed.success) {
    return Response.json({ message: 'Invalid purchase order', errors: z.flattenError(parsed.error) }, { status: 400 })
  }

  const productIds = [...new Set(parsed.data.items.map((item) => item.product))]
  const products = await Product.find({ _id: { $in: productIds } }).select('variants._id')
  const validPairs = new Set(products.flatMap((product) => product.variants.map((variant) => `${product._id}:${variant._id}`)))
  if (parsed.data.items.some((item) => !validPairs.has(`${item.product}:${item.variant}`))) {
    return Response.json({ message: 'One or more product variants no longer exist' }, { status: 400 })
  }

  const now = new Date()
  const prefix = `PO-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
  const sequence = await Purchase.countDocuments({ purchaseNumber: { $regex: `^${prefix}` } })
  const purchase = await Purchase.create({
    ...parsed.data,
    items: parsed.data.items.map((item) => ({
      ...item,
      product: new mongoose.Types.ObjectId(item.product),
      variant: new mongoose.Types.ObjectId(item.variant),
    })),
    purchaseNumber: `${prefix}-${String(sequence + 1).padStart(4, '0')}`,
    total: parsed.data.items.reduce((sum, item) => sum + item.quantity * item.cost, 0),
    date: now,
  })

  await purchase.populate('items.product')
  return Response.json({ purchase: serializePurchase(purchase) }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return Response.json({ message: 'Unauthorized' }, { status: 401 })
  await dbConnect()

  const body = await req.json() as { id?: string; action?: string }
  if (!body.id || !mongoose.Types.ObjectId.isValid(body.id)) {
    return Response.json({ message: 'Invalid purchase order' }, { status: 400 })
  }

  if (body.action === 'receive') {
    const session = await mongoose.startSession()
    try {
      await session.withTransaction(async () => {
        const purchase = await Purchase.findOne({
          _id: body.id,
          status: { $in: ['ordered', 'in_transit'] },
          inventoryAppliedAt: { $exists: false },
        }).session(session)
        if (!purchase) throw new Error('Purchase order is already received or cannot be received')

        const operations = purchase.items.map((item) => ({
          updateOne: {
            filter: { _id: item.product, 'variants._id': item.variant },
            update: { $inc: { 'variants.$[variant].stock': item.quantity } },
            arrayFilters: [{ 'variant._id': item.variant }],
          },
        }))
        const result = await Product.bulkWrite(operations, { session, ordered: true })
        if (result.modifiedCount !== operations.length) throw new Error('A linked product variant no longer exists')

        purchase.status = 'received'
        purchase.receivedDate = new Date()
        purchase.inventoryAppliedAt = new Date()
        await purchase.save({ session })
      })
    } catch (error) {
      return Response.json({ message: error instanceof Error ? error.message : 'Unable to receive inventory' }, { status: 409 })
    } finally {
      await session.endSession()
    }
  } else {
    const transitions: Record<string, { from: string[]; to: string }> = {
      order: { from: ['pending'], to: 'ordered' },
      ship: { from: ['ordered'], to: 'in_transit' },
      cancel: { from: ['pending', 'ordered', 'in_transit'], to: 'cancelled' },
    }
    const transition = body.action ? transitions[body.action] : undefined
    if (!transition) return Response.json({ message: 'Invalid action' }, { status: 400 })
    const updated = await Purchase.findOneAndUpdate(
      { _id: body.id, status: { $in: transition.from } },
      { $set: { status: transition.to } },
      { new: true }
    )
    if (!updated) return Response.json({ message: 'Purchase order cannot make that transition' }, { status: 409 })
  }

  return Response.json({ success: true })
}
