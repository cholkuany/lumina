import { NextResponse } from 'next/server'
import { Types, isValidObjectId } from 'mongoose';
import { withAuth } from '@/lib/withAuth';

type ObjectId = Types.ObjectId

import { WishlistItem } from "@/lib/db/models/Wishlist";

async function fetchUserList(user: string) {
  return await WishlistItem.find({ user })
    .populate("product")
    .sort({ createdAt: -1 })
    .lean();
}

async function addToWishlist(product: ObjectId, user: string) {
  return await WishlistItem.updateOne({ user, product },
    {
      $setOnInsert: { user, product }
    },
    { upsert: true }
  )
}

async function removeFromWishlist(products: ObjectId[], user: string) {
  return await WishlistItem.deleteMany({
    user: user,
    product: { $in: products }
  })
}

export const GET = withAuth(async (_req, user) => {
  const wishlist = await fetchUserList(user.id);

  return NextResponse.json({ wishlist }, { status: 200 });
});

export const POST = withAuth(async (req, user) => {
  const { product } = await req.json();
  console.log('product in API --->', product)
  if (!isValidObjectId(product)) {
    return NextResponse.json(
      { message: "Invalid product ID" },
      { status: 400 }
    );
  }

  const result = await addToWishlist(new Types.ObjectId(product), user.id);
  const message = result.upsertedCount ? "Added to wishlist" : "Already in wishlist";

  return NextResponse.json({ message }, { status: result.upsertedCount ? 201 : 200 });
});

export const DELETE = withAuth(async (req, user) => {
  const { products } = await req.json();
  console.log('products in API ---->', products)

  if (
    !Array.isArray(products) ||
    products.length === 0 ||
    !products.every(isValidObjectId)
  ) {
    return NextResponse.json(
      { message: "Invalid product ID(s)" },
      { status: 400 }
    );
  }

  const productIds = products.map((id: string) => new Types.ObjectId(id));

  const result = await removeFromWishlist(productIds, user.id);

  return NextResponse.json(
    { message: "Wishlist updated", deletedCount: result.deletedCount },
    { status: 200 }
  );
});