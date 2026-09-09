import { useCartStore } from './cart.store'

// Derived selectors
export const useCartItemCount = () =>
  useCartStore((state) =>
    state.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    )
  )

export const useCartSubtotal = () =>
  useCartStore((state) =>
    state.items.reduce(
      (sum, item) =>
        sum + item.product.variant.price * item.quantity,
      0
    )
  )

// State selectors
export const useCartItems = () => useCartStore((state) => state.items)
export const useCartIsOpen = () => useCartStore((state) => state.isOpen)
export const useCartHasHydrated = () => useCartStore((state) => state.hasHydrated)

// Action selectors
export const useAddToCart = () => useCartStore((state) => state.addItem)
export const useRemoveFromCart = () => useCartStore((state) => state.removeItem)
export const useUpdateCartQuantity = () => useCartStore((state) => state.updateQuantity)
export const useClearCart = () => useCartStore((state) => state.clearCart)
export const useToggleCart = () => useCartStore((state) => state.toggleCart)
export const useOpenCart = () => useCartStore((state) => state.openCart)
export const useCloseCart = () => useCartStore((state) => state.closeCart)