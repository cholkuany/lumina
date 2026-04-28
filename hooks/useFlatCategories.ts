import { useQuery } from '@tanstack/react-query'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parent?: { id: string; name: string } | null
  isActive: boolean
  sortOrder: number
  productCount: number
  children: Category[]
  ancestors: { _id: string; name: string; slug: string }[]
}

export interface FlatCategory {
  id: string
  name: string
  level: number
}

export const useFlatCategories = (flat: boolean) =>
  useQuery({
    queryKey: ['flatCategories', flat],

    queryFn: async () => {
      const res = await fetch(
        `/api/categories?flat=${flat}`
      )

      if (!res.ok) throw new Error('Failed to fetch flat categories')

      const data = await res.json()
      const flatCategories = buildFlatList(data)
      console.log('/api/categories?flat=true RES', flatCategories)
      return flatCategories
    },
    staleTime: 10 * 60 * 1000,
  })

// Build flat list with levels for parent select
export const buildFlatList = (cats: Category[], result: FlatCategory[] = []): FlatCategory[] => {
  cats.map(cat => {
    result.push({
      id: cat.id,
      name: cat.name,
      level: 0,
    })
  })

  return result
}
