'use client'

interface EmptyStateProps {
  onCreateClick: () => void
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="text-center max-w-2xl mx-auto px-6">
        {/* Decorative top element */}
        <div className="w-16 h-1 bg-[var(--ink-1)] mx-auto mb-8" />
        
        {/* Volume label */}
        <p className="font-ui text-[0.75rem] text-[var(--ink-4)] uppercase tracking-[0.2em] mb-6">
          VOL. I · NO. 0
        </p>
        
        {/* Main headline - much larger */}
        <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-normal text-[var(--ink-1)] leading-[1.1] mb-6">
          No stories filed yet.
        </h2>
        
        {/* Subtext - larger and more prominent */}
        <p className="font-body text-[1.1rem] text-[var(--ink-3)] leading-relaxed max-w-lg mx-auto mb-10">
          Every expert has a Vol. I. Yours starts here. Track your skills, log sessions, and build your portfolio of progress.
        </p>
        
        {/* Decorative middle element */}
        <div className="w-24 h-px bg-[var(--rule)] mx-auto mb-10" />
        
        {/* CTA button - more prominent */}
        <button
          onClick={onCreateClick}
          className="font-ui text-[0.85rem] text-[var(--ink-1)] uppercase tracking-[0.12em] px-8 py-4 border-2 border-[var(--ink-1)] hover:bg-[var(--ink-1)] hover:text-[var(--bg)] transition-all duration-200"
        >
          FILE YOUR FIRST STORY →
        </button>
        
        {/* Decorative bottom element */}
        <div className="w-16 h-1 bg-[var(--ink-1)] mx-auto mt-12" />
      </div>
    </div>
  )
}
