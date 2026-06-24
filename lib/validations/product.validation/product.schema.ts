import { z } from 'zod'

import { variantSchema } from './variant.schema'

// product category
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  parent: z.string().optional().nullable(),
  ancestors: z.array(z.string()).optional(),
})
const categoryUpdateSchema = categorySchema.partial()

// product specifications
export const specificationSchema = z.object({
  key: z.string().min(1, 'Specification key is required'),
  value: z.string().min(1, 'Specification value is required'),
})
const specificationUpdateSchema = specificationSchema.partial()

// product fields
const baseProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(200, 'Product name cannot exceed 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(150, 'Description cannot exceed 150 characters'),
  longDescription: z
    .string()
    .max(1000, 'Long description cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  brand: z.string().max(200).optional(),
  category: categorySchema,
  unitsSold: z.number().min(0, 'Units sold cannot be negative').optional(),
  variants: z.array(variantSchema).min(1, 'At least one variant is required'),
  specifications: z.array(specificationSchema),
  isNewArrival: z.boolean(),
  isSale: z.boolean(),
  isFeatured: z.boolean()
})

export const productSchema = baseProductSchema

export const productUpdateSchema = baseProductSchema.partial().extend({
  category: categoryUpdateSchema.optional(),
  specifications: z.array(specificationUpdateSchema).optional(),

  // variants handled separately
  variants: z.never().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
})

// TYPES
export type ProductFormData = z.infer<typeof productSchema>
export type SpecificationFormData = z.infer<typeof specificationSchema>
export type UpdateProduct = z.infer<typeof productUpdateSchema>