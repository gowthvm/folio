import type { Metadata } from 'next'
import './tokens.css'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Footer } from '@/components/ui/footer'
import ClickSpark from '@/components/ui/click-spark'

export const metadata: Metadata = {
  title: 'Folio — Skill Tracker',
  description: 'Track your learning journey with Folio',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
}

// FOUC prevention script - runs before React hydrates
const themeScript = `
  (function() {
    try {
      const stored = localStorage.getItem('folio-theme')
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const theme = stored || (systemDark ? 'dark' : 'light')
      document.documentElement.setAttribute('data-theme', theme)
    } catch (e) {}
  })()
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}
          storageKey="folio-theme"
        >
          <ClickSpark sparkSize={15} sparkRadius={20} sparkCount={12} duration={500}>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--ink-primary)] focus:text-[var(--paper-primary)] dark:focus:bg-[var(--paper-primary)] dark:focus:text-[var(--ink-primary)] focus:rounded"
            >
              Skip to content
            </a>
            <div id="main-content" className="flex flex-col min-h-screen">
              {children}
              <Footer />
            </div>
          </ClickSpark>
        </ThemeProvider>
      </body>
    </html>
  )
}
