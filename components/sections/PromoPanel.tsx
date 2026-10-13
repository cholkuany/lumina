"use client"

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function PromoPanel({ href, icon, eyebrow, title, text, cta, className }:
  {
    href: string,
    icon: React.ReactNode,
    eyebrow: string,
    title: string,
    text: string,
    cta: string,
    className: string
  }
) {
  return (
    <Link
      href={href}
      className={`group rounded-sm border p-6 transition hover:-translate-y-1 hover:shadow-hover ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-[#c8e637]">
          {icon}
        </span>
        <p className="text-xs font-bold uppercase text-foreground/55">
          {eyebrow}
        </p>
      </div>
      <h3 className="mt-4 text-2xl font-extrabold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-foreground/65">{text}</p>
      <p className="mt-5 inline-flex items-center gap-1 text-sm font-black text-foreground">
        {cta}
        <ChevronRight className="h-4 w-4" />
      </p>
    </Link>
  )
}