import Image from 'next/image'
import { cn } from '@/lib/utils'

export const AvatarBadge = ({
  image,
  initials,
  className,
}: {
  image?: string | null
  initials: string
  className?: string
}) => (
  <span
    className={cn(
      'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold font-extrabold tracking-tight text-ink',
      className
    )}
  >
    {image ? (
      <Image src={image} alt="" width={48} height={48} className="h-full w-full object-cover" />
    ) : (
      <span aria-hidden="true">{initials}</span>
    )}
  </span>
)