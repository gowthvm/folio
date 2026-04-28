'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SKILL_TEMPLATES, getAllCategories } from '@/lib/skill-templates'
import { motion, AnimatePresence } from 'framer-motion'

export function QuickStartTemplates() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const categories = ['All', ...getAllCategories()]

  const filteredTemplates = selectedCategory === 'All'
    ? SKILL_TEMPLATES
    : SKILL_TEMPLATES.filter(t => t.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="font-ui text-[0.65rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
          QUICK START TEMPLATES
        </div>
        <div className="h-[1px] bg-[var(--rule)] w-20 mx-auto mb-4" />
        <h3 className="font-display text-[var(--text-headline)] text-[var(--ink-primary)] mb-2">
          Start with a template
        </h3>
        <p className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] max-w-[50ch] mx-auto">
          Choose from pre-built skill templates with milestones already set up for you.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`font-ui text-[0.65rem] uppercase tracking-[0.1em] px-3 py-1.5 border transition-colors ${
              selectedCategory === category
                ? 'border-[var(--ink-1)] text-[var(--ink-1)] bg-[var(--surface)]'
                : 'border-[var(--rule)] text-[var(--ink-3)] hover:border-[var(--ink-2)] hover:text-[var(--ink-2)]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--ink-2)] transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{template.emoji}</span>
                <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                  {template.category}
                </span>
              </div>
              
              <h4 className="font-display text-[var(--text-subhead)] text-[var(--ink-primary)] mb-2 line-clamp-2">
                {template.title}
              </h4>
              
              <p className="font-body text-[var(--text-caption)] text-[var(--ink-secondary)] mb-3 line-clamp-2">
                {template.description}
              </p>
              
              <div className="flex items-center justify-between text-xs font-ui text-[var(--ink-tertiary)]">
                <span>{template.milestones.length} milestones</span>
                {template.target_days && <span>{template.target_days} days</span>}
              </div>
              
              <div className="mt-3 pt-3 border-t border-[var(--rule)] flex items-center justify-between">
                <span className="font-ui text-[0.65rem] text-[var(--ink-1)] uppercase tracking-[0.08em] group-hover:underline">
                  Use Template →
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Or create custom */}
      <div className="text-center pt-4 border-t border-[var(--rule)]">
        <Link
          href="/dashboard/skills/new"
          className="font-ui text-[0.7rem] text-[var(--ink-1)] uppercase tracking-[0.1em] hover:underline"
        >
          Or create a custom skill →
        </Link>
      </div>
    </div>
  )
}
