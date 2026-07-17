import { useMemo } from 'react'
import type { TProduct } from '@/lib/types'
import { normalizedValue } from '@/lib/utils'

import { getProductStock } from '@/lib/utils'

const statusKeys = { in_stock: 100, low_stock: 99, out_of_stock: 0 }

export function useFilteredProducts({
  products,
  filterValues,
  searchQuery,
}: {
  products: TProduct[]
  filterValues: Record<string, string>
  searchQuery: string
}) {
  return useMemo(() => filteredProducts({ products, filterValues, searchQuery }),
    [products, filterValues, searchQuery])
}

export function filteredProducts({
  products,
  filterValues,
  searchQuery,
}: {
  products: TProduct[]
  filterValues: Record<string, string>
  searchQuery: string
}) {
  const q = normalizedValue(searchQuery)

  return products.filter(p => {
    const ancestors = p.category.ancestors?.map(normalizedValue) || []
    const stock = getProductStock(p)

    const matchesSearch =
      !searchQuery ||
      normalizedValue(p.name).includes(q) ||
      normalizedValue(p.category.name).includes(q) ||
      ancestors.some(a => a.includes(q))

    const matchesFilters = Object.entries(filterValues).every(([key, value]) => {
      if (!value) return true

      if (key === 'status') {
        const threshold = statusKeys[value as keyof typeof statusKeys]
        return (stock ?? 0) >= threshold
      }

      if (key === 'category') {
        return p.category.name === value
      }

      return true
    })

    return matchesSearch && matchesFilters
  })
}
