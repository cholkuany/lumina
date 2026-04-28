import { z } from 'zod'
import mongoose from 'mongoose'

/**
 * -------------------------------------------------
 * Helpers
 * -------------------------------------------------
 */

// ObjectId validator
export const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  })
/**
 * -------------------------------------------------
 * Review Report Schema
 * -------------------------------------------------
 */
export const reviewReportSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
  details: z.string().optional(),
  reportedBy: objectIdSchema,
  createdAt: z.date(),
})

export type ReviewReportInput = z.infer<typeof reviewReportSchema>

/**
 * -------------------------------------------------
 * Moderation Action Schema
 * -------------------------------------------------
 */
export const moderationActionSchema = z.object({
  action: z.enum(['approved', 'rejected', 'flagged', 'edited']),
  reason: z.string().optional(),
  moderatorId: objectIdSchema,
  moderatorName: z.string().min(1),
  createdAt: z.date(),
})

export type ModerationActionInput = z.infer<
  typeof moderationActionSchema
>

/**
 * -------------------------------------------------
 * Review Response Schema
 * -------------------------------------------------
 */
export const reviewResponseSchema = z.object({
  author: z.string().min(1),
  content: z.string().min(1),
  date: z.date(),
})

export type ReviewResponseInput = z.infer<
  typeof reviewResponseSchema
>

/**
 * -------------------------------------------------
 * Main Review Schema
 * -------------------------------------------------
 */
export const reviewSchema = z.object({
  product: objectIdSchema,
  author: objectIdSchema,
  authorName: z.string().min(1),
  avatar: z.string().optional(),
  rating: z.coerce
    .number({ message: 'Rating is required', })
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  title: z
    .string({ message: 'Review title is required', })
    .min(1, 'Review title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  content: z
    .string({ message: 'Review content is required', })
    .min(1, 'Review content is required')
    .max(500, 'Content cannot exceed 500 characters')
    .trim(),
  verified: z.boolean().default(false),
  helpful: z.number().min(0).default(0),
  images: z
    .array(z.string())
    .max(3, 'Cannot upload more than 3 images')
    .optional(),
  recommendProduct: z.boolean().optional(),
  response: reviewResponseSchema.optional(),
  // Moderation
  status: z
    .enum(['pending', 'approved', 'rejected', 'flagged'])
    .default('pending'),
  reports: z.array(reviewReportSchema).default([]),
  moderationHistory: z.array(moderationActionSchema).default([]),

  createdAt: z.date(),
  updatedAt: z.date(),
})

export type ReviewInput = z.infer<typeof reviewSchema>

export const createReviewSchema = reviewSchema.pick({
  product: true,
  rating: true,
  title: true,
  content: true,
  images: true,
  recommendProduct: true,
})

export type ReviewData = z.infer<typeof createReviewSchema>

export const updateReviewSchema = reviewSchema.partial()