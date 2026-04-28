import Image from 'next/image'
import { User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { type LoginUser } from '@/lib/types'
import { cn } from '@/lib/utils'

export const UserAvatar = ({ user, initials, onClick, open }: { user: LoginUser | null; initials: string; onClick: () => void; open: boolean }) => (
  <Button
    onClick={onClick}
    variant="ghost"
    size="icon"
    className={cn("relative", open && "bg-linen")}
  >
    {user ? (
      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white text-xs font-medium" >
        {
          user.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User Avatar'}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div>{initials}</div>
          )}
      </div>
    ) : (
      <User className="w-5 h-5" />
    )}
  </Button>
)


//   < Button
// variant = "ghost"
// size = "icon"
// onClick = {() => setUserMenuOpen(!userMenuOpen)}
// className = {
//   cn(
//       "relative",
//     userMenuOpen && "bg-linen"
//     )}
//   >
// {
//   user?(
//       <div className = "w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white text-xs font-medium" >
//     {
//       user.image ? (
//         <Image
//           src={user.image}
//           alt={user.name || 'User Avatar'}
//           width={32}
//           height={32}
//           className="w-8 h-8 rounded-full object-cover"
//         />
//       ) :
//         firstName.charAt(0).toLocaleUpperCase() + lastName.charAt(0).toLocaleUpperCase()
//     }
//       </div>
//     ) : (
//   <User className="w-5 h-5" />
// )}
//   </ >