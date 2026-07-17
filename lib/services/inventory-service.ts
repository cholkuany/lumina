import mongoose from 'mongoose'
import Order from '@/lib/db/models/Order'
import Product from '@/lib/db/models/Product'

export class InventoryAdjustmentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InventoryAdjustmentError'
  }
}

type InventoryItem = {
  product: mongoose.Types.ObjectId
  variant: mongoose.Types.ObjectId
  quantity: number
}

function groupInventoryItems(items: InventoryItem[]) {
  const grouped = new Map<string, InventoryItem>()

  for (const item of items) {
    const key = `${item.product.toString()}:${item.variant.toString()}`
    const existing = grouped.get(key)

    if (existing) {
      existing.quantity += item.quantity
    } else {
      grouped.set(key, { ...item })
    }
  }

  return [...grouped.values()]
}

export async function decrementInventoryForOrder(orderId: mongoose.Types.ObjectId | string) {
  const mongoSession = await mongoose.startSession()
  let adjusted = false

  try {
    await mongoSession.withTransaction(async () => {
      const order = await Order.findById(orderId)
        .select('items inventoryAdjustedAt')
        .session(mongoSession)

      if (!order) {
        throw new InventoryAdjustmentError('Order not found while adjusting inventory')
      }

      if (order.inventoryAdjustedAt) return

      const inventoryItems: InventoryItem[] = order.items.map((item) => {
        if (!item.variant) {
          throw new InventoryAdjustmentError('An order item is missing its product variant')
        }

        return {
          product: item.product,
          variant: item.variant,
          quantity: item.quantity,
        }
      })

      const bulkOps = groupInventoryItems(inventoryItems).map((item) => ({
        updateOne: {
          filter: {
            _id: item.product,
            variants: {
              $elemMatch: {
                _id: item.variant,
                stock: { $gte: item.quantity },
              },
            },
          },
          update: {
            $inc: {
              'variants.$[variant].stock': -item.quantity,
              unitsSold: item.quantity,
            },
          },
          arrayFilters: [{ 'variant._id': item.variant }],
        },
      }))

      if (bulkOps.length > 0) {
        const result = await Product.bulkWrite(bulkOps, { session: mongoSession, ordered: true })

        if (result.modifiedCount !== bulkOps.length) {
          throw new InventoryAdjustmentError('Insufficient stock for one or more products')
        }
      }

      const result = await Order.updateOne(
        { _id: order._id, inventoryAdjustedAt: { $exists: false } },
        {
          $set: {
            inventoryStatus: 'adjusted',
            inventoryAdjustedAt: new Date(),
          },
        },
        { session: mongoSession }
      )

      adjusted = result.modifiedCount === 1
    })

    return adjusted
  } catch (error) {
    console.error('Error occurred while adjusting inventory:', error)
    throw error
  } finally {
    await mongoSession.endSession()
  }
}
