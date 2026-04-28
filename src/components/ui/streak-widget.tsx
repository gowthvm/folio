'use client'

import { Flame } from 'lucide-react'
import { useState, useEffect } from 'react'

interface StreakWidgetProps {
  streak?: number
  className?: string
}

export function StreakWidget({ streak = 0, className = '' }: StreakWidgetProps) {
  const [mounted, setMounted] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (streak > 0) {
      setAnimate(true)
    }
  }, [streak])

  if (!mounted) return null

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${animate && streak > 0 ? 'animate-pulse' : ''}`}>
        <Flame className={`w-6 h-6 ${streak > 0 ? 'text-orange-500' : 'text-[var(--ink-tertiary)]'}`} />
        {streak >= 7 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
        )}
      </div>
      <div>
        <div className="font-display text-2xl text-[var(--ink-primary)]">
          {streak}
        </div>
        <div className="font-ui text-[0.6rem] text-[var(--ink-tertiary)] uppercase tracking-wider">
          {streak === 1 ? 'DAY STREAK' : 'DAY STREAKS'}
        </div>
      </div>
      {streak >= 3 && (
        <div className="ml-2 font-ui text-[0.65rem] text-[var(--accent-green)] uppercase tracking-wider bg-[var(--accent-green)]/10 px-2 py-1 border border-[var(--accent-green)]">
          ON FIRE!
        </div>
      )}
    </div>
  )
}
