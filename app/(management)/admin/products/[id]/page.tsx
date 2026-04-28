import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProduct } from '@/lib/queries/get.product'
import {
  ChevronRight, Package, Tag, Star, BarChart2, Edit,
  ArrowLeft, Layers, CheckCircle2, XCircle, TrendingUp,
} from 'lucide-react'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const productData = await getProduct(id)
  const product = productData?.[0] ?? undefined

  if (!product) notFound()

  const mainImage = product.variants[0]?.images[0]?.secure_url
  const allImages = product.variants.flatMap((v) =>
    v.images.map((img) => img.secure_url)
  )

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)

  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
      : 0

  const stars = [5, 4, 3, 2, 1] as const

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/admin/products"
            className="text-warm-gray-dark hover:text-gold transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Products
          </Link>
          <ChevronRight className="w-4 h-4 text-warm-gray-dark" />
          <span className="text-charcoal font-medium truncate max-w-60">
            {product.name}
          </span>
        </nav>

        <Link
          href={`/admin/products/edit/${id}`}
          className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white text-sm 
          font-medium rounded-xl hover:bg-charcoal/85 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Product
        </Link>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {product.isNewArrival && (
          <span className="px-3 py-1 bg-charcoal text-white text-xs font-medium rounded-full">
            New Arrival
          </span>
        )}
        {product.isSale && (
          <span className="px-3 py-1 bg-gold text-white text-xs font-medium rounded-full">
            On Sale
          </span>
        )}
        {product.isFeatured && (
          <span className="px-3 py-1 bg-gold/15 text-gold-dark text-xs font-medium rounded-full">
            Featured
          </span>
        )}
        {totalStock === 0 ? (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-500 text-xs font-medium rounded-full">
            <XCircle className="w-3.5 h-3.5" />
            Out of Stock
          </span>
        ) : (
          <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            In Stock
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Images + Basic Info */}
          <div className="bg-white rounded-xl border border-warm-gray p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Main Image */}
              <div className="space-y-3">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-linen">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-warm-gray" />
                    </div>
                  )}
                  {discountPercentage > 0 && (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-gold text-white text-xs font-semibold rounded-lg">
                      -{discountPercentage}%
                    </span>
                  )}
                </div>

                {/* Image Thumbnails */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {allImages.slice(0, 8).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-lg overflow-hidden bg-linen"
                      >
                        <Image
                          src={img}
                          alt={`${product.name} ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div className='space-y-1'>
                  {product.brand && (
                    <p className="text-sm text-warm-gray-dark font-medium uppercase tracking-wider">
                      {product.brand}
                    </p>
                  )}
                  <h1 className="text-2xl font-semibold text-charcoal">
                    {product.name}
                  </h1>
                  <p className="text-sm text-warm-gray-dark">
                    {/* product.slug */}
                    {product.slug}
                  </p>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-gold">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-warm-gray-dark line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(product.rating)
                          ? 'fill-gold text-gold'
                          : 'text-warm-gray'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-warm-gray-dark">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <p className="text-xs text-warm-gray-dark uppercase tracking-wider font-medium">
                    Category
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap text-sm">
                    {product.category.ancestors?.map((ancestor, idx) => (
                      <span key={idx} className="flex items-center gap-1.5">
                        <span className="text-warm-gray-dark">{ancestor}</span>
                        <ChevronRight className="w-3 h-3 text-warm-gray" />
                      </span>
                    ))}
                    <span className="font-medium text-charcoal">
                      {product.category.name}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <p className="text-xs text-warm-gray-dark uppercase tracking-wider font-medium">
                    Description
                  </p>
                  <p className="text-sm text-charcoal leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Long Description */}
            {product.longDescription && (
              <div className="pt-4 border-t border-warm-gray space-y-2">
                <p className="text-xs text-warm-gray-dark uppercase tracking-wider font-medium">
                  Full Description
                </p>
                <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line">
                  {product.longDescription}
                </p>
              </div>
            )}
          </div>

          {/* Variants */}
          <div className="bg-white rounded-xl border border-warm-gray p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-medium text-charcoal">
                Variants
                <span className="ml-2 text-sm font-normal text-warm-gray-dark">
                  ({product.variants.length})
                </span>
              </h2>
            </div>

            <div className="space-y-3">
              {product.variants.map((variant, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-linen rounded-xl"
                >
                  {/* Variant Image */}
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white shrink-0">
                    {variant.images[0] ? (
                      <Image
                        src={variant.images[0].secure_url}
                        alt={variant.sku}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-warm-gray" />
                      </div>
                    )}
                  </div>

                  {/* Variant Info */}
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-warm-gray-dark">SKU</p>
                      <p className="text-sm font-medium text-charcoal truncate">
                        {variant.sku}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-warm-gray-dark">Attributes</p>
                      <p className="text-sm font-medium text-charcoal">
                        {variant.attributes.color} / {variant.attributes.size}
                        {variant.attributes.material &&
                          ` / ${variant.attributes.material}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-warm-gray-dark">Price</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-gold">
                          ${variant.price.toFixed(2)}
                        </p>
                        {variant.originalPrice && (
                          <p className="text-xs text-warm-gray-dark line-through">
                            ${variant.originalPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-warm-gray-dark">Stock</p>
                      <p
                        className={`text-sm font-medium ${variant.stock === 0
                          ? 'text-red-500'
                          : variant.stock < 10
                            ? 'text-amber-500'
                            : 'text-emerald-600'
                          }`}
                      >
                        {variant.stock} units
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="bg-white rounded-xl border border-warm-gray p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-gold" />
                <h2 className="text-lg font-medium text-charcoal">
                  Specifications
                </h2>
              </div>
              <div className="divide-y divide-warm-gray">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex items-center py-3 gap-4">
                    <p className="text-sm text-warm-gray-dark w-40 shrink-0 capitalize">
                      {spec.key}
                    </p>
                    <p className="text-sm text-charcoal font-medium capitalize">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column — Sidebar */}
        <div className="space-y-6">

          {/* Stats */}
          <div className="bg-white rounded-xl border border-warm-gray p-6 space-y-4">
            <h2 className="text-lg font-medium text-charcoal">Stats</h2>
            <div className="space-y-3 divide-y divide-warm-gray">

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-sm text-warm-gray-dark">
                  <Package className="w-4 h-4" />
                  Total Stock
                </div>
                <span className={`text-sm font-semibold ${totalStock === 0 ? 'text-red-500' : 'text-charcoal'
                  }`}>
                  {totalStock} units
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-sm text-warm-gray-dark">
                  <TrendingUp className="w-4 h-4" />
                  Units Sold
                </div>
                <span className="text-sm font-semibold text-charcoal">
                  {product.unitsSold ?? 0}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-sm text-warm-gray-dark">
                  <Star className="w-4 h-4" />
                  Rating
                </div>
                <span className="text-sm font-semibold text-charcoal">
                  {product.rating.toFixed(1)} / 5
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-sm text-warm-gray-dark">
                  <BarChart2 className="w-4 h-4" />
                  Reviews
                </div>
                <span className="text-sm font-semibold text-charcoal">
                  {product.reviewCount}
                </span>
              </div>
            </div>
          </div>

          {/* Rating Breakdown */}
          {product.reviewCount > 0 && (
            <div className="bg-white rounded-xl border border-warm-gray p-6 space-y-4">
              <h2 className="text-lg font-medium text-charcoal">
                Rating Breakdown
              </h2>
              <div className="space-y-2">
                {stars.map((star) => {
                  const count = product.ratingBreakdown?.[star] ?? 0
                  const percentage = product.reviewCount > 0
                    ? Math.round((count / product.reviewCount) * 100)
                    : 0
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12 shrink-0">
                        <span className="text-xs text-warm-gray-dark">{star}</span>
                        <Star className="w-3 h-3 fill-gold text-gold" />
                      </div>
                      <div className="flex-1 h-1.5 bg-linen rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-warm-gray-dark w-8 text-right">
                        {percentage}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Variant Stock Summary */}
          <div className="bg-white rounded-xl border border-warm-gray p-6 space-y-4">
            <h2 className="text-lg font-medium text-charcoal">Stock Summary</h2>
            <div className="space-y-2">
              {product.variants.map((variant, idx) => {
                const stockPercent = Math.min(
                  Math.round((variant.stock / Math.max(totalStock, 1)) * 100),
                  100
                )
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-warm-gray-dark truncate max-w-32">
                        {variant.attributes.color} / {variant.attributes.size}
                      </span>
                      <span className={`text-xs font-medium ${variant.stock === 0
                        ? 'text-red-500'
                        : variant.stock < 10
                          ? 'text-amber-500'
                          : 'text-emerald-600'
                        }`}>
                        {variant.stock}
                      </span>
                    </div>
                    <div className="h-1.5 bg-linen rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${variant.stock === 0
                          ? 'bg-red-400'
                          : variant.stock < 10
                            ? 'bg-amber-400'
                            : 'bg-emerald-500'
                          }`}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params, }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = (await getProduct(id))?.[0] ?? null

  if (!product) return { title: 'Product Not Found | LUMINA Admin' }

  return {
    title: `${product.name} | LUMINA Admin`,
    description: product.description,
  }
}