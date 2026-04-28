import { useQuery } from '@tanstack/react-query'

// export interface Category {
//   id: string
//   name: string
//   slug: string
//   description?: string
//   image?: string
//   parent?: { id: string; name: string; slug: string } | null
//   isActive: boolean
//   sortOrder: number
//   productCount: number
//   children: Category[]
//   ancestors: { id: string; name: string; slug: string }[]
// }

// export interface FlatCategory {
//   id: string
//   name: string
//   level: number
// }
// type FlatCategory = 
// {
//   ancestors: {
//     name: string
//     slug: string
//     id: string
//   }[]
//   description: string
//   image: string
//   isActive: boolean
//   name: string
//   parent: {
//     name: string
//     slug: string
//     id: string
//   }
//   productCount: number
//   slug: string
//   sortOrder: number
//   id: string
// }

export interface NestedCategory {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parent?: { id: string; name: string; slug: string } | null
  isActive: boolean
  sortOrder: number
  productCount: number
  children: NestedCategory[]
  ancestors: { id: string; name: string; slug: string }[]
}

export type FlatCategory = Omit<NestedCategory, 'children'>

export type NormalizedCategories = {
  categories: NestedCategory[]
  categoryMap: Map<string, NestedCategory>
}

export const useCategories = (showInactive: boolean) => {
  return useQuery({
    queryKey: ['categories', showInactive],

    queryFn: async () => {
      const treeResponse = await fetch(`/api/categories?includeInactive=${showInactive}`)

      if (!treeResponse.ok) {
        throw new Error('Error fetching categories')
      }

      return {
        tree: (await treeResponse.json()) as NestedCategory[],
      }
    },

    select: ({ tree }): NormalizedCategories => {
      const categoryMap = new Map<string, NestedCategory>()

      const walk = (cats: NestedCategory[]) => {
        cats.forEach((cat) => {
          categoryMap.set(cat.id, cat)
          if (cat.children?.length) {
            walk(cat.children)
          }
        })
      }

      walk(tree)

      return {
        categories: tree,
        categoryMap,
      }
    },

    staleTime: 5 * 60 * 1000,
  })
}
