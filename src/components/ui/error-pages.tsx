'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function SupabaseError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[var(--bg)] dark:bg-[var(--surface)] border-2 border-[var(--rule)] dark:border-[var(--rule)] shadow-xl overflow-hidden"
      >
        {/* Press error header */}
        <div className="bg-[var(--surface)] dark:bg-[var(--surface)] border-b border-[var(--rule)] dark:border-[var(--rule)] p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--accent-red)]/20 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-[var(--accent-red)]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--ink-1)] dark:text-[var(--ink-1)]">
            PRINTING DELAYED
          </h1>
          <p className="font-body text-xs text-[var(--ink-3)] mt-2 uppercase tracking-widest">
            Press Error Notice
          </p>
        </div>

        <div className="p-6 text-center">
          <p className="font-body text-sm text-[var(--ink-3)] mb-6">
            We&apos;re experiencing technical difficulties connecting to our printing press (database). 
            Please try again in a few moments.
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full font-body"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
            
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="w-full font-body"
              >
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="px-6 py-3 bg-[var(--surface)] dark:bg-[var(--surface)] border-t border-[var(--rule)] dark:border-[var(--rule)]">
          <p className="font-body text-[10px] text-[var(--ink-3)] text-center">
            Error Code: SUPABASE_CONN_FAIL
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export function WireDelayError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[var(--bg)] dark:bg-[var(--surface)] border-2 border-[var(--rule)] dark:border-[var(--rule)] shadow-xl overflow-hidden"
      >
        <div className="bg-[var(--surface)] dark:bg-[var(--surface)] border-b border-[var(--rule)] dark:border-[var(--rule)] p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--accent-sepia)]/20 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-[var(--accent-sepia)]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--ink-1)] dark:text-[var(--ink-1)]">
            WIRE DELAY
          </h1>
          <p className="font-body text-xs text-[var(--ink-3)] mt-2 uppercase tracking-widest">
            Service Timeout Notice
          </p>
        </div>

        <div className="p-6 text-center">
          <p className="font-body text-sm text-[var(--ink-3)] mb-6">
            The editorial wire (AI service) is taking longer than usual to respond. 
            Would you like to use our pre-written milestone templates instead?
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full font-body"
            >
              Try Again
            </Button>
            
            <Button
              variant="outline"
              className="w-full font-body"
            >
              Use Template Fallback
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}