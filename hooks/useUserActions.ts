import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  banUser,
  unbanUser,
  setUserRole,
  deleteUser,
  revokeUserSessions,
} from "@/lib/adminActions"
import { toast } from "sonner"

export function useUserActions() {
  const queryClient = useQueryClient()

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] })
  }

  const ban = useMutation({
    mutationFn: ({
      userId,
      reason,
    }: {
      userId: string
      reason?: string
    }) => banUser(userId, reason),
    onSuccess: () => {
      toast.success("User banned successfully")
      invalidateUsers()
    },
    onError: () => toast.error("Failed to ban user"),
  })

  const unban = useMutation({
    mutationFn: ({ userId }: { userId: string }) => unbanUser(userId),
    onSuccess: () => {
      toast.success("User reactivated successfully")
      invalidateUsers()
    },
    onError: () => toast.error("Failed to reactivate user"),
  })

  const changeRole = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "user" | "admin" }) =>
      setUserRole(userId, role),
    onSuccess: () => {
      toast.success("Role updated successfully")
      invalidateUsers()
    },
    onError: () => toast.error("Failed to update role"),
  })

  const remove = useMutation({
    mutationFn: ({ userId }: { userId: string }) => deleteUser(userId),
    onSuccess: () => {
      toast.success("User deleted successfully")
      invalidateUsers()
    },
    onError: () => toast.error("Failed to delete user"),
  })

  const revokeSessions = useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      revokeUserSessions(userId),
    onSuccess: () => {
      toast.success("Sessions revoked successfully")
      invalidateUsers()
    },
    onError: () => toast.error("Failed to revoke sessions"),
  })

  return { ban, unban, changeRole, remove, revokeSessions }
}