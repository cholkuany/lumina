import { NextRequest, NextResponse } from 'next/server'

interface ReportData {
  reviewId: string
  userId: string
  reason: string
  details?: string
  createdAt: Date
}

// In-memory store for demo - replace with database
const reports: ReportData[] = []

export async function POST(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const { reviewId } = params
    const body = await request.json()
    const { userId, reason, details } = body

    if (!reason) {
      return NextResponse.json(
        { error: 'Report reason is required' },
        { status: 400 }
      )
    }

    // Check if user already reported this review
    const existingReport = reports.find(
      (r) => r.reviewId === reviewId && r.userId === userId
    )

    if (existingReport) {
      return NextResponse.json(
        { error: 'You have already reported this review' },
        { status: 400 }
      )
    }

    const report: ReportData = {
      reviewId,
      userId,
      reason,
      details,
      createdAt: new Date(),
    }

    reports.push(report)

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
    })
  } catch (error) {
    console.error('Report error:', error)
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    )
  }
}