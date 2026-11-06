import { requireServerSession } from '@/lib/auth-server'
import { getOrderForUser } from '@/lib/queries/get.orders'
import { OrderDetailsClient } from './OrderDetailsClient'
import { getCustomerReturnsForOrder } from '@/lib/queries/return.queries'

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const session = await requireServerSession()
  const { id } = await params
  const order = await getOrderForUser(session.user.id, id)
  const returns = await getCustomerReturnsForOrder(id, session.user.id)

  return <OrderDetailsClient order={order} returns={returns} />
}
