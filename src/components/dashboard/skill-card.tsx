'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BlockProgress } from '@/components/ui/block-progress'
import { formatDateShort } from '@/lib/utils'
import type { Skill, Milestone } from '@/types/database'

interface SkillCardProps {
  skill: Skill & { milestones?: Milestone[] }
  index?: number
}

export const SkillCard = memo(function SkillCard({ skill, index = 0 }: SkillCardProps) {
  const milestones = skill.milestones || []
  
  const allComplete = milestones.length > 0 && milestones.every(m => m.status === 'completed')
  const progress = allComplete 
    ? 100 
    : milestones.length > 0
      ? Math.round(
          milestones
            .filter(m => m.status === 'completed')
            .reduce((sum, m) => sum + m.weight_percent, 0)
        )
      : 0

  const isFading = skill.last_active_at
    ? (new Date().getTime() - new Date(skill.last_active_at).getTime()) > 5 * 24 * 60 * 60 * 1000
    : skill.created_at
      ? (new Date().getTime() - new Date(skill.created_at).getTime()) > 5 * 24 * 60 * 60 * 1000
      : false

  // Get skill level text for category label
  let levelText = 'BEGINNER'
  if (progress >= 75) levelText = 'ADVANCED'
  else if (progress >= 40) levelText = 'INTERMEDIATE'
  else if (progress >= 10) levelText = 'NOVICE'

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isFading ? 0.7 : 1, y: 0 }}
      transition={{ 
        duration: 0.24, 
        ease: [0.25, 0.1, 0.25, 1],
        delay: index * 0.06,
      }}
      className="skill-card break-inside-avoid"
    >
      <Link
        href={`/dashboard/skills/${skill.id}`}
        className={`
          block p-[var(--space-3)]
          transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-ink)]
          focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[var(--ink-primary)]
          ${isFading ? 'opacity-70' : ''}
        `}
      >
        {/* Category label - newspaper section header style */}
        <div className="flex items-center justify-between mb-[var(--space-2)]">
          <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] uppercase tracking-[0.08em]">
            {skill.category} · {levelText}
          </span>
        </div>

        {/* Thin rule below category */}
        <div className="newspaper-rule mb-[var(--space-3)]" />

        {/* Skill title - newspaper headline style, italic */}
        <h3 className="font-display text-[var(--text-headline)] leading-tight text-[var(--ink-primary)] font-style-italic line-clamp-2 mb-[var(--space-3)]">
          {skill.title}
        </h3>

        {/* Byline row: username · streak · xp */}
        <div className="flex items-center gap-[var(--space-2)] mb-[var(--space-3)]">
          <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)]">
            BY YOU · {skill.streak_count || 0} DAY STREAK · {skill.total_xp || 0} XP
          </span>
        </div>

        {/* Thin rule below byline */}
        <div className="newspaper-rule mb-[var(--space-3)]" />

        {/* Body: one-line description or recent session note */}
        <p className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] line-clamp-2 mb-[var(--space-3)]">
          {skill.description || 'No description provided. Click to view milestones and track progress.'}
        </p>

        {/* Block character progress indicator */}
        <div className="mb-[var(--space-3)]">
          <BlockProgress progress={progress} totalBlocks={10} />
        </div>

        {/* Target date or "No deadline" */}
        <div className="flex items-center justify-between">
          <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)]">
            {skill.target_date ? `TARGET: ${formatDateShort(skill.target_date)}` : 'NO DEADLINE'}
          </span>
        </div>
      </Link>
    </motion.article>
  )
}, (prevProps: SkillCardProps, nextProps: SkillCardProps) => prevProps.skill.id === nextProps.skill.id)
