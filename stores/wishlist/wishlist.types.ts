import { TWishlistItem, TProduct } from '@/lib/types'

export type WishlistActions = {
  addItem: (item: TProduct) => void
  removeItem: (id: string) => void
  clearWishlist: () => void
  // loadWishlist: (payload: TWishlistItem[]) => void
}

export interface WishlistState {
  items: TWishlistItem[]
  isHydrated: boolean

}
