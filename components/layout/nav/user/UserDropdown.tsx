import { SignOutButton } from '@/components/sign-out-button'
import { type LoginUser } from '@/lib/types'
import { AuthenticatedLinks } from './AuthenticatedLinks'
import { UserInfoHeader } from './UserInfoHeader'
import { AuthButtons } from './AuthButtons'
import { GuestInfoHeader } from './GuestInfoHeader'
import { QuickLinks } from './QuickLinks'

import { cn } from '@/lib/utils'

type UserDropdownMenuProps = {
  userSession: LoginUser | null,
  userMenuOpen: boolean,
  firstName: string,
  lastName: string,
  setUserMenuOpen: (open: boolean) => void
}

export const UserDropdownMenu = ({
  userSession,
  userMenuOpen,
  firstName,
  lastName,
  setUserMenuOpen
}: UserDropdownMenuProps) => {
  if (!userMenuOpen) return null

  return (
    <div
      className={cn(
        "absolute top-full right-0 mt-2 w-72 bg-white rounded-brand shadow-hover border border-warm-gray-light overflow-hidden transition-all duration-200",
        userMenuOpen
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible -translate-y-2"
      )}
    >
      {userSession ? (
        <>
          <UserInfoHeader
            firstName={firstName}
            lastName={lastName}
            email={userSession.email}
          />
          <AuthenticatedLinks
            setUserMenuOpen={setUserMenuOpen}
          />
          <QuickLinks setUserMenuOpen={setUserMenuOpen} />
          <SignOutButton />
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