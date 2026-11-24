
import { Schema, model, models } from "mongoose";

type IWishlistItem = {
  user: Schema.Types.ObjectId,
  product: Schema.Types.ObjectId
}

const wishlistItemSchema = new Schema<IWishlistItem>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Prevent a user from adding the same product twice
wishlistItemSchema.index(
  { user: 1, product: 1 },
  { unique: true }
);

export const WishlistItem =
  models.WishlistItem ||
  model("WishlistItem", wishlistItemSchema);
