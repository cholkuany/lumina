import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Attribute, TCartProduct } from '@/lib/types'
import type { CartState, Actions } from './cart.types'

import { buildKey } from '@/hooks/useVariant'

export const useCartStore = create<CartState & Actions>()(
  persist((set) => ({
    items: [],
    isOpen: false,
    hasHydrated: false,

    addItem: (product, quantity, variants, image) => set((state) => {
      if (!variants) {
        throw new Error("Variant not found")
      }

      const variantKey = buildKey(variants as Attribute)

      const existingIndex = state.items.findIndex(
        item => item.product.id === product.id && buildKey(item.product.variant.attributes) === variantKey
      )

      if (existingIndex > -1) {
        const updatedItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )

        return {
          items: updatedItems,
          isOpen: true
        }
      }

      const selected = product.variants.find(v => {
        return Object.entries(variants).every(([key, value]) => v.attributes[key] === value)
      })

      if (!selected) {
        throw new Error("Variant not found")
      }

      const cartProduct: TCartProduct = {
        id: product.id,
        name: product.name,
        variant: selected,
      }

      return {
        items: [
          ...state.items,
          {
            id: `${product.id}-${Date.now()}`,
            product: cartProduct,
            quantity,
            variantImage: image
          }],
        isOpen: true
      };
    }),

    removeItem: (id: string) => set((state) => ({ items: state.items.filter(item => item.id !== id) })),

    updateQuantity: (id: string, quantity: number) => set((state) => {
      const updatedItems = state.items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)

      return {
        ...state,
        items: updatedItems
      };
    }),

    clearCart: () => set(({ items: [] })),
    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    openCart: () => set(({ isOpen: true })),
    closeCart: () => set(({ isOpen: false }))
  }),

    {
      name: 'lumina-cart',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true
        }
      }
    }
  )
)
