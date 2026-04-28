import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Database, Lock } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="font-body text-[var(--text-body)] text-[var(--ink-3)] max-w-2xl">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <section>
          <p className="font-body text-[var(--text-body)] text-[var(--ink-3)] leading-relaxed">
            At Folio, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information. By using Folio, you agree to the practices described in this policy.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-6 h-6 text-[var(--ink-1)]" />
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Information We Collect</h2>
          </div>
          <div className="space-y-4">
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Account Information
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                When you create an account, we collect your email address and any information you voluntarily provide, such as your name and profile details.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Skill Data
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                We store information about the skills you track, including titles, descriptions, milestones, sessions, progress, and any notes you add. This data is essential for the service to function.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Usage Data
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                We may collect information about how you use Folio, such as login frequency, features used, and general usage patterns. This helps us improve the service.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-[var(--ink-1)]" />
            <h2 className="font-display text-2xl text-[var(--ink-1)]">How We Use Your Information</h2>
          </div>
          <div className="space-y-4">
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Service Provision
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                We use your information to provide, maintain, and improve the Folio service, including storing your skill data and displaying your progress.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Communication
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                We may use your email to send you important updates about your account, security notifications, and essential service communications.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Analytics
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                We analyze usage data to understand how people use Folio, identify areas for improvement, and develop new features.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-[var(--ink-1)]" />
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Data Security</h2>
          </div>
          <div className="space-y-4">
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Protection Measures
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                We implement industry-standard security measures to protect your data, including encryption, secure authentication, and regular security audits.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Data Storage
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                Your data is stored securely in our database. We maintain backups to prevent data loss and ensure service reliability.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Access Control
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                Access to your personal data is restricted to authorized personnel who need it to perform their job duties. We regularly review access permissions.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-[var(--ink-1)]" />
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Your Rights</h2>
          </div>
          <div className="space-y-4">
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Data Access
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                You can request a copy of all your personal data at any time through your account settings or by contacting us.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Data Deletion
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                You can delete your account and all associated data at any time. Upon deletion, your information will be permanently removed from our servers.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Data Correction
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                You can update or correct your personal information at any time through your account settings.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Third-Party Services</h2>
          </div>
          <div className="space-y-4">
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Authentication
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                We use Supabase for authentication and database services. Your data is stored securely through their infrastructure, which complies with industry security standards.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                No Data Selling
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                We do not sell, rent, or trade your personal information to third parties for marketing purposes. Your data is used solely to provide and improve the Folio service.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Changes to This Policy</h2>
          </div>
          <p className="font-body text-[var(--text-body)] text-[var(--ink-3)] leading-relaxed">
            We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Contact Us</h2>
          </div>
          <p className="font-body text-[var(--text-body)] text-[var(--ink-3)] leading-relaxed">
            If you have any questions about this privacy policy or how we handle your data, please contact us at <Link href="/contact" className="text-[var(--ink-1)] hover:underline">support@folio.app</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
