'use client'

import { useEffect, useState, useCallback } from 'react'

interface UseTypewriterOptions {
  text: string
  speed?: number
  delay?: number
  enabled?: boolean
}

interface UseTypewriterReturn {
  displayedText: string
  isComplete: boolean
}

export function useTypewriter({
  text,
  speed = 40,
  delay = 0,
  enabled = true,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const typeText = useCallback(() => {
    if (!enabled || !text) {
      setDisplayedText(text)
      setIsComplete(true)
      return
    }

    let currentIndex = 0
    setDisplayedText('')
    setIsComplete(false)

    const startTyping = () => {
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(interval)
          setIsComplete(true)
        }
      }, speed)

      return () => clearInterval(interval)
    }

    if (delay > 0) {
      const timeout = setTimeout(startTyping, delay)
      return () => clearTimeout(timeout)
    } else {
      return startTyping()
    }
  }, [text, speed, delay, enabled])

  useEffect(() => {
    const cleanup = typeText()
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup()
      }
    }
  }, [typeText])

  return { displayedText, isComplete }
}
