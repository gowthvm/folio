'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, TrendingUp, Target, Zap } from 'lucide-react'

interface ClassifiedsPanelProps {
  className?: string
}

export function ClassifiedsPanel({ className = '' }: ClassifiedsPanelProps) {
  const [mounted, setMounted] = useState(false)

  const classifieds = [
    {
      icon: Lightbulb,
      category: 'PRACTICE TIP',
      title: 'Slow Down to Speed Up',
      description: 'Practice at 50% tempo. Your brain learns patterns better when they\'re digestible.',
      price: 'FREE'
    },
    {
      icon: TrendingUp,
      category: 'STRATEGY',
      title: 'The 2-Day Rule',
      description: 'Never skip two days in a row. One miss is recovery; two is a new habit.',
      price: 'FREE'
    },
    {
      icon: Target,
      category: 'GOAL SETTING',
      title: 'SMART Milestones',
      description: 'Specific, Measurable, Achievable, Relevant, Time-bound. Make every step count.',
      price: 'FREE'
    },
    {
      icon: Zap,
      category: 'PRODUCTIVITY',
      title: 'Session Priming',
      description: 'Spend 2 minutes reviewing your last session before starting. Memory consolidation.',
      price: 'FREE'
    }
  ]

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className={`bg-[var(--surface-card)] border border-[var(--border-default)] p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em]">
          CLASSIFIEDS
        </span>
        <span className="font-ui text-[0.5rem] text-[var(--ink-tertiary)] uppercase tracking-wider">
          TIPS & STRATEGIES
        </span>
      </div>
      <div className="newspaper-rule mb-3" />
      <div className="space-y-3">
        {classifieds.map((item, i) => (
          <div
            key={i}
            className="p-3 bg-[var(--paper-secondary)] border border-[var(--border-default)] hover:border-[var(--ink-secondary)] transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-[var(--ink-secondary)]" />
                <span className="font-ui text-[0.6rem] text-[var(--ink-tertiary)] uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
              <span className="font-ui text-[0.55rem] text-[var(--accent-green)] uppercase tracking-wider bg-[var(--accent-green)]/10 px-2 py-0.5 border border-[var(--accent-green)]">
                {item.price}
              </span>
            </div>
            <h4 className="font-display text-[var(--text-caption)] text-[var(--ink-primary)] mb-1">
              {item.title}
            </h4>
            <p className="font-body text-[0.75rem] text-[var(--ink-secondary)] leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
