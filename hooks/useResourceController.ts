import { useState } from 'react'
import { useResourceActions } from '@/hooks/useResourceActions'
import { Resource } from '@/lib/types'
import { ActionType } from '@/lib/types'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  RowSelectionState,
  PaginationState,
  // SortingState,
  // ColumnFiltersState,
  OnChangeFn
} from '@tanstack/react-table'


export function useResourceController(resource: Resource) {
  const [selected, setSelected] = useState<string[]>([])
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [search, setSearch] = useState('')

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>({})

  const { confirm, mutation } = useResourceActions(resource, setSelected)

  const handleDelete = (actionText: ActionType, ids: string | string[]) => {
    confirm.open(actionText, ids)
  }

  return {
    selected,
    setSelected,
    filterValues,
    setFilterValues,
    search,
    setSearch,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
    rowSelection,
    setRowSelection,

    confirm,
    mutation,
    handleDelete,
  }
}

export function useTableInstanceController<T>(
  columns: ColumnDef<T>[],
  data: T[],
  rowSelection: RowSelectionState,
  setRowSelection: OnChangeFn<RowSelectionState>,
  pagination: PaginationState,
  setPagination: OnChangeFn<PaginationState>,
  globalFilter: string,
  setGlobalFilter: OnChangeFn<string>,
  getRowId: (p: T) => string
) {

  const table = useReactTable({
    data: data ?? [],
    columns: columns ?? [],

    getRowId,

    state: {
      rowSelection,
      globalFilter,
      pagination,
    },

    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,

    autoResetPageIndex: false,

    enableRowSelection: true,

    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return {
    table
  }
}