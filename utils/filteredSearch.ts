import type { Product } from "@/lib/types"

export const filteredSearch = (
  allProducts: Product[],
  selectedFilters: Record<string, string[]>,
  priceRange: [number, number],
  sortBy: string,
  searchQuery: string | null
) => {
  let result = [...allProducts]

  // Search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    result = result.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.category.name.toLowerCase().includes(query) ||
        // p.brand.toLowerCase().includes(query) ||
        searchQuery === "new" && p.isNewArrival ||
        searchQuery === "sale" && p.isSale
    )
  }

  // Category filter
  if (selectedFilters.category?.length) {
    result = result.filter(p => selectedFilters.category.includes(p.category.name) || p.category.ancestors?.some(ancestor => selectedFilters.category?.includes(ancestor)))
  }

  // Rating filter
  if (selectedFilters.rating?.length) {
    const minRating = Math.min(...selectedFilters.rating.map(Number))
    result = result.filter(p => p.rating >= minRating)
  }

  // Availability filter
  if (selectedFilters.availability?.length) {
    result = result.filter(p => {
      if (selectedFilters.availability.includes('sale') && p.isSale) return true
      if (selectedFilters.availability.includes('new') && p.isNewArrival) return true
      if (selectedFilters.availability.includes('instock')) return true
      return false
    })
  }

  // Price range
  result = result.filter(p => p.variants?.[0].price >= priceRange[0] && p.variants?.[0].price <= priceRange[1])

  // Sort
  switch (sortBy) {
    case 'newest':
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0))
      break
    case 'price-asc':
      result.sort((a, b) => a.variants?.[0].price - b.variants?.[0].price)
      break
    case 'price-desc':
      result.sort((a, b) => b.variants?.[0]?.price - a.variants?.[0].price)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'bestselling':
      result.sort((a, b) => b.reviewCount - a.reviewCount)
      break
  }

  return result
}