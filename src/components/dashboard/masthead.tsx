'use client'

import { TypewriterText } from '@/components/ui/typewriter-text'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { getCurrentDateHeader } from '@/lib/utils'
import { motion } from 'framer-motion'

interface DashboardMastheadProps {
  subtitle?: string
}

export function DashboardMasthead({
  subtitle = 'THE DAILY SKILL TRACKER',
}: DashboardMastheadProps) {
  return (
    <div className="w-full">
      {/* Top strip with app name, date, and theme toggle */}
      <div className="flex items-center justify-between py-3 border-b-2 border-ink-200">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-ink-200">
            FOLIO
          </span>
          <span className="hidden sm:block font-mono text-xs text-ink-50 uppercase tracking-wider">
            {subtitle}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-ink-50 hidden md:block">
            {getCurrentDateHeader()}
          </span>
          
          {/* Ink/Paper Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-full border-2 border-ink-200/30 flex items-center justify-center overflow-hidden group"
            onClick={() => {
              const html = document.documentElement
              html.classList.toggle('dark')
            }}
          >
            <div className="absolute inset-0 bg-ink-200 dark:bg-paper-100 transition-colors" />
            <div className="relative z-10 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 text-paper-100 dark:text-ink-200 transition-colors"
              >
                {/* Ink drop icon */}
                <path
                  d="M12 2C12 2 8 8 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 8 12 2 12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="currentColor"
                  fillOpacity="0.2"
                />
                <path
                  d="M12 20L12 22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile date (shown only on small screens) */}
      <p className="sm:hidden font-mono text-xs text-ink-50 uppercase tracking-wider py-2 text-center border-b border-ink-200/20">
        {getCurrentDateHeader()}
      </p>
    </div>
  )
}
