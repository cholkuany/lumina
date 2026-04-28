import { getProductReviews } from '@/lib/queries/get.reviews'
import type { NextRequest } from 'next/dist/server/web/spec-extension/request'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log('Received product ID:', id)
  const res = await getProductReviews(id)
  return Response.json(res)
}