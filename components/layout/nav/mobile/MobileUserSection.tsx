'use client'

import { type LoginUser } from '@/lib/types'

import Link from 'next/link'
import { LogIn, UserPlus } from 'lucide-react'

export const MobileUserSection = ({ user, firstName, lastName, setOpen }: { user: LoginUser | null; firstName: string; lastName: string; close: () => void, setOpen: (open: boolean) => void }) => {
  if (!user) return <div>Guest</div>

  return (
    <div className="mb-6 pb-6 border-b border-warm-gray-light">
      {user ? (
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-white font-serif font-semibold">
            {firstName.charAt(0)}{lastName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-charcoal">
              {firstName} {lastName}
            </p>
            <p className="text-sm text-warm-gray-dark">
              {user.email}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-warm-gray-dark text-sm mb-3">
            Sign in for a personalized experience
          </p>
          <div className="flex gap-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex-1 h-11 bg-gold text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gold-dark transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex-1 h-11 border border-charcoal text-charcoal rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-linen transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
