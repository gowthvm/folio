'use client'

import { useState, useRef, lazy } from 'react'
import { Download, Copy, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const html2canvasPromise = () => import('html2canvas').then((mod: any) => ({ default: mod.default as any }))

let html2canvasModule: any = null

async function loadHtml2Canvas() {
  if (!html2canvasModule) {
    const mod = await html2canvasPromise()
    html2canvasModule = mod.default
  }
  return html2canvasModule
}

interface ShareableCardProps {
  skill: {
    title: string
    category: string
    cover_emoji: string | null
    completed_at: string
    total_xp: number
    milestones: { title: string; status: string }[]
    total_sessions?: number
  }
}

function Html2CanvasHandler({ 
  children, 
  onGenerate 
}: { 
  children: React.ReactNode
  onGenerate: () => void 
}) {
  return (
    <div>
      {children}
      <Button
        onClick={onGenerate}
        variant="outline"
        size="sm"
        className="font-body"
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
    </div>
  )
}

export function ShareableCard({ skill }: ShareableCardProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const completedMilestones = skill.milestones?.filter(m => m.status === 'completed') || []
  const totalMilestones = skill.milestones?.length || 0
  const completionDate = new Date(skill.completed_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const handleDownload = async () => {
    if (!cardRef.current) return

    setError(null)
    setIsGenerating(true)
    try {
      const html2canvas = await loadHtml2Canvas()
      const canvas = await html2canvas(cardRef.current, {
        background: 'var(--surface)',
      })

      const link = document.createElement('a')
      link.download = `${skill.title.toLowerCase().replace(/\s+/g, '-')}-certificate.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      setError('Failed to generate image. Please try again.')
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!cardRef.current) return

    setError(null)
    setIsGenerating(true)
    try {
      const html2canvas = await loadHtml2Canvas()
      const canvas = await html2canvas(cardRef.current, {
        background: 'var(--surface)',
      })

      canvas.toBlob(async (blob: Blob | null) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
        }
      })
    } catch (error) {
      setError('Failed to copy to clipboard. Please try again.')
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="p-3 bg-[var(--surface)] border border-[var(--accent-red)] text-[var(--accent-red)] text-sm text-center">
          {error}
        </div>
      )}

      {/* Preview card */}
      <div
        ref={cardRef}
        className="w-full max-w-md mx-auto p-6 bg-[var(--surface)] dark:bg-[var(--surface)] border-2 border-[var(--accent-sepia)] dark:border-[var(--accent-sepia)]"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {/* Header */}
        <div className="text-center border-b-2 border-[var(--accent-sepia)] dark:border-[var(--accent-sepia)] pb-4 mb-4">
          <p className="font-body text-xs uppercase tracking-widest text-[var(--accent-sepia)] dark:text-[var(--accent-sepia)]">
            Folio Certificate of Achievement
          </p>
        </div>

        {/* Completion stamp */}
        <div className="flex justify-center mb-4">
          <span className="font-display text-2xl font-bold text-[var(--accent-sepia)] dark:text-[var(--accent-sepia)] px-4 py-2 border-4 border-[var(--accent-sepia)] rotate-6">
            COMPLETED
          </span>
        </div>

        {/* Skill info */}
        <div className="text-center mb-6">
          <span className="text-6xl">{skill.cover_emoji || '🏆'}</span>
          <h2 className="font-display text-2xl font-bold mt-4 text-[var(--ink-1)] dark:text-[var(--ink-1)]">
            {skill.title}
          </h2>
          <p className="font-body text-xs text-[var(--ink-3)] mt-1 uppercase">
            {skill.category}
          </p>
        </div>

        {/* Key milestones */}
        <div className="mb-6">
          <p className="font-body text-xs text-center text-[var(--ink-3)] mb-2">Key Milestones Achieved</p>
          <div className="space-y-1">
            {completedMilestones.slice(0, 3).map((m, i) => (
              <p key={i} className="font-body text-xs text-center text-[var(--ink-1)] dark:text-[var(--ink-1)]">
                ✓ {m.title}
              </p>
            ))}
            {completedMilestones.length > 3 && (
              <p className="font-body text-xs text-center text-[var(--ink-3)]">
                +{completedMilestones.length - 3} more...
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--rule)]/30 dark:border-[var(--rule)]/30">
          <div className="text-center">
            <p className="font-body text-xs text-[var(--ink-3)]">Completed</p>
            <p className="font-display text-xl font-bold">
              {completedMilestones.length}/{totalMilestones}
            </p>
          </div>
          <div className="text-center">
            <p className="font-body text-xs text-[var(--ink-3)]">XP Earned</p>
            <p className="font-serif text-xl font-bold">{skill.total_xp}</p>
          </div>
        </div>

        {/* Date */}
        <p className="text-center font-body text-xs text-[var(--ink-3)] mt-4">
          {completionDate}
        </p>

        {/* Footer branding */}
        <p className="text-center font-body text-[10px] text-[var(--ink-3)] mt-4">
          Created with Folio
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-center">
        <Button
          onClick={handleDownload}
          disabled={isGenerating}
          variant="outline"
          size="sm"
          className="font-body"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Download
        </Button>
        <Button
          onClick={handleCopy}
          disabled={isGenerating}
          variant="outline"
          size="sm"
          className="font-body"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          Copy
        </Button>
      </div>
    </div>
  )
}