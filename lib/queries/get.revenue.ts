import dbConnect from '@/lib/db/connection'
import Order from '@/lib/db/models/Order'

export type RevenueSummary = {
  totalRevenue: number
  refundedRevenue: number
  paidOrderCount: number
}

export async function getRevenueSummary(): Promise<RevenueSummary> {
  await dbConnect()

  const [summary] = await Order.aggregate<RevenueSummary>([
    {
      $match: {
        paymentStatus: { $in: ['paid', 'refunded'] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: {
            $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$total', 0],
          },
        },
        refundedRevenue: {
          $sum: {
            $cond: [{ $eq: ['$paymentStatus', 'refunded'] }, '$total', 0],
          },
        },
        paidOrderCount: {
          $sum: {
            $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
        refundedRevenue: 1,
        paidOrderCount: 1,
      },
    },
  ])

  return summary || {
    totalRevenue: 0,
    refundedRevenue: 0,
    paidOrderCount: 0,
  }
}
