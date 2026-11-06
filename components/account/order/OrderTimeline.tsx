import type { TOrderProps } from '@/lib/types'
import { fallbackTimelineStatus, timelineStatusConfig } from './orderConfig'

export function OrderTimeline({ timeline }: { timeline: TOrderProps['timeline'] }) {
  if (!timeline || timeline.length === 0) return null

  return (
    <div className="bg-white border border-border-light rounded-brand p-6">
      <h2 className="font-serif text-lg text-foreground mb-6">Order Timeline</h2>
      <ol className="relative">
        {timeline.map((event, index) => {
          const config = timelineStatusConfig[event.status] ?? fallbackTimelineStatus
          const Icon = config.icon
          const isLast = index === timeline.length - 1

          return (
            <li key={`${event.status}-${index}`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${event.completed ? 'bg-primary text-white' : 'bg-border-light text-border-dark'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {!isLast && (
                  <div className={`w-0.5 h-12 ${event.completed ? 'bg-primary' : 'bg-border-light'}`} />
                )}
              </div>

              <div className="pb-8">
                <p className={`font-medium ${event.completed ? 'text-foreground' : 'text-border-dark'}`}>
                  {config.label}
                </p>
                <p className="text-sm text-border-dark">{event.date}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}