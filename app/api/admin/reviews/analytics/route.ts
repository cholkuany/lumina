// app/api/admin/reviews/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range') || '30d'

  // Calculate date range
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

  try {
    // Fetch all required data in parallel
    const [
      totalReviews,
      previousPeriodReviews,
      verifiedCount,
      withImagesCount,
      ratingDistribution,
      monthlyData,
      topProducts,
    ] = await Promise.all([
      // Total reviews in period
      prisma.review.count({
        where: {
          status: 'approved',
          createdAt: { gte: startDate },
        },
      }),

      // Previous period for comparison
      prisma.review.count({
        where: {
          status: 'approved',
          createdAt: {
            gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
            lt: startDate,
          },
        },
      }),

      // Verified purchases
      prisma.review.count({
        where: {
          status: 'approved',
          verified: true,
          createdAt: { gte: startDate },
        },
      }),

      // Reviews with images
      prisma.review.count({
        where: {
          status: 'approved',
          images: { isEmpty: false },
          createdAt: { gte: startDate },
        },
      }),

      // Rating distribution
      prisma.review.groupBy({
        by: ['rating'],
        where: {
          status: 'approved',
          createdAt: { gte: startDate },
        },
        _count: true,
      }),

      // Monthly trend data
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*)::int as count,
          AVG(rating)::float as avg_rating
        FROM reviews
        WHERE status = 'approved' AND created_at >= ${startDate}
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month ASC
      `,

      // Top reviewed products
      prisma.review.groupBy({
        by: ['productId'],
        where: {
          status: 'approved',
          createdAt: { gte: startDate },
        },
        _count: true,
        _avg: { rating: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ])

    // Calculate derived metrics
    const monthlyChange = previousPeriodReviews > 0
      ? Math.round(((totalReviews - previousPeriodReviews) / previousPeriodReviews) * 100)
      : 0

    const verifiedPercentage = totalReviews > 0
      ? Math.round((verifiedCount / totalReviews) * 100)
      : 0

    const withImagesPercentage = totalReviews > 0
      ? Math.round((withImagesCount / totalReviews) * 100)
      : 0

    // Calculate average rating
    const totalRatingSum = ratingDistribution.reduce(
      (sum, r) => sum + r.rating * r._count,
      0
    )
    const averageRating = totalReviews > 0 ? totalRatingSum / totalReviews : 0

    // Format rating distribution
    const formattedRatingDistribution = [5, 4, 3, 2, 1].map((rating) => {
      const found = ratingDistribution.find((r) => r.rating === rating)
      const count = found?._count || 0
      return {
        rating,
        count,
        percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
      }
    })

    // Format monthly trend
    const formattedMonthlyTrend = (monthlyData as any[]).map((m) => ({
      month: new Date(m.month).toLocaleDateString('en-US', { month: 'short' }),
      count: m.count,
      avgRating: m.avg_rating,
    }))

    // Get product details for top products
    const productIds = topProducts.map((p) => p.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    })

    const formattedTopProducts = topProducts.map((p) => ({
      id: p.productId,
      name: products.find((prod) => prod.id === p.productId)?.name || 'Unknown',
      reviewCount: p._count,
      avgRating: p._avg.rating || 0,
    }))

    return NextResponse.json({
      totalReviews,
      averageRating,
      ratingChange: 0, // Calculate based on previous period
      reviewsThisMonth: totalReviews,
      monthlyChange,
      verifiedPercentage,
      withImagesPercentage,
      averageHelpfulVotes: 0, // Calculate from data
      ratingDistribution: formattedRatingDistribution,
      monthlyTrend: formattedMonthlyTrend,
      topReviewedProducts: formattedTopProducts,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}