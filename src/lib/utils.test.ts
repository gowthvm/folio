import { describe, it, expect } from 'vitest'
import { formatDate, formatDateShort, calculateProgress, getCategoryEmoji, getMoodEmoji } from './utils'

describe('formatDate', () => {
  it('returns dash for null input', () => {
    expect(formatDate(null)).toBe('—')
  })

  it('formats date string correctly', () => {
    expect(formatDate('2024-01-15')).toBe('January 15, 2024')
  })

  it('formats Date object correctly', () => {
    expect(formatDate(new Date('2024-01-15'))).toBe('January 15, 2024')
  })
})

describe('formatDateShort', () => {
  it('returns dash for null input', () => {
    expect(formatDateShort(null)).toBe('—')
  })

  it('formats date string in short format', () => {
    expect(formatDateShort('2024-01-15')).toBe('Jan 15')
  })

  it('formats Date object in short format', () => {
    expect(formatDateShort(new Date('2024-01-15'))).toBe('Jan 15')
  })
})

describe('calculateProgress', () => {
  it('returns 0 for empty array', () => {
    expect(calculateProgress([])).toBe(0)
  })

  it('calculates progress correctly', () => {
    const milestones = [
      { status: 'completed', weight_percent: 30 },
      { status: 'not_started', weight_percent: 40 },
      { status: 'in_progress', weight_percent: 30 },
    ]
    expect(calculateProgress(milestones)).toBe(30)
  })

  it('returns 100 when all completed', () => {
    const milestones = [
      { status: 'completed', weight_percent: 50 },
      { status: 'completed', weight_percent: 50 },
    ]
    expect(calculateProgress(milestones)).toBe(100)
  })

  it('rounds to nearest integer', () => {
    const milestones = [
      { status: 'completed', weight_percent: 33.3 },
      { status: 'completed', weight_percent: 33.3 },
      { status: 'completed', weight_percent: 33.4 },
    ]
    expect(calculateProgress(milestones)).toBe(100)
  })
})

describe('getCategoryEmoji', () => {
  it('returns correct emoji for known categories', () => {
    expect(getCategoryEmoji('music')).toBe('🎵')
    expect(getCategoryEmoji('fitness')).toBe('💪')
    expect(getCategoryEmoji('learning')).toBe('📚')
    expect(getCategoryEmoji('creative')).toBe('🎨')
  })

  it('returns default emoji for unknown category', () => {
    expect(getCategoryEmoji('unknown')).toBe('📌')
    expect(getCategoryEmoji('other')).toBe('📌')
  })
})

describe('getMoodEmoji', () => {
  it('returns correct emoji for known moods', () => {
    expect(getMoodEmoji('great')).toBe('😄')
    expect(getMoodEmoji('okay')).toBe('😐')
    expect(getMoodEmoji('struggled')).toBe('😓')
  })

  it('returns default emoji for null mood', () => {
    expect(getMoodEmoji(null)).toBe('📝')
  })

  it('returns default emoji for unknown mood', () => {
    expect(getMoodEmoji('unknown')).toBe('📝')
  })
})
