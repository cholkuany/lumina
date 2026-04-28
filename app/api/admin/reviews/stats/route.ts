import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import { Review } from '@/lib/db/models'

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [pending, approved, rejected, flagged, todayCount] = await Promise.all([
      Review.countDocuments({ status: 'pending' }),
      Review.countDocuments({ status: 'approved' }),
      Review.countDocuments({ status: 'rejected' }),
      Review.countDocuments({ status: 'flagged' }),
      Review.countDocuments({
        createdAt: { $gte: today },
      }),
    ])

    // Calculate average response time
    // Get reviews that have been moderated (status is not 'pending' and has moderation history)
    const moderatedReviews = await Review.find({
      status: { $ne: 'pending' },
      'moderationHistory.0': { $exists: true },
    })
      .select('createdAt moderationHistory')
      .sort({ updatedAt: -1 })
      .limit(100)
      .lean()

    let avgResponseTime = 'N/A'

    if (moderatedReviews.length > 0) {
      const totalMinutes = moderatedReviews.reduce((sum, review) => {
        // Get the first moderation action (when review was first moderated)
        const firstModeration = review.moderationHistory?.[0]
        if (!firstModeration?.createdAt) return sum

        const createdTime = new Date(review.createdAt).getTime()
        const moderatedTime = new Date(firstModeration.createdAt).getTime()
        const diffInMinutes = (moderatedTime - createdTime) / 60000

        return sum + diffInMinutes
      }, 0)

      const avgMinutes = Math.round(totalMinutes / moderatedReviews.length)

      if (avgMinutes < 60) {
        avgResponseTime = `${avgMinutes} min`
      } else if (avgMinutes < 1440) {
        avgResponseTime = `${Math.round(avgMinutes / 60)} hours`
      } else {
        avgResponseTime = `${Math.round(avgMinutes / 1440)} days`
      }
    }

    return NextResponse.json({
      pending,
      approved,
      rejected,
      flagged,
      totalToday: todayCount,
      averageResponseTime: avgResponseTime,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}