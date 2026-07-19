import Image from 'next/image'

interface PreviewCardProps {
  images: string[]
  name: string
  price: number
  isNewArrival: boolean
  isSale: boolean
  discountPercentage: number
}

export function PreviewCard({
  images,
  name,
  price,
  isNewArrival,
  isSale,
  discountPercentage,
}: PreviewCardProps) {
  if (images.length === 0) return null

  return (
    <div className="bg-white rounded-brand border border-border p-6 space-y-4">
      <h2 className="text-lg font-medium text-text-primary">Preview</h2>

      <div className="grid grid-cols-2 gap-1">
        {images.map((img, idx) => (
          <div
            key={`${img}-${idx}`}
            className="relative aspect-square rounded-lg overflow-hidden bg-surface"
          >
            <Image
              src={img}
              alt={`Product preview ${idx + 1}`}
              className="w-full h-full object-cover"
              fill
            />

            {isNewArrival && (
              <span className="absolute top-2 left-2 px-2 py-1 bg-text-primary text-white text-xs font-medium rounded">
                New
              </span>
            )}

            {isSale && discountPercentage > 0 && (
              <span className="absolute top-2 right-2 px-2 py-1 bg-primary text-white text-xs font-medium rounded">
                -{discountPercentage}%
              </span>
            )}
          </div>
        ))}
      </div>

      <div>
        <p className="font-medium text-text-primary truncate">
          {name || 'Product Name'}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-primary font-semibold">
            ${price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}