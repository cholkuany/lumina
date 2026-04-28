// // DesktopNavigation.tsx

// import Link from 'next/link'
// import { ChevronDown } from 'lucide-react'
// import type { Category } from "@/hooks/useCategories"
// import { cn } from '@/lib/utils'
// import { NavbarItem } from './Navbar'
// import { useState } from 'react'

// export const DesktopNavigation = ({ categories }: { categories: Category[] }) => (
//   <div className="hidden lg:flex items-center gap-8">
//     {
//       categories.map((category) => (
//         <div key={category.id} className="relative group">

//           {/* Top-level Category Link */}
//           <Link
//             href={`/categories/${category.slug}`}
//             className="flex items-center gap-1 text-sm font-medium text-charcoal hover:text-gold transition-colors py-2"
//           >
//             {category.name}
//             {category.children?.length > 0 && (
//               <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
//             )}
//           </Link>

//           {/* Mega Menu Dropdown */}
//           {category.children?.length > 0 && (
//             <div
//               className={cn(
//                 "absolute top-full left-0 pt-2 z-50",
//                 "opacity-0 invisible -translate-y-1",
//                 "group-hover:opacity-100 group-hover:visible group-hover:translate-y-0",
//                 "transition-all duration-200 ease-out"
//               )}
//             >
//               {/* Invisible bridge — prevents hover gap from closing menu */}
//               <div className="absolute -top-2 left-0 right-0 h-2" />

//               <div
//                 className={cn(
//                   "bg-background rounded-brand shadow-hover border border-warm-gray-light",
//                   "p-6",
//                   category.children.length <= 2 ? "min-w-75" : "min-w-125",
//                   "grid gap-6",
//                   `grid-cols-${Math.min(category.children.length, 4)}`
//                 )}
//               >
//                 {category.children
//                   .filter((child) => child.isActive)
//                   .map((child) => (
//                     <div key={child.id} className="flex flex-col gap-1">

//                       {/* Level 2 — Column Header */}
//                       <Link
//                         href={`/categories/${child.slug}`}
//                         className="font-semibold text-sm text-charcoal hover:text-gold transition-colors pb-2 border-b border-warm-gray-light"
//                       >
//                         {child.name}
//                       </Link>

//                       {/* Level 3 — Grandchildren */}
//                       {child.children?.length > 0 && (
//                         <div className="flex flex-col gap-1 mt-1">
//                           {child.children
//                             .filter((gc) => gc.isActive)
//                             .map((grandchild) => (
//                               <Link
//                                 key={grandchild.id}
//                                 href={`/categories/${grandchild.slug}`}
//                                 className="text-sm text-warm-gray-dark hover:text-gold transition-colors py-1"
//                               >
//                                 {grandchild.name}
//                               </Link>
//                             ))}

//                           {/* "View all" link for Level 2 */}
//                           <Link
//                             href={`/categories/${child.slug}`}
//                             className="text-xs text-gold font-medium mt-1 hover:underline"
//                           >
//                             View all →
//                           </Link>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//               </div>
//             </div>
//           )}
//         </div>
//       ))
//     }
//   </div>
// )

// export const DesktopNavigationWrapper = ({ navigation }: { navigation: NavbarItem[] }) => {
//   const [openCategory, setOpenCategory] = useState<boolean>(false)
//   return (
//     <div className="hidden lg:flex items-center gap-8">
//       {navigation.map((item) => (
//         <div key={item.name} className="relative group">
//           <Link
//             href={item.href}
//             className="flex items-center gap-1 text-sm font-medium text-charcoal hover:text-gold transition-colors link-hover py-2"
//           >
//             {item.name}
//             {item.children && <ChevronDown onClick={() => setOpenCategory(!openCategory)} className="w-4 h-4" />}
//           </Link>

//           {/* Dropdown */}
//           {openCategory && item.children && (
//             <DesktopNavigation categories={item.children} />
//           )}
//         </div>
//       ))}
//     </div>
//   )
// }

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from './Navbar'
import type { NestedCategory } from '@/hooks/useCategories'

// ⚠️ Tailwind JIT can't resolve dynamic class names like `grid-cols-${n}`
// Use a lookup map instead
const gridColsMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

// Renders the mega menu panel content (DB categories as columns)
const CategoryMegaMenuPanel = ({ categories }: { categories: NestedCategory[] }) => {
  const active = categories.filter((c) => c.isActive)
  const cols = Math.min(active.length, 4)

  return (
    <div
      className={cn(
        'bg-background rounded-brand shadow-hover border border-warm-gray-light p-6 grid gap-6',
        active.length <= 2 ? 'min-w-75' : 'min-w-125',
        gridColsMap[cols] ?? 'grid-cols-4'
      )}
    >
      {active.map((category) => (
        <div key={category.id} className="flex flex-col gap-1">

          {/* Level 1 — Column Header */}
          <Link
            href={`/categories/${category.slug}`}
            className="font-semibold text-sm text-charcoal hover:text-gold
                       transition-colors pb-2 border-b border-warm-gray-light"
          >
            {category.name}
          </Link>

          {/* Level 2 — Children */}
          {category.children?.filter((c) => c.isActive).map((child) => (
            <div key={child.id} className="flex flex-col gap-1 mt-1">
              <Link
                href={`/categories/${child.slug}`}
                className="text-sm text-warm-gray-dark hover:text-gold transition-colors py-1"
              >
                {child.name}
              </Link>

              {/* Level 3 — Grandchildren */}
              {child.children?.filter((gc) => gc.isActive).map((grandchild) => (
                <Link
                  key={grandchild.id}
                  href={`/categories/${grandchild.slug}`}
                  className="text-xs text-warm-gray-dark hover:text-gold
                             transition-colors py-0.5 pl-2 border-l border-warm-gray-light"
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

// Main desktop nav — renders all NavItems (static + dynamic categories)
export const DesktopNavigationWrapper = ({ navigation }: { navigation: NavItem[] }) => (
  <div className="hidden lg:flex items-center gap-8">
    {navigation.map((item) => (
      <div key={item.name} className="relative group">

        {/* Nav Item Link */}
        <Link
          href={item.href}
          className="flex items-center gap-1 text-sm font-medium text-charcoal
                     hover:text-gold transition-colors link-hover py-2"
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
            {/* Invisible bridge — prevents accidental hover gap close */}
            <div className="absolute -top-2 left-0 right-0 h-2" />
            <CategoryMegaMenuPanel categories={item.children} />
          </div>
        )}
      </div>
    ))}
  </div>
)