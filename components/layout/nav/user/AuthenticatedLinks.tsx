import { userMenuItems } from '@/lib/constants/navigation'
import { MenuLink } from './MenuLink'

export const AuthenticatedLinks = ({ setUserMenuOpen }: { setUserMenuOpen: (open: boolean) => void }) => (
  <div className="p-2">
    {userMenuItems.map((item) => (
      <MenuLink key={item.name} href={item.href} icon={item.icon} onClick={() => setUserMenuOpen(false)}>
        {item.name}
      </MenuLink>
    ))}
  </div>
)