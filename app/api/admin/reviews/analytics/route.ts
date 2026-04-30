// app/api/admin/reviews/analytics/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Review from '@/lib/db/models/Review'
import Product from '@/lib/db/models/Product'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range') || '30d'

  const now = new Date()
  const startDate = new Date()

  switch (range) {
    case '7d':
      startDate.setDate(now.getDate() - 7)
      break
    case '30d':
      startDate.setDate(now.getDate() - 30)
      break
    case '90d':
      startDate.setDate(now.getDate() - 90)
      break
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1)
      break
  }

  const periodDuration = now.getTime() - startDate.getTime()
  const previousStart = new Date(startDate.getTime() - periodDuration)

  try {
    const matchStage = {
      status: 'approved',
      createdAt: { $gte: startDate },
    }

    const previousMatchStage = {
      status: 'approved',
      createdAt: {
        $gte: previousStart,
        $lt: startDate,
      },
    }

    const [
      totalReviews,
      previousPeriodReviews,
      verifiedCount,
      withImagesCount,
      ratingDistribution,
      monthlyData,
      topProducts,
    ] = await Promise.all([
      Review.countDocuments(matchStage),

      Review.countDocuments(previousMatchStage),

      Review.countDocuments({
        ...matchStage,
        verified: true,
      }),

      Review.countDocuments({
        ...matchStage,
        images: { $exists: true, $ne: [] },
      }),

      // Rating distribution
      Review.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 },
          },
        },
      ]),

      // Monthly trend
      Review.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
            avgRating: { $avg: '$rating' },
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
          },
        },
      ]),

      // Top reviewed products
      Review.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$productId',
            reviewCount: { $sum: 1 },
            avgRating: { $avg: '$rating' },
          },
        },
        { $sort: { reviewCount: -1 } },
        { $limit: 10 },
      ]),
    ])

    // ---- Derived metrics ----

    const monthlyChange =
      previousPeriodReviews > 0
        ? Math.round(((totalReviews - previousPeriodReviews) / previousPeriodReviews) * 100)
        : 0

    const verifiedPercentage =
      totalReviews > 0
        ? Math.round((verifiedCount / totalReviews) * 100)
        : 0

    const withImagesPercentage =
      totalReviews > 0
        ? Math.round((withImagesCount / totalReviews) * 100)
        : 0

    // Average rating
    const totalRatingSum = ratingDistribution.reduce(
      (sum, r) => sum + r._id * r.count,
      0
    )

    const averageRating =
      totalReviews > 0 ? totalRatingSum / totalReviews : 0

    // Format rating distribution
    const formattedRatingDistribution = [5, 4, 3, 2, 1].map((rating) => {
      const found = ratingDistribution.find((r) => r._id === rating)
      const count = found?.count || 0

      return {
        rating,
        count,
        percentage:
          totalReviews > 0
            ? Math.round((count / totalReviews) * 100)
            : 0,
      }
    })

    // Format monthly trend
    const formattedMonthlyTrend = monthlyData.map((m) => {
      const date = new Date(m._id.year, m._id.month - 1)

      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        count: m.count,
        avgRating: m.avgRating,
      }
    })

    // ---- Resolve product names (still separate query) ----

    const productIds = topProducts.map((p) => p._id)

    const products = await Product.find(
      { _id: { $in: productIds } },
      { name: 1 }
    ).lean()

    const productMap = new Map(
      products.map((p) => [p._id.toString(), p.name])
    )

    const formattedTopProducts = topProducts.map((p) => ({
      id: p._id,
      name: productMap.get(p._id.toString()) || 'Unknown',
      reviewCount: p.reviewCount,
      avgRating: p.avgRating || 0,
    }))

    return NextResponse.json({
      totalReviews,
      averageRating,
      ratingChange: 0,
      reviewsThisMonth: totalReviews,
      monthlyChange,
      verifiedPercentage,
      withImagesPercentage,
      averageHelpfulVotes: 0,
      ratingDistribution: formattedRatingDistribution,
      monthlyTrend: formattedMonthlyTrend,
      topReviewedProducts: formattedTopProducts,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}