import mongoose, { Schema, Model } from 'mongoose'


export type PurchaseStatus =
  | 'pending'
  | 'ordered'
  | 'in_transit'
  | 'received'
  | 'cancelled'

export interface IPurchase {
  purchaseNumber: string
  supplier: {
    name: string
    email: string
  }
  items: {
    product: mongoose.Types.ObjectId
    variant: mongoose.Types.ObjectId
    quantity: number
    cost: number
  }[]
  total: number
  status: PurchaseStatus
  expectedDate: Date
  receivedDate: Date | null
  date: Date
  notes?: string
  inventoryAppliedAt?: Date
}

const PurchaseSchema = new Schema<IPurchase>(
  {
    purchaseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    supplier: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        variant: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        cost: { type: Number, required: true, min: 0 },
      },
    ],

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        'pending',
        'ordered',
        'in_transit',
        'received',
        'cancelled',
      ],
      default: 'pending',
      required: true,
    },

    expectedDate: {
      type: Date,
      required: true,
    },

    receivedDate: {
      type: Date,
      default: null,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: { type: String, trim: true, maxlength: 1000 },
    inventoryAppliedAt: { type: Date },
  },
  {
    timestamps: true,
  }
)

const Purchase: Model<IPurchase> =
  mongoose.models.Purchase ||
  mongoose.model<IPurchase>('Purchase', PurchaseSchema)

export default Purchase
