import { Product } from "../db/models";
import dbConnect from "../db/connection";
import type { Product as ProductType } from "../types";
import mongoose from "mongoose";

export const productProjection = {
  $project: {
    _id: 0,
    id: { $toString: '$_id' },
    name: 1,
    description: 1,
    longDescription: 1,
    price: 1,
    originalPrice: 1,
    rating: 1,
    reviewCount: 1,
    stockCount: 1,
    specifications: 1,
    isNewArrival: 1,
    isSale: 1,
    isFeatured: 1,
    brand: 1,
    slug: 1,
    unitsSold: 1,
    category: {
      name: 1,
      parent: {
        $cond: [
          { $ifNull: ['$category.parent', false] },
          { $toString: '$category.parent' },
          null,
        ],
      },
      ancestors: 1
    },
    variants: {
      $map: {
        input: '$variants',
        as: 'variant',
        in: {
          sku: '$$variant.sku',
          stock: '$$variant.stock',
          attributes: {
            color: '$$variant.attributes.color',
            size: '$$variant.attributes.size',
            material: '$$variant.attributes.material'
          },
          price: '$$variant.price',
          originalPrice: '$$variant.originalPrice',
          images: {
            $map: {
              input: '$$variant.images',
              as: 'image',
              in: {
                _id: 0,
                secure_url: '$$image.secure_url',
                public_id: '$$image.public_id'
              }
            }
          },
          id: { $toString: '$$variant._id' }
        }
      }
    },
    ratingBreakdown: 1
  }
}

export async function getProducts() {
  await dbConnect()
  try {
    const products: ProductType[] = await Product.aggregate([
      productProjection
    ])
    return products
  } catch {
    return null
  }
}

export async function getProductsByCategory(categoryName: string, excludeProductId: string, limit: number = 5) {
  await dbConnect()
  try {
    const products: ProductType[] = await Product.aggregate([
      {
        $match: {
          'category.name': categoryName,
          _id: { $ne: new mongoose.Types.ObjectId(excludeProductId) },
        }
      },
      { $limit: limit },
      productProjection
    ])
    return products
  } catch {
    return null
  }
}