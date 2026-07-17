import { NextRequest } from 'next/server'
import { deleteImages, uploadImages } from '@/lib/cloudinary'
import { z } from 'zod'
import dbConnect from '@/lib/db/connection'
import Product from '@/lib/db/models/Product'
import type { ProductVariantFormData } from '@/lib/validations/product.validation/variant.schema'
import { productSchema } from '@/lib/validations/product.validation/product.schema'
import { getProducts } from '@/lib/queries/get.products'
import { getProduct } from '@/lib/queries/get.product'
import type { TProduct as ProductType } from '@/lib/types'
import mongoose from 'mongoose'

type ProcessedVariant = Omit<ProductVariantFormData, 'images'> & {
  images: { public_id: string; secure_url: string }[]
}

type ProcessVariantImagesResult =
  | {
    dbVariants: ProcessedVariant[]
    uploadedPublicIds: string[]
    status: 200
  }
  | {
    message: string
    status: number
  }

export async function POST(req: NextRequest) {
  return createProduct(req)
}

async function createProduct(req: NextRequest) {
  await dbConnect()

  let uploadedPublicIds: string[] = []

  try {
    const body = await req.json()

    if (!body) {
      return Response.json({ message: 'No data provided' }, { status: 400 })
    }

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

    if (!('dbVariants' in formattedVariants)) {
      return Response.json(
        { message: formattedVariants.message },
        { status: formattedVariants.status }
      )
    }

    uploadedPublicIds = formattedVariants.uploadedPublicIds

    const dbProduct = { ...formattedBasicInfo, variants: formattedVariants.dbVariants }

    const newProduct = new Product(dbProduct)
    const savedProduct = await newProduct.save()

    const p: ProductType[] | null = await getProduct(savedProduct._id.toString())
    const product = p?.[0]

    return Response.json(
      {
        message: 'Product created',
        product,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving product to database:', error)

    if (uploadedPublicIds.length > 0) {
      await deleteImages(uploadedPublicIds).catch((cleanupError) => {
        console.error('Failed to cleanup product images:', cleanupError)
      })
    }

    return Response.json(
      { message: 'Error saving product to database' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const res = await getProducts()
  return Response.json(res)
}

const getCloudinaryPublicId = (url: string) => {
  try {
    const pathname = new URL(url).pathname
    const uploadIndex = pathname.indexOf('/upload/')

    if (uploadIndex === -1) {
      return pathname.split('/').slice(-2).join('/').split('.')[0]
    }

    const uploadPath = pathname.slice(uploadIndex + '/upload/'.length)
    const withoutVersion = uploadPath.replace(/^v\d+\//, '')

    return withoutVersion.replace(/\.[^/.]+$/, '')
  } catch {
    return url.split('/').slice(-2).join('/').split('.')[0]
  }
}

export const processVariantImages = async (
  variants: ProductVariantFormData[]
): Promise<ProcessVariantImagesResult> => {
  const dbVariants: ProcessedVariant[] = []
  const uploadedPublicIds: string[] = []

  for (const variant of variants) {
    const { images, ...variantData } = variant

    if (!images || images.length === 0) {
      return {
        message: 'Each variant must have at least one image',
        status: 400,
      }
    }

    try {
      const existingImages: { public_id: string; secure_url: string }[] = []
      const newImageUrls: string[] = []

      images.forEach((img) => {
        if (img.includes('cloudinary.com') || img.includes('res.cloudinary')) {
          existingImages.push({
            secure_url: img,
            public_id: getCloudinaryPublicId(img)
          })
        } else {
          newImageUrls.push(img)
        }
      })

      const uploadedImageIds = newImageUrls.length > 0
        ? await uploadImages(newImageUrls, 'lumina/products')
        : []

      uploadedPublicIds.push(...uploadedImageIds.map((image) => image.public_id))

      // const uploadedImageIds = await uploadImages(images, 'lumina/products')
      dbVariants.push({ ...variantData, images: [...existingImages, ...uploadedImageIds] })
    } catch (error) {
      if (uploadedPublicIds.length > 0) {
        await deleteImages(uploadedPublicIds).catch((cleanupError) => {
          console.error('Failed to cleanup uploaded variant images:', cleanupError)
        })
      }

      return {
        message: error instanceof Error ? error.message : 'Error uploading images',
        status: 500
      }
    }
  }
  return { dbVariants, uploadedPublicIds, status: 200 }
}
