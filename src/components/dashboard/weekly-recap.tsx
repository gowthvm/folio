'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { X, Flame, Target, TrendingUp, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface WeeklyRecapProps {
  isOpen: boolean
  onClose: () => void
  stats: {
    skillsProgressed: number
    percentGained: number
    xpEarned: number
    bestStreak: number
  }
}

export function WeeklyRecapModal({ isOpen, onClose, stats }: WeeklyRecapProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    
    const deltaY = e.touches[0].clientY - touchStart
    if (deltaY > 100) {
      onClose()
      setTouchStart(null)
    }
  }

  const handleTouchEnd = () => {
    setTouchStart(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--ink-1)]/60 dark:bg-[var(--surface)]/70 backdrop-blur-sm"
          />
          
          <motion.div
            ref={modalRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={cn(
              'relative w-full bg-[var(--bg)] dark:bg-[var(--surface)] border-2 border-[var(--rule)] dark:border-[var(--rule)] shadow-2xl overflow-hidden',
              'md:max-w-lg md:rounded-lg',
              'h-[85vh] md:h-auto md:max-h-[90vh]'
            )}
          >
            {/* Swipe indicator for mobile */}
            <div className="md:hidden w-full py-2 flex justify-center">
              <div className="w-12 h-1 bg-[var(--rule)] rounded-full" />
            </div>

            {/* Newspaper header */}
            <div className="bg-[var(--surface)] dark:bg-[var(--surface)] border-b border-[var(--rule)] dark:border-[var(--rule)] p-6 text-center">
              <p className="font-body text-xs text-[var(--ink-3)] uppercase tracking-widest mb-2">
                Weekly Edition
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--ink-1)] dark:text-[var(--ink-1)]">
                Your Learning Journey
              </h2>
              <p className="font-body text-xs text-[var(--ink-3)] mt-2">
                Week of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-[var(--surface)] dark:hover:bg-[var(--surface)]/50 rounded-sm"
                aria-label="Close weekly recap"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Stats grid */}
            <div className="p-6 grid grid-cols-2 gap-4 overflow-y-auto">
              <div className="p-4 border border-[var(--rule)] dark:border-[var(--rule)] text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-[var(--ink-1)] dark:text-[var(--ink-1)]" />
                <p className="font-display text-3xl font-bold">{stats.skillsProgressed}</p>
                <p className="font-body text-xs text-[var(--ink-3)]">Skills Progressed</p>
              </div>
              
              <div className="p-4 border border-[var(--rule)] dark:border-[var(--rule)] text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-[var(--accent-green)]" />
                <p className="font-display text-3xl font-bold">{stats.percentGained}%</p>
                <p className="font-body text-xs text-[var(--ink-3)]">Total Progress</p>
              </div>
              
              <div className="p-4 border border-[var(--rule)] dark:border-[var(--rule)] text-center">
                <Award className="w-6 h-6 mx-auto mb-2 text-[var(--accent-sepia)]" />
                <p className="font-display text-3xl font-bold">{stats.xpEarned}</p>
                <p className="font-body text-xs text-[var(--ink-3)]">XP Earned</p>
              </div>
              
              <div className="p-4 border border-[var(--rule)] dark:border-[var(--rule)] text-center">
                <Flame className="w-6 h-6 mx-auto mb-2 text-[var(--accent-red)]" />
                <p className="font-display text-3xl font-bold">{stats.bestStreak}</p>
                <p className="font-body text-xs text-[var(--ink-3)]">Best Streak</p>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-[var(--rule)] dark:border-[var(--rule)] bg-[var(--surface)]/50 dark:bg-[var(--surface)]/30">
              <Button
                onClick={onClose}
                className="w-full font-body"
              >
                Continue Reading
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Hook to check and show weekly recap
export function useWeeklyRecap() {
  const [showRecap, setShowRecap] = useState(false)
  const [stats, setStats] = useState({ skillsProgressed: 0, percentGained: 0, xpEarned: 0, bestStreak: 0 })

  useEffect(() => {
    const checkWeeklyRecap = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      // Check last dismissed date
      const { data: profile } = await supabase
        .from('profiles')
        .select('weekly_recap_dismissed_at')
        .eq('id', user.id)
        .single()

      const lastDismissed = profile?.weekly_recap_dismissed_at
        ? new Date(profile.weekly_recap_dismissed_at)
        : null

      // Only show if Monday and not dismissed this week
      const now = new Date()
      const isMonday = now.getDay() === 1
      
      if (!isMonday || (lastDismissed && now.getTime() - lastDismissed.getTime() < 7 * 24 * 60 * 60 * 1000)) {
        return
      }

      // Check if user has at least one session in the past week
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      
      const { data: sessions } = await supabase
        .from('sessions')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString())

      // Don't show for brand new users with no activity
      if (!sessions || sessions.length === 0) {
        return
      }

      // Fetch last week's stats
      const { data: skills } = await supabase
        .from('skills')
        .select('*, milestones(*)')
        .eq('user_id', user.id)
        .gt('created_at', weekAgo.toISOString())

      if (!skills || skills.length === 0) return

      const skillsProgressed = skills.filter((s: any) => 
        s.milestones?.some((m: any) => m.status === 'completed')
      ).length

      const percentGained = Math.round(
        skills.reduce((acc, s: any) => {
          const completed = s.milestones?.filter((m: any) => m.status === 'completed') || []
          return acc + completed.reduce((sum: number, m: any) => sum + (m.weight_percent || 0), 0)
        }, 0) / skills.length
      )

      const xpEarned = skills.reduce((acc: number, s: any) => acc + (s.total_xp || 0), 0)
      const bestStreak = Math.max(...skills.map((s: any) => s.streak_count || 0), 0)

      setStats({ skillsProgressed, percentGained, xpEarned, bestStreak })
      setShowRecap(true)
    }

    checkWeeklyRecap()
  }, [])

  const dismissRecap = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase
        .from('profiles')
        .upsert({ id: user.id, weekly_recap_dismissed_at: new Date().toISOString() })
    }

    setShowRecap(false)
  }

  return { showRecap, stats, dismissRecap }
}