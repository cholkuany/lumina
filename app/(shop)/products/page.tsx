import { Suspense } from 'react'
import FetchProducts from '@/components/product/FetchProducts'

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
    <Suspense fallback={<div>Loading products...</div>}>
      <FetchProducts
        searchQuery={filter ?? null}
        categoryParam={category ?? null}
      />
    </Suspense>
  )
}