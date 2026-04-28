'use client'

import { useState, useEffect, useRef } from 'react'

interface TypewriterOptions {
  speed?: number
  startDelay?: number
  cursor?: boolean
  onComplete?: () => void
}

export function useTypewriter(text: string, options: TypewriterOptions = {}) {
  const {
    speed = 38, // --dur-type
    startDelay = 200,
    cursor = true,
    onComplete,
  } = options

  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const previousTextRef = useRef('')
  const isErasingRef = useRef(false)

  useEffect(() => {
    // Clean up previous timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // If text hasn't changed, don't restart
    if (text === previousTextRef.current && displayedText === text) {
      return
    }

    // If text changed mid-type, erase first then retype
    if (previousTextRef.current && displayedText && text !== previousTextRef.current) {
      isErasingRef.current = true
      let eraseIndex = displayedText.length

      const eraseNext = () => {
        if (eraseIndex > 0) {
          setDisplayedText(text.substring(0, eraseIndex - 1))
          eraseIndex--
          timeoutRef.current = setTimeout(eraseNext, speed / 2) // 2× speed for erase
        } else {
          isErasingRef.current = false
          previousTextRef.current = text
          startTyping()
        }
      }

      eraseNext()
      return
    }

    previousTextRef.current = text
    startTyping()

    function startTyping() {
      // Start delay before typing begins
      timeoutRef.current = setTimeout(() => {
        setShowCursor(true)
        setIsTyping(true)
        let index = 0

        const typeNext = () => {
          if (index < text.length) {
            setDisplayedText(text.substring(0, index + 1))
            index++
            timeoutRef.current = setTimeout(typeNext, speed)
          } else {
            setIsTyping(false)
            // Keep cursor blinking for 800ms after typing completes
            timeoutRef.current = setTimeout(() => {
              setShowCursor(false)
              onComplete?.()
            }, 800)
          }
        }

        typeNext()
      }, startDelay)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, speed, startDelay, onComplete, displayedText])

  return {
    displayedText,
    showCursor,
    isTyping,
    cursorChar: cursor ? '|' : '',
  }
}
