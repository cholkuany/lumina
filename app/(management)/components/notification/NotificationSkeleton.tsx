export const NotificationSkeleton = () => (
  <div className="flex flex-col gap-3 p-4" aria-hidden="true">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex gap-3 animate-pulse">
        <div className="w-8 h-8 bg-surface rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-surface rounded w-3/4" />
          <div className="h-2 bg-surface rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
)