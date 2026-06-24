import { z } from 'zod'

export const imageSchema = z
  .array(z.string())
  .min(1, 'At least one image is required')
// z.object({
//   secure_url: z.string(),
//   public_id: z.string(),
// })

export const attributesSchema = z.object({
  color: z.string(),
  size: z.string(),
  material: z.string().optional(),
})

// Variant validation
export const baseVariantSchema = z.object({
  attributes: attributesSchema,
  stock: z.number({ error: 'stock is required' }).min(0, 'Stock cannot be negative'),
  price: z.number({ error: 'Price is required' }).min(0, 'Price cannot be negative'),
  originalPrice: z.number().min(0, 'Original price cannot be negative').optional().nullable(),
  images: imageSchema,
  sku: z.string().min(1).max(50, 'SKU must be between 1 and 50 characters'),
})

export const variantSchema = baseVariantSchema.refine(
  (data) => data.originalPrice == null || data.originalPrice >= data.price,
  {
    message: 'Original price must be greater than or equal to current price',
    path: ['originalPrice'],
  }
)

export const variantUpdateSchema = baseVariantSchema.partial().extend({
  attributes: attributesSchema.partial().optional(),
  images: z.never().optional()
})

export type UpdateVariant = z.infer<typeof variantUpdateSchema>
export type ProductVariantFormData = z.infer<typeof variantSchema>