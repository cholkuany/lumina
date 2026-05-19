import { z } from 'zod'
import mongoose from 'mongoose'

export const purchaseStatusEnum = z.enum([
  'pending',
  'ordered',
  'in_transit',
  'received',
  'cancelled',
])

export const purchaseItemSchema = z.object({
  product: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid product id',
    }),

  quantity: z
    .number({
      error: 'Quantity is required'
    }).min(1, 'Quantity must be at least 1'),

  cost: z
    .number({
      error: 'Cost is required'
    })
    .min(0, 'Cost cannot be negative'),
})

export const purchaseSchema = z.object({
  purchaseNumber: z
    .string({
      error: 'Purchase number is required',
    })
    .trim()
    .min(1, 'Purchase number is required'),

  supplier: z.object({
    name: z
      .string({
        error: 'Supplier name is required',
      })
      .trim()
      .min(1, 'Supplier name is required'),

    email: z
      .email({
        error: 'Supplier email is required',
      })
      .trim()
      .transform((email) => email.toLowerCase()),
  }),

  items: z
    .array(purchaseItemSchema)
    .min(1, 'At least one purchase item is required'),

  total: z
    .number({
      error: 'Total is required'
    }).min(0, 'Total cannot be negative'),


  status: purchaseStatusEnum.default('pending'),

  expectedDate: z.coerce.date({
    error: 'Expected date is required',
  }),

  receivedDate: z.coerce.date().nullable().optional(),

  date: z.coerce.date().optional(),
})

export type PurchaseFormValues = z.infer<typeof purchaseSchema>
export type PurchaseItemFormValues = z.infer<typeof purchaseItemSchema>