'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'

export function NewspaperHeader() {
  const router = useRouter()
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Primary header strip - FOLIO + date */}
      <header className="
        sticky top-0 z-30
        bg-[var(--surface-card)]
        border-b-[var(--border-default)]
        border-b-2
      ">
        <div className="
          flex items-center justify-between
          px-4 py-3
          border-b-[var(--border-default)]
        ">
          {/* Logo - masthead style */}
          <Link href="/dashboard" className="flex-shrink-0">
            <h1 className="masthead text-[var(--ink-primary)]">
              FOLIO
            </h1>
          </Link>

          {/* Date - centered */}
          <span className="byline text-[var(--ink-tertiary)] hidden md:block">
            {today}
          </span>

          {/* Right side - toggle + user */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--paper-tertiary)] transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary strip - section name */}
        <div className="
          text-center py-2
          border-b-[var(--border-default)]
          md:border-b-0
        ">
          <span className="byline text-[var(--ink-tertiary)]">
            THE DASHBOARD
          </span>
        </div>
      </header>
    </>
  )
}

export function MobileHeader() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="
      sticky top-0 z-30
      bg-[var(--surface-card)]
      border-b-[var(--border-default)]
    ">
      <div className="
        flex items-center justify-between
        px-4 py-3
      ">
        <Link href="/dashboard">
          <h1 className="masthead text-[var(--ink-primary)]">
            FOLIO
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={handleSignOut}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--ink-secondary)]"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
