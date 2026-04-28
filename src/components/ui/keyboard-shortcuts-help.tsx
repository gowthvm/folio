'use client'

import { useGlobalKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

export function KeyboardShortcutsHelp() {
  const shortcuts = useGlobalKeyboardShortcuts()

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <div className="bg-[var(--surface)] border border-[var(--rule)] p-4 shadow-lg max-w-xs">
        <div className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] uppercase tracking-[0.08em] mb-3">
          Keyboard Shortcuts
        </div>
        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between text-sm">
              <kbd className="font-ui text-[var(--text-caption)] text-[var(--ink-1)] px-2 py-1 bg-[var(--ink-4)]/10 border border-[var(--rule)] rounded min-w-[32px] text-center">
                {shortcut.key}
              </kbd>
              <span className="font-body text-[var(--text-caption)] text-[var(--ink-secondary)]">
                {shortcut.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
