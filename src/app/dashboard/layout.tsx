import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewspaperMasthead, MobileMasthead } from '@/components/dashboard/newspaper-masthead'
import { BottomNav } from '@/components/dashboard/bottom-nav'
import { PageTransition } from '@/components/ui/page-transition'
import { ToastProvider } from '@/components/ui/toast-provider'
import { XPProvider } from '@/components/ui/xp-popup'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { PracticeReminder } from '@/components/ui/practice-reminder'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <ToastProvider>
      <XPProvider>
        <div className="layout-root min-h-screen pb-20 md:pb-0">
          {/* Main content */}
          <div className="layout-main">
            {/* Masthead inside content-inner for full-bleed rule support */}
            <div className="content-inner pt-[var(--space-6)]">
              <div className="hidden md:block">
                <NewspaperMasthead />
              </div>
              <div className="md:hidden">
                <MobileMasthead />
              </div>
            </div>

            {/* Page content */}
            <main className="content-inner flex-1">
              <PageTransition>
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </PageTransition>
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="md:hidden">
            <BottomNav />
          </div>
        </div>

        {/* Practice Reminder */}
        <PracticeReminder />
      </XPProvider>
    </ToastProvider>
  )
}