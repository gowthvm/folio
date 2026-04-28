'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  showPercentage?: boolean
  animateOnMount?: boolean
  showLevel?: boolean
}

export function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 2,
  className,
  showPercentage = false,
  animateOnMount = true,
  showLevel = false,
}: ProgressRingProps) {
  // Clamp progress to 0-100 range
  const clampedProgress = Math.min(100, Math.max(0, progress))
  const displayProgress = Math.round(clampedProgress)
  
  const [animatedProgress, setAnimatedProgress] = useState(animateOnMount ? 0 : clampedProgress)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const prevProgressRef = useRef(clampedProgress)
  const [isComplete, setIsComplete] = useState(clampedProgress >= 100)

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedProgress / 100) * circumference

  // Detect milestone completion
  useEffect(() => {
    if (prevProgressRef.current < 100 && clampedProgress >= 100) {
      setIsCompleting(true)
      setIsComplete(true)
      setTimeout(() => setIsCompleting(false), 600)
    }
    prevProgressRef.current = clampedProgress
  }, [clampedProgress])

  useEffect(() => {
    if (!animateOnMount) {
      setAnimatedProgress(clampedProgress)
      return
    }

    const timer = setTimeout(() => {
      setAnimatedProgress(clampedProgress)
      setHasAnimated(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [clampedProgress, animateOnMount])

  const level = Math.floor(clampedProgress / 25) + 1

  const overshootProgress = isCompleting 
    ? Math.min(animatedProgress + 5, 105) 
    : animatedProgress
  const overshootOffset = circumference - (overshootProgress / 100) * circumference

  return (
    <div 
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: `${size}px`, height: `${size}px` }}
      role="progressbar"
      aria-valuenow={displayProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${displayProgress}% complete`}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--paper-ruled)"
          strokeWidth={strokeWidth}
          strokeLinecap="square"
        />
        
        {/* Tick mark at 0% (top) */}
        <line
          x1={size / 2}
          y1={strokeWidth + 2}
          x2={size / 2}
          y2={strokeWidth + 4}
          stroke="var(--ink-faint)"
          strokeWidth={1}
          strokeLinecap="square"
        />
        
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isComplete ? 'var(--ring-complete)' : 'var(--ring-progress)'}
          strokeWidth={strokeWidth}
          strokeLinecap="square"
          className="transition-colors duration-[var(--duration-base)]"
          initial={false}
          animate={{
            strokeDasharray: circumference,
            strokeDashoffset: isCompleting ? overshootOffset : offset,
          }}
          transition={hasAnimated ? { duration: 0.48, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage ? (
          <>
            <span className="font-ui text-[var(--text-caption)] tabular-nums">
              {displayProgress}%
            </span>
            {showLevel && size >= 60 && (
              <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)]">
                L{level}
              </span>
            )}
          </>
        ) : (
          showLevel && size >= 60 && (
            <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)]">
              L{level}
            </span>
          )
        )}
        {/* COMPLETE stamp overlay at 100% */}
        {isComplete && (
          <motion.span 
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.24, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="font-ui text-[8px] uppercase text-[var(--accent-green)] border-2 border-[var(--accent-green)] px-1 py-0.5 rotate-[-2deg] opacity-90">
              DONE
            </span>
          </motion.span>
        )}
      </div>
    </div>
  )
}