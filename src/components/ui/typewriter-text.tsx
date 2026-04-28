'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface TypewriterTextProps {
  text: string
  className?: string
  delay?: number
  speed?: number
  showCursor?: boolean
  onComplete?: () => void
}

export function TypewriterText({
  text,
  className = '',
  delay = 0,
  speed = 50,
  showCursor = true,
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let currentIndex = 0

    const startTyping = () => {
      const typeNext = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1))
          currentIndex++
          timeout = setTimeout(typeNext, speed)
        } else {
          setIsComplete(true)
          onComplete?.()
        }
      }

      typeNext()
    }

    timeout = setTimeout(startTyping, delay)

    return () => clearTimeout(timeout)
  }, [text, delay, speed, onComplete])

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-current ml-0.5 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}
    </span>
  )
}

interface TypewriterHeadingProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  className?: string
  delay?: number
}

export function TypewriterHeading({
  children,
  as: Component = 'h1',
  className = '',
  delay = 0,
}: TypewriterHeadingProps) {
  return (
    <Component className={className}>
      <TypewriterText text={children} delay={delay} />
    </Component>
  )
}
