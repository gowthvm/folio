'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user: userData } } = await supabase.auth.getUser()
      
      if (!userData) {
        router.push('/login')
        return
      }

      setUser(userData)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--surface)] border border-[var(--rule)] w-32 rounded" />
          <div className="h-48 bg-[var(--surface)] border border-[var(--rule)] rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="newspaper-rule-thick mb-6" />
      <div>
        <h1 className="font-display text-[var(--text-subhead)] font-style-italic text-[var(--ink-primary)]">
          Settings
        </h1>
        <p className="byline text-[var(--ink-tertiary)]">APPLICATION PREFERENCES</p>
      </div>

      <div className="space-y-6">
        <div className="border border-[var(--rule)] p-6">
          <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
            APPEARANCE
          </div>
          <div className="newspaper-rule mb-[var(--space-4)]" />
          
          <div className="space-y-4">
            <div>
              <label className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] block mb-2">
                THEME
              </label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setTheme('light')}
                  className={`font-ui text-[0.7rem] uppercase tracking-[0.08em] px-4 py-2 border border-[var(--rule)] transition-colors ${theme === 'light' ? 'bg-[var(--ink-1)] text-[var(--paper-primary)]' : 'text-[var(--ink-2)] hover:text-[var(--ink-1)]'}`}
                >
                  Paper
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`font-ui text-[0.7rem] uppercase tracking-[0.08em] px-4 py-2 border border-[var(--rule)] transition-colors ${theme === 'dark' ? 'bg-[var(--ink-1)] text-[var(--paper-primary)]' : 'text-[var(--ink-2)] hover:text-[var(--ink-1)]'}`}
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-[var(--rule)] p-6">
          <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
            ACCOUNT
          </div>
          <div className="newspaper-rule mb-[var(--space-4)]" />
          
          <div className="space-y-4">
            <p className="font-body text-[0.8rem] text-[var(--ink-2)]">
              Manage your account settings and preferences.
            </p>
            <Link
              href="/dashboard/profile"
              className="font-ui text-[0.7rem] uppercase tracking-[0.08em] px-4 py-2 border border-[var(--rule)] hover:bg-[var(--ink-1)] hover:text-[var(--paper-primary)] transition-colors inline-block"
            >
              View Profile →
            </Link>
          </div>
        </div>

        <div className="border border-[var(--rule)] p-6">
          <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
            DATA
          </div>
          <div className="newspaper-rule mb-[var(--space-4)]" />
          
          <div className="space-y-4">
            <p className="font-body text-[0.8rem] text-[var(--ink-2)]">
              All your data is stored securely in Supabase. Your skills, sessions, and progress are backed up automatically.
            </p>
            <button className="font-ui text-[0.7rem] uppercase tracking-[0.08em] px-4 py-2 border border-[var(--rule)] hover:bg-[var(--ink-1)] hover:text-[var(--paper-primary)] transition-colors">
              Export Data →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
