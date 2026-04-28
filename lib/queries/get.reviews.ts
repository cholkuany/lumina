import type { ReviewInput } from "../validations/review.validation";
import Review from "../db/models/Review";
import dbConnect from "../db/connection";
import mongoose from "mongoose";

const fields = {
  _id: 0,
  id: { $toString: '$_id' },
  product: { $toString: '$product' },
  author: { $toString: '$author' },
  authorName: 1,
  avatar: 1,
  rating: 1,
  title: 1,
  content: 1,
  verified: 1,
  helpful: 1,
  images: 1,
  recommendProduct: 1,
  response: 1,
  status: 1,
  reports: 1,
  moderationHistory: 1,
  createdAt: 1,
  updatedAt: 1,
}
export const productReviews = {
  $project: {
    ...fields,
  }
}
export type DBReviewInput = ReviewInput & {
  id: string,
}
export type DBReview = DBReviewInput & {
  productInfo: {
    id: string,
    name: string,
    image?: string,
  }
}

export async function getProductReviews(productId: string): Promise<DBReviewInput[] | null> {
  await dbConnect()
  console.log('Fetching reviews for product ID:', productId)
  try {
    const reviews: DBReviewInput[] = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      productReviews,
    ])
    console.log('Fetched Reviews from DB:', reviews)
    return reviews
  } catch (error) {
    console.error('Error fetching product reviews:', error)
    return null
  }

}

export async function getReviewById(reviewId: string): Promise<DBReviewInput | null> {
  await dbConnect()
  console.log('Fetching review for review ID:', reviewId)
  try {
    const reviews: DBReviewInput[] = await Review.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(reviewId) } },
      productReviews,
    ])
    console.log('Fetched Review from DB:', reviews[0])
    return reviews[0] || null
  } catch (error) {
    console.error('Error fetching review by ID:', error)
    return null
  }

}

export type ReviewStats = {
  pending: number
  approved: number
  rejected: number
  flagged: number
  avgRating: number
}

export type AllReviewsResult = {
  reviews: DBReview[]
  stats: ReviewStats[]
}

export async function getAllReviews(): Promise<AllReviewsResult | null> {
  await dbConnect()
  try {
    const result: AllReviewsResult[] = await Review.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' },
      {
        $facet: {
          reviews: [
            {
              $project: {
                ...fields,
                productInfo: {
                  id: { $toString: '$productDetails._id' },
                  name: '$productDetails.name',
                  image: {
                    $let: {
                      vars: {
                        firstVariant: { $arrayElemAt: ['$productDetails.variants', 0] },
                      },
                      in: {
                        $arrayElemAt: ['$$firstVariant.images.secure_url', 0],
                      },
                    },
                  },
                },
              },
            },
          ],
          stats: [
            {
              $group: {
                _id: null,
                pending: {
                  $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
                },
                approved: {
                  $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] },
                },
                rejected: {
                  $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] },
                },
                flagged: {
                  $sum: {
                    $cond: [{ $gt: [{ $size: '$reports' }, 0] }, 1, 0],
                  },
                },
                avgRating: { $avg: '$rating' },
              },
            },
          ],
        },
      },
    ])

    const data = result[0]

    return {
      reviews: data.reviews,
      stats: data.stats ?? {
        pending: 0,
        approved: 0,
        rejected: 0,
        flagged: 0,
        avgRating: 0,
      },
    }
  } catch (error) {
    console.error('Error fetching all reviews:', error)
    return null
  }
}
