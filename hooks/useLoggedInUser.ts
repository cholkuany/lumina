'use client'

import { useSession } from '@/lib/auth-client'
import { LoginUser } from '@/lib/types'

export function useLoggedInUser() {
  const { data: session } = useSession()

  if (!session) {
    return {
      user: null,
      firstName: '',
      lastName: '',
      initials: '',
    }
  }

  const user = session.user as LoginUser
  const parts = user.name?.split(' ') ?? []

  const firstName = parts[0] ?? ''
  const lastName = parts[1] ?? ''

  return {
    user,
    firstName,
    lastName,
    initials: `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase(),
  }
}