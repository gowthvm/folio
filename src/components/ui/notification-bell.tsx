'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Check, X, Flame, Award, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: 'streak' | 'milestone' | 'reminder'
  title: string
  message: string
  time: string
  read: boolean
}

interface NotificationBellProps {
  className?: string
}

export function NotificationBell({ className = '' }: NotificationBellProps) {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'streak',
      title: 'Streak Warning',
      message: 'Log a session today to keep your 5-day streak alive!',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'milestone',
      title: 'Milestone Complete',
      message: 'You completed "Master chord progressions" in Guitar Basics',
      time: 'Yesterday',
      read: false
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Skill Due Soon',
      message: 'Learn Fingerpicking is due in 3 days',
      time: '2 days ago',
      read: true
    }
  ])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!mounted) return null

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'streak': return <Flame className="w-4 h-4 text-orange-500" />
      case 'milestone': return <Award className="w-4 h-4 text-yellow-500" />
      case 'reminder': return <Clock className="w-4 h-4 text-blue-500" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center hover:bg-[var(--paper-tertiary)] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-[var(--ink-primary)]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-[var(--accent-red)] text-[var(--paper-primary)] text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-[var(--surface-card)] border border-[var(--border-default)] shadow-lg z-50">
          <div className="p-4 border-b border-[var(--border-default)] flex items-center justify-between">
            <span className="font-ui text-[var(--text-caption)] uppercase tracking-wider text-[var(--ink-primary)]">
              NOTIFICATIONS
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="font-ui text-[0.65rem] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] uppercase tracking-wider"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 mx-auto text-[var(--ink-tertiary)] mb-2" />
                <p className="font-body text-[var(--text-body)] text-[var(--ink-tertiary)]">
                  No notifications
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 border-b border-[var(--border-default)] hover:bg-[var(--paper-secondary)] transition-colors cursor-pointer',
                    !notification.read && 'bg-[var(--paper-secondary)]/50'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                          'font-ui text-[var(--text-caption)] uppercase tracking-wider',
                          !notification.read ? 'text-[var(--ink-primary)] font-semibold' : 'text-[var(--ink-secondary)]'
                        )}>
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[var(--accent-red)] rounded-full shrink-0" />
                        )}
                      </div>
                      <p className="font-body text-[var(--text-caption)] text-[var(--ink-secondary)] mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <span className="font-ui text-[0.6rem] text-[var(--ink-tertiary)] uppercase tracking-wider mt-2 block">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-[var(--border-default)]">
            <button className="w-full font-ui text-[0.65rem] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] uppercase tracking-wider py-2">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
