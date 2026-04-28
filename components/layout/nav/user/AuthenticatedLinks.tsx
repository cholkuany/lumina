import Link from 'next/link'
import { userMenuItems } from '@/lib/constants/navigation'

type AuthenticatedLinksProps = {
  setUserMenuOpen: (open: boolean) => void;
}
export const AuthenticatedLinks = ({ setUserMenuOpen }: AuthenticatedLinksProps) => (
  <div className="p-2">
    {userMenuItems.map((item) => (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setUserMenuOpen(false)}
        className="flex items-center gap-3 px-3 py-2.5 text-sm text-charcoal hover:bg-linen hover:text-gold rounded-lg transition-colors"
      >
        <item.icon className="w-4 h-4" />
        {item.name}
      </Link>
    ))}
  </div>
)