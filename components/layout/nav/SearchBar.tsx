'use client'

import { FormEvent, Suspense, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

import { useCategories } from '@/hooks/useCategories'

type SearchFormProps = {
  initialTerm: string
  initialCategory: string
}

const SearchForm = ({ initialTerm, initialCategory }: SearchFormProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { data } = useCategories(false)

  const [query, setQuery] = useState(initialTerm)
  const [category, setCategory] = useState(initialCategory)

  const navigate = (term: string, cat: string) => {
    const onProducts = pathname === '/products'

    if (!term && !cat && !onProducts) return

    const params = onProducts
      ? new URLSearchParams(searchParams.toString())
      : new URLSearchParams()

    if (term) params.set('filter', term)
    else params.delete('filter')

    if (cat) params.set('category', cat)
    else params.delete('category')

    const queryString = params.toString()
    router.push(queryString ? `/products?${queryString}` : '/products')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate(query.trim(), category)
  }

  const handleClear = () => {
    setQuery('')
    if (pathname === '/products') navigate('', category)
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex h-10.5 w-full overflow-hidden rounded border-2 border-gold bg-[#FAFAF8] focus-within:ring-2 focus-within:ring-gold/40"
    >
      <select
        aria-label="Search category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="hidden relative sm:block w-24 shrink-0 truncate border-none bg-[#EDE9DC] px-2 text-xs text-muted outline-none sm:w-auto sm:max-w-40 sm:px-2.5"
      >
        <option value="">All</option>
        {data?.categories.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search products…"
        aria-label="Search products"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="min-w-0 flex-1 border-none bg-transparent px-3 text-sm outline-none sm:px-3.5"
      />

      {query && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={handleClear}
          className="px-2 text-border-dark transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      <button
        type="submit"
        aria-label="Submit search"
        className="flex shrink-0 items-center gap-1.5 bg-gold px-3 text-[13px] font-bold text-ink transition-colors hover:bg-gold-deep sm:px-4"
      >
        <Search className="h-4 w-4 sm:hidden" aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  )
}

const SearchBarContent = () => {
  const searchParams = useSearchParams()

  const term = searchParams.get('filter') ?? ''
  const category = searchParams.get('category') ?? ''

  // When the URL's filter/category change, form remounts with diff. initial state.
  return (
    <SearchForm
      key={`${term}|${category}`}
      initialTerm={term}
      initialCategory={category}
    />
  )
}

export const SearchBar = () => (
  <Suspense fallback={<SearchBarFallback />}>
    <SearchBarContent />
  </Suspense>
)

// suspense boundary
const SearchBarFallback = () => (
  <div
    aria-hidden="true"
    className="flex h-10.5 w-full overflow-hidden rounded border-2 border-gold bg-[#FAFAF8]"
  >
    <div className="w-24 shrink-0 bg-[#EDE9DC] sm:w-28" />
    <div className="flex-1" />
    <div className="w-11 shrink-0 bg-gold sm:w-24" />
  </div>
)