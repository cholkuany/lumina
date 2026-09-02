'use client'

import { useMemo, useState } from 'react'
// import { usePathname } from 'next/navigation'

import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { FilterSidebar } from '@/components/filters/sidebar/FilterSidebar'
import { useProducts } from '@/hooks/useProducts'
import { NestedCategory, useCategories } from '@/hooks/useCategories'

import { filteredSearch } from '@/utils/filteredSearch'
import ProductsToolbar from '@/components/product/ProductsToolbar'
import ProductsGrid from '@/components/product/ProductsGrid'
import ActiveFilters from '@/components/product/ActiveFilters'
import { ProductsLoadingState } from '@/components/product/ProductsLoadingState'
import { ProductsErrorState } from '@/components/product/ProductsErrorState'

export default function FetchProducts({
  searchQuery,
  categoryParam,
  id
}: {
  searchQuery: string | null
  categoryParam: string | null
  id: string | null
}) {
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {}
    if (categoryParam) {
      initial.category = [categoryParam]
    }
    return initial
  })

  const { data: products = [], isPending, isError, isFetching, refetch, } = useProducts()
  const { data: nestedCategories } = useCategories(false)

  const currentCategory: NestedCategory | undefined = nestedCategories?.categoryMap.get(id ?? '') || undefined
  const isLeafCategory = Boolean(currentCategory && currentCategory.children.length === 0)
  const parentCategory = currentCategory?.parent
    ? nestedCategories?.categoryMap.get(currentCategory.parent.id)
    : undefined
  const sidebarCategories = currentCategory
    ? isLeafCategory
      ? parentCategory?.children ?? [currentCategory]
      : currentCategory.children
    : nestedCategories?.categories ?? []

  const filteredProducts = useMemo(
    () =>
      filteredSearch(products, selectedFilters, priceRange, sortBy, searchQuery),
    [products, selectedFilters, priceRange, sortBy, searchQuery]
  )

  const crumbs = useMemo(() => {
    const items: { label: string; href?: string }[] = []
    items.push({ label: 'home', href: '/' })
    if (categoryParam) {
      items.push({ label: 'products', href: '/products' })
      // items.push({ label: categoryParam })
    } else {
      items.push({ label: 'All Products' })
    }

    return items
  }, [categoryParam])

  const currentCrumbs = currentCategory ?
    currentCategory.ancestors.map((ancestor) => ({
      label: ancestor.name,
      href: ancestor.name.toLocaleLowerCase()
    })) : []
  if (categoryParam) currentCrumbs.push({ label: categoryParam, href: '' })

  if (isPending) return <ProductsLoadingState />
  if (isError) {
    return (
      <ProductsErrorState
        onRetry={() => {
          void refetch()
        }}
        isRetrying={isFetching}
      />
    )
  }

  const handleFilterChange = (name: string, value: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const currentValues = prev[name] || []
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] }
      } else {
        return { ...prev, [name]: currentValues.filter(v => v !== value) }
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
        <Breadcrumb items={[...crumbs, ...currentCrumbs]} />
      </div>

      <div className="container-lumina">
        <div className='flex gap-8'>
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <FilterSidebar
              filters={sidebarCategories}
              currentCategory={currentCategory}
              parentCategory={parentCategory}
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
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={currentCategory ? currentCategory.children : nestedCategories?.categories || []}
              selectedFilters={selectedFilters}
              setMobileFiltersOpen={setMobileFiltersOpen}
            />

            <ActiveFilters
              selectedFilters={selectedFilters}
              categories={currentCategory ? currentCategory.children : nestedCategories?.categories || []}
              onRemove={removeFilter}
              onClearAll={() => setSelectedFilters({})}
            />

            <ProductsGrid
              products={filteredProducts}
              onClearAll={clearAllFilters}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <FilterSidebar
          filters={sidebarCategories}
          currentCategory={currentCategory}
          parentCategory={parentCategory}
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
