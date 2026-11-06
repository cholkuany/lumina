import Image from "next/image";
import { cn } from "@/lib/utils";

type ProductThumbProps = {
  image?: string | null
  name: string
  isCompact?: boolean
  className?: string
  sizes?: string
}

export function ProductThumb({
  image,
  name,
  isCompact = false,
  className = '',
  sizes,
}: ProductThumbProps) {
  if (!image) return null

  return (
    <Image
      aria-hidden
      src={image}
      alt={name}
      fill
      loading="lazy"
      sizes={
        sizes ??
        (isCompact
          ? '(max-width: 768px) 50vw, 180px'
          : '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw')
      }
      className={cn(
        'transition-transform h-full w-full duration-500 group-hover:scale-105',
        isCompact ? 'object-contain' : 'object-cover',
        className
      )}
    />
  )
}

export function ProductThumbFrame({
  className = '',
  ...thumb
}: ProductThumbProps) {
  return (
    <div className={cn('relative bg-surface rounded-lg overflow-hidden shrink-0', className)}>
      <ProductThumb sizes="96px" {...thumb} />
    </div>
  )
}
