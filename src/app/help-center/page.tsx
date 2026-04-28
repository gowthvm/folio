import Link from 'next/link'
import { ArrowLeft, BookOpen, MessageSquare, Zap } from 'lucide-react'

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-[var(--rule)]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-ui text-[0.7rem] text-[var(--ink-3)] uppercase tracking-[0.08em] hover:text-[var(--ink-1)] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-[var(--ink-1)] leading-tight mb-4">
            Help Center
          </h1>
          <p className="font-body text-[var(--text-body)] text-[var(--ink-3)] max-w-2xl">
            Everything you need to know about using Folio to track your skills and progress.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Quick Start */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-[var(--ink-1)]" />
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Getting Started</h2>
          </div>
          <div className="space-y-6">
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Creating Your First Skill
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                Click the &quot;New Skill&quot; button in your dashboard to create your first skill. Give it a title, description, and set your target date. Add milestones to break down your skill into achievable steps.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Logging Sessions
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                After creating milestones, you can log practice sessions. Each session records the time spent and any notes about your practice. This builds your progress history and helps you track improvement over time.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Understanding XP and Streaks
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                Complete milestones to earn XP. Maintain daily practice to build your streak. Streaks help you stay consistent, while XP shows your overall progress across all skills.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-[var(--ink-1)]" />
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Features</h2>
          </div>
          <div className="space-y-6">
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Dashboard
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                Your main hub showing all active skills, streaks, and XP. Quickly access any skill or create new ones from here.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Analytics
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                View detailed statistics about your learning journey. Track session frequency, category breakdown, and personal records.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Archive
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                Completed or archived skills live here. Restore them anytime or keep them as a record of your achievements.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-[var(--ink-1)]" />
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Can I delete a skill?
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                Yes, you can archive skills instead of deleting them. Archived skills are moved to the Archive section where they can be restored if needed.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                How is XP calculated?
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                XP is earned by completing milestones. Each milestone has a weight percentage, and completing it adds that percentage to your total XP for that skill.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                What happens if I miss a day?
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                Missing a day resets your current streak, but your longest streak is preserved. Don&apos;t worry—just start again tomorrow and build a new streak.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
