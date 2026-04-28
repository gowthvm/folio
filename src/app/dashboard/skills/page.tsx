import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCategoryEmoji, calculateProgress, formatDate } from '@/lib/utils'
import { Flame, Plus, Target, Clock } from 'lucide-react'
import { redirect } from 'next/navigation'
import { BlockProgress } from '@/components/ui/block-progress'
import { StatusStamp } from '@/components/ui/stamp'
import { EditorsNote } from '@/components/ui/editors-note'
import { QuickActionsBar } from '@/components/ui/quick-actions-bar'
import { ClassifiedsPanel } from '@/components/ui/classifieds-panel'
import { ThisWeekFocus } from '@/components/ui/this-week-focus'
import { ActivityFeed } from '@/components/ui/activity-feed'
import { StreakWidget } from '@/components/ui/streak-widget'
import { NotificationBell } from '@/components/ui/notification-bell'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { SkillsGridSkeleton } from '@/components/ui/skill-card-skeleton'
import { QuickStartTemplates } from '@/components/ui/quick-start-templates'
import { SkillsGridClient } from '@/components/dashboard/skills-grid-client'

export default async function SkillsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all skills with milestones
  const { data: skills } = await supabase
    .from('skills')
    .select(`
      *,
      milestones (*)
    `)
    .eq('user_id', user.id)
    .is('archived_at', null)
    .order('created_at', { ascending: false })

  // Fetch sessions for stats
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, duration_minutes, note, created_at, milestone_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Calculate stats
  const totalSkills = skills?.length || 0
  const totalMilestones = skills?.reduce((acc, skill) => acc + (skill.milestones?.length || 0), 0) || 0
  const completedMilestones = skills?.reduce((acc, skill) => 
    acc + (skill.milestones?.filter((m: { status: string }) => m.status === 'completed').length || 0), 0) || 0
  const totalSessions = sessions?.length || 0
  const totalMinutes = sessions?.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) || 0
  const totalHours = Math.round(totalMinutes / 60 * 10) / 10

  // Motivational quotes for pull quote
  const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "MARK TWAIN" },
    { text: "A journey of a thousand miles begins with a single step.", author: "LAO TZU" },
    { text: "The only way to do great work is to love what you do.", author: "STEVE JOBS" },
    { text: "Success is not final, failure is not fatal.", author: "WINSTON CHURCHILL" },
    { text: "Believe you can and you're halfway there.", author: "THEODORE ROOSEVELT" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "ELEANOR ROOSEVELT" },
  ]
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <div className="space-y-[var(--space-7)]">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Skills' }]} />
      
      {/* Header */}
      <div className="flex items-center justify-between pb-[var(--space-6)] border-b border-[var(--rule)]">
        <div>
          <h1 className="font-display text-[var(--text-headline)] font-normal text-[var(--ink-1)]">Your Skills</h1>
          <p className="font-ui text-[var(--text-caption)] text-[var(--ink-3)] mt-[var(--space-2)]">
            {totalSkills} active skills · {completedMilestones}/{totalMilestones} milestones completed
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StreakWidget streak={skills ? Math.max(...skills.map(s => s.streak_count || 0), 0) : 0} />
          <NotificationBell />
          <Link
            href="/dashboard/skills/new"
            className="flex items-center gap-[var(--space-2)] px-[var(--space-4)] py-[var(--space-3)] bg-[var(--ink-primary)] text-[var(--paper-primary)] hover:bg-[var(--ink-secondary)] dark:bg-[var(--paper-primary)] dark:text-[var(--ink-primary)] dark:hover:bg-[var(--paper-secondary)] transition-colors font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] active:translate-y-[1px]"
          >
            <Plus className="w-4 h-4" />
            New Skill
          </Link>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <QuickActionsBar />

      {/* Two-column layout with sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Main content */}
        <div className="space-y-[var(--space-7)]">
          {/* Skills Grid - Multi-column newspaper layout with search/filter */}
          {skills && skills.length > 0 ? (
            <>
              <SkillsGridClient skills={skills} />

              {/* Mini stats row below skills */}
              <div className="newspaper-rule-thick my-[var(--space-6)]" />
              <div className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] uppercase tracking-[0.15em] text-center mb-[var(--space-3)]">
                YOUR STATISTICS AT A GLANCE
              </div>
              <div className="newspaper-rule-thick mb-[var(--space-6)]" />
              <div className="stats-bar">
                <div className="stats-cell">
                  <span className="stats-label">TOTAL SESSIONS</span>
                  <span className="stats-value">{totalSessions}</span>
                </div>
                <div className="stats-cell">
                  <span className="stats-label">TOTAL TIME LOGGED</span>
                  <span className="stats-value">{totalHours}h</span>
                </div>
                <div className="stats-cell">
                  <span className="stats-label">SKILLS COMPLETED</span>
                  <span className="stats-value">{skills.filter(s => calculateProgress(s.milestones || []) === 100).length}</span>
                </div>
                <div className="stats-cell">
                  <span className="stats-label">LONGEST STREAK EVER</span>
                  <span className="stats-value">{Math.max(...skills.map(s => s.streak_count || 0), 0)}</span>
                </div>
              </div>

              {/* Latest dispatches section */}
              <div className="newspaper-rule-thick my-[var(--space-6)]" />
              <div className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] uppercase tracking-[0.15em] text-center mb-[var(--space-3)]">
                LATEST DISPATCHES
              </div>
              <div className="newspaper-rule-thick mb-[var(--space-6)]" />
              {sessions && sessions.length > 0 ? (
                <div className="space-y-3">
                  {sessions.map((session: any) => {
                    const skill = skills?.find((s: any) => s.milestones?.some((m: any) => m.id === session.milestone_id))
                    const milestone = skill?.milestones?.find((m: any) => m.id === session.milestone_id)
                    return (
                      <div key={session.id} className="py-2 border-b border-[var(--rule)]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-ui text-[0.65rem] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                            {milestone?.title || 'Unknown'}
                          </span>
                          <span className="font-ui text-[0.65rem] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                            {formatDate(session.created_at)}
                          </span>
                        </div>
                        {session.note && (
                          <p className="font-body text-[var(--text-caption)] text-[var(--ink-3)]">
                            {session.note}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="font-ui text-[var(--text-body)] text-[var(--ink-4)] italic text-center">
                  No dispatches filed. Log your first session to see it here.
                </div>
              )}
            </>
          ) : (
          <>
            {/* Empty state - two-column newspaper layout with sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
              {/* LEFT COLUMN - Featured Story */}
              <div>
                <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
                  FEATURED STORY
                </div>
                <div className="newspaper-rule mb-[var(--space-4)]" />
                <h2 className="font-display italic text-[clamp(1.8rem,3.5vw,2.8rem)] text-[var(--ink-1)] mb-[var(--space-4)]">
                  No stories filed yet.
                </h2>
                <p className="font-body text-[0.9rem] text-[var(--ink-2)] max-w-[52ch] leading-[1.85] mb-[var(--space-4)]">
                  Folio turns your goals into structured records — milestones, sessions, and progress you can trace back to the first note. Every expert has a Vol. I. Yours starts here.
                </p>
                <div className="w-[80px] h-[1px] bg-[var(--rule)] mb-[var(--space-4)]" />
                <Link
                  href="/dashboard/skills/new"
                  className="font-ui text-[0.7rem] text-[var(--ink-1)] uppercase tracking-[0.1em] hover:underline"
                >
                  FILE YOUR FIRST STORY →
                </Link>
                
                {/* Pull quote */}
                <div className="mt-[var(--space-6)] border-l-[3px] border-[var(--ink-1)] pl-[var(--space-4)]">
                  <p className="font-display italic text-[1.1rem] text-[var(--ink-2)] mb-2">
                    &ldquo;{randomQuote.text}&rdquo;
                  </p>
                  <p className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.1em]">
                    — {randomQuote.author}
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN - Quick Start Templates */}
              <div>
                <QuickStartTemplates />
              </div>

              {/* Sidebar for empty state */}
              <div className="space-y-6">
                <EditorsNote />
                <ClassifiedsPanel />
              </div>
            </div>
          </>
        )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <EditorsNote />
          <ThisWeekFocus />
          <ClassifiedsPanel />
          <ActivityFeed limit={5} />
        </div>
      </div>
    </div>
  )
}
