"use client"

import { useState } from "react"
import { useUserActions } from "@/hooks/useUserActions"
import { ConfirmModal } from "@/components/admin/ConfirmModal"

interface BulkActionsBarProps {
  selectedIds: string[]
  onClearSelection: () => void
}

export function BulkActionsBar({ selectedIds, onClearSelection }: BulkActionsBarProps) {
  const [confirmAction, setConfirmAction] = useState<"ban" | "delete" | null>(null)
  const { ban, remove } = useUserActions()

  const count = selectedIds.length
  if (count === 0) return null

  const handleBulkBan = async () => {
    await Promise.all(selectedIds.map((id) => ban.mutateAsync({ userId: id })))
    onClearSelection()
    setConfirmAction(null)
  }

  const handleBulkDelete = async () => {
    await Promise.all(selectedIds.map((id) => remove.mutateAsync({ userId: id })))
    onClearSelection()
    setConfirmAction(null)
  }

  return (
    <>
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-charcoal text-ivory rounded-brand shadow-2xl px-5 py-3 animate-in slide-in-from-bottom-4 duration-300"
      >
        {/* Count */}
        <span className="text-sm font-medium text-warm-gray-light">
          {count} user{count !== 1 ? "s" : ""} selected
        </span>

        <div className="w-px h-5 bg-warm-gray-dark/40" />

        {/* Ban */}
        <button
          onClick={() => setConfirmAction("ban")}
          className="text-sm font-medium text-gold hover:text-gold-light transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
        >
          Ban Selected
        </button>

        {/* Delete */}
        <button
          onClick={() => setConfirmAction("delete")}
          className="text-sm font-medium text-gold-dark hover:text-gold transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
        >
          Delete Selected
        </button>

        <div className="w-px h-5 bg-warm-gray-dark/40" />

        {/* Clear */}
        <button
          onClick={onClearSelection}
          className="text-sm text-warm-gray-dark hover:text-ivory transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
        >
          Clear
        </button>
      </div>

      {/* Ban confirmation */}
      <ConfirmModal
        isOpen={confirmAction === "ban"}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleBulkBan}
        title="Ban Selected Users"
        message={`Are you sure you want to ban ${count} user${count !== 1 ? "s" : ""}? They will be immediately logged out and unable to access their accounts.`}
        confirmLabel="Ban All"
        variant="warning"
        isLoading={ban.isPending}
        resource="user"
        action="deactivate"
      />

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={confirmAction === "delete"}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Users"
        message={`This will permanently delete ${count} user account${count !== 1 ? "s" : ""} and all associated data. This action cannot be undone.`}
        confirmLabel="Delete All"
        variant="danger"
        isLoading={remove.isPending}
        resource="user"
        action="delete"
      />
    </>
  )
}