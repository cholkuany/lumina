import mongoose, { Schema, Model } from 'mongoose';
import { createNotification } from '@/lib/queries/notification.queries';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

// Order Item Sub-schema (snapshot of cart item at time of order)
const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  // Snapshot of product details at time of order
  productSnapshot: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
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

// Shipping Address
const ShippingAddressSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  street: { type: String, required: true },
  apartment: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
}, { _id: false });

// Status History
const StatusHistorySchema = new Schema({
  status: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
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
  productSnapshot: {
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  selectedVariants?: Map<string, string>;
  // itemTotal: number;
}

export interface IShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface IStatusHistory {
  _id?: mongoose.Types.ObjectId;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  timestamp: Date;
  note?: string;
}

export interface IOrder {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusHistory: IStatusHistory[];
  shippingAddress: IShippingAddress;
  billingAddress?: IShippingAddress;
  trackingNumber?: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
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
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
      index: true,
    },
    statusHistory: [StatusHistorySchema],
    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },
    billingAddress: ShippingAddressSchema,
    trackingNumber: String,
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    notes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate order number before saving
OrderSchema.pre('save', async function () {
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
  this.wasNew = this.isNew
  if (!this.isNew && this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
});

// Update user's total orders count
OrderSchema.post('save', async function () {
  if (this.status !== 'cancelled') {
    const User = mongoose.model('User');
    const count = await mongoose.model('Order').countDocuments({
      user: this.user,
      status: { $ne: 'cancelled' },
    });
    await User.findByIdAndUpdate(this.user, { totalOrders: count });
  }
});

// New order placed
OrderSchema.post('save', async function () {
  const name = this.shippingAddress.firstName + ' ' + this.shippingAddress.lastName
  if (this.wasNew) {
    await createNotification({
      type: 'ORDER',
      message: `New order received from ${name} — $${this.total.toFixed(2)}`,
      link: `/admin/orders/${this._id}`,
    }).catch(console.error)
    return
  }

  // Order status changed → notify on meaningful transitions
  const statusMessages: Partial<Record<OrderStatus, string>> = {
    SHIPPED: `Order from ${name} has been shipped`,
    DELIVERED: `Order from ${name} was delivered`,
    CANCELLED: `Order from ${name} was cancelled`,
  }

  const message = statusMessages[this.status as OrderStatus]
  if (message) {
    await createNotification({
      type: 'ORDER',
      message,
      link: `/admin/orders/${this._id}`,
    }).catch(console.error)
  }
})

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