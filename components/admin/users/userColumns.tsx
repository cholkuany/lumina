'use client'

import { useMemo } from "react"
import { ActionButton, actions, ModalState } from "@/app/(management)/admin/users/page"
import { User } from "@/lib/auth"
import type { ColumnDef } from '@tanstack/react-table'

import { StatusBadge } from "@/components/admin/StatusBadge"
import { cn } from "@/lib/utils"


export const useUserColumns = (setModal: (state: ModalState) => void): ColumnDef<User>[] => {
  return useMemo(() => {
    return [
      {
        accessorKey: "id",
        header: "User",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0"
            >
              <span className="text-gold font-semibold text-sm">
                {row.original.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-charcoal truncate">{row.original.name}</p>
              <p className="text-xs text-warm-gray-dark truncate">{row.original.email}</p>
            </div>
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setModal({ type: "role", user: row.original })
            }}
            title="Click to change role"
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-full capitalize",
              "transition-all hover:ring-2 hover:ring-offset-1 cursor-pointer",
              row.original.role === "admin"
                ? "bg-purple-100 text-purple-700 hover:ring-purple-300"
                : "bg-linen text-charcoal hover:ring-warm-gray"
            )}
          >
            {row.original.role}
          </button>
        ),
      },
      {
        accessorkey: "banned",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge status={row.original.banned ? "suspended" : "active"} size="sm" />
        ),
      },
      {
        accessorkey: "subscribeNewsletter",
        header: "Newsletter",
        cell: ({ row }) => (
          <span
            className={cn(
              "text-xs",
              (row.original).subscribeNewsletter
                ? "text-green-600 font-medium"
                : "text-warm-gray-dark"
            )}
          >
            {(row.original).subscribeNewsletter ? "Subscribed" : "—"}
          </span>
        ),
      },
      {
        accessorkey: "createdAt",
        header: "Joined",
        cell: ({ row }) => (
          <span className="text-warm-gray-dark text-sm">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            {actions(row.original).map(({ type, title, hoverClass, icon }) => (
              <ActionButton
                key={type}
                onClick={(e) => {
                  e.stopPropagation()
                  setModal({ type, user: row.original })
                }}
                title={title}
                hoverClass={hoverClass}
              >
                {icon}
              </ActionButton>
            ))}
          </div>
        ),
        meta: {
          className: "w-40",
        }
      },
    ]
  }, [setModal])
}
