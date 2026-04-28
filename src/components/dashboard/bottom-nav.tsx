'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, BarChart3, Archive, User } from 'lucide-react'
import { useEffect, useRef } from 'react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Stats', href: '/dashboard/stats', icon: BarChart3 },
  { name: 'Archive', href: '/dashboard/archive', icon: Archive },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const touchStartRef = useRef<number>(0)
  const touchEndRef = useRef<number>(0)

  // Handle swipe gestures
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.changedTouches[0].screenX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndRef.current = e.changedTouches[0].screenX
      handleSwipe()
    }

    const handleSwipe = () => {
      const swipeThreshold = 100
      const diff = touchStartRef.current - touchEndRef.current

      if (Math.abs(diff) > swipeThreshold) {
        const currentIndex = navItems.findIndex(item => 
          pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
        )
        
        if (diff > 0 && currentIndex < navItems.length - 1) {
          // Swipe left - go to next
          window.location.href = navItems[currentIndex + 1].href
        } else if (diff < 0 && currentIndex > 0) {
          // Swipe right - go to previous
          window.location.href = navItems[currentIndex - 1].href
        }
      }
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [pathname, router])

  return (
    <nav className="
      fixed bottom-0 left-0 right-0
      border-t-[var(--border-default)]
      border-t-2
      bg-[var(--surface-card)]
      pb-safe
      z-40
    ">
      <div className="flex items-center justify-around py-[var(--space-2)]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={cn(
                'flex flex-col items-center gap-[var(--space-1)] px-[var(--space-4)] py-[var(--space-2)] min-w-[64px] min-h-[56px] justify-center',
                'transition-all duration-[var(--duration-fast)] active:translate-y-[1px] active:scale-95',
                isActive
                  ? 'text-[var(--ink-primary)]'
                  : 'text-[var(--ink-tertiary)] hover:text-[var(--ink-2)]',
                'focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[var(--ink-primary)]',
                isActive && 'relative after:content-[""] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-[2px] after:bg-[var(--ink-primary)] after:rounded-full'
              )}
            >
              <Icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110')} />
              <span className={cn('font-ui text-[10px] uppercase tracking-[0.08em]', isActive && 'font-semibold')}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
