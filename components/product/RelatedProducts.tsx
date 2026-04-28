import { getProductsByCategory } from "@/lib/queries/get.products"
import { ProductCard } from "../ui/ProductCard"

type RelatedProductsProps = {
  categoryName: string
  excludeProductId: string
  limit?: number
}

export async function RelatedProducts({
  categoryName,
  excludeProductId,
  limit = 4,
}: RelatedProductsProps) {
  const relatedProducts =
    (await getProductsByCategory(categoryName, excludeProductId, limit)) ?? []

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="container-lumina mt-16">
      <h2 className="font-serif text-2xl text-charcoal mb-8">You May Also Like</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
