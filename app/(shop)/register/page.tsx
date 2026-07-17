import RegisterClient from './RegisterClient'
import { getSafeRedirectPath } from '@/utils/getSafeRedirectPath'
import { RedirectProps } from '@/lib/types'

export default async function RegisterPage({ searchParams }: RedirectProps) {
  const redirectTo = getSafeRedirectPath(
    (await searchParams)?.redirectTo,
    '/account'
  )

  return <RegisterClient redirectTo={redirectTo} />
}
