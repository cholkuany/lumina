'use client'

import { FormEvent, KeyboardEvent, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export const SearchBar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchTerm = searchParams.get('filter') ?? ''

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState<string>(searchTerm)

  const runSearch = () => {
    const trimmedQuery = query.trim()
    const params = pathname === '/products'
      ? new URLSearchParams(searchParams.toString())
      : new URLSearchParams()

    if (!trimmedQuery) {
      if (pathname === '/products') {
        params.delete('filter')
        const queryString = params.toString()
        router.push(queryString ? `/products?${queryString}` : '/products')
      }
      setOpen(false)
      return
    }

    params.set('filter', trimmedQuery)
    router.push(`/products?${params.toString()}`)
    setOpen(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    runSearch()
  }

  const clearSearch = () => {
    setQuery('')
    if (pathname === '/products') {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('filter')
      const queryString = params.toString()
      router.push(queryString ? `/products?${queryString}` : '/products')
    }
  }

  return (
    <div className={cn(
      "flex items-center transition-all duration-300",
      open ? "w-64" : "w-auto"
    )}>
      {open ? (
        <form onSubmit={handleSubmit} className="relative w-full">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full h-10 pl-10 pr-16 bg-linen rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Escape') {
                setOpen(false)
              }
              if (event.key === 'Enter') {
                event.preventDefault()
                runSearch()
              }
            }}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-dark" />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={clearSearch}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-warm-gray-dark hover:text-charcoal transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            aria-label="Submit search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray-dark hover:text-gold transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setQuery(searchTerm)
            setOpen(true)
          }}
          aria-label="Open search"
        >
          <Search className="w-5 h-5" />
        </Button>
      )}
    </div>
  )
}
