import Link from 'next/link'
import { type LoginUser } from '@/lib/types'

import { LogOut } from 'lucide-react'

import { userMenuItems } from '@/lib/constants/navigation'

type MobileAccountLinksProps = {
  user: LoginUser | null
  setOpen: (open: boolean) => void
}

export const MobileAccountLinks = ({ user, setOpen }: MobileAccountLinksProps) => {
  if (!user) return null

  return (
    <div className="mt-6 pt-6 border-t border-warm-gray-light">
      <p className="text-xs font-medium text-warm-gray-dark uppercase tracking-wider mb-3">
        My Account
      </p>
      {user &&
        <div className="flex flex-col gap-1">
          {userMenuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 py-3 text-charcoal hover:text-gold transition-colors"
              onClick={() => setOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => {
              setOpen(false)
            }}
            className="flex items-center gap-3 py-3 text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      }
    </div>
  )
}
