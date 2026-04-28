'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)} aria-label="Breadcrumb">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)] transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-[var(--ink-tertiary)]" />
          {item.href ? (
            <Link
              href={item.href as any}
              className={cn(
                'transition-colors',
                i === items.length - 1
                  ? 'text-[var(--ink-primary)] font-medium'
                  : 'text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)]'
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--ink-primary)] font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
