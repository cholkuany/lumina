import { UserPlus, LogIn } from 'lucide-react'
import Link from 'next/link'

export const AuthButtons = ({ setUserMenuOpen }: { setUserMenuOpen: (open: boolean) => void }) => (
  <div className="p-4 space-y-3">
    <Link
      href="/login"
      onClick={() => setUserMenuOpen(false)}
      className="flex items-center justify-center gap-2 w-full h-11 bg-gold text-white rounded-lg font-medium hover:bg-gold-dark transition-colors"
    >
      <LogIn className="w-4 h-4" />
      Sign In
    </Link>
    <Link
      href="/register"
      onClick={() => setUserMenuOpen(false)}
      className="flex items-center justify-center gap-2 w-full h-11 border border-charcoal text-charcoal rounded-lg font-medium hover:bg-linen transition-colors"
    >
      <UserPlus className="w-4 h-4" />
      Create Account
    </Link>
  </div>
)