import { getServerSession } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import CheckoutClient from './CheckoutClient'

export default async function CheckoutPage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect('/login?redirectTo=/checkout')
  }

  return <CheckoutClient />
}
