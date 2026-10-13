import { AvatarBadge } from './AvatarBadge'

type UserInfoHeaderProps = {
  firstName: string
  lastName: string
  email: string
  image?: string | null
}

export const UserInfoHeader = ({ firstName, lastName, email, image }: UserInfoHeaderProps) => (
  <div className="border-b border-border-light bg-surface p-4">
    <div className="flex items-center gap-3">
      <AvatarBadge
        image={image}
        initials={`${firstName.charAt(0)}${lastName.charAt(0)}`}
        className="h-12 w-12 text-base ring-2 ring-gold/40"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          Hello, {firstName} {lastName}
        </p>
        <p className="truncate text-sm text-foreground/60">{email}</p>
      </div>
    </div>
  </div>
)