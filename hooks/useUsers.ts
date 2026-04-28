'use client'

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import type { User } from "better-auth/client";

interface UseUsersOptions {
  page?: number
  limit?: number
  search?: string
  role?: string
  banned?: boolean | undefined
  sortBy?: string
  sortDirection?: "asc" | "desc"
}

export function useUsers(options: UseUsersOptions = {}) {
  const {
    page = 1,
    limit = 10,
    search,
    role,
    banned,
    sortBy = "createdAt",
    sortDirection = "desc",
  } = options

  return useQuery({
    queryKey: ["users", { page, limit, search, role, banned, sortBy, sortDirection }],
    queryFn: async () => {
      const filters: { field: string; value: string; operator: string }[] = []

      if (role) {
        filters.push({ field: "role", value: role, operator: "eq" })
      }

      if (banned !== undefined) {
        filters.push({
          field: "banned",
          value: String(banned),
          operator: "eq",
        })
      }

      const { data, error } = await authClient.admin.listUsers({
        query: {
          limit,
          offset: (page - 1) * limit,
          searchValue: search || undefined,
          searchField: search ? "name" : undefined,
          searchOperator: search ? "contains" : undefined,
          sortBy: sortBy as "email" | "createdAt" | "name",
          sortDirection,
          filterField: filters[0]?.field as "role" | "banned" | undefined,
          filterValue: filters[0]?.value,
          filterOperator: "eq",
        },
      })
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  })
}

export const useUser = (id: string) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data, error } = await authClient.admin.getUser({
        query: { id },
      });

      if (error) {
        throw new Error(error.message);
      }

      return data as User;
    },
  });
