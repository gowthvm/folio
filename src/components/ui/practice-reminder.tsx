'use client'

import { useState, useEffect } from 'react'
import { Bell, X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Reminder {
  skillId: string
  skillTitle: string
  time: string
  enabled: boolean
}

export function PracticeReminder() {
  const [showReminder, setShowReminder] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [timeUntilPractice, setTimeUntilPractice] = useState('')

  useEffect(() => {
    // Check if user has enabled reminders
    const reminderEnabled = localStorage.getItem('practiceReminderEnabled')
    if (reminderEnabled === 'true') {
      const reminderTime = localStorage.getItem('practiceReminderTime') || '09:00'
      checkReminder(reminderTime)
    }
  }, [])

  const checkReminder = (reminderTime: string) => {
    const now = new Date()
    const [hours, minutes] = reminderTime.split(':').map(Number)
    const reminderDate = new Date()
    reminderDate.setHours(hours, minutes, 0, 0)

    // If reminder time has passed today, show it
    if (now >= reminderDate && now <= new Date(reminderDate.getTime() + 60 * 60 * 1000)) {
      setShowReminder(true)
      const diff = now.getTime() - reminderDate.getTime()
      setTimeUntilPractice(`${Math.floor(diff / (1000 * 60))} minutes ago`)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    setShowReminder(false)
    // Don't show again for 24 hours
    localStorage.setItem('lastReminderDismissed', new Date().toISOString())
  }

  const handleSnooze = () => {
    setShowReminder(false)
    // Show again in 1 hour
    setTimeout(() => {
      setShowReminder(true)
    }, 60 * 60 * 1000)
  }

  if (!showReminder || dismissed) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm animate-in slide-in-from-right-4 duration-300">
      <div className="bg-[var(--surface)] border border-[var(--rule)] p-4 shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[var(--ink-primary)]" />
            <span className="font-ui text-[0.65rem] text-[var(--ink-primary)] uppercase tracking-[0.08em]">
              Practice Reminder
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-[var(--ink-tertiary)] hover:text-[var(--ink-2)]"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <p className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] mb-4">
          Time to practice! It&apos;s been a while since your last session.
        </p>
        
        <div className="flex gap-2">
          <Button
            onClick={handleSnooze}
            variant="outline"
            size="sm"
            className="font-ui text-xs uppercase tracking-wider"
          >
            <Clock className="w-3 h-3 mr-1" />
            Snooze
          </Button>
          <Button
            onClick={handleDismiss}
            size="sm"
            className="font-ui text-xs uppercase tracking-wider"
          >
            Mark Done
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ReminderSettings() {
  const [enabled, setEnabled] = useState(false)
  const [time, setTime] = useState('09:00')

  useEffect(() => {
    const savedEnabled = localStorage.getItem('practiceReminderEnabled')
    const savedTime = localStorage.getItem('practiceReminderTime')
    if (savedEnabled) setEnabled(savedEnabled === 'true')
    if (savedTime) setTime(savedTime)
  }, [])

  const handleToggle = () => {
    const newValue = !enabled
    setEnabled(newValue)
    localStorage.setItem('practiceReminderEnabled', String(newValue))
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value)
    localStorage.setItem('practiceReminderTime', e.target.value)
  }

  return (
    <div className="p-4 bg-[var(--surface)] border border-[var(--rule)]">
      <div className="flex items-center justify-between mb-4">
        <span className="font-ui text-[var(--text-caption)] text-[var(--ink-primary)] uppercase tracking-[0.08em]">
          Daily Practice Reminder
        </span>
        <button
          onClick={handleToggle}
          className={`w-12 h-6 rounded-full transition-colors ${
            enabled ? 'bg-[var(--accent-green)]' : 'bg-[var(--rule)]'
          }`}
          aria-label={enabled ? 'Disable reminders' : 'Enable reminders'}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
      
      {enabled && (
        <div>
          <label className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] uppercase tracking-[0.08em] mb-2 block">
            Reminder Time
          </label>
          <input
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="font-body text-[var(--text-body)] text-[var(--ink-1)] bg-[var(--bg)] border border-[var(--rule)] px-3 py-2 focus:outline-none focus:border-[var(--ink-2)]"
          />
        </div>
      )}
    </div>
  )
}
