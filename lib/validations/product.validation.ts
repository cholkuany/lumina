import { z } from 'zod'

export const productVariantSchema = z.object({
  attributes: z.object({
    color: z.string(),
    size: z.string(),
    material: z.string().optional(),
  }),
  stock: z
    .number({ error: 'stock is required' })
    .min(0, 'stock cannot be negative'),
  price: z
    .number({ error: 'Price is required' })
    .min(0, 'Price cannot be negative'),
  originalPrice: z
    .number()
    .min(0, 'Original price cannot be negative')
    .optional()
    .nullable(),
  images: z
    .array(z.string())
    .min(1, 'At least one image is required'),
  sku: z
    .string()
    .min(1, 'SKU name is required')
    .max(50, 'SKU name cannot exceed 50 characters'),
})
  .refine(
    (data) => data.originalPrice == null || data.originalPrice >= data.price,
    {
      message: 'Original price must be greater than or equal to current price',
      path: ['originalPrice'],
    }
  )

export const specificationSchema = z.object({
  key: z.string().min(1, 'Specification key is required'),
  value: z.string().min(1, 'Specification value is required'),
})

export const productSchema = z.object({
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
  price: z
    .number({ error: 'Price is required' })
    .min(0, 'Price cannot be negative'),
  originalPrice: z
    .number()
    .min(0, 'Original price cannot be negative')
    .optional()
    .nullable(),
  brand: z.string().max(200).optional(),
  category: z.object({
    name: z.string().min(1, 'Category name is required'),
    parent: z.string().optional().nullable(),
    ancestors: z.array(z.string()).optional(),
  }),
  stockCount: z.number().min(0, 'Stock count cannot be negative').optional(),
  unitsSold: z.number().min(0, 'Units sold cannot be negative').optional(),
  variants: z.array(productVariantSchema).min(1, 'At least one variant is required'),
  specifications: z.array(specificationSchema),
  isNewArrival: z.boolean(),
  isSale: z.boolean(),
  isFeatured: z.boolean()
})
  .refine(
    (data) => data.originalPrice == null || data.originalPrice >= data.price,
    {
      message: 'Original price must be greater than or equal to current price',
      path: ['originalPrice'],
    }
  )

export type ProductFormData = z.infer<typeof productSchema>
export type ProductVariantFormData = z.infer<typeof productVariantSchema>
export type SpecificationFormData = z.infer<typeof specificationSchema>