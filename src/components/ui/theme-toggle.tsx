'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [syncError, setSyncError] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const syncToSupabase = useCallback(async (newTheme: string) => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error } = await supabase.from('profiles').update({ theme: newTheme }).eq('id', user.id)
        // Don't throw error for sync failures - theme preference is secondary
        if (error) {
          console.warn('Theme sync failed:', error)
        }
      }
      setSyncError(false)
    } catch (err) {
      // Only show error for unexpected failures, not expected auth issues
      console.warn('Theme sync error:', err)
      // Don't set syncError for theme sync issues
    }
  }, [])

  const handleToggle = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    syncToSupabase(newTheme)
  }

  if (!mounted) {
    return (
      <button
        className="font-ui text-[0.65rem] uppercase tracking-[0.1em] text-[var(--ink-3)] min-w-[44px] min-h-[44px]"
        aria-label="Toggle theme"
        disabled
      >
        <span className="sr-only">Toggle theme</span>
      </button>
    )
  }

  const currentTheme = resolvedTheme || theme

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      className={`font-ui text-[0.65rem] uppercase tracking-[0.1em] hover:text-[var(--ink-1)] transition-colors ${
        syncError ? 'text-[var(--accent-red)]' : 'text-[var(--ink-3)]'
      }`}
      aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={syncError ? 'Failed to sync theme preference' : `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {syncError ? '!' : currentTheme === 'dark' ? 'LIGHT' : 'DARK'}
    </button>
  )
}