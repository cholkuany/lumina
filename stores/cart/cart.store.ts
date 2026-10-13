import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { TCartProduct, TProductVariant } from '@/lib/types'
import type { CartState, Actions } from './cart.types'

import { buildKey } from '@/hooks/useVariant'

export const useCartStore = create<CartState & Actions>()(
  persist((set) => ({
    items: [],
    isOpen: false,
    hasHydrated: false,

    addItem: (product, quantity, variants) => set((state) => {
      if (!variants) {
        throw new Error("Variant not found")
      }

      const variantKey = buildKey(variants)

      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id && buildKey(item.product.variant.attributes) === variantKey
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

      const selected = product.variants.find(v =>
        Object.entries(variants).every(([key, value]) => v.attributes[key] === value)
      )

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
          }],
        isOpen: true
      };
    }),

    removeItem: (variant: TProductVariant) => set((state) => ({ items: state.items.filter(item => buildKey(item.product.variant.attributes) !== buildKey(variant.attributes)) })),

    updateQuantity: (variant: TProductVariant, quantity: number) => set((state) => {
      const updatedItems = state.items.map(item =>
        // item.id === id
        buildKey(item.product.variant.attributes) === buildKey(variant.attributes)
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)

      return { ...state, items: updatedItems };
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
