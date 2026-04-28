// app/api/reviews/[reviewId]/vote/route.ts
import { NextRequest, NextResponse } from 'next/server'

// In-memory store for demo - replace with database
const votes: Record<string, Record<string, 'up' | 'down'>> = {}

export async function POST(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const { reviewId } = params
    const body = await request.json()
    const { vote, userId } = body

    if (!vote || !['up', 'down'].includes(vote)) {
      return NextResponse.json(
        { error: 'Invalid vote type' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      )
    }

    // Initialize review votes if not exists
    if (!votes[reviewId]) {
      votes[reviewId] = {}
    }

    const currentVote = votes[reviewId][userId]

    // Toggle vote if same, otherwise set new vote
    if (currentVote === vote) {
      delete votes[reviewId][userId]
    } else {
      votes[reviewId][userId] = vote
    }

    // Calculate vote counts
    const voteCounts = Object.values(votes[reviewId]).reduce(
      (acc, v) => {
        if (v === 'up') acc.upvotes++
        else acc.downvotes++
        return acc
      },
      { upvotes: 0, downvotes: 0 }
    )

    return NextResponse.json({
      success: true,
      reviewId,
      userVote: votes[reviewId][userId] || null,
      ...voteCounts,
    })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const { reviewId } = params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const reviewVotes = votes[reviewId] || {}

    const voteCounts = Object.values(reviewVotes).reduce(
      (acc, v) => {
        if (v === 'up') acc.upvotes++
        else acc.downvotes++
        return acc
      },
      { upvotes: 0, downvotes: 0 }
    )

    return NextResponse.json({
      reviewId,
      userVote: userId ? reviewVotes[userId] || null : null,
      ...voteCounts,
    })
  } catch (error) {
    console.error('Get votes error:', error)
    return NextResponse.json(
      { error: 'Failed to get votes' },
      { status: 500 }
    )
  }
}