// lib/jobs/send-review-requests.ts
import { prisma } from '@/lib/prisma' // or your database client

interface OrderItem {
  productId: string
  productName: string
  productImage: string
}

interface Order {
  id: string
  orderNumber: string
  customerEmail: string
  customerName: string
  deliveredAt: Date
  items: OrderItem[]
  reviewRequestSent: boolean
}

export async function sendReviewRequestsJob() {
  const DAYS_AFTER_DELIVERY = 7
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - DAYS_AFTER_DELIVERY)

  try {
    // Find orders delivered X days ago that haven't received review request
    const eligibleOrders: Order[] = await prisma.order.findMany({
      where: {
        status: 'delivered',
        deliveredAt: {
          gte: new Date(cutoffDate.setHours(0, 0, 0, 0)),
          lte: new Date(cutoffDate.setHours(23, 59, 59, 999)),
        },
        reviewRequestSent: false,
        customer: {
          emailPreferences: {
            reviewRequests: true,
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    })

    console.log(`Found ${eligibleOrders.length} orders eligible for review requests`)

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const order of eligibleOrders) {
      try {
        // Check if customer already reviewed any items
        const existingReviews = await prisma.review.findMany({
          where: {
            customerId: order.customerId,
            productId: {
              in: order.items.map((item) => item.productId),
            },
          },
        })

        const reviewedProductIds = new Set(existingReviews.map((r) => r.productId))

        // Filter out already reviewed products
        const unreviewedProducts = order.items
          .filter((item) => !reviewedProductIds.has(item.productId))
          .map((item) => ({
            id: item.productId,
            name: item.product.name,
            image: item.product.images[0],
          }))

        // Skip if all products already reviewed
        if (unreviewedProducts.length === 0) {
          await prisma.order.update({
            where: { id: order.id },
            data: { reviewRequestSent: true },
          })
          continue
        }

        // Send email
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/emails/send-review-request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: order.customerEmail,
            customerName: order.customerName,
            orderNumber: order.orderNumber,
            orderDate: order.deliveredAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            products: unreviewedProducts,
          }),
        })

        if (response.ok) {
          // Mark order as review request sent
          await prisma.order.update({
            where: { id: order.id },
            data: {
              reviewRequestSent: true,
              reviewRequestSentAt: new Date(),
            },
          })

          results.sent++
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
      } catch (error) {
        results.failed++
        results.errors.push(`Order ${order.orderNumber}: ${error}`)
      }
    }

    console.log('Review request job completed:', results)
    return results
  } catch (error) {
    console.error('Review request job failed:', error)
    throw error
  }
}

// Reminder job (14 days after delivery if no review)
export async function sendReviewRemindersJob() {
  const DAYS_AFTER_FIRST_REQUEST = 7
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - DAYS_AFTER_FIRST_REQUEST)

  try {
    const eligibleOrders = await prisma.order.findMany({
      where: {
        reviewRequestSent: true,
        reviewReminderSent: false,
        reviewRequestSentAt: {
          gte: new Date(cutoffDate.setHours(0, 0, 0, 0)),
          lte: new Date(cutoffDate.setHours(23, 59, 59, 999)),
        },
        customer: {
          emailPreferences: {
            reviewRequests: true,
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    })

    // Similar logic to send reminder emails...
    // Implementation follows same pattern as above
  } catch (error) {
    console.error('Review reminder job failed:', error)
    throw error
  }
}