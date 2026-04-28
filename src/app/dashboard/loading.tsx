export default function Loading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Masthead skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-ink-100/20 dark:bg-wiki-border w-48 rounded" />
        <div className="h-4 bg-ink-100/20 dark:bg-wiki-border w-32 rounded" />
      </div>

      {/* Stats bar skeleton */}
      <div className="flex justify-center gap-8 py-4 border-y border-ink-200/20">
        <div className="space-y-2">
          <div className="h-3 bg-ink-100/20 dark:bg-wiki-border w-20 rounded mx-auto" />
          <div className="h-6 bg-ink-100/20 dark:bg-wiki-border w-12 rounded mx-auto" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-ink-100/20 dark:bg-wiki-border w-20 rounded mx-auto" />
          <div className="h-6 bg-ink-100/20 dark:bg-wiki-border w-16 rounded mx-auto" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-ink-100/20 dark:bg-wiki-border w-20 rounded mx-auto" />
          <div className="h-6 bg-ink-100/20 dark:bg-wiki-border w-12 rounded mx-auto" />
        </div>
      </div>

      {/* Skill cards skeleton */}
      <div className="grid grid-cols-1 md:columns-2 lg:columns-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="break-inside-avoid mb-4 p-4 bg-ink-100/10 dark:bg-wiki-border/20 border border-ink-200/10"
          >
            <div className="h-4 bg-ink-100/20 dark:bg-wiki-border w-16 rounded mb-3" />
            <div className="h-6 bg-ink-100/20 dark:bg-wiki-border w-3/4 rounded mb-2" />
            <div className="h-4 bg-ink-100/20 dark:bg-wiki-border w-1/2 rounded" />
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink-200/10">
              <div className="h-8 w-8 rounded-full bg-ink-100/20 dark:bg-wiki-border" />
              <div className="h-3 bg-ink-100/20 dark:bg-wiki-border w-12 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}