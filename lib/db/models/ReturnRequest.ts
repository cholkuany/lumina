import mongoose, { Model, Schema } from 'mongoose'
import { createNotification } from '@/lib/queries/notification.queries'

export type ReturnRequestStatus = 'pending' | 'approved' | 'rejected' | 'received'

export interface IReturnRequestItem {
  orderItem: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
  variant?: mongoose.Types.ObjectId
  productName: string
  image?: string
  quantity: number
  reason: string
}

export interface IReturnRequest {
  _id: mongoose.Types.ObjectId
  returnNumber: string
  order: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  items: IReturnRequestItem[]
  status: ReturnRequestStatus
  statusHistory: Array<{
    status: ReturnRequestStatus
    timestamp: Date
    note?: string
  }>
  adminNote?: string
  createdAt: Date
  updatedAt: Date
}

const ReturnItemSchema = new Schema<IReturnRequestItem>({
  orderItem: { type: Schema.Types.ObjectId, required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variant: Schema.Types.ObjectId,
  productName: { type: String, required: true },
  image: String,
  quantity: { type: Number, required: true, min: 1 },
  reason: { type: String, required: true, trim: true, maxlength: 300 },
}, { _id: false })

const ReturnStatusHistorySchema = new Schema({
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'received'],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  note: String,
}, { _id: false })

const ReturnRequestSchema = new Schema<IReturnRequest>({
  returnNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
    default: () => `RET-${new mongoose.Types.ObjectId().toString().slice(-10).toUpperCase()}`,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  items: {
    type: [ReturnItemSchema],
    required: true,
    validate: {
      validator: (items: IReturnRequestItem[]) => items.length > 0,
      message: 'At least one returned item is required',
    },
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'received'],
    default: 'pending',
    index: true,
  },
  statusHistory: { type: [ReturnStatusHistorySchema], default: [] },
  adminNote: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true })

ReturnRequestSchema.pre('save', function () {
  this.wasNew = this.isNew

  if (this.isNew) {
    this.statusHistory = [{ status: 'pending', timestamp: new Date() }]
  } else if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: this.adminNote,
    })
  }
})

ReturnRequestSchema.post('save', async function () {
  if (!this.wasNew) return

  await createNotification({
    type: 'ORDER',
    message: `New return request ${this.returnNumber}`,
    link: `/admin/orders?order=${this.order.toString()}`,
  }).catch(console.error)
})

ReturnRequestSchema.index({ order: 1, createdAt: -1 })
ReturnRequestSchema.index({ status: 1, createdAt: -1 })

const ReturnRequest: Model<IReturnRequest> = mongoose.models.ReturnRequest
  || mongoose.model<IReturnRequest>('ReturnRequest', ReturnRequestSchema)

export default ReturnRequest
