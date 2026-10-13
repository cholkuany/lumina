import { Badge } from '@/components/ui/Badge'

interface ProductBadgesProps {
  isSale?: boolean
  isNewArrival?: boolean
  isCompact?: boolean
}

export function ProductBadges({
  isSale = false,
  isNewArrival = false,
  isCompact = false,
}: ProductBadgesProps) {
  if (!isSale && !isNewArrival) return null

  return (
    <div className="absolute left-2 top-2 flex flex-col gap-1">
      <Badge variant="error" isCompact={isCompact} status={isSale}>
        SALE
      </Badge>
      <Badge variant="success" isCompact={isCompact} status={!isSale && isNewArrival}>
        NEW
      </Badge>
    </div>
  )
}