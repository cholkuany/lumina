import dbConnect from '@/lib/db/connection'
import Category from '@/lib/db/models/Category'

export interface StorefrontCategory {
  id: string
  name: string
  slug: string
  image?: string
}

export async function getStorefrontCategories(limit = 8): Promise<StorefrontCategory[]> {
  await dbConnect()

  return Category.aggregate<StorefrontCategory>([
    { $match: { isActive: true, parent: null } },
    { $sort: { sortOrder: 1, name: 1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        id: { $toString: '$_id' },
        name: 1,
        slug: 1,
        image: 1,
      },
    },
  ])
}
