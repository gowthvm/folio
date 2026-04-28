'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SkillCard } from '@/components/dashboard/skill-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { InkFab } from '@/components/ui/ink-fab'
import { SkillCreationModal } from '@/components/skill/skill-creation-modal'
import useSWR from 'swr'
import type { Skill, Milestone } from '@/types/database'

interface SkillWithMilestones extends Skill {
  milestones?: Milestone[]
}

const fetcher = async (): Promise<SkillWithMilestones[]> => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from('skills')
    .select(`*, milestones (*)`)
    .eq('user_id', user.id)
    .is('archived_at', null)
    .order('created_at', { ascending: false })

  return data || []
}

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: skills, mutate } = useSWR('skills', fetcher, { refreshInterval: 5000 })

  const activeSkills = skills?.length || 0
  const totalXP = skills?.reduce((acc: number, skill: SkillWithMilestones) => acc + (skill.total_xp || 0), 0) || 0
  const bestStreak = Math.max(...(skills?.map((s: SkillWithMilestones) => s.streak_count || 0) || [0]))

  const handleSkillCreated = () => {
    mutate()
    setIsModalOpen(false)
  }

  return (
    <div>
      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stats-cell">
          <span className="stats-label">Active Skills</span>
          <span className="stats-value">{activeSkills}</span>
        </div>
        <div className="stats-cell">
          <span className="stats-label">Best Streak</span>
          <span className="stats-value">{bestStreak}</span>
        </div>
        <div className="stats-cell">
          <span className="stats-label">Total XP</span>
          <span className="stats-value">{totalXP}</span>
        </div>
      </div>

      {skills && skills.length > 0 ? (
        <div className="newspaper-columns mt-[var(--space-6)]">
          {skills.map((skill: SkillWithMilestones, idx: number) => (
            <SkillCard key={skill.id} skill={skill} index={idx} />
          ))}
        </div>
      ) : (
        <div className="mt-[var(--space-8)]">
          <EmptyState onCreateClick={() => setIsModalOpen(true)} />
        </div>
      )}

      {/* Floating Action Button */}
      <InkFab onClick={() => setIsModalOpen(true)} />

      {/* Skill Creation Modal */}
      <SkillCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSkillCreated}
      />
    </div>
  )
}