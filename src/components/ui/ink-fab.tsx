'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

interface InkFabProps {
  onClick: () => void
  className?: string
  icon?: React.ReactNode
  label?: string
}

export function InkFab({ onClick, className, icon, label = 'New' }: InkFabProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'fixed bottom-[var(--space-6)] right-[var(--space-6)] z-50',
        'group flex items-center gap-[var(--space-2)]',
        'bg-[var(--ink-primary)]',
        'text-[var(--paper-primary)]',
        'px-[var(--space-4)] py-[var(--space-3)]',
        'shadow-lg',
        'font-ui text-[var(--text-caption)] uppercase tracking-[0.08em]',
        'hover:shadow-xl hover:translate-y-[-1px]',
        'active:translate-y-[1px] active:scale-[0.98]',
        'transition-transform duration-[var(--duration-fast)]',
        'focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[var(--ink-primary)]',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Ink stamp effect */}
      <div className="relative">
        <span className="relative flex items-center justify-center">
          {icon || <Plus className="w-5 h-5" />}
        </span>
      </div>
      <span>{label}</span>
    </motion.button>
  )
}
