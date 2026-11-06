'use client'

import { useRouter } from 'next/navigation'

import { useProducts } from '@/hooks/useProducts'
import { useFlatCategories } from '@/hooks/useFlatCategories'

import { ResourceHeader } from '../../components/resource/ResourceHeader'
import { createProductColumns } from '../../components/columns/createProductColumns'
import { BulkActions } from '../../components/resource/ResourceBulkActions'
import { ConfirmModal } from '../../components/ConfirmModal'

import { ResourceTableToolbar } from '@/app/(management)/components/tables/ResourceTableToolbar'
import { ResourceTable } from '@/app/(management)/components/tables/ResourceTable'
import { ResourceTablePagination } from '@/app/(management)/components/tables/ResourceTablePagination'
import { useResourceController, useTableInstanceController } from '@/hooks/useResourceController'
import { AdminPageLoadingState } from '@/components/ui/PageLoadingState'

const stockStatuses = [
  { value: 'in_stock', label: 'In Stock', amount: 100 },
  { value: 'low_stock', label: 'Low Stock', amount: 99 },
  { value: 'out_of_stock', label: 'Out of Stock', amount: 0 },
]

export default function ProductsPage() {
  const router = useRouter()

  const {
    filterValues,
    setFilterValues,

    confirm,
    mutation,
    handleDelete,

    pagination,
    setPagination,

    rowSelection,
    setRowSelection,

    globalFilter,
    setGlobalFilter
  } = useResourceController('product')

  const { isPending, isError, data: allProducts = [], error } = useProducts()
  const { data: categoriesData } = useFlatCategories(true)

  const columns = createProductColumns({ onDelete: handleDelete })

  const { table } = useTableInstanceController(
    columns,
    allProducts,
    rowSelection,
    setRowSelection,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
    (product) => product.id
  )

  const categories = categoriesData?.map(c => ({ value: c.name, label: c.name }))

  if (isPending) return <AdminPageLoadingState />
  if (isError) return <div>Error fetching products {error.message}</div>

  const selectedIds =
    table
      .getSelectedRowModel()
      .rows.map((row) =>
        row.original.id
      )

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      handleDelete('delete', selectedIds)

    }
  }

  return (
    <div className="space-y-6">
      {/* <ProductsHeader /> */}
      <ResourceHeader
        title='Products'
        addResourceText='Add Product'
        addResourceUrl='/admin/products/new'
        description='Manage your product catalog'
      />

      {/* Search & Filters */}
      <ResourceTableToolbar
        searchPlaceholder="Search products..."
        search={globalFilter}
        onSearchChange={setGlobalFilter}
        filters={[
          { key: 'category', label: 'Category', options: categories ?? [] },
          { key: 'status', label: 'Stock Status', options: stockStatuses },
        ]}
        onFilterChange={setFilterValues}
        filterValues={filterValues}
        actions={<BulkActions onDelete={handleBulkDelete} selected={selectedIds} />}
      />

      <ResourceTable
        table={table}
        onRowClick={(product) => router.push(`/admin/products/${product.id}/`)}
        selectable
      />

      <ResourceTablePagination
        table={table}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirm.state.open}
        onClose={confirm.close}
        onConfirm={confirm.confirm}
        title="Delete Product"
        confirmLabel="Delete"
        variant="danger"
        action={confirm.state.type}
        count={confirm.state.ids.length}
        isLoading={mutation.isPending}
        resource={confirm.state.resource}
      />
    </div>
  )
}
