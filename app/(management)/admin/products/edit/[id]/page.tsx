import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProduct } from '@/lib/queries/get.product'
import { ProductForm } from '@/components/forms/ProductForm'
import { getLeafCategories } from '@/lib/queries/get.leaf.categories'

import { ChevronRight } from 'lucide-react';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [productData, categories] = await Promise.all([
    getProduct(id),
    getLeafCategories(),
  ])

  const product = productData?.[0] ?? undefined

  if (!product) {
    notFound()
  }

  const normalizedProduct = {
    ...product,
    category: {
      ...product.category,
      ancestors: product.category.ancestors ?? undefined,
    },
    specifications: product.specifications ?? [],
    isNewArrival: product.isNewArrival ?? false,
    isSale: product.isSale ?? false,
    isFeatured: product.isFeatured ?? false,
    variants: product.variants.map((variant) => ({
      ...variant,
      images: variant.images.map((img) => img.secure_url),
    })),
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/admin/products"
          className="text-warm-gray-dark hover:text-gold transition-colors"
        >
          Products
        </Link>
        <ChevronRight className="w-4 h-4 text-warm-gray-dark" />
        <Link
          href={`/admin/products/${product.id}`}
          className="text-warm-gray-dark hover:text-gold transition-colors max-w-50 truncate"
        >
          {product.name}
        </Link>
        <ChevronRight className="w-4 h-4 text-warm-gray-dark" />
        <span className="text-charcoal font-medium">Edit</span>
      </nav>

      {/* Edit Form */}
      <ProductForm
        initialData={normalizedProduct}
        availableCategories={categories}
      />
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = (await getProduct(id))?.[0] ?? null

  if (!product) {
    return { title: 'Product Not Found | LUMINA Admin' }
  }

  return {
    title: `Edit ${product.name} | LUMINA Admin`,
    description: `Edit product details for ${product.name}`,
  }
}
