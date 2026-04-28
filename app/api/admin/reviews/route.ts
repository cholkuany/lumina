// app/api/admin/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server'
import type { QueryFilter, Types } from 'mongoose'
import dbConnect from '@/lib/db/connection'
import { Review } from '@/lib/db/models'
import type { IReview } from '@/lib/db/models/Review'

// ============ Type Definitions ============

type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged'

// Populated product shape (after .populate() with select)
interface PopulatedProduct {
  _id: Types.ObjectId
  name: string
  images: string[]
}

// Populated author shape (after .populate() with select)
interface PopulatedAuthor {
  _id: Types.ObjectId
  firstName: string
  lastName: string
  email: string
  totalOrders: number
  totalReviews: number
}

// Review document after population and .lean()
interface ReviewPopulatedLean {
  _id: Types.ObjectId
  product: PopulatedProduct | null
  author: PopulatedAuthor | null
  authorName: string
  avatar?: string
  rating: number
  title: string
  content: string
  verified: boolean
  helpful: number
  images?: string[]
  recommendProduct?: boolean
  response?: {
    author: string
    content: string
    date: Date
  }
  status: ReviewStatus
  reports: Array<{
    _id?: Types.ObjectId
    reason: string
    details?: string
    reportedBy: Types.ObjectId
    createdAt: Date
  }>
  moderationHistory: Array<{
    _id?: Types.ObjectId
    action: 'approved' | 'rejected' | 'flagged' | 'edited'
    reason?: string
    moderatorId: Types.ObjectId
    moderatorName: string
    createdAt: Date
  }>
  createdAt: Date
  updatedAt: Date
}

// API Response types
interface TransformedReview {
  id: string
  rating: number
  title: string
  content: string
  authorName: string
  avatar?: string
  verified: boolean
  helpful: number
  images?: string[]
  recommendProduct?: boolean
  status: ReviewStatus
  createdAt: string
  response?: {
    author: string
    content: string
    date: string
  }
  product: {
    id: string
    name: string
    image: string
  } | null
  customer: {
    id: string
    name: string
    email: string
    totalOrders: number
    totalReviews: number
  } | null
  reports: Array<{
    id: string
    reason: string
    details?: string
    reportedBy: string
    createdAt: string
  }>
  moderationHistory: Array<{
    id: string
    action: string
    reason?: string
    moderatorId: string
    moderatorName: string
    createdAt: string
  }>
}

interface ReviewsApiResponse {
  reviews: TransformedReview[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// ============ Helper Functions ============

const VALID_STATUSES: readonly ReviewStatus[] = [
  'pending',
  'approved',
  'rejected',
  'flagged',
] as const

function isValidStatus(status: string): status is ReviewStatus {
  return VALID_STATUSES.includes(status as ReviewStatus)
}

function transformReview(review: ReviewPopulatedLean): TransformedReview {
  return {
    id: review._id.toString(),
    rating: review.rating,
    title: review.title,
    content: review.content,
    authorName: review.authorName,
    avatar: review.avatar,
    verified: review.verified,
    helpful: review.helpful,
    images: review.images,
    recommendProduct: review.recommendProduct,
    status: review.status,
    createdAt: review.createdAt.toISOString(),

    response: review.response
      ? {
        author: review.response.author,
        content: review.response.content,
        date: review.response.date.toISOString(),
      }
      : undefined,

    product: review.product
      ? {
        id: review.product._id.toString(),
        name: review.product.name,
        image: review.product.images[0] ?? '',
      }
      : null,

    customer: review.author
      ? {
        id: review.author._id.toString(),
        name: `${review.author.firstName} ${review.author.lastName}`.trim(),
        email: review.author.email,
        totalOrders: review.author.totalOrders ?? 0,
        totalReviews: review.author.totalReviews ?? 0,
      }
      : null,

    reports: review.reports.map((report) => ({
      id: report._id?.toString() ?? '',
      reason: report.reason,
      details: report.details,
      reportedBy: report.reportedBy.toString(),
      createdAt: report.createdAt.toISOString(),
    })),

    moderationHistory: review.moderationHistory.map((action) => ({
      id: action._id?.toString() ?? '',
      action: action.action,
      reason: action.reason,
      moderatorId: action.moderatorId.toString(),
      moderatorName: action.moderatorName,
      createdAt: action.createdAt.toISOString(),
    })),
  }
}

// ============ Route Handler ============

export async function GET(
  request: NextRequest
): Promise<NextResponse<ReviewsApiResponse | { error: string }>> {
  const { searchParams } = new URL(request.url)

  const statusParam = searchParams.get('status') ?? 'pending'
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
  const search = searchParams.get('search')?.trim() ?? ''

  // Validate status
  if (!isValidStatus(statusParam)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    )
  }

  try {
    await dbConnect()

    // Build query filter
    const filter: QueryFilter<IReview> = { status: statusParam }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { authorName: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (page - 1) * limit

    // Execute query with proper typing
    const reviews = await Review.find(filter)
      .populate<{ product: PopulatedProduct | null }>({
        path: 'product',
        select: 'name images',
      })
      .populate<{ author: PopulatedAuthor | null }>({
        path: 'author',
        select: 'firstName lastName email totalOrders totalReviews',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<ReviewPopulatedLean[]>()

    // Transform with full type safety
    const transformedReviews = reviews.map(transformReview)

    const total = await Review.countDocuments(filter)

    return NextResponse.json({
      reviews: transformedReviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}