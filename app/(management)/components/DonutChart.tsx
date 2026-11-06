'use client'

import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

export type Slice = { name: string; value: number; color: string }

export function DonutChart({
  data,
  valuePrefix = '',
  centerLabel,
}: {
  data: Slice[]
  valuePrefix?: string
  centerLabel?: string
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (total === 0) {
    return <p className="py-10 text-center text-sm text-border-dark">No data yet.</p>
  }

  const chartData = data.map((d) => ({ ...d, fill: d.color }))

  return (
    <div>
      <div className="relative h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="90%"
              paddingAngle={2}
              stroke="none"
            />
            <Tooltip
              formatter={(value) =>
                `${valuePrefix}${(typeof value === 'number' ? value : Number(value ?? 0)).toLocaleString()}`
              }
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        {centerLabel && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold text-foreground">
              {valuePrefix}{total.toLocaleString()}
            </span>
            <span className="text-xs text-border-dark">{centerLabel}</span>
          </div>
        )}
      </div>

      <ul className="mt-4 space-y-2">
        {data.map((d) => (
          <li key={d.name} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-foreground">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
              <span className="capitalize flex-wrap">{d.name}</span>
            </span>
            <span className="font-medium text-foreground">
              {valuePrefix}{d.value.toLocaleString()}
              <span className="ml-1 text-border-dark">
                ({Math.round((d.value / total) * 100)}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}