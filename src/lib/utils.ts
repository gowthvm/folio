import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(date: string | Date | null): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function getCurrentDateHeader(): string {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function calculateProgress(milestones: { status: string; weight_percent: number }[]): number {
  if (milestones.length === 0) return 0
  
  const completed = milestones
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + m.weight_percent, 0)
  
  return Math.round(completed)
}

export function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    music: '🎵',
    fitness: '💪',
    learning: '📚',
    creative: '🎨',
    other: '📌',
  }
  return emojis[category] || '📌'
}

export function getMoodEmoji(mood: string | null): string {
  const emojis: Record<string, string> = {
    great: '😄',
    okay: '😐',
    struggled: '😓',
  }
  return emojis[mood || ''] || '📝'
}

export function generateRandomId(): string {
  return crypto.randomUUID()
}
