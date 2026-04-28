'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getCategoryEmoji, calculateProgress, formatDate } from '@/lib/utils'
import { Plus, Download } from 'lucide-react'
import { BlockProgress } from '@/components/ui/block-progress'
import { StatusStamp } from '@/components/ui/stamp'
import { SkillSearchFilter } from '@/components/ui/skill-search-filter'
import { Button } from '@/components/ui/button'
import { exportSkillsToCSV } from '@/lib/export-utils'
import type { Skill, Milestone } from '@/types/database'

interface SkillsGridClientProps {
  skills: (Skill & { milestones?: Milestone[] })[]
}

export function SkillsGridClient({ skills }: SkillsGridClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'in-progress' | 'completed' | 'not-started'>('all')

  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      // Search filter
      const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.category.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const progress = calculateProgress(skill.milestones || [])
      let matchesFilter = true

      if (activeFilter === 'in-progress') {
        matchesFilter = progress > 0 && progress < 100
      } else if (activeFilter === 'completed') {
        matchesFilter = progress === 100
      } else if (activeFilter === 'not-started') {
        matchesFilter = progress === 0
      }

      return matchesSearch && matchesFilter
    })
  }, [skills, searchQuery, activeFilter])

  return (
    <>
      {/* Search and Filter */}
      <SkillSearchFilter
        searchQuery={searchQuery}
        activeFilter={activeFilter}
        onSearchChange={setSearchQuery}
        onFilterChange={setActiveFilter}
      />

      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => exportSkillsToCSV(filteredSkills)}
          variant="outline"
          size="sm"
          className="font-ui text-xs uppercase tracking-wider"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length > 0 ? (
        <div className="newspaper-columns">
          {filteredSkills.map((skill) => {
            const progress = calculateProgress(skill.milestones || [])
            const emoji = skill.cover_emoji || getCategoryEmoji(skill.category)
            const completed = skill.milestones?.filter((m: { status: string }) => m.status === 'completed').length || 0
            const total = skill.milestones?.length || 0

            return (
              <Link
                key={skill.id}
                href={`/dashboard/skills/${skill.id}`}
                className="skill-card block"
              >
                <div className="flex items-center justify-between mb-[var(--space-2)]">
                  <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] uppercase tracking-[0.08em]">
                    {skill.category}
                  </span>
                </div>
                <div className="newspaper-rule mb-[var(--space-3)]" />
                <h3 className="font-display text-[var(--text-headline)] leading-tight text-[var(--ink-primary)] font-style-italic line-clamp-2 mb-[var(--space-3)]">
                  {skill.title}
                </h3>
                <div className="flex items-center gap-[var(--space-2)] mb-[var(--space-3)]">
                  <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)]">
                    VOL. I · {completed}/{total} MILESTONES · {progress}% COMPLETE
                  </span>
                </div>
                <div className="newspaper-rule mb-[var(--space-3)]" />
                <div className="mb-[var(--space-3)]">
                  <BlockProgress progress={progress} totalBlocks={10} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)]">
                    {skill.target_date ? `TARGET: ${formatDate(skill.target_date)}` : 'NO DEADLINE'}
                  </span>
                  <StatusStamp status={progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started'} className="w-12 h-12" />
                </div>
              </Link>
            )
          })}

          {/* Fill remaining columns with stub cards if needed */}
          {filteredSkills.length < 3 && [...Array(3 - filteredSkills.length)].map((_, idx) => (
            <Link
              key={`stub-${idx}`}
              href="/dashboard/skills/new"
              className="skill-card block"
            >
              <div className="flex items-center justify-between mb-[var(--space-2)]">
                <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] uppercase tracking-[0.08em]">
                  NEW STORY
                </span>
              </div>
              <div className="newspaper-rule mb-[var(--space-3)]" />
              <h3 className="font-display text-[var(--text-headline)] leading-tight text-[var(--ink-4)] font-style-italic mb-[var(--space-3)]">
                File a new skill.
              </h3>
              <div className="border border-dashed border-[var(--rule)] p-[var(--space-4)]">
                <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] uppercase tracking-[0.08em]">
                  NEW →
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
            {searchQuery || activeFilter !== 'all'
              ? 'No skills match your search or filter criteria.'
              : 'No skills yet. Create your first skill to get started.'}
          </p>
        </div>
      )}
    </>
  )
}
