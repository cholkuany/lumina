'use client'

import { useState, useMemo } from 'react'
// import { usePathname } from 'next/navigation'

import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { FilterSidebar } from '@/components/filters/sidebar/FilterSidebar'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'

import { filteredSearch } from '@/utils/filteredSearch'
import ProductsToolbar from '@/components/product/ProductsToolbar'
import ProductsGrid from '@/components/product/ProductsGrid'
import ActiveFilters from '@/components/product/ActiveFilters'

export default function FetchProducts({
  searchQuery,
  categoryParam,
}: {
  searchQuery: string | null
  categoryParam: string | null
}) {
  const [viewMode, setViewMode] = useState<'grid' | 'flex'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  // const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  // ✅ sync URL → state
  // useEffect(() => {
  //   if (categoryParam) {
  //     setSelectedFilters(prev => ({
  //       ...prev,
  //       category: [categoryParam],
  //     }))
  //   }
  // }, [categoryParam])


  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {}
    if (categoryParam) {
      initial.category = [categoryParam]
    }
    return initial
  })

  const { data: products = [], isPending, isError, error } = useProducts()
  const { data: nestedCategories } = useCategories(false)

  const filteredProducts = useMemo(
    () =>
      filteredSearch(products, selectedFilters, priceRange, sortBy, searchQuery),
    [products, selectedFilters, priceRange, sortBy, searchQuery]
  )

  const crumbs = useMemo(() => {
    const items: { label: string; href?: string }[] = []

    if (categoryParam) {
      items.push({ label: 'categories', href: '/categories' })
      items.push({ label: categoryParam })
    } else {
      items.push({ label: 'All Products' })
    }

    return items
  }, [categoryParam])

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>{error.message}</div>

  const handleFilterChange = (name: string, value: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const current = prev[name] || []
      if (checked) {
        return { ...prev, [name]: [...current, value] }
      } else {
        return { ...prev, [name]: current.filter(v => v !== value) }
      }
    })
  }

  const clearAllFilters = () => {
    setSelectedFilters({})
    setPriceRange([0, 500])
  }

  const removeFilter = (groupId: string, value: string) => {
    handleFilterChange(groupId, value, false)
  }

  return (
    <main className="pb-16">

      <div className="container-lumina py-4">
        <Breadcrumb items={crumbs} />
      </div>

      <div className="container-lumina">
        {/* Page Header */}
        {Object.keys(selectedFilters).length > 0 &&
          <div className="mb-8">
            <h1 className="font-serif text-3xl lg:text-4xl text-charcoal mb-2">
              {categoryParam ? `Results for "${categoryParam}"` : 'All Products'}
            </h1>
            <p className="text-warm-gray-dark">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
        }

        <div className='flex gap-8'>
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterSidebar
              filters={nestedCategories?.categories || []}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <ProductsToolbar
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={nestedCategories?.categories || []}
              selectedFilters={selectedFilters}
              setMobileFiltersOpen={setMobileFiltersOpen}
            />

            <ActiveFilters
              selectedFilters={selectedFilters}
              categories={nestedCategories?.categories || []}
              onRemove={removeFilter}
              onClearAll={() => setSelectedFilters({})}
            />

            <ProductsGrid
              products={filteredProducts}
              viewMode={viewMode}
              onClearAll={clearAllFilters}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <FilterSidebar
          filters={nestedCategories?.categories || []}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearAll={clearAllFilters}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          isMobile
          onClose={() => setMobileFiltersOpen(false)}
        />
      )}
    </main>
  )
}