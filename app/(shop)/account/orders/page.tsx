import { requireServerSession } from '@/lib/auth-server'
import { getOrdersForUser } from '@/lib/queries/get.orders'
import { OrdersClient } from './OrdersClient'

export default async function OrdersPage() {
  const session = await requireServerSession()
  const orders = await getOrdersForUser(session.user.id)

  return <OrdersClient orders={orders} />
}
