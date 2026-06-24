import mongoose from "mongoose";
import { z } from 'zod'

import { NextRequest } from "next/server";

import dbConnect from "@/lib/db/connection";
import {
  variantUpdateSchema,
  type UpdateVariant
} from "@/lib/validations/product.validation/variant.schema";

import { Product } from "@/lib/db/models";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  await dbConnect()

  try {
    const { id, variantId } = await params
    const body = await req.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { message: 'Invalid product ID' },
        { status: 400 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(variantId)) {
      return Response.json(
        { message: 'Invalid variant ID' },
        { status: 400 }
      )
    }

    const parsedResult = variantUpdateSchema.safeParse(body)

    if (!parsedResult.success) {
      return Response.json(
        {
          message: 'Invalid variant data',
          errors: z.flattenError(parsedResult.error),
        },
        { status: 400 }
      )
    }

    const data: UpdateVariant = parsedResult.data
    const update: Record<string, unknown> = {}

    const allowedFields = [
      'sku',
      'price',
      'originalPrice',
      'stock',
    ] as const

    for (const key of allowedFields) {
      if (data[key]) {
        update[`variants.$.${key}`] = data[key]
      }
    }

    if (data.attributes) {
      for (const [key, value] of Object.entries(data.attributes)) {
        if (value) {
          update[`variants.$.attributes.${key}`] = value
        }
      }
    }

    if (Object.keys(update).length === 0) {
      return Response.json(
        { message: 'No valid fields provided for update' },
        { status: 400 }
      )
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      {
        _id: id,
        'variants._id': variantId
      },
      { $set: update },
      { new: true }
    )

    if (!updatedProduct) {
      return Response.json(
        { message: 'Product or variant not found' },
        { status: 404 }
      )
    }

    return Response.json(
      {
        message: 'Variant updated',
        variant: variantId
      }
    )

  } catch (error) {
    console.error('Error updating variant: ', error)

    return Response.json(
      { message: 'Error updating variant' },
      { status: 500 }
    )
  }
}