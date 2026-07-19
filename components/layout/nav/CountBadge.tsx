export const CountBadge = ({ count }: { count: number }) => {
  return (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
      {count}
    </span>
  )
}