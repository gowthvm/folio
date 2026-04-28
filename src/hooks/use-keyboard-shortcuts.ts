'use client'

import { useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface ShortcutConfig {
  key: string
  description: string
  action: () => void
  condition?: () => boolean
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in an input
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      // Check for modifier keys (Cmd/Ctrl for shortcuts)
      const isModifierKey = e.metaKey || e.ctrlKey
      const key = e.key.toLowerCase()

      for (const shortcut of shortcuts) {
        if (shortcut.condition && !shortcut.condition()) {
          continue
        }

        if (key === shortcut.key.toLowerCase() && !isModifierKey) {
          e.preventDefault()
          shortcut.action()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

export function useGlobalKeyboardShortcuts() {
  const router = useRouter()
  const pathname = usePathname()

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'n',
      description: 'Create new skill',
      action: () => router.push('/dashboard/skills/new'),
      condition: () => pathname.startsWith('/dashboard')
    },
    {
      key: 's',
      description: 'Go to skills',
      action: () => router.push('/dashboard'),
      condition: () => pathname.startsWith('/dashboard')
    },
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      action: () => {
        // Toggle shortcuts modal (to be implemented)
        alert('Keyboard Shortcuts:\nN - New skill\nS - Skills\n? - Show this help\nEsc - Close modals')
      }
    },
    {
      key: 'escape',
      description: 'Close modals',
      action: () => {
        // Close any open modals (to be implemented)
        document.dispatchEvent(new CustomEvent('close-modals'))
      }
    },
  ]

  useKeyboardShortcuts(shortcuts)

  return shortcuts
}
