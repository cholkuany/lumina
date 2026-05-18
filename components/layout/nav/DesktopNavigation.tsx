import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from './Navbar'
import type { NestedCategory } from '@/hooks/useCategories'

const gridColsMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

const CategoryMegaMenuPanel = ({ categories }: { categories: NestedCategory[] }) => {
  const cols = Math.min(categories.length, 4)

  return (
    <div
      className={cn(
        'bg-background rounded-brand shadow-hover border border-warm-gray-light p-6 gap-6 grid',
        categories.length <= 2 ? 'min-w-75' : 'min-w-125',
        gridColsMap[cols] ?? 'grid-cols-4'
      )}
    >
      {categories.map((category) => (
        <div key={category.id} className="flex flex-col gap-1">

          {/* Level 1 — Column Header */}
          <Link
            href={`/categories/${category.slug}`}
            className="font-semibold text-sm text-charcoal hover:text-gold transition-colors pb-2 border-b border-warm-gray-light"
          >
            {category.name}
          </Link>

          {/* Level 2 — Children */}
          {category.children?.map((child) => (
            <div key={child.id} className="flex flex-col gap-1 mt-1">
              <Link
                href={`/categories/${child.slug}`}
                className="text-sm text-warm-gray-dark hover:text-gold transition-colors py-1"
              >
                {child.name}
              </Link>

              {/* Level 3 — Grandchildren */}
              {child.children?.map((grandchild) => (
                <Link
                  key={grandchild.id}
                  href={`/categories/${grandchild.slug}`}
                  className="text-xs text-warm-gray-dark hover:text-gold transition-colors py-0.5 pl-2 border-l border-warm-gray-light"
                >
                  {grandchild.name}
                </Link>
              ))}

              {/* View All */}
              <Link
                href={`/categories/${child.slug}`}
                className="text-xs text-gold font-medium mt-1 hover:underline"
              >
                View all →
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// Main desktop nav
export const DesktopNavigationWrapper = ({ navigation }: { navigation: NavItem[] }) => (
  <div className="hidden lg:flex items-center gap-8">
    {navigation.map((item) => (
      <div key={item.name} className="relative group">

        {/* Nav Item Link */}
        <Link
          href={item.href}
          className="flex items-center gap-1 text-sm font-medium text-charcoal hover:text-gold transition-colors link-hover py-2"
        >
          {item.name}
          {item.children && item.children.length > 0 && (
            <ChevronDown
              className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
            />
          )}
        </Link>

        {/* Mega Menu Dropdown (only for items with children) */}
        {item.children && item.children.length > 0 && (
          <div
            className={cn(
              'absolute top-full left-0 pt-2 z-50',
              'opacity-0 invisible -translate-y-1',
              'group-hover:opacity-100 group-hover:visible group-hover:translate-y-0',
              'transition-all duration-200 ease-out'
            )}
          >
            <CategoryMegaMenuPanel categories={item.children} />
          </div>
        )}
      </div>
    ))}
  </div>
)