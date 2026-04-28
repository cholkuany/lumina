import dbConnect from '@/lib/db/connection'
import { Product } from '@/lib/db/models'
import type { Product as ProductType } from '../types'
import { productProjection } from './get.products'
import mongoose from 'mongoose'

export async function getProduct(id: string): Promise<ProductType[] | null> {
  await dbConnect()

  try {
    const product: ProductType[] = await Product.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      productProjection
    ])
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}