import type { TProduct } from '@/lib/types'
import { ProductImage } from './ProductImage'
import { ProductInfo } from './ProductInfo'

export function ProductCell({ product }: { product: TProduct }) {
  return (
    <div className="flex items-center gap-3">
      <ProductImage
        imageUrl={product.variants?.[0]?.images?.[0]?.secure_url}
        alt={product.name}
      />
      <ProductInfo
        name={product.name}
        category={product.category.name}
        id={product.id}
      />
    </div>
  )
}