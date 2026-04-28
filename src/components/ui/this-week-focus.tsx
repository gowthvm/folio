'use client'

import Link from 'next/link'
import { Target, Calendar, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import useSWR from 'swr'

interface ThisWeekFocusProps {
  className?: string
}

export function ThisWeekFocus({ className = '' }: ThisWeekFocusProps) {
  const { data: skills } = useSWR('this-week-focus', async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return []
    
    const { data } = await supabase
      .from('skills')
      .select('id, title, category, target_date, streak_count, milestones(status, weight_percent)')
      .eq('user_id', user.id)
      .is('archived_at', null)
      .order('streak_count', { ascending: false })
      .limit(3)
    
    return data || []
  })

  const getFocusType = (skill: any) => {
    if (skill.target_date) {
      const daysUntil = Math.ceil((new Date(skill.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      if (daysUntil <= 7) return { type: 'due-soon', label: `DUE IN ${daysUntil} DAYS`, icon: Calendar }
    }
    if (skill.streak_count >= 3) return { type: 'hot-streak', label: `${skill.streak_count} DAY STREAK`, icon: TrendingUp }
    return { type: 'priority', label: 'IN PROGRESS', icon: Target }
  }

  if (!skills || skills.length === 0) return null

  return (
    <div className={`bg-[var(--surface-card)] border border-[var(--border-default)] p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-[var(--ink-tertiary)]" />
        <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em]">
          THIS WEEK&apos;S FOCUS
        </span>
      </div>
      <div className="newspaper-rule mb-3" />
      <div className="space-y-3">
        {skills.slice(0, 3).map((skill: any) => {
          const focus = getFocusType(skill)
          const progress = skill.milestones 
            ? Math.round((skill.milestones.filter((m: any) => m.status === 'completed').length / skill.milestones.length) * 100)
            : 0
          
          return (
            <Link
              key={skill.id}
              href={`/dashboard/skills/${skill.id}`}
              className="block p-3 bg-[var(--paper-secondary)] border border-[var(--border-default)] hover:border-[var(--ink-primary)] transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-ui text-[0.6rem] text-[var(--ink-tertiary)] uppercase tracking-wider">
                    {skill.category}
                  </span>
                  <h4 className="font-display text-[var(--text-caption)] text-[var(--ink-primary)] mt-1">
                    {skill.title}
                  </h4>
                </div>
                <div className="flex items-center gap-1">
                  <focus.icon className="w-3 h-3 text-[var(--accent-sepia)]" />
                  <span className="font-ui text-[0.55rem] text-[var(--accent-sepia)] uppercase tracking-wider">
                    {focus.label}
                  </span>
                </div>
              </div>
              <div className="w-full h-1 bg-[var(--ink-tertiary)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--ink-primary)] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
