import mongoose, { Model, Schema } from 'mongoose'

export interface INewsletterSubscriber {
  email: string
  source: string
  isActive: boolean
  subscribedAt: Date
  unsubscribedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    source: {
      type: String,
      default: 'footer',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: Date,
  },
  {
    timestamps: true,
  }
)

NewsletterSubscriberSchema.index({ isActive: 1, subscribedAt: -1 })

const NewsletterSubscriber: Model<INewsletterSubscriber> =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriber>(
    'NewsletterSubscriber',
    NewsletterSubscriberSchema
  )

export default NewsletterSubscriber
