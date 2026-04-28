import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import Category from '@/lib/db/models/Category'
import { categorySchema } from '@/lib/validations/category.validation'
import { z } from 'zod'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const category = await Category.findById(params.id)
      .populate('parent', 'name slug')
      .lean()

    if (!category) {
      return NextResponse.json(
        {
          message: 'Category not found',
          status: 404
        }
      )
    }

    return NextResponse.json({
      ...category,
      id: category._id.toString(),
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      {
        message: 'Failed to fetch category',
        status: 500
      }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const categoryId = params.id
    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    const category = await Category.findById(categoryId)
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    // Validate parent change (if provided)
    if (validatedData.parent) {
      // ❌ Cannot be its own parent
      if (validatedData.parent === categoryId) {
        return NextResponse.json(
          {
            message: 'Category cannot be its own parent',
            status: 400
          }
        )
      }

      // ❌ Cannot move under its own descendant
      const isAncestor = category.ancestors.some(
        (a) => a._id.toString() === validatedData.parent
      )

      if (isAncestor) {
        return NextResponse.json(
          {
            message: 'Invalid parent: circular hierarchy',
            status: 400
          }
        )
      }

      // ❌ Parent must exist
      const parentExists = await Category.exists({
        _id: validatedData.parent,
      })

      if (!parentExists) {
        return NextResponse.json(
          {
            message: 'Parent category does not exist',
            status: 400
          }
        )
      }
    }

    const parentChanged =
      validatedData.parent !== undefined &&
      validatedData.parent?.toString() !== category.parent?.toString()

    category.set({
      ...validatedData,
      parent: validatedData.parent ?? null,
    })

    await category.save() // 🔹 ancestors recomputed here

    // 🔁 Cascade ancestor changes
    if (parentChanged) {
      await updateDescendantAncestors(category)
    }

    return NextResponse.json(category.toJSON())
  } catch (error) {
    console.error('Error updating category:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Validation error', details: error.message,
          status: 400
        }
      )
    }

    return NextResponse.json(
      {
        message: 'Failed to update category',
        status: 500
      }
    )
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    // Check if category has children
    const hasChildren = await Category.exists({ parent: params.id })
    if (hasChildren) {
      return NextResponse.json(
        {
          message: 'Cannot delete category with subcategories. Please delete or move subcategories first.',
          status: 400
        }
      )
    }

    // Check if category has products
    const category = await Category.findById(params.id)
    if (category && category.productCount > 0) {
      return NextResponse.json(
        {
          message: 'Cannot delete category with associated products. Please reassign products first.',
          status: 400
        }
      )
    }

    const deletedCategory = await Category.findByIdAndDelete(params.id)

    if (!deletedCategory) {
      return NextResponse.json(
        {
          message: 'Category not found',
          status: 404
        }
      )
    }

    return NextResponse.json({ message: 'Category deleted successfully', status: 200 })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      {
        message: 'Failed to delete category',
        status: 500
      }
    )
  }
}

async function updateDescendantAncestors(category: any) {
  const descendants = await Category.find({
    ancestors: { $elemMatch: { _id: category._id } },
  })

  for (const child of descendants) {
    const index = child.ancestors.findIndex(
      (a) => a._id.toString() === category._id.toString()
    )

    child.ancestors = [
      ...category.ancestors,
      {
        _id: category._id,
        name: category.name,
        slug: category.slug,
      },
      ...child.ancestors.slice(index + 1),
    ]

    await child.save()
  }
}