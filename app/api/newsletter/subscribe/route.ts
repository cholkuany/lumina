import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import dbConnect from '@/lib/db/connection'
import NewsletterSubscriber from '@/lib/db/models/NewsletterSubscriber'

const subscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Please enter a valid email address')),
  source: z.string().trim().max(60).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = subscribeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid email address' },
        { status: 400 }
      )
    }

    await dbConnect()

    const { email, source = 'footer' } = parsed.data

    await NewsletterSubscriber.findOneAndUpdate(
      { email },
      {
        $set: {
          email,
          source,
          isActive: true,
        },
        $unset: { unsubscribedAt: '' },
        $setOnInsert: {
          subscribedAt: new Date(),
        },
      },
      { new: true, upsert: true, runValidators: true }
    )

    const db = NewsletterSubscriber.db.db

    if (db) {
      await db.collection('user').updateOne(
        { email },
        {
          $set: {
            subscribeNewsletter: true,
            updatedAt: new Date(),
          },
        }
      )
    }

    return NextResponse.json({
      message: "You're subscribed. Welcome to the LUMINA community.",
    })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: 'Unable to subscribe right now. Please try again.' },
      { status: 500 }
    )
  }
}
