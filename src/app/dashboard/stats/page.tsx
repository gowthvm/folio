'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { NewspaperEmpty } from '@/components/ui/newspaper-empty'
import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { StreakWidget } from '@/components/ui/streak-widget'
import { NotificationBell } from '@/components/ui/notification-bell'
import { QuickActionsBar } from '@/components/ui/quick-actions-bar'

const LazyCharts = lazy(() => import('@/components/charts/lazy-charts').then(mod => ({ default: mod.LazyCharts })))

interface SessionWithDate {
  created_at: string
  milestone_id: string
  duration_minutes?: number
}

interface SkillProgress {
  id: string
  title: string
  category: string
  milestones: { status: string; weight_percent: number; completed_at?: string }[]
  created_at: string
  total_xp: number
  streak_count?: number
}

function ChartSkeleton() {
  return (
    <div className="animate-pulse h-[300px] bg-ink-100/20 dark:bg-wiki-border rounded" />
  )
}

export default function StatsPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<SessionWithDate[]>([])
  const [skills, setSkills] = useState<SkillProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const [sessionsRes, skillsRes] = await Promise.all([
        supabase
          .from('sessions')
          .select('created_at, milestone_id, duration_minutes')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true }),
        supabase
          .from('skills')
          .select('id, title, category, milestones(status, weight_percent, completed_at), created_at, total_xp, streak_count')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true }),
      ])

      setSessions(sessionsRes.data || [])
      setSkills(skillsRes.data || [])
      setLoading(false)
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--surface)] border border-[var(--rule)] w-32 rounded" />
          <ChartSkeleton />
          <div className="h-32 bg-[var(--surface)] border border-[var(--rule)] rounded" />
        </div>
      </div>
    )
  }

  // Empty state check
  if (sessions.length === 0 && skills.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Analytics</h1>
            <p className="font-ui text-sm text-ink-50">Track your learning velocity</p>
          </div>
          <Link
            href="/dashboard"
            className="font-ui text-sm text-ink-50 hover:text-ink-200"
          >
            Back to Dashboard
          </Link>
        </div>
        
        {/* Enhanced empty state with preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Preview of what's coming */}
          <div className="space-y-6">
            <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
              COMING SOON TO YOUR ANALYTICS
            </div>
            <div className="newspaper-rule mb-4" />
            
            {/* Preview Heatmap */}
            <div className="bg-[var(--surface-card)] border border-[var(--border-default)] p-4 opacity-60">
              <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
                ACTIVITY HEATMAP
              </div>
              <div className="newspaper-rule mb-3" />
              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: 84 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-[var(--ink-tertiary)] opacity-20"
                  />
                ))}
              </div>
              <p className="font-body text-[0.75rem] text-[var(--ink-tertiary)] mt-3 italic">
                Track your daily practice patterns over time
              </p>
            </div>

            {/* Preview Category Breakdown */}
            <div className="bg-[var(--surface-card)] border border-[var(--border-default)] p-4 opacity-60">
              <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
                CATEGORY BREAKDOWN
              </div>
              <div className="newspaper-rule mb-3" />
              <div className="space-y-2">
                {['MUSIC', 'LEARNING', 'FITNESS'].map((cat) => (
                  <div key={cat} className="flex items-center gap-2">
                    <span className="font-ui text-[0.6rem] text-[var(--ink-tertiary)] w-16">{cat}</span>
                    <div className="flex-1 h-2 bg-[var(--ink-tertiary)] opacity-20 rounded" />
                  </div>
                ))}
              </div>
              <p className="font-body text-[0.75rem] text-[var(--ink-tertiary)] mt-3 italic">
                See which skills get the most attention
              </p>
            </div>
          </div>

          {/* Right: Motivational content */}
          <div>
            <NewspaperEmpty
              title="No Data Yet"
              message="Your analytics will populate as you log sessions and complete milestones. Start tracking to unlock insights."
              cta="Create Your First Skill"
              ctaHref="/dashboard/skills/new"
            />
            
            {/* Quick stats preview */}
            <div className="mt-6 bg-[var(--surface-card)] border border-[var(--border-default)] p-4">
              <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
                METRICS YOU&apos;LL TRACK
              </div>
              <div className="newspaper-rule mb-3" />
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-[var(--paper-secondary)]">
                  <div className="font-display text-2xl text-[var(--ink-tertiary)]">—</div>
                  <div className="font-ui text-[0.55rem] text-[var(--ink-4)] uppercase tracking-wider mt-1">
                    Total Sessions
                  </div>
                </div>
                <div className="text-center p-3 bg-[var(--paper-secondary)]">
                  <div className="font-display text-2xl text-[var(--ink-tertiary)]">—</div>
                  <div className="font-ui text-[0.55rem] text-[var(--ink-4)] uppercase tracking-wider mt-1">
                    Hours Logged
                  </div>
                </div>
                <div className="text-center p-3 bg-[var(--paper-secondary)]">
                  <div className="font-display text-2xl text-[var(--ink-tertiary)]">—</div>
                  <div className="font-ui text-[0.55rem] text-[var(--ink-4)] uppercase tracking-wider mt-1">
                    Longest Streak
                  </div>
                </div>
                <div className="text-center p-3 bg-[var(--paper-secondary)]">
                  <div className="font-display text-2xl text-[var(--ink-tertiary)]">—</div>
                  <div className="font-ui text-[0.55rem] text-[var(--ink-4)] uppercase tracking-wider mt-1">
                    Total XP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Process heatmap data
  const getHeatmapData = () => {
    const days: Record<string, number> = {}
    const today = new Date()
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const key = date.toISOString().split('T')[0]
      days[key] = 0
    }
    
    sessions.forEach(s => {
      const key = s.created_at.split('T')[0]
      if (days[key] !== undefined) {
        days[key]++
      }
    })
    
    return Object.entries(days).map(([date, count]) => ({ date, count }))
  }

  // Calculate velocity
  const calculateVelocity = () => {
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
    
    const thisMonth = sessions.filter(s => new Date(s.created_at) >= thisMonthStart).length
    const lastMonth = sessions.filter(s => {
      const d = new Date(s.created_at)
      return d >= lastMonthStart && d <= lastMonthEnd
    }).length
    
    const change = lastMonth === 0 ? 100 : Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
    
    return { thisMonth, lastMonth, change }
  }

  // Category breakdown
  const getCategoryBreakdown = () => {
    const breakdown: Record<string, number> = {}
    
    skills.forEach(skill => {
      const completed = skill.milestones?.filter(m => m.status === 'completed') || []
      if (completed.length > 0) {
        breakdown[skill.category] = (breakdown[skill.category] || 0) + completed.length
      }
    })
    
    return Object.entries(breakdown).map(([name, value]) => ({ name: name.toUpperCase(), value }))
  }

  // Calculate personal records
  const getPersonalRecords = () => {
    // Longest streak from skills
    const longestStreak = skills.reduce((max, skill) => Math.max(max, skill.streak_count || 0), 0)

    // Most sessions in a day
    const sessionsByDay: Record<string, number> = {}
    sessions.forEach(session => {
      const date = session.created_at.split('T')[0]
      sessionsByDay[date] = (sessionsByDay[date] || 0) + 1
    })
    const mostSessionsInDay = Math.max(...Object.values(sessionsByDay), 0)

    // Fastest skill completed (days between created_at and first milestone completion)
    const completionTimes = skills
      .filter(skill => {
        const completed = skill.milestones?.filter(m => m.status === 'completed') || []
        return completed.length > 0
      })
      .map(skill => {
        const created = new Date(skill.created_at).getTime()
        const firstCompletion = skill.milestones
          ?.filter(m => m.status === 'completed')
          .sort((a, b) => new Date(a.completed_at || 0).getTime() - new Date(b.completed_at || 0).getTime())[0]
        if (!firstCompletion || !firstCompletion.completed_at) return Infinity
        const completed = new Date(firstCompletion.completed_at).getTime()
        return Math.ceil((completed - created) / (1000 * 60 * 60 * 24))
      })
      .filter(days => days !== Infinity && days > 0)
    const fastestSkillCompleted = completionTimes.length > 0 ? Math.min(...completionTimes) : 0

    // Most XP in a week
    const xpByWeek: Record<string, number> = {}
    skills.forEach(skill => {
      if (skill.total_xp > 0) {
        const created = new Date(skill.created_at)
        const weekStart = new Date(created)
        weekStart.setDate(created.getDate() - created.getDay())
        const weekKey = weekStart.toISOString().split('T')[0]
        xpByWeek[weekKey] = (xpByWeek[weekKey] || 0) + skill.total_xp
      }
    })
    const mostXPInWeek = Math.max(...Object.values(xpByWeek), 0)

    return { longestStreak, mostSessionsInDay, fastestSkillCompleted, mostXPInWeek }
  }

  // Progress over time per skill
  const getProgressOverTime = () => {
    const progressBySkill: Record<string, { date: string; progress: number }[]> = {}
    
    skills.forEach(skill => {
      if (!skill.milestones?.length) return
      
      let cumulative = 0
      const total = skill.milestones.reduce((sum, m) => sum + m.weight_percent, 0)
      
      skill.milestones.forEach(m => {
        if (m.status === 'completed') {
          cumulative += m.weight_percent
          progressBySkill[skill.title] = progressBySkill[skill.title] || []
          progressBySkill[skill.title].push({
            date: skill.created_at.split('T')[0],
            progress: Math.round((cumulative / total) * 100)
          })
        }
      })
    })
    
    return Object.entries(progressBySkill).map(([name, data]) => ({ name, data }))
  }

  const heatmapData = getHeatmapData()
  const velocity = calculateVelocity()
  const categoryData = getCategoryBreakdown()
  const progressData = getProgressOverTime()
  const personalRecords = getPersonalRecords()
  
  // Calculate total hours from sessions
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0)
  const totalHours = totalMinutes > 0 ? Math.round(totalMinutes / 60 * 10) / 10 : 0

  const allCategories = ['MUSIC', 'LEARNING', 'FITNESS', 'CREATIVE', 'TECHNICAL']
  const categoryBreakdown = allCategories.map(cat => {
    const found = categoryData.find(c => c.name === cat)
    return { name: cat, value: found?.value || 0 }
  })

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Analytics' }]} />
      
      {/* Header with newspaper style */}
      <div className="newspaper-rule-thick mb-6" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[var(--text-subhead)] font-style-italic text-[var(--ink-primary)]">
            The Analytics
          </h1>
          <p className="byline text-[var(--ink-tertiary)]">DATA JOURNALISM</p>
        </div>
        <div className="flex items-center gap-3">
          <StreakWidget streak={0} />
          <NotificationBell />
          <Link
            href="/dashboard"
            className="font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <QuickActionsBar />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          {/* Block 1 - Activity Heatmap */}
          <div>
            <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
              SESSIONS THIS YEAR
            </div>
            <div className="newspaper-rule mb-[var(--space-4)]" />
            
            <div className="heatmap-grid">
              {heatmapData.map(({ date, count }) => (
                <div
                  key={date}
                  className="heatmap-cell"
                  style={{
                    backgroundColor: count === 0 
                      ? 'var(--paper-ruled)' 
                      : count <= 1 
                        ? 'var(--ink-tertiary)'
                        : count <= 2 
                          ? 'var(--ink-secondary)'
                          : 'var(--ink-primary)',
                    opacity: count === 0 ? 0.2 : 0.3 + (count / 10) * 0.7,
                  }}
                  title={`${date}: ${count} session${count !== 1 ? 's' : ''}`}
                />
              ))}
            </div>
            <p className="font-body text-[0.85rem] text-[var(--ink-3)] mt-4">
              {sessions.length} sessions logged this year.
            </p>
          </div>

          {/* Block 2 - Skill Progress Over Time */}
          <div>
            <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
              PROGRESS CHART
            </div>
            <div className="newspaper-rule mb-[var(--space-4)]" />
            
            <div className="h-[220px] flex items-center justify-center bg-[var(--surface)] border border-[var(--rule)]">
              <p className="font-body text-[var(--ink-4)] italic">
                No data filed yet.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8 lg:border-l lg:border-[var(--rule)] lg:pl-8">
          {/* Block 1 - Category Breakdown */}
          <div>
            <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
              STORIES BY CATEGORY
            </div>
            <div className="newspaper-rule mb-[var(--space-4)]" />
            
            <div className="space-y-0">
              {categoryBreakdown.map((cat) => {
                const maxValue = Math.max(...categoryBreakdown.map(c => c.value), 1)
                const barWidth = (cat.value / maxValue) * 100
                return (
                  <div key={cat.name} className="py-3 border-b border-[var(--rule)]">
                    <div className="flex items-center gap-4">
                      <span className="font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] text-[var(--ink-2)] w-24">
                        {cat.name}
                      </span>
                      <div className="flex-1 h-[12px] bg-[var(--ink-1)]" style={{ width: `${barWidth}%` }} />
                      <span className="font-ui text-[var(--text-caption)] tabular-nums text-[var(--ink-1)]">
                        {cat.value}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Block 2 - Personal Records */}
          <div>
            <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
              PERSONAL RECORDS
            </div>
            <div className="newspaper-rule mb-[var(--space-4)]" />
            
            <div className="space-y-0">
              <div className="py-[var(--space-3)] border-b border-[var(--rule)]">
                <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] mb-1">
                  LONGEST STREAK
                </div>
                <div className="font-ui text-[1.3rem] text-[var(--ink-1)]">
                  {personalRecords.longestStreak > 0 ? `${personalRecords.longestStreak} days` : '—'}
                </div>
              </div>
              <div className="py-[var(--space-3)] border-b border-[var(--rule)]">
                <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] mb-1">
                  MOST SESSIONS IN A DAY
                </div>
                <div className="font-ui text-[1.3rem] text-[var(--ink-1)]">
                  {personalRecords.mostSessionsInDay > 0 ? personalRecords.mostSessionsInDay : '—'}
                </div>
              </div>
              <div className="py-[var(--space-3)] border-b border-[var(--rule)]">
                <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] mb-1">
                  FASTEST SKILL COMPLETED
                </div>
                <div className="font-ui text-[1.3rem] text-[var(--ink-1)]">
                  {personalRecords.fastestSkillCompleted > 0 ? `${personalRecords.fastestSkillCompleted} days` : '—'}
                </div>
              </div>
              <div className="py-[var(--space-3)]">
                <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] mb-1">
                  MOST XP IN A WEEK
                </div>
                <div className="font-ui text-[1.3rem] text-[var(--ink-1)]">
                  {personalRecords.mostXPInWeek > 0 ? personalRecords.mostXPInWeek : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Block 3 - Recent Badges */}
          <div>
            <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
              PRESS CLIPPINGS
            </div>
            <div className="newspaper-rule mb-[var(--space-4)]" />
            
            <div className="font-body text-[0.8rem] text-[var(--ink-4)] italic">
              No clippings yet. Complete milestones to earn your first.
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM - All-Time Numbers */}
      <div className="newspaper-rule-thick my-[var(--space-6)]" />
      <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] text-center mb-[var(--space-3)]">
        ALL-TIME NUMBERS
      </div>
      <div className="newspaper-rule-thick mb-[var(--space-6)]" />
      
      <div className="grid grid-cols-5 gap-0">
        <div className="text-center border-r border-[var(--rule)]">
          <div className="font-display text-[clamp(1.8rem,3vw,2.5rem)] text-[var(--ink-1)]">
            {skills.length}
          </div>
          <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] mt-2">
            TOTAL SKILLS
          </div>
        </div>
        <div className="text-center border-r border-[var(--rule)]">
          <div className="font-display text-[clamp(1.8rem,3vw,2.5rem)] text-[var(--ink-1)]">
            {skills.reduce((acc, s) => acc + (s.milestones?.length || 0), 0)}
          </div>
          <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] mt-2">
            TOTAL MILESTONES
          </div>
        </div>
        <div className="text-center border-r border-[var(--rule)]">
          <div className="font-display text-[clamp(1.8rem,3vw,2.5rem)] text-[var(--ink-1)]">
            {sessions.length}
          </div>
          <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] mt-2">
            TOTAL SESSIONS
          </div>
        </div>
        <div className="text-center border-r border-[var(--rule)]">
          <div className="font-display text-[clamp(1.8rem,3vw,2.5rem)] text-[var(--ink-1)]">
            {totalHours}h
          </div>
          <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] mt-2">
            TOTAL TIME LOGGED
          </div>
        </div>
        <div className="text-center">
          <div className="font-display text-[clamp(1.8rem,3vw,2.5rem)] text-[var(--ink-1)]">
            {skills.reduce((acc, s) => acc + (s.total_xp || 0), 0)}
          </div>
          <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] mt-2">
            TOTAL XP EARNED
          </div>
        </div>
      </div>
    </div>
  )
}
