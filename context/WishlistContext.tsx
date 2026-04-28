// context/WishlistContext.tsx
'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { WishlistItem, Product } from '@/lib/types'

interface WishlistState {
  items: WishlistItem[]
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] }

interface WishlistContextType {
  state: WishlistState
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  itemCount: number
}

const WishlistContext = createContext<WishlistContextType | null>(null)

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.some(item => item.product.id === action.payload.id)
      if (exists) return state
      return {
        items: [...state.items, { id: action.payload.id, product: action.payload, addedAt: new Date() }],
      }
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(item => item.product.id !== action.payload),
      }
    case 'CLEAR_WISHLIST':
      return { items: [] }
    case 'LOAD_WISHLIST':
      return { items: action.payload }
    default:
      return state
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] })

  useEffect(() => {
    const savedWishlist = localStorage.getItem('lumina-wishlist')
    if (savedWishlist) {
      dispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(savedWishlist) })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('lumina-wishlist', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product: Product) => dispatch({ type: 'ADD_ITEM', payload: product })
  const removeItem = (productId: string) => dispatch({ type: 'REMOVE_ITEM', payload: productId })
  const clearWishlist = () => dispatch({ type: 'CLEAR_WISHLIST' })
  const isInWishlist = (productId: string) => state.items.some(item => item.product.id === productId)
  const itemCount = state.items.length

  return (
    <WishlistContext.Provider value={{ state, addItem, removeItem, clearWishlist, isInWishlist, itemCount }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}