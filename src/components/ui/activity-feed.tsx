'use client'

import { createClient } from '@/lib/supabase/client'
import useSWR from 'swr'
import { Clock, Award, Flame, BookOpen } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ActivityFeedProps {
  className?: string
  limit?: number
}

interface Activity {
  id: string
  type: 'session' | 'milestone' | 'streak' | 'skill'
  title: string
  description: string
  timestamp: string
  icon: any
}

export function ActivityFeed({ className = '', limit = 5 }: ActivityFeedProps) {
  const { data: activities } = useSWR('activity-feed', async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return []
    
    // Fetch recent sessions and milestones
    const [sessionsRes, milestonesRes, skillsRes] = await Promise.all([
      supabase
        .from('sessions')
        .select('id, created_at, note, duration_minutes, milestone_id, skill_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('milestones')
        .select('id, title, status, completed_at, skill_id')
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(10),
      supabase
        .from('skills')
        .select('id, title, streak_count, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
    ])
    
    const activities: Activity[] = []
    
    // Add session activities
    sessionsRes.data?.forEach(session => {
      activities.push({
        id: `session-${session.id}`,
        type: 'session',
        title: 'Session Logged',
        description: session.note || `${session.duration_minutes} minutes practiced`,
        timestamp: session.created_at,
        icon: BookOpen
      })
    })
    
    // Add milestone activities
    milestonesRes.data?.forEach(milestone => {
      activities.push({
        id: `milestone-${milestone.id}`,
        type: 'milestone',
        title: 'Milestone Complete',
        description: milestone.title,
        timestamp: milestone.completed_at,
        icon: Award
      })
    })
    
    // Add skill activities
    skillsRes.data?.forEach(skill => {
      if (skill.streak_count >= 3) {
        activities.push({
          id: `streak-${skill.id}`,
          type: 'streak',
          title: 'Streak Update',
          description: `${skill.title}: ${skill.streak_count} day streak`,
          timestamp: skill.created_at,
          icon: Flame
        })
      }
    })
    
    // Sort by timestamp and limit
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  })

  if (!activities || activities.length === 0) {
    return (
      <div className={`bg-[var(--surface-card)] border border-[var(--border-default)] p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-[var(--ink-tertiary)]" />
          <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em]">
            RECENT ACTIVITY
          </span>
        </div>
        <div className="newspaper-rule mb-3" />
        <p className="font-body text-[var(--text-body)] text-[var(--ink-tertiary)] italic text-center">
          No recent activity. Start tracking to see your feed here.
        </p>
      </div>
    )
  }

  return (
    <div className={`bg-[var(--surface-card)] border border-[var(--border-default)] p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-[var(--ink-tertiary)]" />
        <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em]">
          RECENT ACTIVITY
        </span>
      </div>
      <div className="newspaper-rule mb-3" />
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-[var(--paper-secondary)] border border-[var(--border-default)]">
              <div className="mt-0.5">
                <Icon className="w-4 h-4 text-[var(--ink-secondary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-ui text-[0.65rem] text-[var(--ink-tertiary)] uppercase tracking-wider">
                  {activity.title}
                </span>
                <p className="font-body text-[var(--text-caption)] text-[var(--ink-secondary)] mt-1 line-clamp-2">
                  {activity.description}
                </p>
                <span className="font-ui text-[0.55rem] text-[var(--ink-tertiary)] uppercase tracking-wider mt-2 block">
                  {formatDate(activity.timestamp)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
