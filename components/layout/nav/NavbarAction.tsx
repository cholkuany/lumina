import { SearchBar } from './SearchBar'
import { CartButton } from './CartButton'
import { WishlistButton } from './WishlistButton'
import { UserMenu } from './user/UserMenu'
import { LoginUser } from '@/lib/types'

type NavbarActionsProps = {
  user: LoginUser | null
  firstName: string
  lastName: string
  itemCount: number
}

export const NavbarActions = ({ user, firstName, lastName, itemCount }: NavbarActionsProps) => (
  <div className="flex items-center gap-1 sm:gap-2">
    <SearchBar />
    <UserMenu user={user} firstName={firstName} lastName={lastName} />
    <WishlistButton />
    <CartButton count={itemCount} />
  </div>
)
