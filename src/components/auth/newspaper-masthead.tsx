'use client'

import { TypewriterText } from '@/components/ui/typewriter-text'
import { getCurrentDateHeader } from '@/lib/utils'

interface NewspaperMastheadProps {
  subtitle?: string
  showDate?: boolean
}

export function NewspaperMasthead({
  subtitle = 'THE DAILY SKILL TRACKER',
  showDate = true,
}: NewspaperMastheadProps) {
  return (
    <div className="text-center space-y-3">
      {/* Main Title */}
      <div className="relative">
        <h1 className="masthead text-6xl md:text-7xl lg:text-8xl text-ink-200 tracking-tight">
          <TypewriterText text="FOLIO" delay={200} speed={150} />
        </h1>
      </div>

      {/* Decorative Rule */}
      <div className="newspaper-rule-thick w-full" />

      {/* Subtitle Row */}
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-ink-50">
        <span className="hidden sm:inline">Est. 2024</span>
        <span className="font-semibold">{subtitle}</span>
        <span className="hidden sm:inline">Vol. I</span>
      </div>

      {/* Thin Rule */}
      <div className="newspaper-rule w-full" />

      {/* Date */}
      {showDate && (
        <p className="dateline">
          {getCurrentDateHeader()}
        </p>
      )}
    </div>
  )
}

export function MiniMasthead({ title }: { title: string }) {
  return (
    <div className="text-center space-y-2">
      <h1 className="masthead text-3xl text-ink-200">{title}</h1>
      <div className="newspaper-rule w-24 mx-auto" />
    </div>
  )
}
