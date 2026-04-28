'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center p-8 border-2 border-[var(--accent-red)] bg-[var(--accent-red)]/10">
        <div className="border-b-2 border-[var(--accent-red)] pb-4 mb-4">
          <p className="font-body text-xs text-[var(--accent-red)] uppercase tracking-widest">
            Correction
          </p>
        </div>

        <h2 className="font-display text-2xl font-bold mb-2">
          System Error
        </h2>
        
        <p className="font-body text-sm text-[var(--ink-3)] mb-6">
          An unexpected error occurred. Please refresh the page.
        </p>

        <Button
          onClick={reset}
          className="font-body"
        >
          Refresh Page
        </Button>
      </div>
    </div>
  )
}