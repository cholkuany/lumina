import { requireServerSession } from '@/lib/auth-server'
import { getOrderForUser } from '@/lib/queries/get.orders'
import { OrderDetailsClient } from './OrderDetailsClient'

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const session = await requireServerSession()
  const { id } = await params
  const order = await getOrderForUser(session.user.id, id)

  return <OrderDetailsClient order={order} />
}
