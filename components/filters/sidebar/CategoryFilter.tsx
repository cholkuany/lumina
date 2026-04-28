'use client'

import type { NestedCategory } from '@/hooks/useCategories'
import { Checkbox } from '@/components/ui/Checkbox'
import { ToggleButton } from '@/components/filters/sidebar/ToggleButton'

export const CategoryFilter = ({
  category,
  expandedGroups,
  toggleGroup,
  selectedFilters,
  onFilterChange,
  level = 0,
}: { category: NestedCategory, expandedGroups: string[], toggleGroup: (groupId: string) => void, selectedFilters: Record<string, string[]>, onFilterChange: (groupId: string, value: string, checked: boolean) => void, level: number }) => {
  const isExpanded = expandedGroups.includes(category.id);

  return (
    <div
      className={`${level > 0 ? "pl-4" : ""
        }`}
    >
      <ToggleButton
        id={category.id}
        included={isExpanded}
        toggleGroup={toggleGroup}
        label={category.name}
      />

      {isExpanded && category.children?.length > 0 && (
        <div className="py-2 space-y-2">
          {category.children.map((child) =>
            child.children?.length > 0 ? (
              // 🔁 Recursive call if child has children
              <CategoryFilter
                key={child.id}
                category={child}
                expandedGroups={expandedGroups}
                toggleGroup={toggleGroup}
                selectedFilters={selectedFilters}
                onFilterChange={onFilterChange}
                level={level + 1}
              />
            ) : (
              // ✅ Leaf node (no children → show checkbox)
              <Checkbox
                key={child.id}
                id={child.id}
                label={
                  <span className="flex items-center justify-between w-full">
                    <span>{child.name}</span>
                    {child.productCount !== undefined && (
                      <span className="text-warm-gray-dark text-xs">
                        ({child.productCount})
                      </span>
                    )}
                  </span>
                }
                checked={
                  selectedFilters[child.id]?.includes(child.name) || false
                }
                onChange={(checked) =>
                  onFilterChange(child.id, child.name, checked)
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
};