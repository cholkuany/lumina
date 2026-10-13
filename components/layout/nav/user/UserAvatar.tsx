import { ChevronDown, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { type LoginUser } from '@/lib/types'
import { cn } from '@/lib/utils'
import { AvatarBadge } from './AvatarBadge'

export const UserAvatar = ({
  user,
  initials,
  onClick,
  open,
}: {
  user: LoginUser | null
  initials: string
  onClick: () => void
  open: boolean
}) => {
  const firstName = user?.name?.trim().split(' ')[0]

  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="xxxl"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-label={user ? `Account menu for ${user.name || 'your account'}` : 'Sign in or view account'}
      className={cn(
        'text-background hover:bg-background/10 hover:text-background',
        open && 'z-50 bg-white/10'
      )}
    >
      <span className="flex items-center gap-2">
        {user ? (
          <AvatarBadge
            image={user.image}
            initials={initials}
            className={cn('h-8 w-8 text-xs ring-2 ring-background/30 transition-shadow', open && 'ring-gold')}
          />
        ) : (
          <UserRound className="h-5 w-5 shrink-0 text-background" aria-hidden="true" />
        )}

        <span
          className={cn(
            'text-left text-xs leading-tight text-[#EDEBE1]',
            user && 'hidden sm:block'
          )}
        >
          <span className="block max-w-24 truncate">
            {user ? `Hello, ${firstName || 'there'}` : 'Hello, sign in'}
          </span>
          <strong className="block text-[13px] font-semibold text-background">Account</strong>
        </span>

        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-[#EDEBE1] transition-transform duration-200',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </span>
    </Button>
  )
}