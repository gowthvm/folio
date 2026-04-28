'use client'

import { motion } from 'framer-motion'

export function NewspaperSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-ink-100/20 dark:bg-wiki-border/50 w-32 rounded" />
        <div className="h-4 bg-ink-100/20 dark:bg-wiki-border/50 w-20 rounded" />
      </div>

      {/* Card skeleton */}
      <div className="p-4 bg-paper-50 dark:bg-wiki-darker border border-ink-200/10 dark:border-wiki-border">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-ink-100/20 dark:bg-wiki-border/50 w-16 rounded" />
          <div className="h-3 bg-ink-100/20 dark:bg-wiki-border/50 w-8 rounded" />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-ink-100/20 dark:bg-wiki-border/50 rounded" />
          <div className="flex-1">
            <div className="h-5 bg-ink-100/20 dark:bg-wiki-border/50 w-3/4 rounded mb-1" />
            <div className="h-3 bg-ink-100/20 dark:bg-wiki-border/50 w-1/2 rounded" />
          </div>
        </div>
        <div className="pt-3 border-t border-ink-200/10 dark:border-wiki-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ink-100/20 dark:bg-wiki-border/50 rounded-full" />
            <div className="h-3 bg-ink-100/20 dark:bg-wiki-border/50 w-12 rounded" />
          </div>
          <div className="h-3 bg-ink-100/20 dark:bg-wiki-border/50 w-16 rounded" />
        </div>
      </div>
    </div>
  )
}

export function ColumnSkeleton() {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="break-inside-avoid mb-4"
        >
          <div className="p-4 bg-paper-50 dark:bg-wiki-darker border border-ink-200/10 dark:border-wiki-border">
            <div className="h-3 bg-ink-100/20 dark:bg-wiki-border/50 w-16 rounded mb-3" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-ink-100/20 dark:bg-wiki-border/50 rounded" />
              <div className="flex-1">
                <div className="h-4 bg-ink-100/20 dark:bg-wiki-border/50 w-3/4 rounded mb-1" />
                <div className="h-3 bg-ink-100/20 dark:bg-wiki-border/50 w-1/2 rounded" />
              </div>
            </div>
            <div className="pt-3 border-t border-ink-200/10 dark:border-wiki-border">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-ink-100/20 dark:bg-wiki-border/50 rounded-full" />
                <div className="h-3 bg-ink-100/20 dark:bg-wiki-border/50 w-12 rounded" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}