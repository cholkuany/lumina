import { ProductFormData } from '@/lib/validations/product.validation/product.schema'

export interface CategoryFromDB {
  name: string
  parent?: string | null
  ancestors?: string[]
  id?: string
}

export interface ProductFromDB extends Omit<ProductFormData, 'category'> {
  id?: string
  category: CategoryFromDB
}

export interface CategoryOption {
  _id: string
  name: string
  parent?: string | null
  ancestors?: string[] | null
}

export type ProductFormTab = 'basic' | 'variants' | 'specs'