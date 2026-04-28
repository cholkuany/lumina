'use client'

import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/lib/types'

export const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const result = await fetch('/api/products/')

      if (!result.ok) {
        throw new Error('Error fetching data')
      }
      return result.json() as Promise<Product[]>
    }
  })

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const result = await fetch(`/api/products/${id}`)

      if (!result.ok) {
        throw new Error('Error fetching data')
      }

      console.log('\n\nFetch result:\n\n\n', result)

      return result.json() as Promise<Product>
    }
  })