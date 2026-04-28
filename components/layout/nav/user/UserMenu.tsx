'use client'

import { useRef, useState } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { UserAvatar } from './UserAvatar'
import { UserDropdownMenu } from './UserDropdown'
import { type LoginUser } from '@/lib/types'

type UserMenuProps = {
  user: LoginUser | null
  firstName: string
  lastName: string
}

export const UserMenu = ({ user, firstName, lastName }: UserMenuProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside(ref, () => setOpen(false))

  return (
    <div ref={ref} className="relative hidden sm:block">
      <UserAvatar
        user={user}
        initials={`${firstName[0]}${lastName[0]}`}
        onClick={() => setOpen(!open)}
        open={open}
      />
      <UserDropdownMenu
        userSession={user}
        userMenuOpen={open}
        firstName={firstName}
        lastName={lastName}
        setUserMenuOpen={setOpen}
      />
    </div>
  )
}
