"use client"

import { Eye, ShieldCheck, Ban, Trash2 } from 'lucide-react';

import { useState, useCallback, useMemo } from "react"

import { ResourceTable } from '@/components/tables/ResourceTable';
import { ResourceTableToolbar } from '@/components/tables/ResourceTableToolbar';
import { ResourceTablePagination } from '@/components/tables/ResourceTablePagination';
import { useTableInstanceController } from '@/hooks/useResourceController';
import { useResourceController } from '@/hooks/useResourceController';

import { cn } from "@/lib/utils"
import { useUsers } from "@/hooks/useUsers"
import { useUserActions } from "@/hooks/useUserActions"
import { User } from "@/lib/auth"
import { UserDetailModal } from "@/components/admin/users/UserDetailModal"
import { UserRoleModal } from "@/components/admin/users/UserRoleModal"
import { BulkActionsBar } from "@/components/admin/users/BulkActionsBar"
import { ConfirmModal } from "@/components/admin/ConfirmModal"
import { useUserColumns } from '@/components/admin/users/userColumns';
import { BulkActions } from '@/components/admin/resource/ResourceBulkActions';
import { ResourceHeader } from '@/components/admin/resource/ResourceHeader';

const ITEMS_PER_PAGE = 10

const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "Customer" },
]

const statuses = [
  { value: "active", label: "Active" },
  { value: "banned", label: "Banned" },
]

export type ModalState =
  | { type: "none" }
  | { type: "view"; user: User }
  | { type: "role"; user: User }
  | { type: "ban"; user: User }
  | { type: "delete"; user: User }

export const actions = (user: User) => [
  {
    type: "view" as const,
    title: "View details",
    hoverClass: "hover:text-gold hover:bg-linen",
    icon: <Eye className="w-4 h-4" />,
  },
  {
    type: "role" as const,
    title: "Change role",
    hoverClass: "hover:text-gold-dark hover:bg-linen",
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    type: "ban" as const,
    title: user.banned ? "Unban user" : "Ban user",
    hoverClass: "hover:text-gold hover:bg-gold/10",
    icon: <Ban className="w-4 h-4" />,
  },
  {
    type: "delete" as const,
    title: "Delete user",
    hoverClass: "hover:text-red-500 hover:bg-red-50",
    icon: <Trash2 className="w-4 h-4" />,
  },
]

export default function UsersPage() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [modal, setModal] = useState<ModalState>({ type: "none" })

  const { ban, unban, remove } = useUserActions()

  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery || undefined,
    role: filters.role || undefined,
    banned:
      filters.status === "banned"
        ? true
        : filters.status === "active"
          ? false
          : undefined,
  }), [currentPage, searchQuery, filters])

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useUsers(queryParams)

  const closeModal = useCallback(() => setModal({ type: "none" }), [])

  const stats = useMemo(() => {
    return {
      total: usersData?.total ?? 0,
      active: usersData?.users.filter((u) => !u.banned).length ?? 0,
      banned: usersData?.users.filter((u) => u.banned).length ?? 0,
      admins: usersData?.users.filter((u) => u.role === "admin").length ?? 0,
    }
  }, [usersData])

  const users = usersData?.users as User[] ?? []

  const columns = useUserColumns(setModal)
  const {
    filterValues, setFilterValues,
    pagination, setPagination,
    globalFilter, setGlobalFilter,
    // confirm,
    // mutation,
    handleDelete,
    rowSelection, setRowSelection,
  } = useResourceController('user')

  const { table } = useTableInstanceController<User>(
    columns,
    users,
    rowSelection,
    setRowSelection,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
    (user) => user.id
  )

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
      {/* ── Page Header ── */}
      <ResourceHeader
        title='Users'
        description='Manage customer and admin accounts'
        exportText='Export CSV'
      />

      {/* ── Stats ── */}
      <Stats
        total={stats.total}
        active={stats.active}
        banned={stats.banned}
        isLoading={usersLoading}
        users={usersData?.users as User[] || []}
      />

      <ResourceTableToolbar
        searchPlaceholder='Search users...'
        onSearchChange={setGlobalFilter}
        search={globalFilter}
        filters={[
          { key: "role", label: "Role", options: roles },
          { key: "status", label: "Status", options: statuses },
        ]}
        onFilterChange={setFilterValues}
        actions={<BulkActions onDelete={handleBulkDelete} selected={selectedIds} />}
        filterValues={filterValues}

      />

      {/* ── Error State ── */}
      {usersError && (
        <div className="bg-red-50 border border-red-200 rounded-brand p-4">
          <p className="text-sm text-red-600">
            Failed to load users: {usersError.message}
          </p>
        </div>
      )}

      {/* ── Table ── */}
      <ResourceTable
        table={table}
        onRowClick={(user) => setModal({ type: "view", user })}
        isLoading={usersLoading}
        selectable
      />

      {/* ── Pagination ── */}
      <ResourceTablePagination
        table={table}
      />

      {/* ── Bulk Actions ── */}
      <BulkActionsBar
        selectedIds={selectedUsers}
        onClearSelection={() => setSelectedUsers([])}
      />

      {/* ── View Modal ── */}
      {modal.type === "view" && (
        <UserDetailModal
          user={modal.user}
          onClose={closeModal}
          onChangeRole={() => setModal({ type: "role", user: modal.user })}
        />
      )}

      {/* ── Role Modal ── */}
      {modal.type === "role" && (
        <UserRoleModal user={modal.user} onClose={closeModal} />
      )}

      {/* ── Ban / Unban Confirmation ── */}
      <ConfirmModal
        isOpen={modal.type === "ban"}
        onClose={closeModal}
        onConfirm={async () => {
          if (modal.type !== "ban") return

          if (modal.user.banned) {
            await unban.mutateAsync({ userId: modal.user.id })
          } else {
            await ban.mutateAsync({ userId: modal.user.id })
          }
          closeModal()
        }}
        title={modal.type === "ban" && modal.user.banned ? "Unban User" : "Ban User"}
        message={
          modal.type === "ban"
            ? modal.user.banned
              ? `Restore access to ${modal.user.name}'s account? They will be able to log in again.`
              : `Ban ${modal.user.name}'s account? They will be immediately logged out and unable to access the store.`
            : ""
        }
        confirmLabel={modal.type === "ban" && modal.user.banned ? "Unban" : "Ban User"}
        variant={modal.type === "ban" && modal.user.banned ? "info" : "warning"}
        isLoading={ban.isPending || unban.isPending}
        resource="user"
        action="deactivate"
      />

      {/* ── Delete Confirmation ── */}
      <ConfirmModal
        isOpen={modal.type === "delete"}
        onClose={closeModal}
        onConfirm={async () => {
          if (modal.type !== "delete") return
          await remove.mutateAsync({ userId: modal.user.id })
          closeModal()
        }}
        title="Delete User"
        message={
          modal.type === "delete"
            ? `Permanently delete ${modal.user.name}'s account? All their data including order history will be removed. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete Permanently"
        variant="danger"
        isLoading={remove.isPending}
        resource="user"
        action="delete"
      />
    </div>
  )
}

// helper components 
type StatCardProps = {
  label: string
  value: string | number
  valueClass: string
  isLoading?: boolean
}
type ActionButtonProps = {
  onClick: (e: React.MouseEvent) => void
  title: string
  hoverClass: string
  children: React.ReactNode
}
type StatProps = {
  total: number
  isLoading: boolean
  active: number
  users: User[]
  banned: number
}

const Stats = ({ total = 0, isLoading, active = 0, users, banned }: StatProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <StatCard label="Total Users" value={total ?? "—"} valueClass="text-charcoal" isLoading={isLoading} />
    <StatCard label="Active Users" value={active} valueClass="text-green-600" isLoading={isLoading} />
    <StatCard label="Banned" value={banned} valueClass="text-red-600" isLoading={isLoading} />
    <StatCard
      label="Admins"
      value={
        (users ?? []).filter((u) => u.role === "admin").length
      }
      valueClass="text-purple-600"
      isLoading={isLoading}
    />
  </div>
)

function StatCard({ label, value, valueClass, isLoading }: StatCardProps) {
  return (
    <div className="bg-white rounded-brand border border-warm-gray p-4">
      <p className="text-sm text-warm-gray-dark">{label}</p>
      {isLoading ? (
        <div className="h-8 w-16 bg-warm-gray-light animate-pulse rounded mt-1" />
      ) : (
        <p className={cn("text-2xl font-semibold mt-1", valueClass)}>{value}</p>
      )}
    </div>
  )
}

export function ActionButton({ onClick, title, hoverClass, children }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "p-2 text-warm-gray-dark rounded-lg transition-colors",
        hoverClass
      )}
    >
      {children}
    </button>
  )
}