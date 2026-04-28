'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from '../Navbar'

type Props = {
  navigation: NavItem[]
  setOpen: (open: boolean) => void
}

export const MobileNavLinks = ({ navigation, setOpen }: Props) => {
  const [openL1, setOpenL1] = useState<string | null>(null)
  const [openL2, setOpenL2] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-1">
      {navigation.map((item) => (
        <div key={item.name}>

          {/* Level 0 — Static nav items (Home, Categories, Deals...) */}
          <div
            className="flex items-center justify-between py-3 border-b border-warm-gray-light cursor-pointer"
            onClick={() =>
              item.children?.length
                ? setOpenL1(openL1 === item.name ? null : item.name)
                : setOpen(false)
            }
          >
            <Link
              href={item.href}
              className="text-lg font-medium text-charcoal hover:text-gold transition-colors"
              onClick={(e) => item.children?.length && e.preventDefault()}
            >
              {item.name}
            </Link>
            {item.children && item.children.length > 0 && (
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-charcoal transition-transform duration-200',
                  openL1 === item.name && 'rotate-180'
                )}
              />
            )}
          </div>

          {/* Level 1 — DB Categories (under "Categories") */}
          {item.children && openL1 === item.name && (
            <div className="pl-4 py-1 flex flex-col gap-1">
              {item.children.filter((c) => c.isActive).map((category) => (
                <div key={category.id}>

                  <div
                    className="flex items-center justify-between py-2.5 cursor-pointer"
                    onClick={() =>
                      category.children?.length
                        ? setOpenL2(openL2 === category.id ? null : category.id)
                        : setOpen(false)
                    }
                  >
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-base font-medium text-charcoal hover:text-gold transition-colors"
                      onClick={(e) => category.children?.length && e.preventDefault()}
                    >
                      {category.name}
                    </Link>
                    {category.children?.length > 0 && (
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 text-warm-gray-dark transition-transform duration-200',
                          openL2 === category.id && 'rotate-180'
                        )}
                      />
                    )}
                  </div>

                  {/* Level 2 — Subcategories */}
                  {category.children?.length > 0 && openL2 === category.id && (
                    <div className="pl-4 flex flex-col gap-1 pb-2">
                      {category.children.filter((c) => c.isActive).map((child) => (
                        <Link
                          key={child.id}
                          href={`/categories/${child.slug}`}
                          className="block py-2 text-sm text-warm-gray-dark hover:text-gold transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}