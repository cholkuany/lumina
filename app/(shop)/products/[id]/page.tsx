import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Accordion } from '@/components/ui/Accordion'
import { ProductInfo } from '@/components/product/ProductInfo'
import { getProduct } from '@/lib/queries/get.product'
import { Header } from '@/components/product/ReviewSection'
import { ProductReviews } from '@/components/product/productReviews'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { Suspense } from 'react'
import { RelatedProductsSkeleton } from '@/components/product/RelatedProductsSkeleton'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params
  const productData = await getProduct(id)
  if (!productData || productData.length === 0) return <div>Product not found!</div>
  const product = productData[0]


  const crumbs = product.category?.ancestors ? product.category?.ancestors.map((a) => {
    return {
      label: a, href: `/products?category=${a}`
    }
  }) : []
  crumbs.push({ label: product.category.name, href: `/products?category=${product.category.name}` })

  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="container-lumina py-4">
        <Breadcrumb items={crumbs} />
      </div>

      {/* Product Section */}
      <section className="container-lumina">
        <ProductInfo product={product} />
      </section>

      {/* Product Details Tabs */}
      <section className="container-lumina mt-16">
        <Header title="About This Product" as="h2" />
        <Accordion
          items={[
            {
              id: 'product-details',
              title: 'Product Details',
              content: (
                <div className="prose prose-warm-gray max-w-none">
                  <p className="text-warm-gray-dark leading-relaxed whitespace-pre-line">
                    {product.longDescription}
                  </p>
                </div>
              ),
            },
            {
              id: 'specifications',
              title: 'Specifications',
              content: (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                  {product.specifications && product.specifications.map((spec) => (
                    <div key={spec.key} className="flex justify-between py-3 border-b border-warm-gray-light">
                      <span className="text-warm-gray-dark">{spec.key}</span>
                      <span className="font-medium text-charcoal">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </section>

      {/* Related Products */}
      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProducts
          categoryName={product.category.name}
          excludeProductId={product.id}
        />
      </Suspense>

      <section className="container-lumina mt-16">
        <ProductReviews productId={product.id} productName={product.name} />
      </section>
    </main>
  )
}