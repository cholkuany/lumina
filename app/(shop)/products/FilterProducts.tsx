'use client'

import { useState, useMemo } from 'react'
import { SlidersHorizontal, Grid, LayoutList, X } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ProductCard } from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/Button'
import { FilterSidebar } from '@/components/filters/sidebar/FilterSidebar'
import { SortDropdown } from '@/components/filters/SortDropdown'
import { cn } from '@/lib/utils'
// import type { Product } from '@/lib/types'
import { filteredSearch } from '@/utils/filteredSearch'

import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'bestselling', label: 'Best Selling' },
]

export function FilterProduct({ categoryParam, searchQuery }: { categoryParam: string, searchQuery: string }) {

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'flex'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {}
    if (categoryParam) {
      initial.category = [categoryParam]
    }
    return initial
  })

  const { isPending, isError, data: allProducts = [], error } = useProducts()
  const {
    data: nestedCategories,
    isPending: areCategoriesPending,
    isError: hasCategoriesErred
  } = useCategories(false)

  const pending = isPending && areCategoriesPending
  const hasErred = isError && hasCategoriesErred

  // Filter and sort products
  const filteredProducts = useMemo(() => filteredSearch(allProducts, selectedFilters, priceRange, sortBy, searchQuery), [allProducts, selectedFilters, priceRange, sortBy, searchQuery])

  if (pending) return <div>Loading...</div>
  if (hasErred) return <div>error fetching products {error.message}</div>

  console.log("nested categories", nestedCategories)
  console.log("query params", { searchQuery, categoryParam })
  console.log("selected filters", selectedFilters)

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

  // Active filters for display
  const activeFilters = Object.entries(selectedFilters).flatMap(([name, values]) =>
    values.map(value => ({
      name,
      value,
      label: nestedCategories?.categories
        .find(category => category.name === name)
        ?.children.find(child => child.name === value)?.name || value,
    }))
  )

  const crumbs = []
  if (categoryParam) {
    crumbs.push({ label: "categories", href: '/categories' })
  }
  crumbs.push({ label: categoryParam ? `${categoryParam}` : 'All Products' })

  console.log('selected filters', selectedFilters)

  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="container-lumina py-4">
        <Breadcrumb
          items={crumbs}
        />
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

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterSidebar
              // filters={filterGroups}
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
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-warm-gray-light">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-charcoal"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilters.length > 0 && (
                  <span className="w-5 h-5 bg-gold text-white text-xs rounded-full flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center gap-1 border border-warm-grayrounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-1.5 rounded transition-colors',
                    viewMode === 'grid' ? 'bg-charcoal text-white' : 'text-warm-gray-dark hover:text-charcoal'
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setViewMode('flex')}
                  className={cn(
                    'p-1.5 rounded transition-colors',
                    viewMode === 'flex' ? 'bg-charcoal text-white' : 'text-warm-gray-dark hover:text-charcoal'
                  )}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>

              {/* Sort */}
              <SortDropdown
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
              />
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-warm-gray-dark">Active filters:</span>
                {activeFilters.map(({ name, value, label }) => (
                  <button
                    key={`${name}-${value}`}
                    onClick={() => removeFilter(name, value)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linen text-sm text-charcoal rounded-full hover:bg-warm-gray-light transition-colors"
                  >
                    {label}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gold hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className={cn(
                  'gap-4 lg:gap-6',
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 lg:grid-cols-3'
                    : 'flex flex-col'
                )}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  // For list view, we could create a different card layout
                  />
                ))}
              </div>
            ) : (
              /* No Results */
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-linen rounded-full flex items-center justify-center mx-auto mb-6">
                  <SlidersHorizontal className="w-8 h-8 text-warm-gray-dark" />
                </div>
                <h2 className="font-serif text-xl text-charcoal mb-2">No products found</h2>
                <p className="text-warm-gray-dark mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <Button variant="secondary" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Load More / Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-12 text-center">
                <Button variant="secondary" size="lg">
                  Load More Products
                </Button>
              </div>
            )}
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