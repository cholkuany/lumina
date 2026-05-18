import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export const SearchBar = () => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState<string>('')

  console.log('query===', query)

  return (
    <div className={cn(
      "flex items-center transition-all duration-300",
      open ? "w-64" : "w-auto"
    )}>
      {open ? (
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full h-10 pl-10 pr-4 bg-linen rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            autoFocus
            onBlur={() => setOpen(false)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-dark" />
        </div>
      ) : (
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Search className="w-5 h-5" />
        </Button>
      )}
    </div>
  )
}
