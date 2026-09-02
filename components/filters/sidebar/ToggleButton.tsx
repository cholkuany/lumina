import Link from 'next/link'

export const ToggleButton = (
  {
    id,
    label,
    productCount,
    isCurrent = false,
  }:
    {
      id: string,
      label: string,
      productCount?: number
      isCurrent?: boolean
    }
) => {
  const content = (
    <span className="flex w-full items-center justify-between gap-3">
      <span>{label}</span>
      {!isCurrent && productCount !== undefined && (
        <span className="text-xs text-border-dark">({productCount})</span>
      )}
    </span>
  )

  if (isCurrent) {
    return (
      <div aria-current="page" className="py-1.5 font-semibold text-text-primary">
        {content}
      </div>
    )
  }

  return (
    <Link
      href={`/products?category=${encodeURIComponent(label)}&id=${id}`}
      className="block py-1.5 text-sm text-text-primary transition-colors hover:text-primary hover:underline"
    >
      {content}
    </Link>
  )
}
