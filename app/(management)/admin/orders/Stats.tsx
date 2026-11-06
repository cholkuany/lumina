'use client'

import { X, Check, Truck, Clock } from 'lucide-react'

import type { AdminOrderStats } from '@/lib/types'

export const Stats = ({
  stats,
}: {
  stats: AdminOrderStats
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white rounded-brand border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">{stats.processing}</p>
            <p className="text-xs text-border-dark">Processing</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-brand border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">{stats.shipped}</p>
            <p className="text-xs text-border-dark">Shipped</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-brand border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-success-light rounded-lg flex items-center justify-center">
            <Check className="w-5 h-5 text-success-dark" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">{stats.delivered}</p>
            <p className="text-xs text-border-dark">Delivered</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-brand border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <X className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">{stats.cancelled}</p>
            <p className="text-xs text-border-dark">Cancelled</p>
          </div>
        </div>
      </div>
    </div>
  )
}