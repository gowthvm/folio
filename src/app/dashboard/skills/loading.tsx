import { SkillsGridSkeleton } from '@/components/ui/skill-card-skeleton'

export default function SkillsLoading() {
  return (
    <div className="space-y-[var(--space-7)]">
      {/* Breadcrumbs skeleton */}
      <div className="h-6 bg-[var(--rule)]/30 w-32 rounded animate-pulse" />
      
      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-[var(--space-6)] border-b border-[var(--rule)]">
        <div className="space-y-2">
          <div className="h-8 bg-[var(--rule)]/30 w-48 rounded animate-pulse" />
          <div className="h-4 bg-[var(--rule)]/30 w-64 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[var(--rule)]/30 rounded animate-pulse" />
          <div className="h-10 w-10 bg-[var(--rule)]/30 rounded animate-pulse" />
        </div>
      </div>

      {/* Quick Actions skeleton */}
      <div className="h-12 bg-[var(--rule)]/30 rounded animate-pulse" />

      {/* Skills grid skeleton */}
      <SkillsGridSkeleton count={3} />

      {/* Stats bar skeleton */}
      <div className="border border-[var(--rule)] p-4">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center space-y-2">
              <div className="h-4 bg-[var(--rule)]/30 w-full rounded animate-pulse" />
              <div className="h-8 bg-[var(--rule)]/30 w-16 mx-auto rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
