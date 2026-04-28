'use client'

import { useState, useEffect, useRef } from 'react'

interface UseNumberTransitionOptions {
  target: number
  duration?: number
  enabled?: boolean
}

interface UseNumberTransitionReturn {
  displayValue: number
  isAnimating: boolean
}

export function useNumberTransition({
  target,
  duration = 480,
  enabled = true,
}: UseNumberTransitionOptions): UseNumberTransitionReturn {
  const [displayValue, setDisplayValue] = useState(target)
  const [isAnimating, setIsAnimating] = useState(false)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (!enabled || target === displayValue) {
      setDisplayValue(target)
      return
    }

    setIsAnimating(true)
    const startValue = displayValue
    const startTime = performance.now()
    const diff = target - startValue

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startValue + diff * eased)
      
      setDisplayValue(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, enabled])

  return { displayValue, isAnimating }
}

// Component wrapper for displaying animated numbers
export function AnimatedNumber({ 
  value, 
  className,
  duration = 480,
}: { 
  value: number
  className?: string
  duration?: number
}) {
  const { displayValue } = useNumberTransition({ target: value, duration })
  
  return (
    <span className={className}>
      {displayValue}
    </span>
  )
}