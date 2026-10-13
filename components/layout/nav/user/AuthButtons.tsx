import { UserPlus, LogIn } from 'lucide-react'
import Link from 'next/link'

const base =
  'flex h-11 w-full items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2'

export const AuthButtons = ({ setUserMenuOpen }: { setUserMenuOpen: (open: boolean) => void }) => {
  const close = () => setUserMenuOpen(false)

  return (
    <div className="space-y-3 p-4">
      <Link
        href="/login"
        onClick={close}
        className={`${base} bg-primary text-white hover:bg-primary-dark`}
      >
        <LogIn className="h-4 w-4 shrink-0" aria-hidden="true" />
        Sign In
      </Link>
      <Link
        href="/register"
        onClick={close}
        className={`${base} border border-foreground/30 text-foreground hover:bg-surface`}
      >
        <UserPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
        Create Account
      </Link>
    </div>
  )
}