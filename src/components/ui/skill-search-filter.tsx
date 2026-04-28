'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'

interface SkillSearchFilterProps {
  onSearchChange: (query: string) => void
  onFilterChange: (filter: 'all' | 'in-progress' | 'completed' | 'not-started') => void
  searchQuery: string
  activeFilter: 'all' | 'in-progress' | 'completed' | 'not-started'
}

export function SkillSearchFilter({
  onSearchChange,
  onFilterChange,
  searchQuery,
  activeFilter
}: SkillSearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-3)]" />
        <input
          type="text"
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--rule)] font-body text-[var(--text-body)] text-[var(--ink-1)] placeholder:text-[var(--ink-4)] focus:outline-none focus:border-[var(--ink-2)] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)] hover:text-[var(--ink-2)]"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 font-ui text-[var(--text-caption)] text-[var(--ink-3)] uppercase tracking-[0.08em] hover:text-[var(--ink-2)] transition-colors"
          aria-expanded={showFilters}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilter !== 'all' && (
            <span className="ml-1 px-2 py-0.5 bg-[var(--ink-primary)] text-[var(--paper-primary)] dark:bg-[var(--paper-primary)] dark:text-[var(--ink-primary)] text-[10px] rounded">
              Active
            </span>
          )}
        </button>

        {activeFilter !== 'all' && (
          <button
            onClick={() => onFilterChange('all')}
            className="font-ui text-[var(--text-caption)] text-[var(--accent-red)] uppercase tracking-[0.08em] hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter options */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-200">
          {[
            { value: 'all', label: 'All Skills' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'not-started', label: 'Not Started' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value as any)}
              className={`font-ui text-[0.65rem] uppercase tracking-[0.08em] px-3 py-1.5 border transition-colors ${
                activeFilter === filter.value
                  ? 'border-[var(--ink-1)] text-[var(--ink-1)] bg-[var(--surface)]'
                  : 'border-[var(--rule)] text-[var(--ink-3)] hover:border-[var(--ink-2)] hover:text-[var(--ink-2)]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
