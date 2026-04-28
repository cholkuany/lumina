'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/admin/DataTable'
import { SearchFilter } from '@/components/admin/SearchFilter'
import { Pagination } from '@/components/admin/Pagination'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { Button } from '@/components/ui/Button'
import { useProducts } from '@/hooks/useProducts'
import { useFlatCategories } from '@/hooks/useFlatCategories'
import type { Product } from '@/lib/types'
import { useConfirmAction } from '@/hooks/useConfirmAction'
import { useResourceMutation } from '@/hooks/useResourceMutation'
import { normalizedValue } from '@/lib/utils'

import Image from 'next/image'

import { Plus, SquarePen, Trash2 } from 'lucide-react'

const stockStatuses = [
  { value: 'in_stock', label: 'In Stock', amount: 100 },
  { value: 'low_stock', label: 'Low Stock', amount: 99 },
  { value: 'out_of_stock', label: 'Out of Stock', amount: 0 },
]

const statusKeys = { 'in_stock': 100, 'low_stock': 99, 'out_of_stock': 0 }

export default function ProductsPage() {
  const router = useRouter()
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState('')

  const [currentPage, setCurrentPage] = useState(1)

  const { isPending, isError, data: allProducts = [], error } = useProducts()

  const { data: categoriesData } = useFlatCategories(true)

  const categories = categoriesData?.map(c => ({ value: c.name, label: c.name }))

  const productMutation = useResourceMutation<'product'>({
    onSuccess: () => {
      confirmAction.close()
      setSelectedProducts([])
    }
  })

  const confirmAction = useConfirmAction<'product'>({
    resource: 'product',
    onConfirm: ({ action, ids, resource }) => {
      productMutation.mutate({ action, ids, resource })

    }
  })

  const getFilteredProducts = useMemo(() => {
    if (!allProducts) return []

    const q = normalizedValue(searchQuery)
    const filtered = allProducts.filter(p => {
      const ancestors = p.category.ancestors?.map(a => normalizedValue(a)) || ''
      const matchesSearch =
        searchQuery === '' ||
        normalizedValue(p.category.name).includes(q) ||
        ancestors?.includes(q) ||
        normalizedValue(p.name).includes(q)

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        let amount
        if (key === 'status') {
          amount = (statusKeys[value as keyof typeof statusKeys] <= (p.stockCount || 0)) || true
        }
        return p.category.name === key && amount
      })

      return matchesSearch && matchesFilters
    })

    return filtered
  }, [allProducts, filters, searchQuery])

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error fetching products {error.message}</div>

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    console.log('Search:', query)
  }

  const handleFilterChange = (activeFilters: Record<string, string>) => {
    setFilters(activeFilters)
    console.log('Filters:', filters)
  }

  const handleBulkDelete = () => {
    if (selectedProducts.length > 0) {
      confirmAction.open('delete', selectedProducts)
    }
  }

  const actions =
    selectedProducts.length > 0 && (
      <Button variant="secondary" size="sm" onClick={handleBulkDelete}>
        Delete ({selectedProducts.length})
      </Button>
    )

  const columns =
    [
      {
        key: 'product',
        title: 'Product',
        render: (product: Product) => (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-linen shrink-0 overflow-hidden">
              <Image
                src={product.variants?.[0]?.images?.[0]?.secure_url}
                className='w-full h-full bg-warm-gray-light'
                alt={product.name}
                width={48}
                height={48}
              />
            </div>
            <div>
              <Link
                href={`/admin/products/edit/${product.id}`}
                className="font-medium text-charcoal hover:text-gold transition-colors"
              >
                {product.name}
              </Link>
              <p className="text-xs text-warm-gray-dark">{product.category.name}</p>
            </div>
          </div>
        ),
        sortable: true,
      },
      {
        key: 'price',
        title: 'Price',
        render: (product: Product) => (
          <span className="font-medium text-charcoal">${product.price.toFixed(2)}</span>
        ),
        sortable: true,
      },
      {
        key: 'stock',
        title: 'Stock',
        render: (product: Product) => (
          <div className="flex items-center gap-2">
            <span className="text-charcoal">{product.stockCount}</span>
            <StatusBadge status={
              (product.stockCount ?? 0) > 100
                ? 'in_stock'
                : (product.stockCount ?? 0) > 0
                  ? 'low_stock'
                  : 'out_of_stock'

            } size="sm" />
          </div>
        ),
        sortable: true,
      },
      {
        key: 'sales',
        title: 'Sales',
        render: (product: Product) => (
          <span className="text-charcoal">{product.unitsSold} units</span>
        ),
        sortable: true,
      },
      {
        key: 'actions',
        title: '',
        render: (product: Product) => (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/products/edit/${product.id}`}
              className="p-2 text-warm-gray-dark hover:text-gold hover:bg-linen rounded-lg transition-colors"
            >
              <SquarePen className="w-4 h-4" />
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation()
                // setDeleteModal({ open: true, productId: product.id })
                confirmAction.open('edit', product.id)
              }}
              className="p-2 text-warm-gray-dark hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
        className: 'w-24',
      },
    ]

  const filteredProducts = getFilteredProducts

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Products</h1>
          <p className="text-warm-gray-dark mt-1">
            Manage your product catalog
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <SearchFilter
        searchPlaceholder="Search products..."
        onSearchChange={handleSearch}
        filters={[
          { key: 'category', label: 'Category', options: categories ?? [] },
          { key: 'status', label: 'Stock Status', options: stockStatuses },
        ]}
        onFilterChange={handleFilterChange}
        actions={actions}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        keyExtractor={(product) => product.id}
        onRowClick={(product) => router.push(`/admin/products/${product.id}/`)}
        selectable
        onSelectionChange={setSelectedProducts}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
        totalItems={156}
        itemsPerPage={10}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        // isOpen={deleteModal.open}
        isOpen={confirmAction.state.open}
        // onClose={() => setDeleteModal({ open: false })}
        onClose={confirmAction.close}
        // onConfirm={handleDelete}
        onConfirm={confirmAction.confirm}
        title="Delete Product"
        confirmLabel="Delete"
        variant="danger"

        action={confirmAction.state.type}
        count={confirmAction.state.ids.length}
        isLoading={productMutation.isPending}
        resource={confirmAction.state.resource}
      />
    </div>
  )
}
