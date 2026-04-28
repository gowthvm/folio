'use client'

import { useState, useEffect } from 'react'
import { Quote } from 'lucide-react'

interface EditorsNoteProps {
  className?: string
}

export function EditorsNote({ className = '' }: EditorsNoteProps) {
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const notes = [
    {
      quote: "The secret to progress isn't intensity—it's consistency. Show up, even for 15 minutes.",
      author: "THE EDITOR"
    },
    {
      quote: "Every expert was once a beginner. Your first milestone is the hardest. The rest follow.",
      author: "THE EDITOR"
    },
    {
      quote: "Streaks build momentum. Break the chain only when necessary, never by accident.",
      author: "THE EDITOR"
    },
    {
      quote: "Log your sessions honestly. The data doesn't judge—it illuminates.",
      author: "THE EDITOR"
    },
    {
      quote: "Celebrate small wins. Each milestone is a chapter in your story.",
      author: "THE EDITOR"
    }
  ]

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % notes.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [notes.length])

  if (!mounted) return null

  const currentNote = notes[currentIndex]

  return (
    <div className={`bg-[var(--surface-card)] border border-[var(--border-default)] p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Quote className="w-4 h-4 text-[var(--ink-tertiary)]" />
        <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em]">
          EDITOR&apos;S NOTE
        </span>
      </div>
      <div className="newspaper-rule mb-4" />
      <blockquote className="font-display italic text-[var(--text-body)] text-[var(--ink-primary)] leading-relaxed mb-3">
        &ldquo;{currentNote.quote}&rdquo;
      </blockquote>
      <cite className="font-ui text-[0.65rem] text-[var(--ink-tertiary)] uppercase tracking-wider not-italic">
        — {currentNote.author}
      </cite>
      <div className="flex gap-1 mt-4">
        {notes.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex ? 'bg-[var(--ink-primary)] w-6' : 'bg-[var(--ink-tertiary)]'
            }`}
            aria-label={`Go to note ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
