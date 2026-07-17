import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth-server'
import { getAdminOrders } from '@/lib/queries/get.admin.orders'
import { AdminOrdersClient } from './AdminOrdersClient'

export default async function OrdersPage() {
  const session = await getServerSession()

  if (!session?.user) redirect('/login')
  if (session.user.role !== 'admin') redirect('/')

  const { orders, stats } = await getAdminOrders()
  return <AdminOrdersClient initialOrders={orders} initialStats={stats} />
}
