import { useWishlistStore as uws } from "./wishlist.store";

export const useIsInWishlist = (productId: string) => {
  const items = useWishlistItems();
  return items.some((item) => item.product.id === productId);
};

export const useWishlistItemCount = () => {
  const items = useWishlistItems();
  return items.length;
};

export const useWishlistItems = () => uws((state) => state.items);
export const useAddToWishlist = () => uws((state) => state.addItem);
export const useRemoveFromWishlist = () => uws((state) => state.removeItem);
export const useClearWishlist = () => uws((state) => state.clearWishlist);