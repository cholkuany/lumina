import Image from 'next/image'

export const ProductImage = ({ imageUrl, alt }: { imageUrl: string, alt: string }) => {
  return (
    <div className="w-12 h-12 rounded-lg bg-linen shrink-0 overflow-hidden">
      <Image
        src={imageUrl}
        className="w-full h-full bg-warm-gray-light"
        alt={alt}
        width={48}
        height={48}
      />
    </div>
  )
}