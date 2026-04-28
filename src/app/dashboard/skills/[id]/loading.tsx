export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="h-6 w-24 bg-ink-100/20 dark:bg-wiki-border rounded" />
      
      <div className="p-6 bg-ink-100/10 dark:bg-wiki-border/20 border border-ink-200/10">
        <div className="h-4 bg-ink-100/20 dark:bg-wiki-border w-20 rounded mb-4" />
        
        <div className="flex gap-4 mb-6">
          <div className="h-12 w-12 bg-ink-100/20 dark:bg-wiki-border rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-8 bg-ink-100/20 dark:bg-wiki-border w-3/4 rounded" />
            <div className="h-4 bg-ink-100/20 dark:bg-wiki-border w-1/2 rounded" />
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-3 bg-ink-100/20 dark:bg-wiki-border rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-ink-100/30 dark:bg-wiki-border/50" />
        </div>
      </div>
      
      {/* Milestones skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-32 bg-ink-100/20 dark:bg-wiki-border rounded" />
        
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 border border-ink-200/10 bg-ink-100/10 dark:bg-wiki-border/20"
          >
            <div className="flex gap-3">
              <div className="h-12 w-12 bg-ink-100/20 dark:bg-wiki-border rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-ink-100/20 dark:bg-wiki-border w-3/4 rounded" />
                <div className="h-3 bg-ink-100/20 dark:bg-wiki-border w-1/2 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}