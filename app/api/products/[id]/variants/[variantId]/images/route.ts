import { NextRequest } from "next/server";
import mongoose from 'mongoose'
import { z } from 'zod'
// import Product from "@/lib/db/models";
import dbConnect from "@/lib/db/connection";
import { uploadImages, deleteImages } from "@/lib/cloudinary";
import { Product } from "@/lib/db/models";

const patchImagesSchema = z.object({
  images: z
    .array(z.string().startsWith('data:image/'))
    .min(1, 'At least one image is required'),
})

const deleteImageSchema = z.object({
  public_id: z.string().min(1, 'Image public_id is required'),
})

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string; }> }
) {
  await dbConnect()

  try {
    const { id, variantId } = await params
    const body = await req.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ message: 'Invalid product ID' }, { status: 400 })
    }

    const parseResult = deleteImageSchema.safeParse(body)

    if (!parseResult.success) {
      return Response.json(
        {
          message: 'Invalid data',
          errors: z.flattenError(parseResult.error),
        },
        { status: 400 }
      )
    }

    const { public_id } = parseResult.data

    const product = await Product.findOne(
      {
        _id: id,
        'variants._id': variantId,
      },
      {
        'variants.$': 1,
      }
    )

    if (!product) {
      return Response.json({ message: 'Product or variant not found' }, { status: 404 })
    }

    if (!product.variants || product.variants.length === 0) {
      return Response.json({ message: 'Variant not found' }, { status: 404 })
    }

    const variant = product.variants[0]
    const imageExists = variant.images.some(
      (image) => image.public_id === public_id
    )
    if (!imageExists) {
      return Response.json({ message: 'Image not found' }, { status: 404 })
    }

    if (variant.images.length === 1) {
      return Response.json({ message: 'Cannot delete the only image of a variant' }, { status: 400 })
    }

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: id,
        'variants._id': variantId,
      },
      {
        $pull: {
          'variants.$.images': { public_id },
        },
      },
      { new: true }
    )

    if (!updatedProduct) {
      return Response.json({ message: 'Failed to update product' }, { status: 500 })
    }

    const result = await deleteImages([public_id])
    console.log('Deleted image result:', result)

  } catch (error) {
    console.error('Error deleting image:', error)
    return Response.json({ message: 'Failed to delete image' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string; }> }
) {
  await dbConnect()

  try {
    const { id, variantId } = await params
    const body = await req.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ message: 'Invalid product ID' }, { status: 400 })
    }

    const parseResult = patchImagesSchema.safeParse(body)

    if (!parseResult.success) {
      return Response.json(
        {
          message: 'Invalid data',
          errors: z.flattenError(parseResult.error),
        },
        { status: 400 }
      )
    }

    const uploadedImages = await uploadImages(
      parseResult.data.images,
      'lumina/products'
    )

    const updatedProduct = await Product.findByIdAndUpdate(
      {
        _id: id,
        'variants._id': variantId,
      },
      {
        $push: {
          'variants.$.images': { $each: uploadedImages },
        },
      },
      { new: true }
    )

    if (!updatedProduct) {
      return Response.json({ message: 'Failed to update product' }, { status: 500 })
    }

    return Response.json({
      message: `${uploadedImages.length} images added successfully to variant ${variantId} of product ${id}`
    })


  } catch (error) {
    console.error('Error adding images:', error)
    return Response.json({ message: 'Failed to add images' }, { status: 500 })
  }
}