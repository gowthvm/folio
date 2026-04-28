'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'heading' | 'line'
  lines?: number
}

export function Skeleton({
  className,
  variant = 'text',
  lines = 1,
}: SkeletonProps) {
  const baseClasses = 'bg-ink-100/10 rounded-sm animate-pulse'

  const variantClasses = {
    text: 'h-4 w-full',
    heading: 'h-8 w-3/4',
    line: 'h-3 w-full',
  }

  if (lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(baseClasses, variantClasses.line)}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
    />
  )
}

export function NewspaperSkeleton() {
  return (
    <div className="space-y-6">
      {/* Masthead skeleton */}
      <div className="text-center space-y-2 pb-4 border-b border-ink-200/20">
        <Skeleton variant="heading" className="h-12 w-48 mx-auto" />
        <Skeleton variant="line" className="h-3 w-32 mx-auto" />
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          <Skeleton variant="heading" />
          <Skeleton lines={6} />
        </div>
        <div className="space-y-3 border-l border-ink-200/20 pl-6">
          <Skeleton variant="heading" className="h-6" />
          <Skeleton lines={4} />
        </div>
      </div>
    </div>
  )
}

export function RedactedText({
  className,
  width = '100%',
}: {
  className?: string
  width?: string
}) {
  return (
    <div
      className={cn(
        'h-4 rounded bg-gradient-to-r from-ink-100/10 via-ink-100/20 to-ink-100/10',
        'bg-[length:200%_100%] animate-shimmer',
        className
      )}
      style={{ width }}
    />
  )
}
