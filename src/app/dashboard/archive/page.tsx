'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, RotateCcw, Award, Archive } from 'lucide-react'
import useSWR from 'swr'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { StreakWidget } from '@/components/ui/streak-widget'
import { NotificationBell } from '@/components/ui/notification-bell'

interface ArchivedSkill {
  id: string
  title: string
  category: string
  cover_emoji: string | null
  description: string | null
  total_xp: number
  completed_at: string
  milestones: { status: string }[]
  streak_count?: number
}

export default function ArchivePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setLoading(false)
    }

    checkAuth()
  }, [router])

  const { data: skills, mutate } = useSWR(
    'archived-skills',
    async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return []
      
      const { data } = await supabase
        .from('skills')
        .select('id, title, category, cover_emoji, description, total_xp, archived_at, milestones(status), streak_count')
        .eq('user_id', user.id)
        .not('archived_at', 'is', null)
        .order('archived_at', { ascending: false })
      
      return (data || []) as unknown as ArchivedSkill[]
    },
    { refreshInterval: 10000 }
  )

  const handleRestore = async (skillId: string) => {
    const supabase = createClient()
    
    await supabase
      .from('skills')
      .update({ archived_at: null })
      .eq('id', skillId)

    mutate()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--surface)] border border-[var(--rule)] w-48 rounded" />
          <div className="h-48 bg-[var(--surface)] border border-[var(--rule)] rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Archive' }]} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Archive className="w-6 h-6" />
            Back Issues
          </h1>
          <p className="font-body text-sm text-[var(--ink-3)]">
            Archived and completed skills
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StreakWidget streak={skills ? Math.max(...skills.map(s => s.streak_count || 0), 0) : 0} />
          <NotificationBell />
          <Link
            href="/dashboard"
            className="font-body text-sm text-[var(--ink-3)] hover:text-[var(--ink-2)] flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Archive grid */}
      {skills && skills.length > 0 ? (
        <div className="grid grid-cols-1 md:columns-2 lg:columns-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="break-inside-avoid mb-4 p-4 bg-[var(--surface)]/50 dark:bg-[var(--surface)]/10 border border-[var(--rule)]/30 dark:border-[var(--rule)]/30"
            >
              {/* Complete stamp */}
              <div className="relative mb-3">
                <div className="absolute top-0 right-0 rotate-12">
                  <span className="font-display text-xs font-bold text-[var(--accent-sepia)] dark:text-[var(--accent-sepia)] px-2 py-1 border-2 border-[var(--accent-sepia)] rounded uppercase tracking-widest">
                    COMPLETE
                  </span>
                </div>
              </div>

              {/* Category */}
              <span className="font-body text-[10px] uppercase tracking-widest bg-[var(--ink-1)] dark:bg-[var(--ink-1)] text-[var(--bg)] dark:text-[var(--bg)] px-2 py-0.5">
                {skill.category}
              </span>

              {/* Title */}
              <h3 className="font-display text-lg font-semibold mt-3 text-[var(--ink-1)] dark:text-[var(--ink-1)]">
                {skill.title}
              </h3>

              {skill.description && (
                <p className="font-body text-xs text-[var(--ink-3)] mt-2 line-clamp-2">
                  {skill.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--rule)]/20 dark:border-[var(--rule)]/20">
                <span className="font-body text-xs text-[var(--ink-3)]">
                  {skill.total_xp} XP
                </span>
                <button
                  onClick={() => handleRestore(skill.id)}
                  className="flex items-center gap-1 font-body text-xs text-[var(--ink-3)] hover:text-[var(--ink-2)]"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restore
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border-2 border-dashed border-[var(--rule)] dark:border-[var(--rule)]">
          <Archive className="w-12 h-12 mx-auto text-[var(--ink-3)] mb-4" />
          <h3 className="font-display text-lg font-semibold mb-2">No back issues</h3>
          <p className="font-body text-sm text-[var(--ink-3)]">
            Completed or archived skills will appear here.
          </p>
        </div>
      )}
    </div>
  )
}