'use client'

import Link from 'next/link'
import { Plus, BookOpen, BarChart3, Archive, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickActionsBarProps {
  className?: string
}

export function QuickActionsBar({ className = '' }: QuickActionsBarProps) {
  const actions = [
    {
      icon: Plus,
      label: 'New Skill',
      href: '/dashboard/skills/new' as const,
      description: 'Start tracking'
    },
    {
      icon: BookOpen,
      label: 'Log Session',
      href: '/dashboard' as const,
      description: 'Record progress'
    },
    {
      icon: Flame,
      label: 'Streaks',
      href: '/dashboard' as const,
      description: 'View activity'
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      href: '/dashboard/stats' as const,
      description: 'See insights'
    },
    {
      icon: Archive,
      label: 'Archive',
      href: '/dashboard/archive' as const,
      description: 'Completed skills'
    },
  ]

  return (
    <div className={cn(
      'bg-[var(--surface-card)] border border-[var(--border-default)] p-4',
      className
    )}>
      <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-3">
        QUICK ACTIONS
      </div>
      <div className="newspaper-rule mb-3" />
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--paper-secondary)] border border-[var(--border-default)] hover:border-[var(--ink-primary)] hover:bg-[var(--ink-primary)] hover:text-[var(--paper-primary)] dark:hover:bg-[var(--paper-primary)] dark:hover:text-[var(--ink-primary)] transition-all text-[var(--ink-secondary)] group"
          >
            <action.icon className="w-4 h-4" />
            <span className="font-ui text-[var(--text-caption)] uppercase tracking-wider">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
