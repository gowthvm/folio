'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface MastheadProps {
  sectionLabel?: string
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Stats', href: '/dashboard/stats' },
  { name: 'Archive', href: '/dashboard/archive' },
  { name: 'Profile', href: '/dashboard/profile' },
]

export function NewspaperMasthead({ sectionLabel = 'THE DASHBOARD' }: MastheadProps) {
  const router = useRouter()
  const pathname = usePathname()

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
    <header className="relative z-10">
      {/* Row A: thin rule, full bleed */}
      <div className="border-t border-[var(--rule)] rule-full-bleed" />

      {/* Row B: three-column flex */}
      <div className="flex items-center py-[14px]">
        <div className="flex-1">
          <span className="font-ui text-[0.65rem] uppercase tracking-[0.1em] text-[var(--ink-3)]">
            EST. 2026 · FREE TO READ
          </span>
        </div>
        <div className="flex-0">
          <Link href="/dashboard">
            <h1 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] tracking-[-0.02em] text-[var(--ink-1)] leading-[1] m-0">
              FOLIO
            </h1>
          </Link>
        </div>
        <div className="flex-1 text-right flex items-center justify-end gap-0">
          <span className="font-ui text-[0.65rem] uppercase tracking-[0.1em] text-[var(--ink-3)]">
            {today}
            {' · '}
            <ThemeToggle />
            {' · '}
            <button
              onClick={handleSignOut}
              className="font-ui text-[0.65rem] uppercase tracking-[0.1em] text-[var(--ink-3)] hover:text-[var(--ink-1)] transition-colors"
              aria-label="Sign out of your account"
            >
              SIGN OUT
            </button>
          </span>
        </div>
      </div>

      {/* Row C: double rule */}
      <div className="border-t-[2px] border-[var(--ink-1)] pt-[3px] border-b border-[var(--ink-1)] h-0 rule-full-bleed" />

      {/* Row D: navigation strip */}
      <nav className="py-[10px] text-center">
        <div className="flex items-center justify-center gap-0">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <span key={item.href} className="flex items-center">
                {index > 0 && (
                  <span className="font-ui text-[0.7rem] text-[var(--ink-4)] mx-2">·</span>
                )}
                <Link
                  href={item.href as any}
                  className={cn(
                    'font-ui text-[0.7rem] uppercase tracking-[0.08em] text-[var(--ink-3)] pb-[2px] transition-colors',
                    isActive
                      ? 'text-[var(--ink-1)] border-b-[1.5px] border-[var(--ink-1)]'
                      : 'hover:text-[var(--ink-1)]'
                  )}
                >
                  {item.name}
                </Link>
              </span>
            )
          })}
        </div>
      </nav>

      {/* Row E: single rule */}
      <div className="border-t border-[var(--rule)] rule-full-bleed" />

      {/* Row F: section label */}
      <div className="py-[8px] text-center">
        <span className="font-ui text-[0.65rem] uppercase tracking-[0.15em] text-[var(--ink-3)]">
          {sectionLabel}
        </span>
      </div>

      {/* Row G: single rule */}
      <div className="border-t border-[var(--rule)] rule-full-bleed" />
    </header>
  )
}

// Simplified mobile masthead
export function MobileMasthead({ sectionLabel = 'THE DASHBOARD' }: MastheadProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="relative z-10 md:hidden">
      {/* Row A: thin rule */}
      <div className="border-t border-[var(--rule)] rule-full-bleed" />

      {/* Row B: FOLIO + actions */}
      <div className="flex items-center justify-between py-[14px]">
        <Link href="/dashboard">
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] tracking-[-0.02em] text-[var(--ink-1)] leading-[1] m-0">
            FOLIO
          </h1>
        </Link>

        <div className="flex items-center gap-0">
          <span className="font-ui text-[0.65rem] uppercase tracking-[0.1em] text-[var(--ink-3)]">
            <ThemeToggle />
            {' · '}
            <button
              onClick={handleSignOut}
              className="font-ui text-[0.65rem] uppercase tracking-[0.1em] text-[var(--ink-3)] hover:text-[var(--ink-1)] transition-colors"
              aria-label="Sign out of your account"
            >
              SIGN OUT
            </button>
          </span>
        </div>
      </div>

      {/* Row C: double rule */}
      <div className="border-t-[2px] border-[var(--ink-1)] pt-[3px] border-b border-[var(--ink-1)] h-0 rule-full-bleed" />

      {/* Row D: section label */}
      <div className="py-[8px] text-center">
        <span className="font-ui text-[0.65rem] uppercase tracking-[0.15em] text-[var(--ink-3)]">
          {sectionLabel}
        </span>
      </div>

      {/* Row E: single rule */}
      <div className="border-t border-[var(--rule)] rule-full-bleed" />
    </header>
  )
}
