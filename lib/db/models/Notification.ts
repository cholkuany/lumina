import mongoose, { Schema, Model } from 'mongoose'

export type NotificationType = 'ORDER' | 'REVIEW' | 'USER' | 'SYSTEM'

export interface INotification {
  type: NotificationType
  message: string
  read: boolean
  link?: string
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ['ORDER', 'REVIEW', 'USER', 'SYSTEM'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
  },
  { timestamps: true }
)

// prevent model recompilation in Next.js dev mode
const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema)

export default Notification