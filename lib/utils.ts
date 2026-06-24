// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { Product } from './types'

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

export function getDefaultVariant(product: Product) {
  return (
    product.variants.find((variant) => variant.stock > 0) ||
    product.variants[0]
  )
}

export function getProductPrice(product: Product) {
  return getDefaultVariant(product)?.price ?? 0
}

export function getProductOriginalPrice(product: Product) {
  return getDefaultVariant(product)?.originalPrice ?? null
}

export function getProductStock(product: Product) {
  return product.variants.reduce(
    (total, variant) => total + Number(variant.stock || 0),
    0
  )
}