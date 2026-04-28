'use client'

import { memo } from 'react'

interface BlockProgressProps {
  progress: number
  totalBlocks?: number
  className?: string
}

export const BlockProgress = memo(function BlockProgress({ 
  progress, 
  totalBlocks = 10,
  className = ''
}: BlockProgressProps) {
  // Clamp progress to 0-100
  const clampedProgress = Math.min(100, Math.max(0, progress))
  
  // Calculate filled blocks
  const filledBlocks = Math.round((clampedProgress / 100) * totalBlocks)
  
  // Generate the block string
  const filled = '■'.repeat(filledBlocks)
  const empty = '□'.repeat(totalBlocks - filledBlocks)
  
  return (
    <span 
      className={`block-progress ${className}`}
      aria-label={`${clampedProgress}% complete`}
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className="filled">{filled}</span>
      <span className="empty">{empty}</span>
      {' '}
      <span className="filled tabular-number">{clampedProgress}%</span>
    </span>
  )
})
