"use client"

import { useState } from "react"
import { User } from "@/lib/auth"
import { useUserActions } from "@/hooks/useUserActions"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

import { X, LockKeyhole } from "lucide-react"

const ROLES = [
  {
    value: "user" as const,
    label: "Customer",
    description: "Can browse, purchase products and manage their orders.",
  },
  {
    value: "admin" as const,
    label: "Admin",
    description: "Full access to dashboard, products, orders and user management.",
  },
]

interface UserRoleModalProps {
  user: User
  onClose: () => void
}

export function UserRoleModal({ user, onClose }: UserRoleModalProps) {
  // Start with null — nothing newly selected yet
  const [selectedRole, setSelectedRole] = useState<"user" | "admin" | null>(null)
  const { changeRole } = useUserActions()

  const currentRole = user.role as "user" | "admin"
  const canSave = selectedRole !== null && selectedRole !== currentRole

  const handleSave = async () => {
    if (!canSave) return
    await changeRole.mutateAsync({ userId: user.id, role: selectedRole! })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-ivory rounded-brand shadow-xl w-full max-w-md p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-warm-gray-dark 
                     hover:text-charcoal hover:bg-linen transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-charcoal">Change Role</h2>
          <p className="text-sm text-warm-gray-dark mt-0.5">
            Updating role for{" "}
            <span className="font-medium text-charcoal">{user.name}</span>
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-3 mb-6">
          {ROLES.map((role) => {
            const isCurrent = role.value === currentRole
            const isSelected = role.value === selectedRole

            return isCurrent ? (
              /* ── Currently assigned role — locked, unclickable ── */
              <div
                key={role.value}
                aria-disabled="true"
                className={cn(
                  "relative w-full p-4 rounded-lg border-2 select-none",
                  "border-dashed border-warm-gray bg-linen/60 opacity-60",
                  "cursor-not-allowed"
                )}
              >
                {/* "Assigned" badge */}
                <span
                  className={cn(
                    "absolute top-3 right-3",
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
                    "text-[10px] font-semibold uppercase tracking-wide",
                    role.value === "admin"
                      ? "bg-purple-100 text-purple-500"
                      : "bg-warm-gray-light text-warm-gray-dark"
                  )}
                >
                  <LockKeyhole className="w-2.5 h-2.5" />
                  Assigned
                </span>

                <div className="flex items-center justify-between pr-16">
                  <div>
                    <p className="font-medium text-sm text-charcoal/50">
                      {role.label}
                    </p>
                    <p className="text-xs text-warm-gray-dark/70 mt-0.5">
                      {role.description}
                    </p>
                  </div>
                  {/* Filled, muted radio indicator */}
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center",
                      "justify-center shrink-0 ml-3",
                      "border-warm-gray bg-warm-gray"
                    )}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-ivory" />
                  </div>
                </div>
              </div>
            ) : (
              /* ── Selectable role ── */
              <button
                key={role.value}
                onClick={() => setSelectedRole(role.value)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-all duration-150",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
                  isSelected
                    ? role.value === "admin"
                      ? "border-purple-400 bg-purple-50 shadow-sm"
                      : "border-gold bg-linen shadow-sm"
                    : "border-warm-gray bg-white hover:border-warm-gray-dark hover:bg-linen/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={cn(
                        "font-medium text-sm",
                        isSelected
                          ? role.value === "admin"
                            ? "text-purple-700"
                            : "text-charcoal"
                          : "text-charcoal"
                      )}
                    >
                      {role.label}
                    </p>
                    <p className="text-xs text-warm-gray-dark mt-0.5">
                      {role.description}
                    </p>
                  </div>

                  {/* Radio indicator */}
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center",
                      "justify-center shrink-0 ml-3 transition-colors",
                      isSelected
                        ? role.value === "admin"
                          ? "border-purple-500 bg-purple-500"
                          : "border-gold bg-gold"
                        : "border-warm-gray-dark bg-white"
                    )}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Helper text */}
        <p className="text-xs text-warm-gray-dark text-center mb-5">
          {canSave ? (
            <>
              Changing role from{" "}
              <span className="font-medium text-charcoal capitalize">
                {currentRole === "user" ? "Customer" : currentRole}
              </span>{" "}
              →{" "}
              <span className="font-medium text-charcoal capitalize">
                {selectedRole === "user" ? "Customer" : selectedRole}
              </span>
            </>
          ) : (
            <>
              Select a new role to replace the currently assigned{" "}
              <span className="font-medium capitalize">
                {currentRole === "user" ? "Customer" : currentRole}
              </span>{" "}
              role.
            </>
          )}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={changeRole.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleSave}
            disabled={!canSave || changeRole.isPending}
          >
            {changeRole.isPending ? (
              <span className="flex items-center gap-2">
                <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />
                Saving…
              </span>
            ) : (
              "Save Role"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}