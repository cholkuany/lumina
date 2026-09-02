'use client'

import type { NestedCategory } from '@/hooks/useCategories'
import { ToggleButton } from '@/components/filters/sidebar/ToggleButton'

export const CategoryFilter = (
  {
    category,
    isCurrent = false,
  }:
    {
      category: NestedCategory,
      isCurrent?: boolean
    }
) => {
  return (
    <div>
      <ToggleButton
        id={category.id}
        label={category.name}
        productCount={category.productCount}
        isCurrent={isCurrent}
      />
    </div>
  );
};
