'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center p-8 border-2 border-[var(--accent-red)] bg-[var(--accent-red)]/10">
        {/* Retraction notice style */}
        <div className="border-b-2 border-[var(--accent-red)] pb-4 mb-4">
          <p className="font-body text-xs text-[var(--accent-red)] uppercase tracking-widest">
            Retraction Notice
          </p>
        </div>

        <h2 className="font-display text-2xl font-bold mb-2">
          Oops! Something went wrong
        </h2>
        
        <p className="font-body text-sm text-[var(--ink-3)] mb-6">
          We encountered an error loading this page. Please try again.
        </p>

        {error.message && (
          <p className="font-body text-xs text-[var(--accent-red)] mb-6 p-2 bg-[var(--accent-red)]/20">
            {error.message}
          </p>
        )}

        <Button
          onClick={reset}
          className="font-body"
        >
          Try Again
        </Button>
      </div>
    </div>
  )
}