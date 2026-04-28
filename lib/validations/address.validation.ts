import { z } from 'zod'

export const addressSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters'),
  street: z
    .string()
    .min(1, 'Street address is required')
    .max(200, 'Street cannot exceed 200 characters'),
  apartment: z
    .string()
    .max(100, 'Apartment cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City cannot exceed 100 characters'),
  state: z
    .string()
    .min(1, 'State is required')
    .max(100, 'State cannot exceed 100 characters'),
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .max(20, 'ZIP code cannot exceed 20 characters'),
  country: z.string().min(1, 'Country is required').default('United States'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .max(20, 'Phone cannot exceed 20 characters')
    .regex(/^[\d\s\-+()]+$/, 'Invalid phone number format'),
  isDefault: z.boolean().default(false),
})

export type AddressFormData = z.infer<typeof addressSchema>