export const CountBadge = ({ count }: { count: number }) => {
  return (
    <span
      aria-hidden="true"
      className="absolute -right-1.5 -top-1 flex h-4.25 min-w-4.25 items-center justify-center rounded-full bg-gold px-1 text-[10.5px] font-extrabold text-ink"
    >
      {count}
    </span>
  )
}