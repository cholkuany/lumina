import type { NextRequest } from 'next/server'

import { getProduct } from '@/lib/queries/get.product'
import Product from '@/lib/db/models/Product'
import { productSchema, productUpdateSchema, UpdateProduct } from '@/lib/validations/product.validation/product.schema'
import { processVariantImages } from '../route'
import dbConnect from '@/lib/db/connection'
import { z } from 'zod'
import { slugify } from '@/lib/utils'
import mongoose from 'mongoose'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const allowedProductUpdateFields = [
    'name',
    'description',
    'longDescription',
    'brand',
    // 'price',
    // 'originalPrice',
    'category',
    // 'stockCount',
    'unitsSold',
    'specifications',
    'isNewArrival',
    'isSale',
    'isFeatured',
  ] as const

  await dbConnect()

  try {
    const { id } = await params
    const body = await req.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ message: 'Invalid product ID' }, { status: 400 })
    }

    const parseResult = productUpdateSchema.safeParse(body)

    if (!parseResult.success) {
      return Response.json(
        {
          message: 'Invalid product data',
          errors: z.flattenError(parseResult.error),
        },
        { status: 400 }
      )
    }
    const data: UpdateProduct = parseResult.data
    const update: Record<string, unknown> = {}

    for (const key of allowedProductUpdateFields) {
      if (data[key]) {
        update[key] = data[key]
      }
    }

    if (data.name && typeof data.name === 'string') {
      update.slug = slugify(data.name)
    }

    if (data.category) {
      update.category = {
        ...data.category,
        parent: data.category.parent
          ? new mongoose.Types.ObjectId(data.category.parent)
          : null
      }
    }

    return Response.json(
      {
        message: 'product updated',
        product: `${id}`
      },
      { status: 200 }
    )

  } catch (error) {
    console.log('Error patching product:', error)

    return Response.json(
      { message: 'Error updating product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect()

  try {
    const { id } = await params
    const body = await req.json()

    const parseResult = productSchema.safeParse(body)

    if (!parseResult.success) {
      return Response.json(
        {
          message: 'Invalid product data',
          errors: z.flattenError(parseResult.error),
        },
        { status: 400 }
      )
    }

    const { variants, ...basicInfo } = parseResult.data

    const formattedBasicInfo = {
      ...basicInfo,
      category: {
        ...basicInfo.category,
        parent: basicInfo.category.parent
          ? new mongoose.Types.ObjectId(basicInfo.category.parent)
          : null,
      }
    }

    const formattedVariants = await processVariantImages(variants)

    if (formattedVariants.status !== 200) {
      return Response.json(
        { message: formattedVariants.message },
        { status: formattedVariants.status }
      )
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...formattedBasicInfo,
        variants: formattedVariants.dbVariants,
        slug: slugify(formattedBasicInfo.name)
      },
      { new: true, runValidators: true }
    )

    if (!updatedProduct) {
      return Response.json({ message: 'Product not found' }, { status: 404 })
    }

    const p = await getProduct(id)
    return Response.json(
      {
        message: 'Product updated',
        product: p?.[0],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating product:', error)
    return Response.json(
      { message: 'Error updating product' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return Response.json({ message: 'Product not found' }, { status: 404 })
  }

  return Response.json(product[0], { status: 200 })
}