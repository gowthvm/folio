'use client'

import { useState, useCallback, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  ArrowLeft, Clock, ChevronDown, X, Plus, CheckCircle2, Flame, Lock
} from 'lucide-react'
import { getCategoryEmoji } from '@/lib/utils'
import { StatusStamp } from '@/components/ui/stamp'
import { TypewriterText } from '@/components/ui/typewriter-text'
import { Button } from '@/components/ui/button'
import { formatDateShort } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Skill, Milestone, Session, Insert, Update } from '@/types/database'
import useSWR from 'swr'
import { BlockProgress } from '@/components/ui/block-progress'

// Lazy load confetti for better performance
const loadConfetti = async () => {
  const confetti = await import('canvas-confetti')
  return confetti
}

interface SkillWithMilestones extends Skill {
  milestones?: (Milestone & { sessions?: Session[] })[]
}

interface SkillDetailClientProps {
  skillId: string
  initialSkill: SkillWithMilestones
}


const moods = [
  { value: 'great', label: 'GREAT' },
  { value: 'okay', label: 'OKAY' },
  { value: 'struggled', label: 'STRUGGLED' },
]

function calculateProgress(milestones: Milestone[] = []): number {
  if (milestones.length === 0) return 0
  
  const allComplete = milestones.every(m => m.status === 'completed')
  if (allComplete) return 100
  
  return Math.round(
    milestones
      .filter(m => m.status === 'completed')
      .reduce((sum, m) => sum + m.weight_percent, 0)
  )
}

function getDaysRemaining(targetDate: string | null): { days: number; isOverdue: boolean } {
  if (!targetDate) return { days: 0, isOverdue: false }
  const target = new Date(targetDate)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return { days: Math.abs(days), isOverdue: days < 0 }
}

// Convert milestone status to stamp variant
function getMilestoneStampStatus(status: string): 'not_started' | 'in_progress' | 'completed' {
  switch (status) {
    case 'completed': return 'completed'
    case 'in_progress': return 'in_progress'
    default: return 'not_started'
  }
}

// Generate redacted text by replacing characters with block characters
function redactedText(text: string): string {
  return '░'.repeat(text.length)
}

// Helper functions for milestone styling (for backward compatibility)
function getMilestoneStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'bg-[var(--accent-green)] text-[var(--bg)] border-[var(--accent-green)]'
    case 'in_progress': return 'bg-[var(--ink-1)] text-[var(--bg)] border-[var(--ink-1)] dark:bg-[var(--ink-1)] dark:text-[var(--bg)]'
    default: return 'bg-transparent text-[var(--ink-3)] border-[var(--rule)] dark:text-[var(--ink-3)] dark:border-[var(--rule)]'
  }
}

function getMilestoneStatusLabel(status: string): string {
  switch (status) {
    case 'completed': return 'DONE'
    case 'in_progress': return 'IN PROGRESS'
    default: return 'NOT STARTED'
  }
}

export function SkillDetailClient({ skillId, initialSkill }: SkillDetailClientProps) {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null)
  const [showSessionForm, setShowSessionForm] = useState<string | null>(null)
  const [completingMilestone, setCompletingMilestone] = useState<string | null>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)
  
  const { data: skill, mutate } = useSWR(
    `skill-${skillId}`,
    async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('skills')
        .select(`*, milestones (*, sessions (*))`)
        .eq('id', skillId)
        .single()
      return (data as unknown) as SkillWithMilestones | null
    },
    { fallbackData: initialSkill, refreshInterval: 5000 }
  )

  const { data: relatedSkills } = useSWR(
    skill ? `related-skills-${skillId}` : null,
    async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !skill) return []

      const { data } = await supabase
        .from('skills')
        .select('id, title, category, milestones(status)')
        .eq('user_id', user.id)
        .neq('id', skillId)
        .is('archived_at', null)
        .limit(3)

      return data || []
    }
  )

  const milestones = skill?.milestones || []
  const progress = calculateProgress(milestones)
  const emoji = skill?.cover_emoji || getCategoryEmoji(skill?.category || 'other')
  const { days, isOverdue } = getDaysRemaining(skill?.target_date || null)
  
  const totalWeight = milestones.reduce((sum, m) => sum + m.weight_percent, 0)
  const hasWeightError = totalWeight !== 100

  const handleLogSession = async (
    milestoneId: string,
    data: { note: string; mood: string | null; duration: number | null; markComplete: boolean }
  ) => {
    setSessionError(null)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    // Optimistic update - create optimistic data
    const optimisticSession: Insert<'sessions'> = {
      milestone_id: milestoneId,
      user_id: user.id,
      note: data.note || null,
      mood: data.mood as 'great' | 'okay' | 'struggled' | null,
      duration_minutes: data.duration,
      created_at: new Date().toISOString(),
      id: `optimistic-${Date.now()}`,
    }

    // Optimistic milestone update if marking complete
    const optimisticMilestoneUpdate = data.markComplete ? {
      status: 'completed' as const,
      completed_at: new Date().toISOString(),
    } : undefined

    // Optimistic next milestone unlock
    const currentIdx = milestones.findIndex(m => m.id === milestoneId)
    const nextMilestoneId = currentIdx >= 0 && currentIdx < milestones.length - 1 
      ? milestones[currentIdx + 1].id 
      : null
    const optimisticUnlock = nextMilestoneId ? { is_locked: false } : undefined

    // Apply optimistic update
    mutate(
      (currentSkill: SkillWithMilestones | null | undefined) => {
        if (!currentSkill) return null

        const updatedMilestones = (currentSkill.milestones || []).map(m => {
          if (m.id === milestoneId) {
            return {
              ...m,
              status: optimisticMilestoneUpdate?.status || m.status,
              completed_at: optimisticMilestoneUpdate?.completed_at || m.completed_at,
              sessions: [
                ...(m.sessions || []),
                optimisticSession as any
              ]
            }
          }
          if (nextMilestoneId && m.id === nextMilestoneId) {
            return {
              ...m,
              is_locked: false
            }
          }
          return m
        })

        return {
          ...currentSkill,
          milestones: updatedMilestones
        }
      },
      {
        optimisticData: (currentSkill: SkillWithMilestones | null | undefined) => {
          if (!currentSkill) return null

          const updatedMilestones = (currentSkill.milestones || []).map(m => {
            if (m.id === milestoneId) {
              return {
                ...m,
                status: optimisticMilestoneUpdate?.status || m.status,
                completed_at: optimisticMilestoneUpdate?.completed_at || m.completed_at,
                sessions: [
                  ...(m.sessions || []),
                  optimisticSession as any
                ]
              }
            }
            if (nextMilestoneId && m.id === nextMilestoneId) {
              return {
                ...m,
                is_locked: false
              }
            }
            return m
          })

          return {
            ...currentSkill,
            milestones: updatedMilestones
          }
        },
        rollbackOnError: true,
        revalidate: false
      }
    )

    // Actual API call
    const sessionData: Insert<'sessions'> = {
      milestone_id: milestoneId,
      user_id: user.id,
      note: data.note || null,
      mood: data.mood as 'great' | 'okay' | 'struggled' | null,
      duration_minutes: data.duration,
    }

    const { error: sessionError } = await supabase
      .from('sessions')
      .insert(sessionData)

    if (sessionError) {
      setSessionError('Failed to log session. Please try again.')
      setTimeout(() => setSessionError(null), 5000)
      mutate() // Rollback on error
      return
    }

    if (data.markComplete) {
      setCompletingMilestone(milestoneId)

      const milestoneUpdate: Update<'milestones'> = {
        status: 'completed',
        completed_at: new Date().toISOString(),
      }

      const { error: updateError } = await supabase
        .from('milestones')
        .update(milestoneUpdate)
        .eq('id', milestoneId)

      if (!updateError) {
        loadConfetti().then((confetti) => {
          confetti.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#1A1A1A', '#8B0000', '#D1C0A8', '#F5F0E8']
          })
        })
        
        if (nextMilestoneId) {
          const unlockUpdate: Update<'milestones'> = {
            is_locked: false,
          }
          await supabase
            .from('milestones')
            .update(unlockUpdate)
            .eq('id', nextMilestoneId)
        }
      } else {
        mutate() // Rollback on error
      }
      
      setTimeout(() => setCompletingMilestone(null), 3000)
    }

    // Close form and collapse accordion after submit
    setShowSessionForm(null)
    setExpandedMilestone(null)
    
    mutate() // Revalidate to get fresh data
  }

  const toggleExpand = (milestoneId: string) => {
    setExpandedMilestone(expandedMilestone === milestoneId ? null : milestoneId)
    setShowSessionForm(null)
  }

  // Calculate segments for segmented progress bar
  const sortedMilestones = [...milestones].sort((a, b) => a.order_index - b.order_index)
  const progressSegments = sortedMilestones.map(m => ({
    percent: m.weight_percent,
    completed: m.status === 'completed',
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8">
      {/* LEFT COLUMN (65%) - Main Content */}
      <div className="space-y-6">
        {/* Weight validation warning */}
        {hasWeightError && (
          <div className="p-3 bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--rule)] dark:border-[var(--rule)]">
            <p className="font-body text-xs text-[var(--accent-red)] dark:text-[var(--accent-red)] uppercase tracking-wider">
              <span className="font-bold">CORRECTION:</span> Milestone weights do not sum to 100% (currently {totalWeight}%)
            </p>
          </div>
        )}

        {/* Session error message */}
        {sessionError && (
          <div className="p-3 bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--accent-red)] dark:border-[var(--accent-red)]">
            <p className="font-body text-xs text-[var(--accent-red)] dark:text-[var(--accent-red)] uppercase tracking-wider">
              <span className="font-bold">ERROR:</span> {sessionError}
            </p>
          </div>
        )}

        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 font-body text-sm text-[var(--ink-3)] hover:text-[var(--ink-2)] transition-colors"
          data-pressable
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Skill Header Block */}
        <div className="relative">
          {/* Category label */}
          <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
            {skill?.category}
          </div>
          <div className="newspaper-rule mb-[var(--space-4)]" />
          
          {/* Skill title */}
          <h1 className="font-display italic text-[clamp(1.8rem,3vw,2.5rem)] text-[var(--ink-1)] mb-[var(--space-3)]">
            {skill?.title}
          </h1>
          
          {/* Byline */}
          <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-3)] font-ui text-[var(--text-caption)] text-[var(--ink-3)] uppercase tracking-[0.08em]">
            <span>BY YOU</span>
            <span>·</span>
            <span>{skill?.streak_count || 0} DAY STREAK</span>
            <span>·</span>
            <span>{skill?.total_xp || 0} XP</span>
            {skill?.target_date && (
              <>
                <span>·</span>
                <span className={isOverdue ? 'text-[var(--accent-red)]' : ''}>
                  {isOverdue ? `${days} DAYS OVERDUE` : `TARGET: ${days} DAYS`}
                </span>
              </>
            )}
          </div>
          <div className="newspaper-rule mb-[var(--space-4)]" />
          
          {/* Large watermark percentage */}
          <div className="relative h-[clamp(4rem,8vw,7rem)] mb-[var(--space-4)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[clamp(4rem,8vw,7rem)] text-[var(--ink-4)] opacity-[0.15] leading-none">
                {progress}%
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mb-[var(--space-4)]">
            <BlockProgress progress={progress} totalBlocks={10} />
          </div>
          <div className="newspaper-rule" />
        </div>

        {/* Milestone List */}
        <div>
          <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
            MILESTONES
          </div>
          <div className="newspaper-rule mb-[var(--space-4)]" />
          
          {sortedMilestones.map((milestone, index) => {
          const isExpanded = expandedMilestone === milestone.id
          const isCompleting = completingMilestone === milestone.id
          const sessions = milestone.sessions || []
          const isLocked = milestone.is_locked
          const isCompleted = milestone.status === 'completed'

          return (
            <motion.article
              key={milestone.id}
              initial={false}
              layout
              className={cn(
                'relative py-[var(--space-4)]',
                isCompleted && 'sepia-wash',
                isLocked && 'opacity-60'
              )}
            >
              {/* Milestone header - always visible */}
              <button
                type="button"
                onClick={() => !isLocked && toggleExpand(milestone.id)}
                disabled={isLocked}
                className={cn(
                  'w-full text-left',
                  !isLocked && 'hover:bg-[var(--paper-secondary)] transition-colors',
                  !isLocked && 'focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[var(--ink-primary)]'
                )}
                data-pressable
              >
                <div className="flex items-start gap-4">
                  {/* Status stamp */}
                  <div className="flex-shrink-0">
                    <StatusStamp 
                      status={getMilestoneStampStatus(milestone.status)}
                      className="w-16 h-16"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Article-style headline */}
                    <h3 className={cn(
                      'font-display text-[var(--text-headline)] font-style-italic text-[var(--ink-primary)]',
                      isLocked && 'redacted',
                      isCompleted && 'text-[var(--ink-tertiary)]'
                    )}>
                      {isLocked ? redactedText(milestone.title) : milestone.title}
                    </h3>
                    
                    {/* Byline-style metadata */}
                    <div className="flex items-center gap-3 mt-2 font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] uppercase tracking-[0.08em]">
                      <span>{milestone.weight_percent}% WEIGHT</span>
                      {milestone.estimated_minutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {milestone.estimated_minutes} MIN
                        </span>
                      )}
                      {sessions.length > 0 && (
                        <span>{sessions.length} SESSIONS</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isLocked && <Lock className="w-4 h-4 text-[var(--ink-tertiary)]" />}
                    {!isLocked && (
                      <ChevronDown className={cn(
                        'w-5 h-5 text-[var(--ink-tertiary)] transition-transform',
                        isExpanded && 'rotate-180'
                      )} />
                    )}
                  </div>
                </div>

                {/* Thin rule below header */}
                <div className="newspaper-rule mt-[var(--space-4)]" />
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && !isLocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 border-t border-[var(--rule)] dark:border-[var(--rule)] bg-[var(--surface)]/50 dark:bg-[var(--surface)]/30">
                      {/* Session history - sorted newest first */}
                      {sessions.length > 0 && (
                        <div className="mb-[var(--space-4)] space-y-[var(--space-2)]">
                          <h4 className="font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] text-[var(--ink-tertiary)]">Session History</h4>
                          {[...sessions]
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .map((session) => (
                            <div
                              key={session.id}
                              className="p-[var(--space-2)] bg-[var(--surface-card)] border border-[var(--border-default)]"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-ui text-[var(--text-caption)] tabular-nums">{formatDateShort(session.created_at)}</span>
                                {session.mood && (
                                  <span className="font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] text-[var(--ink-tertiary)]">
                                    {moods.find(m => m.value === session.mood)?.label}
                                  </span>
                                )}
                              </div>
                              {session.note && (
                                <p className="font-body text-[var(--text-caption)] text-[var(--ink-tertiary)] mt-1">{session.note}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Log session button or form */}
                      {!showSessionForm ? (
                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowSessionForm(milestone.id)
                            }}
                            variant="outline"
                            size="sm"
                            className="font-body text-xs"
                            data-pressable
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Log Session
                          </Button>
                          
                          {!isCompleted && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleLogSession(milestone.id, { note: '', mood: null, duration: null, markComplete: true })
                              }}
                              size="sm"
                              className="font-body text-xs bg-[var(--accent-green)] hover:opacity-80"
                              data-pressable
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      ) : (
                        <SessionForm
                          onSubmit={(data) => handleLogSession(milestone.id, data)}
                          onCancel={() => setShowSessionForm(null)}
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          )
        })}
        <div className="newspaper-rule" />
      </div>

      {/* Session Log (below milestones) */}
      <div>
        <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
          SESSION LOG
        </div>
        <div className="newspaper-rule mb-[var(--space-4)]" />
        
        {/* All sessions across all milestones, sorted newest first */}
        {(() => {
          const allSessions = milestones.flatMap(m => 
            (m.sessions || []).map(s => ({ ...s, milestoneTitle: m.title, milestoneId: m.id }))
          ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

          if (allSessions.length === 0) {
            return (
              <div className="font-ui text-[var(--text-body)] text-[var(--ink-4)] italic text-center py-[var(--space-6)]">
                No dispatches yet. Log your first session above.
              </div>
            )
          }

          return allSessions.map((session, idx) => (
            <div key={session.id} className="mb-[var(--space-4)]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                  {session.milestoneTitle}
                </span>
                <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                  {formatDateShort(session.created_at)}
                </span>
              </div>
              {session.note && (
                <p className="font-body text-[0.88rem] text-[var(--ink-2)] mb-1">
                  {session.note}
                </p>
              )}
              {session.mood && (
                <span className={cn(
                  'font-ui text-[0.6rem] uppercase tracking-[0.08em]',
                  session.mood === 'great' && 'text-[var(--accent-green)]',
                  session.mood === 'struggled' && 'text-[var(--accent-red)]',
                  session.mood === 'okay' && 'text-[var(--ink-2)]'
                )}>
                  {moods.find(m => m.value === session.mood)?.label}
                </span>
              )}
              {idx < allSessions.length - 1 && <div className="newspaper-rule mt-[var(--space-3)]" />}
            </div>
          ))
        })()}
      </div>
      </div>

      {/* RIGHT COLUMN (35%) - Sidebar Content */}
      <div className="space-y-6 lg:border-l lg:border-[var(--rule)] lg:pl-8">
        {/* Block 1 - Skill Stats */}
        <div>
          <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
            SKILL STATS
          </div>
          <div className="newspaper-rule mb-[var(--space-4)]" />
          
          <div className="space-y-0">
            <div className="py-[var(--space-3)] border-b border-[var(--rule)]">
              <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] mb-1">
                SESSIONS LOGGED
              </div>
              <div className="font-ui text-[1.3rem] text-[var(--ink-1]">
                {milestones.reduce((acc, m) => acc + (m.sessions?.length || 0), 0)}
              </div>
            </div>
            <div className="py-[var(--space-3)] border-b border-[var(--rule)]">
              <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] mb-1">
                TOTAL TIME
              </div>
              <div className="font-ui text-[1.3rem] text-[var(--ink-1)]">
                {milestones.reduce((acc, m) => acc + (m.sessions?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0), 0)}m
              </div>
            </div>
            <div className="py-[var(--space-3)] border-b border-[var(--rule)]">
              <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] mb-1">
                XP EARNED
              </div>
              <div className="font-ui text-[1.3rem] text-[var(--ink-1)]">
                {skill?.total_xp || 0}
              </div>
            </div>
            <div className="py-[var(--space-3)]">
              <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] mb-1">
                DAYS ACTIVE
              </div>
              <div className="font-ui text-[1.3rem] text-[var(--ink-1)]">
                {skill?.streak_count || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Block 2 - Milestone Progress */}
        <div>
          <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
            MILESTONE BREAKDOWN
          </div>
          <div className="newspaper-rule mb-[var(--space-4)]" />
          
          <div className="space-y-0">
            {sortedMilestones.map((m, idx) => {
              const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
              const sessionCount = m.sessions?.length || 0
              const estimatedMinutes = m.estimated_minutes || 60
              const mProgress = m.status === 'completed' ? 100 : Math.min(Math.round((sessionCount * 30 / estimatedMinutes) * 100), 99)
              const blocks = '■'.repeat(Math.floor(mProgress / 10)) + '□'.repeat(10 - Math.floor(mProgress / 10))
              return (
                <div key={m.id} className="py-2 border-b border-[var(--rule)] font-ui text-[0.7rem] text-[var(--ink-2)]">
                  <span className="text-[var(--ink-4)] mr-2">{romanNumerals[idx] || idx + 1}.</span>
                  <span className="truncate max-w-[20ch] inline-block align-middle">{m.title}</span>
                  <span className="ml-2 font-mono text-xs">{blocks}</span>
                  <span className="ml-1">{mProgress}%</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Block 3 - Streak Calendar */}
        <div>
          <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
            THIS MONTH
          </div>
          <div className="newspaper-rule mb-[var(--space-4)]" />
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
              <div key={day} className="font-ui text-[0.55rem] text-[var(--ink-4)] text-center py-1">
                {day}
              </div>
            ))}
            {(() => {
              const now = new Date()
              const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
              const startDay = firstDay.getDay()
              const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
              const hasSession = (day: number) => {
                const date = new Date(now.getFullYear(), now.getMonth(), day)
                return milestones.some(m => 
                  m.sessions?.some(s => 
                    new Date(s.created_at).toDateString() === date.toDateString()
                  )
                )
              }
              
              const blanks = Array(startDay === 0 ? 6 : startDay - 1).fill(null)
              const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
              
              return [...blanks, ...days].map((day, idx) => {
                if (day === null) {
                  return <div key={`blank-${idx}`} />
                }
                const isToday = day === now.getDate()
                const hasSessionDay = hasSession(day)
                return (
                  <div
                    key={day}
                    className={cn(
                      'font-ui text-[0.65rem] text-center py-1',
                      hasSessionDay ? 'bg-[var(--ink-1)] text-[var(--bg)]' : 'text-[var(--ink-3)]',
                      isToday && 'border border-[var(--ink-1)]'
                    )}
                  >
                    {day}
                  </div>
                )
              })
            })()}
          </div>
        </div>

        {/* Block 4 - Related Skills */}
        <div>
          <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
            OTHER STORIES
          </div>
          <div className="newspaper-rule mb-[var(--space-4)]" />

          {relatedSkills && relatedSkills.length > 0 ? (
            <div className="space-y-3">
              {relatedSkills.map((relatedSkill: any) => {
                const relatedProgress = calculateProgress(relatedSkill.milestones || [])
                return (
                  <Link
                    key={relatedSkill.id}
                    href={`/dashboard/skills/${relatedSkill.id}`}
                    className="block py-2 border-b border-[var(--rule)] hover:bg-[var(--surface)] transition-colors"
                  >
                    <div className="font-ui text-[0.65rem] text-[var(--ink-4)] uppercase tracking-[0.08em] mb-1">
                      {relatedSkill.category}
                    </div>
                    <div className="font-display text-sm text-[var(--ink-1)] leading-tight">
                      {relatedSkill.title}
                    </div>
                    <div className="font-ui text-[0.65rem] text-[var(--ink-3)] mt-1">
                      {relatedProgress}% complete
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="font-body text-[0.8rem] text-[var(--ink-4)] italic">
              No other stories in progress.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Session form component
function SessionForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: { note: string; mood: string | null; duration: number | null; markComplete: boolean }) => void
  onCancel: () => void
}) {
  const [note, setNote] = useState('')
  const [mood, setMood] = useState<string>('okay') // Default to 'okay'
  const [duration, setDuration] = useState('')
  const [markComplete, setMarkComplete] = useState(false)
  const [noteError, setNoteError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    // Validate note - reject whitespace-only
    const trimmedNote = note.trim()
    if (note.length > 0 && trimmedNote.length === 0) {
      setNoteError('Notes cannot be empty.')
      return
    }
    
    // Validate duration if provided
    if (duration && (parseInt(duration) < 0 || isNaN(parseInt(duration)))) {
      setNoteError('Duration must be a positive number.')
      return
    }
    
    setNoteError(null)
    setIsSubmitting(true)
    
    try {
      await onSubmit({
        note: trimmedNote,
        mood,
        duration: duration ? parseInt(duration) : null,
        markComplete
      })
      
      // Clear form after successful submit
      setNote('')
      setMood('okay')
      setDuration('')
      setMarkComplete(false)
    } catch (error) {
      setNoteError('Failed to submit session. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-[var(--space-4)] bg-[var(--paper-secondary)]">
      <div className="flex items-center justify-between mb-[var(--space-4)]">
        <h4 className="font-display text-[var(--text-caption)] uppercase tracking-[0.15em] text-[var(--ink-primary)]">Log Session</h4>
        <button 
          onClick={onCancel} 
          className="font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[var(--ink-secondary)]"
          data-pressable
        >
          CANCEL
        </button>
      </div>

      {/* Mood selector - text-based radio buttons */}
      <fieldset className="mb-[var(--space-4)]">
        <legend className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] mb-[var(--space-2)] uppercase tracking-[0.08em]">How did it go?</legend>
        <div className="flex gap-[var(--space-4)]" role="radiogroup" aria-label="Session mood">
          {moods.map((m) => (
            <label key={m.value} className="cursor-pointer">
              <input
                type="radio"
                name="mood"
                value={m.value}
                checked={mood === m.value}
                onChange={(e) => setMood(e.target.value)}
                className="checkbox-key"
              />
              <span className="font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] ml-2">{m.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Notes - typewritten textarea with ruled lines */}
      <div className="mb-[var(--space-4)]">
        <label className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] mb-[var(--space-2)] block uppercase tracking-[0.08em]">Notes</label>
        <textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value)
            setNoteError(null)
          }}
          placeholder="Type your notes here..."
          rows={3}
          className={`typewritten-input session-textarea ${noteError ? 'border-b-2 border-[var(--accent-red)]' : ''}`}
          disabled={isSubmitting}
        />
        {noteError && (
          <p className="font-ui text-[var(--text-caption)] text-[var(--accent-red)] mt-[var(--space-2)] font-semibold">
            {noteError}
          </p>
        )}
      </div>

      {/* Duration - typewritten input */}
      <div className="mb-[var(--space-4)]">
        <label className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] mb-[var(--space-2)] block uppercase tracking-[0.08em]">Duration (minutes)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => {
            setDuration(e.target.value)
            setNoteError(null)
          }}
          placeholder="0"
          min="0"
          className="typewritten-input w-20 tabular-nums"
          disabled={isSubmitting}
        />
      </div>

      {/* Mark complete - text checkbox */}
      <label className="flex items-center gap-[var(--space-2)] mb-[var(--space-4)] cursor-pointer">
        <input
          type="checkbox"
          checked={markComplete}
          onChange={(e) => setMarkComplete(e.target.checked)}
          className="checkbox-key"
        />
        <span className="font-ui text-[var(--text-caption)] uppercase tracking-[0.08em]">Mark milestone as complete</span>
      </label>

      {/* Submit - text-based button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full py-[var(--space-3)] font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] text-[var(--ink-primary)] border-b-2 border-[var(--ink-primary)] hover:bg-[var(--paper-tertiary)] transition-colors focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[var(--ink-primary)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        data-pressable
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  )
}
