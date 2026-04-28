'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface NewspaperEmptyProps {
  title?: string
  message?: string
  cta?: string
  ctaHref?: string
  onCtaClick?: () => void
}

export function NewspaperEmpty({
  title = 'No Edition This Week',
  message = 'The presses are warming up.',
  cta = 'Return to Dashboard',
  ctaHref = '/dashboard',
  onCtaClick,
}: NewspaperEmptyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="
        text-center p-8 md:p-12
        bg-paper-50 dark:bg-wiki-darker
        border-2 border-dashed border-ink-200/20 dark:border-wiki-border/50
      ">
        {/* Blank newspaper header */}
        <div className="mb-6 space-y-2">
          <div className="h-6 bg-ink-100/10 dark:bg-wiki-border/30 w-64 mx-auto" />
          <div className="border-t border-b border-ink-200/20 dark:border-wiki-border py-2 my-4">
            <div className="h-3 bg-ink-100/10 dark:bg-wiki-border/30 w-32 mx-auto mb-2" />
            <div className="h-3 bg-ink-100/10 dark:bg-wiki-border/30 w-48 mx-auto" />
          </div>
        </div>

        {/* Redacted placeholder areas */}
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-ink-100/10 dark:bg-wiki-border/30 w-full max-w-xs mx-auto rounded" />
          <div className="h-4 bg-ink-100/10 dark:bg-wiki-border/30 w-4/5 mx-auto rounded" />
          <div className="h-4 bg-ink-100/10 dark:bg-wiki-border/30 w-3/5 mx-auto rounded" />
        </div>

        <div className="border-t border-ink-200/10 dark:border-wiki-border pt-6">
          <p className="font-serif text-2xl text-ink-200 dark:text-wiki-text mb-2">
            {title}
          </p>
          <p className="font-mono text-sm text-ink-50 dark:text-wiki-muted">
            {message}
          </p>
        </div>

        {(cta || ctaHref) && (
          <div className="mt-6">
            {onCtaClick ? (
              <Button onClick={onCtaClick} className="font-mono">
                {cta}
              </Button>
            ) : ctaHref ? (
              <Link href={ctaHref as any}>
                <Button className="font-mono">
                  {cta}
                </Button>
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </motion.div>
  )
}