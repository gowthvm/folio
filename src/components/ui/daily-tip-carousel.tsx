'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react'

interface DailyTipCarouselProps {
  className?: string
}

export function DailyTipCarousel({ className = '' }: DailyTipCarouselProps) {
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const tips = [
    "Practice at 50% tempo. Your brain learns patterns better when they're digestible.",
    "Never skip two days in a row. One miss is recovery; two is a new habit.",
    "Spend 2 minutes reviewing your last session before starting. Memory consolidation.",
    "Log sessions honestly. The data doesn't judge—it illuminates.",
    "Celebrate small wins. Each milestone is a chapter in your story.",
    "Set SMART milestones: Specific, Measurable, Achievable, Relevant, Time-bound.",
    "The Pomodoro Technique: 25 minutes focus, 5 minutes break. Repeat.",
    "Track how sessions feel, not just what you did. Mood data reveals patterns."
  ]

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const nextTip = () => setCurrentIndex(prev => (prev + 1) % tips.length)
  const prevTip = () => setCurrentIndex(prev => (prev - 1 + tips.length) % tips.length)

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Lightbulb className="w-4 h-4 text-[var(--accent-yellow)]" />
      <div className="flex-1 overflow-hidden">
        <p className="font-body text-[var(--text-caption)] text-[var(--ink-secondary)] truncate">
          {tips[currentIndex]}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={prevTip}
          className="w-6 h-6 flex items-center justify-center hover:bg-[var(--paper-tertiary)] transition-colors"
          aria-label="Previous tip"
        >
          <ChevronLeft className="w-4 h-4 text-[var(--ink-tertiary)]" />
        </button>
        <button
          onClick={nextTip}
          className="w-6 h-6 flex items-center justify-center hover:bg-[var(--paper-tertiary)] transition-colors"
          aria-label="Next tip"
        >
          <ChevronRight className="w-4 h-4 text-[var(--ink-tertiary)]" />
        </button>
      </div>
    </div>
  )
}
