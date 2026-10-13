import { useEffect } from 'react'
import { SignOutButton } from '@/components/sign-out-button'
import { type LoginUser } from '@/lib/types'
import { AuthenticatedLinks } from './AuthenticatedLinks'
import { UserInfoHeader } from './UserInfoHeader'
import { AuthButtons } from './AuthButtons'
import { GuestInfoHeader } from './GuestInfoHeader'
import { QuickLinks } from './QuickLinks'

type UserDropdownMenuProps = {
  userSession: LoginUser | null
  userMenuOpen: boolean
  firstName: string
  lastName: string
  setUserMenuOpen: (open: boolean) => void
}

export const UserDropdownMenu = ({
  userSession,
  userMenuOpen,
  firstName,
  lastName,
  setUserMenuOpen,
}: UserDropdownMenuProps) => {
  useEffect(() => {
    if (!userMenuOpen) return
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setUserMenuOpen(false)
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [userMenuOpen, setUserMenuOpen])

  if (!userMenuOpen) return null

  return (
    <div className="fixed inset-x-2 top-16 z-50 overflow-hidden rounded-brand border border-border-light bg-white shadow-hover sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72">
      {userSession ? (
        <>
          <UserInfoHeader
            firstName={firstName}
            lastName={lastName}
            email={userSession.email}
            image={userSession.image}
          />
          <AuthenticatedLinks setUserMenuOpen={setUserMenuOpen} />
          <QuickLinks setUserMenuOpen={setUserMenuOpen} />
          <SignOutButton closeMenu={() => setUserMenuOpen(false)} />
        </>
      ) : (
        <>
          <GuestInfoHeader />
          <AuthButtons setUserMenuOpen={setUserMenuOpen} />
        </>
      )}
    </div>
  )
}