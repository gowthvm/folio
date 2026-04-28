import { Metadata } from 'next'
import { LandingPageContent } from './landing-page'

export const metadata: Metadata = {
  title: 'Folio — The Daily Skill Tracker',
  description: 'Turn your goals into structured stories. Track skills with milestones, sessions, and real progress.',
  openGraph: {
    title: 'Folio — The Daily Skill Tracker',
    description: 'Turn your goals into structured stories. Track skills with milestones, sessions, and real progress.',
    type: 'website',
    images: ['/api/og'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Folio — The Daily Skill Tracker',
    description: 'Turn your goals into structured stories. Track skills with milestones, sessions, and real progress.',
    images: ['/api/og'],
  },
}

export default async function LandingPage() {
  return <LandingPageContent />
}
