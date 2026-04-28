'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { BookOpen, LayoutDashboard, LogOut, Settings, User, BarChart3, Archive } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { MiniMasthead } from '@/components/auth/newspaper-masthead'

const navItems: { name: string; href: string; icon: typeof BookOpen }[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Skills',
    href: '/dashboard/skills',
    icon: BookOpen,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="flex flex-col h-full border-r border-ink-200/10 dark:border-wiki-border">
      <div className="p-6">
        <Link href="/dashboard">
          <MiniMasthead title="FOLIO" />
        </Link>
      </div>

      <div className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href as any}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-mono transition-colors',
                    isActive
                      ? 'bg-ink-100/10 text-ink-200 dark:bg-wiki-border/50 dark:text-wiki-text'
                      : 'text-ink-50 hover:bg-ink-100/5 hover:text-ink-200 dark:text-wiki-muted dark:hover:text-wiki-text'
                  )}
                  data-pressable
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-ink-200/10 dark:border-wiki-border">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-sm font-mono text-ink-50 hover:text-ink-200 dark:text-wiki-muted dark:hover:text-wiki-text transition-colors"
            data-pressable
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}

const mobileNavItems: { name: string; href: string; icon: typeof LayoutDashboard }[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Stats', href: '/dashboard/stats', icon: BarChart3 },
  { name: 'Archive', href: '/dashboard/archive', icon: Archive },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-3 border-b border-ink-200/10 dark:border-wiki-border md:hidden">
        <Link href="/dashboard">
          <span className="font-serif text-xl font-bold">FOLIO</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={handleSignOut}
            className="p-2 text-ink-50 hover:text-ink-200 dark:text-wiki-muted dark:hover:text-wiki-text"
            data-pressable
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Bottom Navigation Bar - Newspaper Footer Style */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t-2 border-ink-200/20 dark:border-wiki-border bg-paper-50/95 dark:bg-wiki-darker/95 backdrop-blur-sm z-40 pb-safe">
        <div className="flex items-center justify-around py-1">
          {mobileNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href as any}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-4 py-2 min-w-[44px] min-h-[44px] justify-center',
                  isActive
                    ? 'text-ink-200 dark:text-wiki-text'
                    : 'text-ink-50 dark:text-wiki-muted',
                  'focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-ink-200'
                )}
                data-pressable
              >
                <Icon className="w-5 h-5" />
                <span className="font-mono text-[10px] uppercase tracking-wider">
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
