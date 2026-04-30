import mongoose, { Schema, Model } from 'mongoose';

import { createNotification } from '@/lib/queries/notification.queries';

// Cart Item Sub-schema
const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  selectedVariants: {
    type: Map,
    of: String,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Wishlist Item Sub-schema
const WishlistItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  selectedVariants?: Map<string, string>;
  addedAt: Date;
}

export interface IWishlistItem {
  product: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface IUser {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  role: 'customer' | 'admin' | 'moderator';
  cart: ICartItem[];
  wishlist: IWishlistItem[];
  addresses: mongoose.Types.ObjectId[];
  totalOrders: number;
  totalReviews: number;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    avatar: String,
    phone: {
      type: String,
      match: [/^[\d\s\-+()]+$/, 'Please enter a valid phone number'],
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'moderator'],
      default: 'customer',
    },
    cart: [CartItemSchema],
    wishlist: [WishlistItemSchema],
    addresses: [{
      type: Schema.Types.ObjectId,
      ref: 'Address',
    }],
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.pre('save', function () {
  this.wasNew = this.isNew
})

// New customer registered
UserSchema.post('save', async function () {
  if (!this.wasNew) return
  // don't notify for admin accounts being created
  if (this.role === 'admin') return

  await createNotification({
    type: 'USER',
    message: `New customer registered: ${this.email}`,
    link: `/admin/users/${this._id}`,
  }).catch(console.error)
})

// Indexes
// UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;