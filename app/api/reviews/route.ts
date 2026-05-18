import { NextRequest } from 'next/server'
import { z } from 'zod';

import { Model } from 'mongoose'

import dbConnect from '@/lib/db/connection'
import { createReviewSchema } from '@/lib/validations/review.validation'
import { getAllReviews } from '@/lib/queries/get.reviews'
import Review from '@/lib/db/models/Review'
import Product from '@/lib/db/models/Product'
import User from '@/lib/db/models/User'
import { getServerSession } from '@/lib/auth-server'
import { Resource } from '@/lib/types'
import { apiResponse } from '../apiResponse'
import Order from '@/lib/db/models/Order';

type MongooseModel = Model<unknown>

const MODEL_MAP: Record<Resource, MongooseModel> = {
  review: Review,
  product: Product,
  user: User,
  order: Order
}

export async function POST(req: NextRequest) {
  await dbConnect()

  const sessionUser = await getServerSession()
  if (!sessionUser?.user) {
    return apiResponse('Unauthorized', 401)
  }

  const body = await req.json()
  if (!body) {
    return apiResponse('Invalid data provided', 400)
  }

  const parsed = createReviewSchema.safeParse(body)

  if (!parsed.success) {
    console.dir(parsed.error.issues, { depth: null })
    return apiResponse('Data validation failed', 400, null, z.flattenError(parsed.error))
  }

  const user_and_review = {
    ...parsed.data,
    author: sessionUser.user.id,
    authorName: sessionUser.user.name || "Anonymous"
  }

  try {
    const newReview = await Review.create(user_and_review)
    return apiResponse('Review created successfully', 201, newReview)
  } catch (error) {
    console.error('Error creating review:', error)
    return apiResponse('An error occurred while creating the review', 500)
  }
}

export async function PATCH(req: NextRequest) {
  await dbConnect()

  try {
    const { action, ids, resource } = await req.json()

    if (!action || !Array.isArray(ids) || !resource) {
      return Response.json(
        { error: 'Invalid payload' },
        { status: 400 }
      )
    }

    if (!(resource in MODEL_MAP)) {
      return Response.json(
        { error: `Invalid resource: ${resource}` },
        { status: 400 }
      )
    }

    const model = MODEL_MAP[resource as Resource]

    if (action === 'delete') {
      await model.deleteMany({ _id: { $in: ids } })
      return Response.json({ success: true, ok: true }, { status: 200 })
    }

    const update: Record<string, string | boolean> = {}
    if (action === 'approve') {
      update.status = 'approved'
      update.verified = true
    }
    if (action === 'reject') update.status = 'rejected'

    await model.updateMany(
      { _id: { $in: ids } },
      { $set: update }
    )

    return Response.json(
      {
        message: `${resource} ${update.status} successfully`,
        ok: true,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: 'Server error', ok: false },
      { status: 500 }
    )
  }
}

export async function GET() {
  await dbConnect()
  try {
    const result = await getAllReviews()

    if (!result) {
      return Response.json(
        { message: 'No reviews found' },
        { status: 404 }
      )
    }

    return Response.json(result)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return Response.json(
      { message: 'An error occurred while fetching reviews' },
      { status: 500 }
    )
  }
}
