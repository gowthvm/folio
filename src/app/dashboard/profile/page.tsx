'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { StatusStamp } from '@/components/ui/stamp'
import { useTheme } from 'next-themes'

interface Profile {
  full_name?: string | null
}

interface SkillWithMilestones {
  id: string
  title: string
  category: string
  created_at: string
  total_xp: number
  streak_count?: number
  milestones?: { status: string }[]
}

export default function ProfilePage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [skills, setSkills] = useState<SkillWithMilestones[]>([])
  const [user, setUser] = useState<any>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [totalSessions, setTotalSessions] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user: userData } } = await supabase.auth.getUser()
      
      if (!userData) {
        router.push('/login')
        return
      }

      setUser(userData)

      const [profileRes, skillsRes, sessionsRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', userData.id).single(),
        supabase
          .from('skills')
          .select('id, title, category, created_at, total_xp, streak_count, milestones(status)')
          .eq('user_id', userData.id)
          .order('created_at', { ascending: true }),
        supabase
          .from('sessions')
          .select('id')
          .eq('user_id', userData.id)
      ])

      if (profileRes.data) {
        setProfile(profileRes.data)
        setDisplayName(profileRes.data.full_name || '')
      }

      if (skillsRes.data) {
        setSkills(skillsRes.data)
      }

      if (sessionsRes.data) {
        setTotalSessions(sessionsRes.data.length)
      }

      setLoading(false)
    }

    fetchData()
  }, [router])

  const handleSaveProfile = async () => {
    setSaving(true)
    setSaveMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('users')
        .update({ full_name: displayName })
        .eq('id', user?.id)

      if (error) throw error

      setSaveMessage('Changes saved successfully')
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err) {
      setSaveMessage('Failed to save changes')
      setTimeout(() => setSaveMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      const supabase = createClient()
      // Delete user's skills first
      await supabase.from('skills').delete().eq('user_id', user?.id)
      // Delete user's sessions
      await supabase.from('sessions').delete().eq('user_id', user?.id)
      // Delete user profile
      await supabase.from('users').delete().eq('id', user?.id)
      // Delete auth user
      await supabase.auth.admin.deleteUser(user?.id)
      router.push('/')
    } catch (err) {
      console.error('Failed to delete account:', err)
      alert('Failed to delete account. Please try again or contact support.')
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--surface)] border border-[var(--rule)] w-32 rounded" />
          <div className="h-48 bg-[var(--surface)] border border-[var(--rule)] rounded" />
        </div>
      </div>
    )
  }

  const totalSkills = skills?.length || 0
  const completedSkills = skills?.filter(s => {
    const milestones = s.milestones || []
    return milestones.length > 0 && milestones.every((m) => m.status === 'completed')
  }).length || 0
  const totalMilestones = skills?.reduce((acc, s) => acc + (s.milestones?.length || 0), 0) || 0
  const totalXP = skills?.reduce((acc, s) => acc + (s.total_xp || 0), 0) || 0
  const currentStreak = skills?.reduce((max, s) => Math.max(max, s.streak_count || 0), 0) || 0
  const longestStreak = currentStreak

  const joinDate = new Date(user?.created_at || '').toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 1000) + 1
  }
  const level = calculateLevel(totalXP)
  const xpInCurrentLevel = totalXP % 1000
  const progressToNextLevel = (xpInCurrentLevel / 1000) * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="newspaper-rule-thick mb-6" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[var(--text-subhead)] font-style-italic text-[var(--ink-primary)]">
            Correspondent Profile
          </h1>
          <p className="byline text-[var(--ink-tertiary)]">ACCOUNT RECORDS</p>
        </div>
        <Link
          href="/dashboard"
          className="font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[30%_40%_30%] gap-8" style={{ columnRule: '1px solid var(--rule)' }}>
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          {/* Block 1 - Correspondent Profile */}
          <div>
            <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
              CORRESPONDENT
            </div>
            <div className="newspaper-rule mb-[var(--space-4)]" />
            
            <h2 className="font-display italic text-[1.4rem] text-[var(--ink-1)] mb-[var(--space-3)]">
              {profile?.full_name || 'Anonymous Correspondent'}
            </h2>
            <p className="font-ui text-[0.65rem] text-[var(--ink-4)] uppercase tracking-[0.08em] mb-[var(--space-4)]">
              ON THE RECORD SINCE {joinDate}
            </p>
            
            <div className="mb-[var(--space-4)]">
              <StatusStamp status="in_progress" className="w-16 h-16" />
            </div>
            
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                  LEVEL {level}
                </span>
                <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                  {xpInCurrentLevel}/1000 XP
                </span>
              </div>
              <div className="h-2 bg-[var(--surface)]">
                <div 
                  className="h-full bg-[var(--ink-1)]"
                  style={{ width: `${progressToNextLevel}%` }}
                />
              </div>
            </div>
            <div className="newspaper-rule" />
          </div>

          {/* Block 2 - Quick Stats */}
          <div>
            <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
              AT A GLANCE
            </div>
            <div className="newspaper-rule mb-[var(--space-4)]" />
            
            <div className="space-y-0">
              <div className="py-[var(--space-2)] border-b border-[var(--rule)]">
                <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                  SKILLS ACTIVE
                </span>
                <span className="font-ui text-[1rem] text-[var(--ink-1)] ml-2">
                  {totalSkills - completedSkills}
                </span>
              </div>
              <div className="py-[var(--space-2)] border-b border-[var(--rule)]">
                <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                  SKILLS COMPLETE
                </span>
                <span className="font-ui text-[1rem] text-[var(--ink-1)] ml-2">
                  {completedSkills}
                </span>
              </div>
              <div className="py-[var(--space-2)] border-b border-[var(--rule)]">
                <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                  TOTAL SESSIONS
                </span>
                <span className="font-ui text-[1rem] text-[var(--ink-1)] ml-2">
                  {totalSessions}
                </span>
              </div>
              <div className="py-[var(--space-2)] border-b border-[var(--rule)]">
                <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                  TOTAL MILESTONES
                </span>
                <span className="font-ui text-[1rem] text-[var(--ink-1)] ml-2">
                  {totalMilestones}
                </span>
              </div>
              <div className="py-[var(--space-2)] border-b border-[var(--rule)]">
                <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                  CURRENT STREAK
                </span>
                <span className="font-ui text-[1rem] text-[var(--ink-1)] ml-2">
                  {currentStreak}
                </span>
              </div>
              <div className="py-[var(--space-2)]">
                <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                  LONGEST STREAK
                </span>
                <span className="font-ui text-[1rem] text-[var(--ink-1)] ml-2">
                  {longestStreak}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN */}
        <div className="space-y-8">
          {/* Block 1 - All Badges */}
          <div>
            <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
              PRESS CLIPPINGS
            </div>
            <div className="newspaper-rule mb-[var(--space-4)]" />
            
            <div className="font-body text-[0.8rem] text-[var(--ink-4)] italic">
              No clippings yet. Complete milestones to earn your first.
            </div>
          </div>

          {/* Block 2 - Skill History Timeline */}
          <div>
            <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
              THE RECORD
            </div>
            <div className="newspaper-rule mb-[var(--space-4)]" />
            
            <div className="space-y-0">
              {skills && skills.length > 0 ? skills.map((skill: SkillWithMilestones) => {
                const milestones = skill.milestones || []
                const isComplete = milestones.length > 0 && milestones.every((m) => m.status === 'completed')
                const status = isComplete ? 'COMPLETE' : 'ACTIVE'
                const createdDate = new Date(skill.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                
                return (
                  <div key={skill.id} className="py-3 border-b border-[var(--rule)]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                        {createdDate}
                      </span>
                      <span className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em]">
                        {status}
                      </span>
                    </div>
                    <h3 className="font-display italic text-[0.9rem] text-[var(--ink-1)]">
                      {skill.title}
                    </h3>
                  </div>
                )
              }) : (
                <div className="font-body text-[0.8rem] text-[var(--ink-4)] italic py-3">
                  More stories to be filed.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* Block 1 - Account Settings */}
          <div>
            <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
              ACCOUNT
            </div>
            <div className="newspaper-rule mb-[var(--space-4)]" />
            
            <div className="space-y-4">
              <div>
                <label className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] block mb-2">
                  DISPLAY NAME
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-transparent border-b border-[var(--ink-2)] py-2 font-body text-[var(--ink-1)] focus:outline-none focus:border-b-2"
                />
              </div>
              
              <div className="newspaper-rule" />
              
              <div>
                <label className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] block mb-2">
                  EMAIL
                </label>
                <p className="font-body text-[var(--ink-3)]">
                  {user.email}
                </p>
              </div>
              
              <div className="newspaper-rule" />
              
              <div>
                <label className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.08em] block mb-2">
                  THEME PREFERENCE
                </label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`font-ui text-[0.7rem] uppercase tracking-[0.08em] hover:underline ${theme === 'light' ? 'text-[var(--ink-1)]' : 'text-[var(--ink-3)]'}`}
                  >
                    PAPER
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`font-ui text-[0.7rem] uppercase tracking-[0.08em] hover:underline ${theme === 'dark' ? 'text-[var(--ink-1)]' : 'text-[var(--ink-3)]'}`}
                  >
                    ARCHIVE
                  </button>
                </div>
              </div>
              
              <div className="newspaper-rule" />
              
              {saveMessage && (
                <p className={`font-ui text-[0.65rem] uppercase tracking-[0.08em] ${saveMessage.includes('Failed') ? 'text-[var(--accent-red)]' : 'text-[var(--accent-green)]'}`}>
                  {saveMessage}
                </p>
              )}
              
              <button 
                onClick={handleSaveProfile}
                disabled={saving}
                className="font-ui text-[0.7rem] text-[var(--ink-1)] uppercase tracking-[0.08em] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'SAVING...' : 'SAVE CHANGES →'}
              </button>
            </div>
          </div>

          {/* Block 2 - Danger Zone */}
          <div>
            <div className="font-ui text-[0.6rem] text-[var(--ink-4)] uppercase tracking-[0.15em] mb-2">
              CORRECTIONS
            </div>
            <div className="newspaper-rule mb-[var(--space-4)]" />
            
            <div className="space-y-4">
              <button
                onClick={handleSignOut}
                className="font-ui text-[0.7rem] text-[var(--ink-3)] uppercase tracking-[0.08em] hover:underline block"
              >
                SIGN OUT →
              </button>
              
              <div className="newspaper-rule" />
              
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="font-ui text-[0.7rem] text-[var(--accent-red)] uppercase tracking-[0.08em] hover:underline"
              >
                DELETE ACCOUNT →
              </button>
              
              <p className="font-body text-[0.75rem] text-[var(--ink-4)] italic mt-2">
                Deleting your account permanently removes all skills, sessions, and records.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--surface)] border-2 border-[var(--rule)] p-6 max-w-md w-full">
            <h2 className="font-display text-xl text-[var(--ink-1)] mb-4">Confirm Account Deletion</h2>
            <p className="font-body text-[var(--ink-2)] mb-6">
              Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your skills, sessions, and records.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="font-ui text-[0.7rem] uppercase tracking-[0.08em] text-[var(--ink-2)] hover:text-[var(--ink-1)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="font-ui text-[0.7rem] uppercase tracking-[0.08em] text-[var(--accent-red)] hover:text-[var(--accent-red)] disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
