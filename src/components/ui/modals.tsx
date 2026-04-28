'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Trash2, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RetractionNoticeProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  skillTitle: string
  sessionCount: number
  isLoading?: boolean
}

export function RetractionNoticeModal({
  isOpen,
  onClose,
  onConfirm,
  skillTitle,
  sessionCount,
  isLoading = false,
}: RetractionNoticeProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[var(--space-4)]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--ink-primary)]/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[var(--surface-card)] border-2 border-[var(--accent-red)] shadow-2xl overflow-hidden"
          >
            {/* Retraction header */}
            <div className="bg-[var(--surface-elevated)] border-b border-[var(--border-default)] p-[var(--space-6)] text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-[var(--accent-red)] mb-4">
                <AlertTriangle className="w-8 h-8 text-[var(--accent-red)]" />
              </div>
              <h2 className="font-display text-xl font-normal text-[var(--ink-primary)] uppercase tracking-[0.08em]">
                RETRACTION NOTICE
              </h2>
              <p className="font-ui text-[var(--text-caption)] text-[var(--accent-red)] mt-1 uppercase tracking-[0.08em]">
                Permanent Removal Requested
              </p>
            </div>

            <div className="p-[var(--space-6)]">
              <p className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] mb-[var(--space-4)]">
                The following skill and all associated data will be permanently removed:
              </p>

              <div className="p-[var(--space-4)] bg-[var(--surface-elevated)] border border-[var(--border-default)]">
                <h3 className="font-display text-lg font-normal text-[var(--ink-primary)] mb-2">
                  {skillTitle}
                </h3>
                <p className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)]">
                  {sessionCount} session{sessionCount !== 1 ? 's' : ''} will be deleted
                </p>
              </div>

              <p className="font-body text-[var(--text-caption)] text-[var(--ink-tertiary)] mt-[var(--space-4)]">
                This action cannot be undone. All milestones, sessions, and progress data will be permanently removed from our records.
              </p>
            </div>

            <div className="p-[var(--space-4)] border-t border-[var(--border-default)] bg-[var(--surface-elevated)] flex gap-[var(--space-3)]">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                variant="destructive"
                className="flex-1"
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isLoading ? 'Deleting...' : 'Confirm Retraction'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

interface WeightValidationProps {
  totalWeight: number
  target: number
  isError: boolean
  onAutoBalance: () => void
  className?: string
}

export function WeightValidation({
  totalWeight,
  target,
  isError,
  onAutoBalance,
  className,
}: WeightValidationProps) {
  // Handle NaN/undefined - treat empty as 0
  const safeTotal = isNaN(totalWeight) ? 0 : totalWeight
  const displayTotal = Math.round(safeTotal)
  
  return (
    <div className={cn('space-y-[var(--space-2)]', className)}>
      <div
        className={cn(
          'flex items-center justify-between py-[var(--space-2)] px-[var(--space-3)] font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] border',
          isError 
            ? 'border-l-[3px] border-l-[var(--accent-red)] border-[var(--border-default)] text-[var(--accent-red)]' 
            : 'border-l-[3px] border-l-[var(--accent-green)] border-[var(--border-default)] text-[var(--accent-green)]'
        )}
      >
        <span>Total Weight:</span>
        <span className="tabular-nums">{displayTotal}%</span>
      </div>
      
      {isError && (
        <div className="flex items-center gap-[var(--space-2)]">
          <p className="flex-1 font-ui text-[var(--text-caption)] text-[var(--accent-red)]">
            Weights must sum to exactly {target}%
          </p>
          <Button
            type="button"
            onClick={onAutoBalance}
            variant="ghost"
            size="sm"
          >
            <Scale className="w-3 h-3 mr-1" />
            Auto-balance
          </Button>
        </div>
      )}
    </div>
  )
}