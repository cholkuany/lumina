import { useState, useMemo } from 'react'

export function usePagination<T>(items: T[], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage))

  // Min after filtering
  const safePage = Math.min(currentPage, totalPages)

  const paginatedItems = useMemo(
    () => items.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage),
    [items, safePage, itemsPerPage]
  )

  const resetPage = () => setCurrentPage(1)

  return {
    currentPage: safePage,
    totalPages,
    paginatedItems,
    setCurrentPage,
    resetPage,
  }
}