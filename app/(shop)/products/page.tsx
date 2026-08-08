import { Suspense } from 'react'
import FetchProducts from '@/components/product/FetchProducts'
import { ProductsLoadingState } from '@/components/product/ProductsLoadingState'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    filter?: string
    category?: string
  }>
}) {
  const { filter, category } = await searchParams
  return (
    <Suspense fallback={<ProductsLoadingState />}>
      <FetchProducts
        key={`${filter ?? ''}:${category ?? ''}`}
        searchQuery={filter ?? null}
        categoryParam={category ?? null}
      />
    </Suspense>
  )
}
