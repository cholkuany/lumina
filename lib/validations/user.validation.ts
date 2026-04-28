import { z } from 'zod';
import { objectIdSchema } from './review.validation';

// ─────────────────────────────────────────────
// Sub-schemas
// ─────────────────────────────────────────────

export const CartItemSchema = z.object({
  product: objectIdSchema,

  quantity: z
    .number({ error: 'Quantity is required' })
    .int()
    .min(1, 'Quantity must be at least 1')
    .default(1),

  selectedVariants: z
    .record(z.string(), z.string())
    .optional(),

  addedAt: z
    .date()
    .default(() => new Date()),
});

export const WishlistItemSchema = z.object({
  product: objectIdSchema,

  addedAt: z
    .date()
    .default(() => new Date()),
});

// ─────────────────────────────────────────────
// User Role Enum
// ─────────────────────────────────────────────

export const UserRoleEnum = z.enum(['customer', 'admin', 'moderator']);

// ─────────────────────────────────────────────
// Full User Schema
// ─────────────────────────────────────────────

export const UserSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .trim()
    .toLowerCase()
    .regex(/^\S+@\S+\.\S+$/, 'Please enter a valid email'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),

  firstName: z
    .string({ error: 'First name is required' })
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters'),

  lastName: z
    .string({ error: 'Last name is required' })
    .trim()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters'),

  avatar: z.string().optional(),

  phone: z
    .string()
    .regex(/^[\d\s\-+()]+$/, 'Please enter a valid phone number')
    .optional(),

  role: UserRoleEnum.default('customer'),

  cart: z.array(CartItemSchema).default([]),

  wishlist: z.array(WishlistItemSchema).default([]),

  addresses: z.array(objectIdSchema).default([]),

  totalOrders: z
    .number()
    .int()
    .nonnegative()
    .default(0),

  totalReviews: z
    .number()
    .int()
    .nonnegative()
    .default(0),

  isVerified: z.boolean().default(false),

  isActive: z.boolean().default(true),

  lastLogin: z.date().optional(),

  // Managed by Mongoose `timestamps: true`
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// ─────────────────────────────────────────────
// Partial Schemas for Specific Use Cases
// ─────────────────────────────────────────────

/**
 * Used when creating a new user.
 */
export const CreateUserSchema = UserSchema.omit({
  totalOrders: true,
  totalReviews: true,
  isVerified: true,
  cart: true,
  wishlist: true,
  addresses: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

/**
 * Used when updating an existing user profile.
 * All fields are optional; password updates should
 * go through a dedicated change-password flow.
 */
export const UpdateUserSchema = UserSchema.pick({
  firstName: true,
  lastName: true,
  avatar: true,
  phone: true,
}).partial();

/**
 * Used for login validation.
 */
export const LoginSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .trim()
    .toLowerCase()
    .regex(/^\S+@\S+\.\S+$/, 'Please enter a valid email'),

  password: z
    .string({ error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters'),
});

// ─────────────────────────────────────────────
// Inferred TypeScript Types
// ─────────────────────────────────────────────

export type CartItem = z.infer<typeof CartItemSchema>;
export type WishlistItem = z.infer<typeof WishlistItemSchema>;
export type UserRole = z.infer<typeof UserRoleEnum>;
export type ZUser = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;