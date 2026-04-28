// app/api/cron/review-requests/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendReviewRequestsJob, sendReviewRemindersJob } from '@/lib/jobs/send-review-requests'

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [requestResults, reminderResults] = await Promise.all([
      sendReviewRequestsJob(),
      sendReviewRemindersJob(),
    ])

    return NextResponse.json({
      success: true,
      reviewRequests: requestResults,
      reviewReminders: reminderResults,
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Job failed' }, { status: 500 })
  }
}