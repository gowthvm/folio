'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NewMilestonePage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    weight_percent: '',
    order_index: '0',
    estimated_minutes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const weight = parseFloat(formData.weight_percent)

    if (isNaN(weight) || weight <= 0 || weight > 100) {
      setError('Weight must be between 0 and 100')
      setIsLoading(false)
      return
    }

    const milestoneData = {
      skill_id: params.id,
      title: formData.title,
      description: formData.description || null,
      weight_percent: weight,
      order_index: parseInt(formData.order_index) || 0,
      estimated_minutes: formData.estimated_minutes ? parseInt(formData.estimated_minutes) : null,
      status: 'not_started',
      is_locked: false,
    }

    const { error: insertError } = await supabase
      .from('milestones')
      .insert(milestoneData as any)

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    router.push(`/dashboard/skills/${params.id}`)
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={`/dashboard/skills/${params.id}`}
        className="inline-flex items-center gap-2 font-body text-sm text-[var(--ink-3)] hover:text-[var(--ink-2)] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Skill
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Add Milestone</h1>
        <p className="font-body text-sm text-[var(--ink-3)] mt-1">
          Create a new milestone for this skill
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-newsprint p-6 space-y-6">
        {error && (
          <div className="p-3 text-sm font-body border border-[var(--accent-red)] bg-[var(--accent-red)]/10 text-[var(--accent-red)] dark:bg-[var(--accent-red)]/20 dark:text-[var(--accent-red)] dark:border-[var(--accent-red)]">
            <span className="font-semibold">ERROR: </span>
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title" className="font-body text-xs uppercase tracking-wider">
            Milestone Title *
          </Label>
          <Input
            id="title"
            placeholder="e.g., Learn basic chords"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="font-body"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="font-mono text-xs uppercase tracking-wider">
            Description
          </Label>
          <textarea
            id="description"
            rows={2}
            placeholder="What does this milestone entail?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--rule)] bg-[var(--surface)] font-body text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink-1)]/20 dark:bg-[var(--surface)] dark:border-[var(--rule)]"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight_percent" className="font-mono text-xs uppercase tracking-wider">
              Weight (%) *
            </Label>
            <Input
              id="weight_percent"
              type="number"
              min="0"
              max="100"
              step="1"
              placeholder="50"
              value={formData.weight_percent}
              onChange={(e) => setFormData({ ...formData, weight_percent: e.target.value })}
              className="font-body"
              required
              disabled={isLoading}
            />
            <p className="font-body text-xs text-[var(--ink-3)]">
              All milestones must sum to 100%
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="order_index" className="font-mono text-xs uppercase tracking-wider">
              Order
            </Label>
            <Input
              id="order_index"
              type="number"
              min="0"
              placeholder="0"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
              className="font-body"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimated_minutes" className="font-mono text-xs uppercase tracking-wider">
            Estimated Time (minutes)
          </Label>
          <Input
            id="estimated_minutes"
            type="number"
            min="0"
            placeholder="60"
            value={formData.estimated_minutes}
            onChange={(e) => setFormData({ ...formData, estimated_minutes: e.target.value })}
            className="font-body"
            disabled={isLoading}
          />
        </div>

        <div className="pt-4 border-t border-[var(--rule)]">
          <Button
            type="submit"
            className="w-full font-body uppercase tracking-wider"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Create Milestone'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
