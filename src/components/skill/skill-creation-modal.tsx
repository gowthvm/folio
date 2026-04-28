'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { X, ChevronRight, ChevronLeft, Sparkles, Loader2, Lock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SortableMilestoneList } from './sortable-milestone-list'
import { WeightValidation } from '@/components/ui/modals'
import { cn } from '@/lib/utils'

interface MilestoneInput {
  id: string
  title: string
  description: string
  weight_percent: number
  estimated_minutes: number | null
  order_index: number
  is_locked?: boolean
}

interface SkillCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const categories = [
  { value: 'music', label: 'MUSIC', emoji: '🎵' },
  { value: 'fitness', label: 'FITNESS', emoji: '💪' },
  { value: 'learning', label: 'LEARNING', emoji: '📚' },
  { value: 'creative', label: 'CREATIVE', emoji: '🎨' },
  { value: 'other', label: 'OTHER', emoji: '📌' },
]

export function SkillCreationModal({ isOpen, onClose, onSuccess }: SkillCreationModalProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  // Step 1: Basic info
  const [skillData, setSkillData] = useState({
    title: '',
    category: 'other',
    description: '',
    target_date: '',
    cover_emoji: '',
  })

  // Step 2: Milestones
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { id: '1', title: '', description: '', weight_percent: 100, estimated_minutes: null, order_index: 0 }
  ])

  // Step 3: Settings
  const [settings, setSettings] = useState({
    sequential_locking: true,
  })

  const totalWeight = milestones.reduce((sum, m) => sum + (m.weight_percent || 0), 0)
  const isWeightValid = Math.abs(totalWeight - 100) < 0.01 // Allow for tiny floating point inaccuracies
  const canSubmit = skillData.title.trim() && milestones.length > 0 && milestones.every(m => m.title.trim()) && isWeightValid

  const handleAutoBalance = () => {
    const lockedMilestones = milestones.filter(m => m.is_locked)
    const nonLockedMilestones = milestones.filter(m => !m.is_locked)
    
    // Calculate sum of locked weights
    const lockedWeightSum = lockedMilestones.reduce((sum, m) => sum + (m.weight_percent || 0), 0)
    
    // Remaining weight to distribute
    const remainingWeight = 100 - lockedWeightSum
    
    if (nonLockedMilestones.length === 0) return
    
    // Calculate even weight with 1 decimal precision
    const rawEvenWeight = remainingWeight / nonLockedMilestones.length
    const evenWeight = Math.floor(rawEvenWeight * 10) / 10
    
    // Create redistributed array
    const redistributed = milestones.map(m => ({
      ...m,
      weight_percent: m.is_locked ? m.weight_percent : evenWeight
    }))
    
    // Calculate remainder and give to last non-locked milestone
    const currentSum = redistributed.reduce((sum, m) => sum + (m.weight_percent || 0), 0)
    const remainder = Math.round((100 - currentSum) * 10) / 10
    
    // Find last non-locked milestone index
    const lastNonLockedIndex = redistributed.map((m, i) => ({ ...m, index: i }))
      .filter(m => !m.is_locked)
      .pop()?.index
    
    if (lastNonLockedIndex !== undefined && remainder !== 0) {
      redistributed[lastNonLockedIndex].weight_percent = 
        Math.round((redistributed[lastNonLockedIndex].weight_percent + remainder) * 10) / 10
    }

    setMilestones(redistributed)
  }

  const handleAddMilestone = () => {
    const newWeight = milestones.length > 0 ? Math.round(100 / (milestones.length + 1)) : 100
    const redistributed = milestones.map(m => ({
      ...m,
      weight_percent: newWeight
    }))
    
    setMilestones([
      ...redistributed,
      {
        id: crypto.randomUUID(),
        title: '',
        description: '',
        weight_percent: newWeight,
        estimated_minutes: null,
        order_index: milestones.length,
      }
    ])
  }

  const handleRemoveMilestone = (id: string) => {
    const filtered = milestones.filter(m => m.id !== id)
    const newWeight = filtered.length > 0 ? Math.round(100 / filtered.length) : 0
    const redistributed = filtered.map((m, idx) => ({
      ...m,
      weight_percent: newWeight,
      order_index: idx
    }))
    setMilestones(redistributed)
  }

  const handleMilestoneChange = (id: string, field: keyof MilestoneInput, value: string | number | null) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ))
  }

  const handleSortMilestones = useCallback((newOrder: MilestoneInput[]) => {
    setMilestones(newOrder.map((m, idx) => ({ ...m, order_index: idx })))
  }, [])

  const handleGenerateAI = async () => {
    if (!skillData.title) return
    
    setIsGeneratingAI(true)
    setError(null)
    
    // Placeholder for AI API - simulating delay
    setTimeout(() => {
      const suggestedMilestones = generateMockAIMilestones(skillData.title, skillData.category)
      setMilestones(suggestedMilestones.map((m, idx) => ({ ...m, id: crypto.randomUUID(), order_index: idx })))
      setIsGeneratingAI(false)
    }, 1500)
  }

  const handleSubmit = async () => {
    if (!canSubmit) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')
      
      // Create skill
      const { data: skill, error: skillError } = await supabase
        .from('skills')
        .insert({
          user_id: user.id,
          title: skillData.title,
          category: skillData.category as any,
          description: skillData.description || null,
          target_date: skillData.target_date || null,
          cover_emoji: skillData.cover_emoji || null,
        })
        .select()
        .single()
      
      if (skillError) throw skillError
      
      // Create milestones
      const milestoneData = milestones.map((m, idx) => ({
        skill_id: skill.id,
        title: m.title,
        description: m.description || null,
        weight_percent: m.weight_percent,
        order_index: idx,
        status: 'not_started' as const,
        is_locked: settings.sequential_locking && idx > 0,
        estimated_minutes: m.estimated_minutes,
      }))
      
      const { error: milestoneError } = await supabase
        .from('milestones')
        .insert(milestoneData)
      
      if (milestoneError) throw milestoneError
      
      onSuccess()
      resetForm()
    } catch (err) {
      console.error('Skill creation error:', err)
      let errorMessage = 'Failed to create skill'
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (err && typeof err === 'object' && 'message' in err) {
        // This handles cases where err is an object but not an instance of Error, e.g., Supabase errors
        errorMessage = (err as any).message || errorMessage
      }

      // Append Supabase details if available and not null
      if (err && typeof err === 'object' && 'details' in err && (err as any).details) {
        errorMessage += `: ${(err as any).details}`
      }
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSkillData({ title: '', category: 'other', description: '', target_date: '', cover_emoji: '' })
    setMilestones([{ id: '1', title: '', description: '', weight_percent: 100, estimated_minutes: null, order_index: 0 }])
    setSettings({ sequential_locking: true })
    setError(null)
  }

  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)
  
  const hasFormData = () => {
    return skillData.title.trim() || 
           skillData.description.trim() || 
           skillData.target_date || 
           skillData.cover_emoji ||
           milestones.some(m => m.title.trim())
  }
  
  const handleClose = () => {
    if (hasFormData()) {
      setShowDiscardConfirm(true)
    } else {
      resetForm()
      onClose()
    }
  }
  
  const confirmDiscard = () => {
    setShowDiscardConfirm(false)
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-[var(--ink-1)]/60 dark:bg-[var(--surface)]/70 backdrop-blur-sm"
      />
      
      {/* Modal */}
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
        className="relative w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] bg-[var(--surface-card)] border-t sm:border border-[var(--border-default)] shadow-2xl flex flex-col"
      >
        {/* Discard confirmation dialog */}
        <AnimatePresence>
          {showDiscardConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[var(--surface-card)] z-50 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="border-2 border-[var(--accent-red)] p-6 max-w-sm">
                <h3 className="font-display text-xl mb-2">RETRACTION NOTICE</h3>
                <p className="font-body text-[var(--ink-secondary)] mb-6">
                  Discard your unsaved skill? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDiscardConfirm(false)}
                    className="flex-1"
                  >
                    Continue Editing
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={confirmDiscard}
                    className="flex-1"
                  >
                    Discard
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Newspaper fold effect header */}
        <div className="bg-[var(--surface-elevated)] border-b border-[var(--border-default)] p-[var(--space-4)] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-display text-lg font-normal">NEW SKILL</span>
              {/* Roman numeral step indicator */}
              <span className="font-ui text-[var(--text-caption)] tracking-[0.08em] uppercase">
                {['I', 'II', 'III'].map((num, idx) => (
                  <span 
                    key={num} 
                    className={cn(
                      idx === step - 1 ? 'text-[var(--ink-primary)]' : 'text-[var(--ink-faint)]',
                      idx > 0 && 'ml-2'
                    )}
                  >
                    {idx > 0 && <span className="text-[var(--ink-faint)] mx-1">·</span>}
                    {num}
                  </span>
                ))}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-[var(--paper-tertiary)] transition-colors focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[var(--ink-secondary)]"
              data-pressable
            >
              <X className="w-5 h-5 text-[var(--ink-secondary)]" />
            </button>
          </div>
          
          {/* Step progress bar */}
          <div className="flex gap-1 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  'h-1 flex-1 transition-colors duration-[var(--duration-base)]',
                  s <= step ? 'bg-[var(--ink-primary)]' : 'bg-[var(--paper-ruled)]'
                )}
              />
            ))}
          </div>
        </div>

        {/* Content - scrollable on mobile */}
        <div className="p-[var(--space-6)] overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Title */}
                <div className="space-y-[var(--space-3)]">
                  <Label>Skill Title *</Label>
                  <Input
                    value={skillData.title}
                    onChange={(e) => setSkillData({ ...skillData, title: e.target.value })}
                    placeholder="e.g., Learn Wonderwall on Guitar"
                  />
                </div>

                {/* Category tabs */}
                <div className="space-y-[var(--space-3)]">
                  <Label>Category *</Label>
                  <div className="flex flex-wrap gap-[var(--space-2)]">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setSkillData({ ...skillData, category: cat.value })}
                        className={cn(
                          'px-[var(--space-4)] py-[var(--space-2)] font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] border-2 transition-colors',
                          skillData.category === cat.value
                            ? 'border-[var(--ink-primary)] bg-[var(--ink-primary)] text-[var(--paper-primary)] dark:bg-[var(--paper-primary)] dark:text-[var(--ink-primary)]'
                            : 'border-[var(--paper-ruled)] hover:border-[var(--ink-secondary)]'
                        )}
                        data-pressable
                      >
                        <span className="mr-2">{cat.emoji}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-[var(--space-3)]">
                  <Label>Description</Label>
                  <textarea
                    value={skillData.description}
                    onChange={(e) => setSkillData({ ...skillData, description: e.target.value })}
                    placeholder="What do you want to achieve?"
                    rows={3}
                    className="w-full px-[var(--space-3)] py-[var(--space-2)] border border-[var(--paper-ruled)] bg-[var(--surface-card)] font-body text-[var(--text-body)] focus-visible:border-[var(--ink-secondary)] focus-visible:outline-none rounded-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-[var(--space-4)]">
                  {/* Target date */}
                  <div className="space-y-[var(--space-3)]">
                    <Label>Target Date</Label>
                    <Input
                      type="date"
                      value={skillData.target_date}
                      onChange={(e) => setSkillData({ ...skillData, target_date: e.target.value })}
                    />
                  </div>

                  {/* Emoji */}
                  <div className="space-y-[var(--space-3)]">
                    <Label>Cover Emoji</Label>
                    <Input
                      value={skillData.cover_emoji}
                      onChange={(e) => setSkillData({ ...skillData, cover_emoji: e.target.value })}
                      placeholder="🎸"
                      maxLength={2}
                      className="text-center text-lg"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-[var(--space-4)]"
              >
                {/* AI Suggestion Button */}
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI || !skillData.title}
                  className="w-full py-[var(--space-3)] border-2 border-dashed border-[var(--paper-ruled)] hover:border-[var(--ink-secondary)] transition-colors flex items-center justify-center gap-2 font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] disabled:opacity-40"
                  data-pressable
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Get AI Suggestions
                    </>
                  )}
                </button>

                {/* Milestone list with drag-and-drop */}
                <SortableMilestoneList
                  milestones={milestones}
                  onChange={handleMilestoneChange}
                  onRemove={handleRemoveMilestone}
                  onReorder={handleSortMilestones}
                />

                {/* Add milestone button */}
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="w-full py-[var(--space-3)] border-2 border-[var(--paper-ruled)] hover:border-[var(--ink-secondary)] transition-colors font-ui text-[var(--text-caption)] uppercase tracking-[0.08em]"
                  data-pressable
                >
                  + Add Milestone
                </button>

                {/* Weight validation with auto-balance - updates on every keystroke */}
                <WeightValidation
                  totalWeight={totalWeight}
                  target={100}
                  isError={!isWeightValid}
                  onAutoBalance={handleAutoBalance}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-[var(--space-6)]"
              >
                {/* Sequential locking toggle */}
                <div className="p-[var(--space-4)] border border-[var(--paper-ruled)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display text-[var(--text-subhead)] font-normal flex items-center gap-2">
                        {settings.sequential_locking ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        Sequential Locking
                      </h4>
                      <p className="font-body text-[var(--text-caption)] text-[var(--ink-tertiary)] mt-1">
                        Lock milestones until previous ones are completed
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, sequential_locking: !s.sequential_locking }))}
                      className={cn(
                        'w-12 h-6 transition-colors relative',
                        settings.sequential_locking ? 'bg-[var(--ink-primary)]' : 'bg-[var(--paper-ruled)]'
                      )}
                      data-pressable
                    >
                      <div className={cn(
                        'absolute top-1 w-4 h-4 bg-[var(--surface-card)] transition-transform',
                        settings.sequential_locking ? 'left-7' : 'left-1'
                      )} />
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-[var(--space-3)]">
                  <h4 className="font-display text-[var(--text-subhead)] font-normal">Summary</h4>
                  <div className="p-[var(--space-4)] bg-[var(--surface-elevated)] space-y-[var(--space-2)] font-ui text-[var(--text-caption)]">
                    <div className="flex justify-between">
                      <span className="text-[var(--ink-tertiary)]">Skill:</span>
                      <span className="text-[var(--ink-primary)]">{skillData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--ink-tertiary)]">Category:</span>
                      <span className="text-[var(--ink-primary)] uppercase">{skillData.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--ink-tertiary)]">Milestones:</span>
                      <span className="text-[var(--ink-primary)] tabular-nums">{milestones.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--ink-tertiary)]">Sequential:</span>
                      <span className="text-[var(--ink-primary)]">{settings.sequential_locking ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-[var(--space-3)] border-l-[3px] border-l-[var(--accent-red)] bg-[var(--surface-elevated)]">
                    <p className="font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] text-[var(--accent-red)]">
                      Error: {error}
                    </p>
                  </div>
                )}

                {/* Validation feedback */}
                {!canSubmit && (
                  <div className="p-[var(--space-3)] border-l-[3px] border-l-[var(--ink-secondary)] bg-[var(--surface-elevated)]">
                    <p className="font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] text-[var(--ink-secondary)] mb-2">
                      Please fix:
                    </p>
                    <ul className="font-body text-[var(--text-caption)] text-[var(--ink-tertiary)] space-y-1">
                      {!skillData.title.trim() && <li>• Add a skill title</li>}
                      {milestones.length === 0 && <li>• Add at least one milestone</li>}
                      {milestones.length > 0 && !milestones.every(m => m.title.trim()) && <li>• Fill in all milestone titles</li>}
                      {!isWeightValid && <li>• Milestone weights must total 100% (currently {totalWeight}%)</li>}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer buttons */}
        <div className="p-[var(--space-4)] border-t border-[var(--border-default)] bg-[var(--surface-elevated)] flex justify-between flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(s => s - 1) : handleClose()}
          >
            {step > 1 ? (
              <><ChevronLeft className="w-4 h-4 mr-1" /> Back</>
            ) : (
              'Cancel'
            )}
          </Button>
          
          {step < 3 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !skillData.title.trim()}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isLoading}
            >
              {isLoading ? (
                'Creating...'
              ) : (
                'Create Skill'
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// Mock AI milestone generator (placeholder for actual LLM API)
function generateMockAIMilestones(title: string, category: string): Omit<MilestoneInput, 'id' | 'order_index'>[] {
  const templates: Record<string, string[]> = {
    music: ['Learn basic chords', 'Practice strumming patterns', 'Master chord transitions', 'Learn the song structure', 'Practice with metronome', 'Play along with recording', 'Perform from memory'],
    fitness: ['Set baseline metrics', 'Create workout schedule', 'Learn proper form', 'Build endurance', 'Increase intensity', 'Track progress', 'Achieve target goal'],
    learning: ['Gather resources', 'Create study plan', 'Learn fundamentals', 'Practice exercises', 'Build projects', 'Review and test', 'Master advanced concepts'],
    creative: ['Gather inspiration', 'Learn techniques', 'Sketch/practice drafts', 'Develop style', 'Create portfolio pieces', 'Seek feedback', 'Complete final project'],
    other: ['Define objectives', 'Research approach', 'Create action plan', 'Execute phase 1', 'Execute phase 2', 'Review progress', 'Complete and evaluate'],
  }
  
  const template = templates[category] || templates.other
  const weight = Math.round(100 / template.length)
  
  return template.slice(0, 6).map((t, i) => ({
    title: t,
    description: '',
    weight_percent: i === 5 ? 100 - weight * 5 : weight,
    estimated_minutes: 30 + Math.floor(Math.random() * 60),
  }))
}
