import mongoose, { Schema, Model } from 'mongoose';
import { createNotification } from '@/lib/queries/notification.queries';
import { AddressSnapshotSchema, type IShippingAddress } from './Address';
import { OrderStatus, TPaymentStatus, TInventoryStatus } from '@/lib/types';

export type { IShippingAddress } from './Address';
const orderStatusArr = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const paymentStatusArr = ['pending', 'paid', 'failed', 'refunded']
const invertoryStatusArr = ['pending', 'adjusted', 'failed']

// Order Item Sub-schema (snapshot of cart item at time of order)
const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  variant: {
    type: Schema.Types.ObjectId,
  },
  // Snapshot of product details at time of order
  productSnapshot: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    sku: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  selectedVariants: {
    type: Map,
    of: String,
  },
});

// Status History
const StatusHistorySchema = new Schema({
  status: {
    type: String,
    enum: orderStatusArr,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  note: String,
}, { _id: true });

export interface IOrderItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  variant?: mongoose.Types.ObjectId;
  productSnapshot: {
    name: string;
    price: number;
    image: string;
    sku?: string;
  };
  quantity: number;
  selectedVariants?: Map<string, string>;
  // itemTotal: number;
}

export interface IStatusHistory {
  _id?: mongoose.Types.ObjectId;
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

export interface PaymentMethod {
  type: 'card' | 'paypal';
  brand: string;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface IOrder {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  customerEmail?: string;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  statusHistory: IStatusHistory[];
  shippingAddress: IShippingAddress;
  billingAddress?: IShippingAddress;
  trackingNumber?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: TPaymentStatus
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string;
  inventoryStatus: TInventoryStatus;
  inventoryAdjustedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (v: unknown[]) => v.length > 0,
        message: 'Order must have at least one item',
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shipping: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: orderStatusArr,
      default: 'processing',
      index: true,
    },
    statusHistory: [StatusHistorySchema],
    shippingAddress: {
      type: AddressSnapshotSchema,
      required: true,
    },
    billingAddress: AddressSnapshotSchema,
    trackingNumber: String,
    paymentMethod: {
      type: {
        type: String,
        enum: ['card', 'paypal'],
      },
      brand: String,
      last4: String,
      expiryMonth: Number,
      expiryYear: Number,
    },
    paymentStatus: {
      type: String,
      enum: paymentStatusArr,
      default: 'pending',
    },
    stripeCheckoutSessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      sparse: true,
    },
    stripePaymentIntentId: String,
    inventoryStatus: {
      type: String,
      enum: invertoryStatusArr,
      default: 'pending',
    },
    inventoryAdjustedAt: Date,
    notes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate required values before Mongoose runs validation.
OrderSchema.pre('validate', async function () {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Count today's orders to generate sequence
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const count = await mongoose.model('Order').countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    this.orderNumber = `ORD-${year}${month}${day}-${sequence}`;
  }

  // Add initial status to history if new order
  if (this.isNew) {
    this.statusHistory = [{
      status: this.status,
      timestamp: new Date(),
    }];
  }
});

// Update status history when status changes
OrderSchema.pre('save', function () {
  const hasStatusChanged = !this.isNew && this.isModified('status');

  this.$locals.wasNew = this.isNew;
  this.$locals.statusChanged = hasStatusChanged;

  if (hasStatusChanged) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
});

// Update user's total orders count and create notification
OrderSchema.post('save', async function () {
  const { wasNew, hasStatusChanged } = this.$locals as {
    wasNew?: boolean;
    hasStatusChanged?: boolean;
  };

  if (!wasNew && !hasStatusChanged) return;

  // User's order count
  try {
    const count = await mongoose.model('Order').countDocuments({
      user: this.user,
      status: { $ne: 'cancelled' },
    });
    await mongoose.model('User').findByIdAndUpdate(this.user, { totalOrders: count });
  } catch (err) {
    console.error('Failed to update user order count', err);
  }

  // Notification
  const name = `${this.shippingAddress.firstName} ${this.shippingAddress.lastName}`;
  const statusMessages: Record<OrderStatus, string> = {
    processing: `Order from ${name} is being processed`,
    shipped: `Order from ${name} has been shipped`,
    delivered: `Order from ${name} was delivered`,
    cancelled: `Order from ${name} was cancelled`,
    pending: `Order from ${name} is pending`,
  };

  const message = wasNew
    ? `New order received from ${name} — $${this.total.toFixed(2)}`
    : statusMessages[this.status];

  await createNotification({
    type: 'ORDER',
    message,
    link: `/admin/orders/${this._id}`,
  }).catch(console.error);
});

// Virtual for item count
OrderSchema.virtual('itemCount').get(function () {
  return this.items.reduce((acc, item) => acc + item.quantity, 0);
});

// Indexes
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
