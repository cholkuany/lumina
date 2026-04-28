import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import Category from '@/lib/db/models/Category'
import { categorySchema } from '@/lib/validations/category.validation'
import { z } from 'zod'
import { FlatCategory } from '@/hooks/useCategories'

export const categoryProjection = {
  $project: {
    _id: 0,
    id: { $toString: '$_id' },
    name: 1,
    description: 1,
    slug: 1,
    ancestors: {
      $map: {
        input: { $ifNull: ['$ancestors', []] },
        as: 'ancestor',
        in: {
          name: '$$ancestor.name',
          slug: '$$ancestor.slug',
          id: { $toString: '$$ancestor._id' }
        }
      }
    },
    image: 1,
    isActive: 1,
    parent: {
      $let: {
        vars: {
          p: { $arrayElemAt: ['$parent', 0] }
        },
        in: {
          id: { $toString: '$$p._id' },
          name: '$$p.name',
          slug: '$$p.slug'
        }
      }
    },
    productCount: 1,
    sortOrder: 1,
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'
    const flat = searchParams.get('flat') === 'true'
    const parentId = searchParams.get('parent')

    const query: Record<string, string | boolean | null> = {}

    if (!includeInactive) {
      query.isActive = true
    }

    if (parentId) {
      query.parent = parentId
    }

    const categories: FlatCategory[] = await Category.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'parent',
          foreignField: '_id',
          as: 'parent'
        }
      },
      { $sort: { sortOrder: 1, name: 1 } },
      categoryProjection
    ])

    if (flat) {
      return NextResponse.json(categories)
    }

    // Tree mode (Option B)
    if (!flat) {
      console.log('inside !PARENTID')
      const map = new Map<string, FlatCategory & { children: FlatCategory[] }>()
      const roots: FlatCategory[] = []

      categories.forEach((c) => {
        map.set(c.id, {
          ...c,
          children: [],
        })
      })

      categories.forEach((c) => {
        if (c.parent?.id) {
          map
            .get(c.parent.id)
            ?.children.push(map.get(c.id)!)

        } else {
          roots.push(map.get(c.id)!)
        }
      })

      for (const node of map.values()) {
        node.children.sort(
          (a, b) =>
            a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)
        )
      }

      return NextResponse.json(roots)
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const validatedData = categorySchema.safeParse(body)

    if (!validatedData.success) {
      console.log("category data", validatedData)
      return NextResponse.json(
        {
          error: "Invalid category data!",
          status: 404
        }
      )
    }

    const sanitizedData = validatedData.data
    // Validate parent existence
    if (sanitizedData.parent) {
      const parentExists = await Category.exists({
        _id: sanitizedData.parent,
      })

      if (!parentExists) {
        return NextResponse.json(
          {
            error: 'Parent category does not exist',
            status: 400
          }
        )
      }
    }

    // Check for duplicate name under same parent
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${sanitizedData.name}$`, 'i') },
      parent: sanitizedData.parent || null,
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists at this level' },
        { status: 400 }
      )
    }

    const category = await Category.create({
      ...sanitizedData,
      parent: sanitizedData.parent || null,
      // ancestors built in pre('save')
    })

    return NextResponse.json(category.toJSON(), { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: `Validation error ${error.message}`,
          status: 400
        }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to create category',
        status: 500
      }
    )
  }
}

