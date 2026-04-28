import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewspaperMasthead } from '@/components/auth/newspaper-masthead'
import { SignupForm } from '@/components/auth/signup-form'
import { PageTransition } from '@/components/ui/page-transition'

export default async function SignupPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            {/* Newspaper Card */}
            <div className="card-newsprint p-8 md:p-10 space-y-8">
              <NewspaperMasthead subtitle="NEW SUBSCRIPTION" />

              {/* Article Header */}
              <div className="text-center space-y-2">
                <h2 className="font-serif text-xl font-semibold">
                  Join Our Readership
                </h2>
                <p className="font-mono text-sm text-ink-50">
                  Create an account to start tracking your skills
                </p>
              </div>

              {/* Signup Form */}
              <SignupForm />

              {/* Footer */}
              <div className="pt-4 border-t border-ink-200/10">
                <p className="text-center font-mono text-sm text-ink-50">
                  Already subscribed?{' '}
                  <Link
                    href="/login"
                    className="underline underline-offset-4 hover:text-ink-200 font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Decorative footer text */}
            <p className="text-center font-mono text-xs text-ink-50 mt-6">
              © 2024 Folio Press. All rights reserved.
            </p>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
