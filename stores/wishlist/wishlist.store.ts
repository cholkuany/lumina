import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WishlistActions, WishlistState } from './wishlist.types'

export const useWishlistStore = create<WishlistState & WishlistActions>()(
  persist((set) => ({
    items: [],
    isHydrated: false,
    addItem: (item) => set((state) => {
      const itemInWishlist = state.items.some(it => it.product.id === item.id)
      if (itemInWishlist) return state

      return {
        items: [
          ...state.items,
          {
            id: item.id,
            product: item,
            addedAt: new Date()
          }
        ]
      }
    }),
    removeItem: (id) => set((state) => ({
      items: state.items.filter(item => item.product.id !== id)
    })),
    clearWishlist: () => set({ items: [] }),
  }),
    {
      name: 'wishlist-store',
      onRehydrateStorage: () => (state) => {
        if (state) state.isHydrated = true
      }
    }
  )
)