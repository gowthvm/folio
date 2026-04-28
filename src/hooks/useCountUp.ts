'use client'

import { useState, useEffect, useRef } from 'react'

interface CountUpOptions {
  duration?: number
  ease?: (t: number) => number
}

// Ease function: cubic-bezier(0.25, 0.1, 0.25, 1)
const easeInk = (t: number): number => {
  return t * t * (3 - 2 * t)
}

export function useCountUp(target: number, options: CountUpOptions = {}) {
  const {
    duration = 450, // --dur-slow
    ease = easeInk,
  } = options

  const [count, setCount] = useState(0)
  const previousTargetRef = useRef(0)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>()

  useEffect(() => {
    const startValue = previousTargetRef.current
    const endValue = target
    const durationMs = startValue === 0 ? duration : 250 // --dur-base for updates

    if (startValue === endValue) {
      return
    }

    startTimeRef.current = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - (startTimeRef.current || 0)
      const progress = Math.min(elapsed / durationMs, 1)
      const easedProgress = ease(progress)

      const currentCount = startValue + (endValue - startValue) * easedProgress
      setCount(Math.round(currentCount))

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Snap to exact target value on completion
        setCount(endValue)
        previousTargetRef.current = endValue
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [target, duration, ease])

  return count
}
