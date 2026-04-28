"use client"

import { Eye, ShieldCheck, Ban, Trash2, Upload } from 'lucide-react';

import { useState, useCallback, useMemo } from "react"
import { DataTable } from "@/components/admin/DataTable"
import { SearchFilter } from "@/components/admin/SearchFilter"
import { Pagination } from "@/components/admin/Pagination"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { useUsers } from "@/hooks/useUsers"
import { useUserActions } from "@/hooks/useUserActions"
import { User } from "@/lib/auth"
import { UserDetailModal } from "@/components/admin/users/UserDetailModal"
import { UserRoleModal } from "@/components/admin/users/UserRoleModal"
import { BulkActionsBar } from "@/components/admin/users/BulkActionsBar"
import { ConfirmModal } from "@/components/admin/ConfirmModal"

const ITEMS_PER_PAGE = 10

const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "Customer" },
]

const statuses = [
  { value: "active", label: "Active" },
  { value: "banned", label: "Banned" },
]

type ModalState =
  | { type: "none" }
  | { type: "view"; user: User }
  | { type: "role"; user: User }
  | { type: "ban"; user: User }
  | { type: "delete"; user: User }

const actions = (user: User) => [
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

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  const handleFilterChange = useCallback((newFilters: Record<string, string>) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  const closeModal = useCallback(() => setModal({ type: "none" }), [])

  const stats = useMemo(() => {
    const users = usersData?.users ?? []
    return {
      total: usersData?.total ?? 0,
      active: users.filter((u) => !u.banned).length,
      banned: users.filter((u) => u.banned).length,
      admins: users.filter((u) => u.role === "admin").length,
    }
  }, [usersData])

  const totalPages = Math.ceil((usersData?.total ?? 0) / ITEMS_PER_PAGE)

  const columns = useMemo(() => columnsProps(setModal), [])

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Users</h1>
          <p className="text-warm-gray-dark mt-1">
            Manage customer and admin accounts
          </p>
        </div>
        <Button variant="secondary">
          <Upload className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* ── Stats ── */}
      <Stats
        total={stats.total}
        active={stats.active}
        banned={stats.banned}
        isLoading={usersLoading}
        users={usersData?.users as User[] || []}
      />

      {/* ── Search & Filters ── */}
      <SearchFilter
        searchPlaceholder="Search by name or email…"
        onSearchChange={handleSearch}
        filters={[
          { key: "role", label: "Role", options: roles },
          { key: "status", label: "Status", options: statuses },
        ]}
        onFilterChange={handleFilterChange}
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
      <DataTable
        columns={columns}
        data={(usersData?.users as User[]) ?? []}
        keyExtractor={(user) => user.id}
        selectable
        onSelectionChange={setSelectedUsers}
        isLoading={usersLoading}
        onRowClick={(user) => setModal({ type: "view", user })}
        emptyMessage="No users found. Try adjusting your search or filters."
      />

      {/* ── Pagination ── */}
      {!usersLoading && (usersData?.total ?? 0) > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={usersData?.total ?? 0}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}

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

const Stats = ({ total, isLoading, active, users, banned }: StatProps) => (
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

function ActionButton({ onClick, title, hoverClass, children }: ActionButtonProps) {
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

const columnsProps = (setModal: (state: ModalState) => void) => {
  return [
    {
      key: "user",
      title: "User",
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0"
          >
            <span className="text-gold font-semibold text-sm">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-charcoal truncate">{user.name}</p>
            <p className="text-xs text-warm-gray-dark truncate">{user.email}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "role",
      title: "Role",
      render: (user: User) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setModal({ type: "role", user })
          }}
          title="Click to change role"
          className={cn(
            "px-2 py-1 text-xs font-medium rounded-full capitalize",
            "transition-all hover:ring-2 hover:ring-offset-1 cursor-pointer",
            user.role === "admin"
              ? "bg-purple-100 text-purple-700 hover:ring-purple-300"
              : "bg-linen text-charcoal hover:ring-warm-gray"
          )}
        >
          {user.role}
        </button>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (user: User) => (
        <StatusBadge status={user.banned ? "suspended" : "active"} size="sm" />
      ),
    },
    {
      key: "newsletter",
      title: "Newsletter",
      render: (user: User) => (
        <span
          className={cn(
            "text-xs",
            (user as User).subscribeNewsletter
              ? "text-green-600 font-medium"
              : "text-warm-gray-dark"
          )}
        >
          {(user as User).subscribeNewsletter ? "Subscribed" : "—"}
        </span>
      ),
    },
    {
      key: "joinDate",
      title: "Joined",
      render: (user: User) => (
        <span className="text-warm-gray-dark text-sm">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
      sortable: true,
    },
    {
      key: "actions",
      title: "",
      render: (user: User) => (
        <div className="flex items-center justify-end gap-1">
          {actions(user).map(({ type, title, hoverClass, icon }) => (
            <ActionButton
              key={type}
              onClick={(e) => {
                e.stopPropagation()
                setModal({ type, user })
              }}
              title={title}
              hoverClass={hoverClass}
            >
              {icon}
            </ActionButton>
          ))}
        </div>
      ),
      className: "w-40",
    },
  ]
}
