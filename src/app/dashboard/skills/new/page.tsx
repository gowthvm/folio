'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

const categories = [
  { value: 'music', label: 'Music', emoji: '🎵' },
  { value: 'fitness', label: 'Fitness', emoji: '💪' },
  { value: 'learning', label: 'Learning', emoji: '📚' },
  { value: 'creative', label: 'Creative', emoji: '🎨' },
  { value: 'other', label: 'Other', emoji: '📌' },
]

export default function NewSkillPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    category: 'other',
    description: '',
    target_date: '',
    cover_emoji: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError('You must be signed in to create a skill')
      setIsLoading(false)
      return
    }

    const { data, error: insertError } = await supabase
      .from('skills')
      .insert({
        user_id: user.id,
        title: formData.title,
        category: formData.category as any,
        description: formData.description || null,
        target_date: formData.target_date || null,
        cover_emoji: formData.cover_emoji || null,
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    router.push(`/dashboard/skills/${data.id}`)
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Link */}
      <Link
        href="/dashboard/skills"
        className="inline-flex items-center gap-2 font-body text-sm text-[var(--ink-3)] hover:text-[var(--ink-2)] mb-6"
        data-pressable
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Skills
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Start a New Skill</h1>
        <p className="font-body text-sm text-[var(--ink-3)] mt-1">
          Create a new skill to track your learning journey
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card-newsprint p-6 space-y-6">
        {error && (
          <div className="p-3 text-sm font-body border border-[var(--accent-red)] bg-[var(--accent-red)]/10 text-[var(--accent-red)] dark:bg-[var(--accent-red)]/20 dark:text-[var(--accent-red)] dark:border-[var(--accent-red)]">
            <span className="font-semibold">ERROR: </span>
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title" className="font-body text-xs uppercase tracking-wider">
            Skill Title *
          </Label>
          <Input
            id="title"
            placeholder="e.g., Learn Wonderwall on Guitar"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="font-body"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase tracking-wider">
            Category *
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat.value })}
                className={`flex items-center gap-2 p-3 border font-body text-sm transition-colors ${
                  formData.category === cat.value
                    ? 'border-[var(--ink-1)] bg-[var(--surface)] dark:border-[var(--ink-1)] dark:bg-[var(--surface)]'
                    : 'border-[var(--rule)] hover:border-[var(--rule)]/50 dark:border-[var(--rule)]'
                }`}
                disabled={isLoading}
                data-pressable
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="font-mono text-xs uppercase tracking-wider">
            Description
          </Label>
          <textarea
            id="description"
            rows={3}
            placeholder="What do you want to achieve?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--rule)] bg-[var(--surface)] font-body text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink-1)]/20 dark:bg-[var(--surface)] dark:border-[var(--rule)]"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target_date" className="font-mono text-xs uppercase tracking-wider">
              Target Date
            </Label>
            <Input
              id="target_date"
              type="date"
              value={formData.target_date}
              onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
              className="font-body"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover_emoji" className="font-mono text-xs uppercase tracking-wider">
              Cover Emoji
            </Label>
            <Input
              id="cover_emoji"
              placeholder="🎸"
              maxLength={2}
              value={formData.cover_emoji}
              onChange={(e) => setFormData({ ...formData, cover_emoji: e.target.value })}
              className="font-mono text-center text-lg"
              disabled={isLoading}
            />
          </div>
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
              'Create Skill'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
