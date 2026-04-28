import mongoose, { Schema, Model } from 'mongoose';
import { createNotification } from '@/lib/queries/notification.queries';

declare module 'mongoose' {
  interface Document {
    wasNew?: boolean
  }
}

// Review Report Sub-schema
const ReviewReportSchema = new Schema({
  reason: {
    type: String,
    required: true,
  },
  details: String,
  reportedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Moderation Action Sub-schema
const ModerationActionSchema = new Schema({
  action: {
    type: String,
    enum: ['approved', 'rejected', 'flagged', 'edited'],
    required: true,
  },
  reason: String,
  moderatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  moderatorName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Review Response Sub-schema
const ReviewResponseSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

export interface IReviewReport {
  reason: string;
  details?: string;
  reportedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface IModerationAction {
  action: 'approved' | 'rejected' | 'flagged' | 'edited';
  reason?: string;
  moderatorId: mongoose.Types.ObjectId;
  moderatorName: string;
  createdAt: Date;
}

export interface IReviewResponse {
  author: string;
  content: string;
  date: Date;
}

export interface IReview {
  product: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  authorName: string;
  avatar?: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  recommendProduct?: boolean;
  response?: IReviewResponse;
  // Moderation fields
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  reports: IReviewReport[];
  moderationHistory: IModerationAction[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    avatar: String,
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Review content is required'],
      trim: true,
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: {
      type: [String],
      validate: {
        validator: (v: string[]) => v.length <= 3,
        message: 'Cannot upload more than 3 images',
      },
    },
    recommendProduct: Boolean,
    response: ReviewResponseSchema,
    // Moderation
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'flagged'],
      default: 'pending',
      index: true,
    },
    reports: [ReviewReportSchema],
    moderationHistory: [ModerationActionSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for efficient queries
ReviewSchema.index({ product: 1, status: 1 });
ReviewSchema.index({ product: 1, createdAt: -1 });
ReviewSchema.index({ author: 1, createdAt: -1 });
ReviewSchema.index({ status: 1, createdAt: -1 });
ReviewSchema.index({ rating: 1 });

// track whether this was a new document
ReviewSchema.pre('save', function () {
  this.wasNew = this.isNew
})

// Update product rating and review count after review changes
ReviewSchema.post('save', async function () {

  if (!this.wasNew) return

  if (this.status === 'pending') {
    await createNotification({
      type: 'REVIEW',
      message: `New review pending moderation`,
      link: `/admin/reviews/${this._id}`,
    }).catch(console.error)
  }
})

ReviewSchema.post('save', async function () {
  if (!this.wasNew) return;
  if (this.status !== 'approved') return;

  await updateProductRating(this.product);
});

ReviewSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await updateProductRating(doc.product)
  }
})

ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await updateProductRating(doc.product)
  }
})

async function updateProductRating(productId: mongoose.Types.ObjectId) {
  const Product = mongoose.model('Product');
  const stats = await mongoose.model('Review').aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        status: 'approved'
      }
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
  ]);

  const breakdown = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  }

  let totalReviews = 0
  let ratingSum = 0

  for (const stat of stats) {
    const rating = stat._id
    const count = stat.count

    breakdown[rating as 1 | 2 | 3 | 4 | 5] = count

    totalReviews += count
    ratingSum += rating * count
  }

  const avgRating = totalReviews
    ? Math.round((ratingSum / totalReviews) * 10) / 10
    : 0

  await Product.findByIdAndUpdate(productId, {
    rating: avgRating,
    reviewCount: totalReviews,
    ratingBreakdown: breakdown
  });
}

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;