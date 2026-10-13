import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getStorefrontCategories } from '@/lib/queries/get.categories'
import { CategoryScroller } from './CategoryScroller'

export async function Categories() {
  const categories = await getStorefrontCategories()

  return (
    <section className="mb-5 border-y border-border-light bg-surface py-14 sm:py-20">
      <div className="container-lumina">
        <div className="mb-8 flex items-end justify-between gap-6">
          <h2 className="mt-2 text-xl font-black tracking-[-.045em] text-foreground sm:text-3xl">Categories</h2>
          <Link
            href="/products"
            className="group flex items-center gap-2 text-sm font-black text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            View all
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
          </Link>
        </div>

        <CategoryScroller categories={categories} />
      </div>
    </section>
  )
}