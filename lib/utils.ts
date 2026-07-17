// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { TProduct } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  if (price === undefined || price === null || isNaN(price)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[-\s]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
export function normalizedValue(value: string) {
  return value.trim().toLowerCase()
}

export const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString)
  return format(date, 'PPP')
}

export function getDefaultVariant(product: TProduct) {
  return (
    product.variants.find((variant) => variant.stock > 0) ||
    product.variants[0]
  )
}

export function getProductPrice(product: TProduct) {
  return getDefaultVariant(product)?.price ?? 0
}

export function getProductOriginalPrice(product: TProduct) {
  return getDefaultVariant(product)?.originalPrice ?? null
}

export function getProductDiscount(product?: TProduct) {
  const currentVariant = product?.variants?.[0]

  if (!currentVariant?.originalPrice || !currentVariant.price) return null

  const price = Number(currentVariant.price)
  const original = Number(currentVariant.originalPrice)

  if (!original || original <= price) return null

  return Math.round(((original - price) / original) * 100)
}

export function getProductStock(product: TProduct) {
  return product.variants.reduce(
    (total, variant) => total + Number(variant.stock || 0),
    0
  )
}
