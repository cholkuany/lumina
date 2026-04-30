import type { NestedCategory } from "@/hooks/useCategories"

export const activeFilters = (selectedFilters: Record<string, string[]>, categories: NestedCategory[]) => {
  const currentFilters = Object.entries(selectedFilters).flatMap(
    ([group, values]) =>
      values.map(value => {
        const label =
          categories
            ?.find(cat => cat.name === group)
            ?.children?.find(child => child.name === value)?.name || value

        return {
          group,
          value,
          label,
        }
      })
  )
  return currentFilters
}