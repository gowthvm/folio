'use client'

import { motion } from 'framer-motion'

export function SkillCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="skill-card p-6 bg-[var(--surface)] border border-[var(--rule)]"
    >
      {/* Category */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-[var(--ink-4)]/30 w-20 rounded animate-pulse" />
      </div>
      
      {/* Divider */}
      <div className="h-[1px] bg-[var(--rule)] mb-4" />
      
      {/* Title */}
      <div className="h-6 bg-[var(--ink-4)]/30 w-3/4 rounded animate-pulse mb-4" />
      
      {/* Meta info */}
      <div className="h-3 bg-[var(--ink-4)]/30 w-1/2 rounded animate-pulse mb-4" />
      
      {/* Divider */}
      <div className="h-[1px] bg-[var(--rule)] mb-4" />
      
      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 bg-[var(--ink-4)]/30 w-8 rounded-full animate-pulse" />
        <div className="h-3 bg-[var(--ink-4)]/30 w-16 rounded animate-pulse" />
      </div>
      
      {/* Divider */}
      <div className="h-[1px] bg-[var(--rule)] mb-4" />
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="h-3 bg-[var(--ink-4)]/30 w-24 rounded animate-pulse" />
        <div className="h-8 bg-[var(--ink-4)]/30 w-12 rounded animate-pulse" />
      </div>
    </motion.div>
  )
}

export function SkillsGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="newspaper-columns">
      {Array.from({ length: count }).map((_, i) => (
        <SkillCardSkeleton key={i} />
      ))}
    </div>
  )
}
