import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductThumb({
  image,
  name,
  isCompact = false,
}: {
  image: string;
  name: string
  isCompact?: boolean;
}) {
  return (
    <Image
      aria-hidden
      src={image}
      alt={name}
      fill
      loading="lazy"
      sizes={isCompact
        ? '(max-width: 768px) 50vw, 180px'
        : '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'}
      className={cn(
        'transition-transform h-full w-full duration-500 group-hover:scale-105',
        isCompact ? 'object-contain' : 'object-cover'
      )}
    />
  );
}
