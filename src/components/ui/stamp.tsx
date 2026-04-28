'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StampProps {
  label: string
  id?: string
  variant: 'done' | 'in-progress' | 'locked' | 'overdue' | 'complete' | 'level'
  className?: string
  animate?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles: Record<StampProps['variant'], string> = {
  done: 'text-[var(--accent-green)] border-[var(--accent-green)]',
  'in-progress': 'text-[var(--accent-sepia)] border-[var(--accent-sepia)]',
  locked: 'text-[var(--ink-tertiary)] border-[var(--ink-tertiary)]',
  overdue: 'text-[var(--accent-red)] border-[var(--accent-red)]',
  complete: 'text-[var(--ink-primary)] border-[var(--ink-primary)]',
  level: 'text-[var(--ink-secondary)] border-[var(--ink-secondary)]',
}

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-2 py-1 text-[8px]',
  md: 'px-3 py-1.5 text-[10px]',
  lg: 'px-4 py-2 text-xs',
}

function getRotationFromId(id: string): number {
  // angle = ((charCodeSum of id) % 7) - 3 degrees
  let charCodeSum = 0
  for (let i = 0; i < id.length; i++) {
    charCodeSum += id.charCodeAt(i)
  }
  return (charCodeSum % 7) - 3
}

export function Stamp({ label, id, variant, className, animate = false, size = 'md' }: StampProps) {
  const rotation = id ? getRotationFromId(id) : getRotationFromId(label)
  
  const stampContent = (
    <span
      className={cn(
        'inline-flex items-center justify-center font-ui uppercase tracking-[0.08em]',
        'border-[3px] border-current',
        'opacity-[var(--stamp-border-opacity)]',
        'font-normal',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      style={{ 
        transform: `rotate(${rotation}deg)`,
        ['--stamp-border-opacity' as string]: '0.85',
      } as React.CSSProperties}
    >
      {label}
    </span>
  )

  if (animate) {
    return (
      <motion.span
        initial={{ scale: 1.5, rotate: rotation, opacity: 0 }}
        animate={{ scale: 1, rotate: rotation, opacity: 1 }}
        transition={{
          duration: 0.25, // --dur-base
          ease: [0.34, 1.4, 0.64, 1], // --ease-stamp
          times: [0, 0.4, 0.65, 1],
          keyframes: [
            { scale: 1.5, rotate: rotation, opacity: 0 },
            { scale: 0.95, rotate: rotation, opacity: 1 },
            { scale: 1.05, rotate: rotation, opacity: 1 },
            { scale: 1, rotate: rotation, opacity: 1 },
          ],
        }}
        style={{ display: 'inline-block', position: 'relative' }}
        className="stamp-ink-spread"
      >
        {stampContent}
      </motion.span>
    )
  }

  return stampContent
}

interface LevelStampProps {
  level: number
  className?: string
}

export function LevelStamp({ level, className }: LevelStampProps) {
  return (
    <Stamp
      label={`LEVEL ${level}`}
      variant="level"
      className={className}
    />
  )
}

interface StatusStampProps {
  status: 'not_started' | 'in_progress' | 'completed' | 'locked'
  className?: string
  animate?: boolean
}

const statusToVariant: Record<StatusStampProps['status'], StampProps['variant']> = {
  not_started: 'locked',
  in_progress: 'in-progress',
  completed: 'done',
  locked: 'locked',
}

const statusLabels: Record<StatusStampProps['status'], string> = {
  not_started: 'NOT STARTED',
  in_progress: 'IN PROGRESS',
  completed: 'DONE',
  locked: 'LOCKED',
}

export function StatusStamp({ status, className, animate = false }: StatusStampProps) {
  return (
    <Stamp
      label={statusLabels[status]}
      variant={statusToVariant[status]}
      size="md"
      className={className}
      animate={animate}
    />
  )
}