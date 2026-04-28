import Link from 'next/link'
import { ArrowLeft, FileText, AlertTriangle, Users, Gavel } from 'lucide-react'

export default function TermsOfServicePage() {
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
            Terms of Service
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
            Welcome to Folio. By using our service, you agree to these terms of service. Please read them carefully to understand your rights and responsibilities.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-[var(--ink-1)]" />
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Acceptance of Terms</h2>
          </div>
          <div className="space-y-4">
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Agreement
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                By accessing or using Folio, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the service.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Age Requirement
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                You must be at least 13 years old to use Folio. By using the service, you represent that you are of legal age to form a binding contract with Folio.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Account Creation
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                To use certain features of Folio, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-[var(--ink-1)]" />
            <h2 className="font-display text-2xl text-[var(--ink-1)]">User Responsibilities</h2>
          </div>
          <div className="space-y-4">
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Accurate Information
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Acceptable Use
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                You agree not to use Folio for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction, including intellectual property laws.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Prohibited Activities
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                You may not attempt to gain unauthorized access to any portion of the service, use the service to distribute malware, or interfere with the service&apos;s operation.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-[var(--ink-1)]" />
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Content and Intellectual Property</h2>
          </div>
          <div className="space-y-4">
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Your Content
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                You retain ownership of all content you create or input into Folio, including skills, milestones, sessions, and notes. You grant us a license to store, process, and display this content to provide the service.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Service Content
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                The design, layout, and overall appearance of Folio, including all text, graphics, and code, are owned by Folio and protected by intellectual property laws.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Feedback
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                Any feedback, suggestions, or ideas you provide about Folio become our property and may be used to improve the service without compensation to you.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Gavel className="w-6 h-6 text-[var(--ink-1)]" />
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Service Availability and Modifications</h2>
          </div>
          <div className="space-y-4">
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Service Changes
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                We reserve the right to modify, suspend, or discontinue the service at any time without prior notice. We are not liable to you or any third party for any modification, suspension, or discontinuation.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Updates
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                We may update the service from time to time to add new features, improve functionality, or fix bugs. These updates are automatically applied and you agree to receive them.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                Termination
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                We may terminate or suspend your account at any time for violation of these terms or for any other reason at our sole discretion. Upon termination, your right to use the service will immediately cease.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Disclaimer of Warranties</h2>
          </div>
          <div className="space-y-4">
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                As Is
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                Folio is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </div>
            <div className="p-6 border border-[var(--rule)]">
              <h3 className="font-ui text-[0.75rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                No Guarantee
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                We do not guarantee that the service will be uninterrupted, secure, or error-free. We are not responsible for any loss or damage resulting from your use of the service.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Limitation of Liability</h2>
          </div>
          <p className="font-body text-[var(--text-body)] text-[var(--ink-3)] leading-relaxed">
            To the fullest extent permitted by law, Folio shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation loss of profits, data, use, or other intangible losses, resulting from your access to or use of the service.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Governing Law</h2>
          </div>
          <p className="font-body text-[var(--text-body)] text-[var(--ink-3)] leading-relaxed">
            These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Folio is operated, without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Changes to Terms</h2>
          </div>
          <p className="font-body text-[var(--text-body)] text-[var(--ink-3)] leading-relaxed">
            We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page. Your continued use of the service after such modifications constitutes your acceptance of the new terms.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl text-[var(--ink-1)]">Contact Information</h2>
          </div>
          <p className="font-body text-[var(--text-body)] text-[var(--ink-3)] leading-relaxed">
            If you have any questions about these Terms of Service, please contact us at <Link href="/contact" className="text-[var(--ink-1)] hover:underline">support@folio.app</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
