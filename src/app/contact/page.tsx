'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
            Contact Us
          </h1>
          <p className="font-body text-[var(--text-body)] text-[var(--ink-3)] max-w-2xl">
            Have questions, feedback, or ideas? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-display text-xl text-[var(--ink-1)] mb-6">Get in Touch</h2>
            <p className="font-body text-[var(--text-body)] text-[var(--ink-3)] mb-8">
              Whether you have a question about features, need help with your account, or want to share your experience with Folio, we&apos;re here to help.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[var(--ink-2)] mt-1" />
                <div>
                  <h3 className="font-ui text-[0.7rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-1">
                    Email
                  </h3>
                  <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                    support@folio.app
                  </p>
                </div>
              </div>
              
              <div className="p-6 border border-[var(--rule)]">
                <h3 className="font-ui text-[0.7rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                  Response Time
                </h3>
                <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                  We typically respond within 24-48 hours during business days. For urgent matters, please include &quot;URGENT&quot; in your subject line.
                </p>
              </div>

              <div className="p-6 border border-[var(--rule)]">
                <h3 className="font-ui text-[0.7rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2">
                  Before You Contact
                </h3>
                <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                  Check our <Link href="/help-center" className="text-[var(--ink-1)] hover:underline">Help Center</Link> for quick answers to common questions. You might find what you&apos;re looking for there.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-display text-xl text-[var(--ink-1)] mb-6">Send a Message</h2>
            
            {isSubmitted ? (
              <div className="p-8 border-2 border-[var(--accent-green)] bg-[var(--accent-green)]/5 text-center">
                <p className="font-display text-xl text-[var(--ink-1)] mb-2">Message Sent!</p>
                <p className="font-body text-[var(--text-body)] text-[var(--ink-3)]">
                  Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="font-ui text-[0.7rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2 block">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--rule)] font-body text-[var(--text-body)] text-[var(--ink-1)] focus:outline-none focus:border-[var(--ink-1)] transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="font-ui text-[0.7rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--rule)] font-body text-[var(--text-body)] text-[var(--ink-1)] focus:outline-none focus:border-[var(--ink-1)] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="font-ui text-[0.7rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2 block">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--rule)] font-body text-[var(--text-body)] text-[var(--ink-1)] focus:outline-none focus:border-[var(--ink-1)] transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="font-ui text-[0.7rem] text-[var(--ink-1)] uppercase tracking-[0.08em] mb-2 block">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--rule)] font-body text-[var(--text-body)] text-[var(--ink-1)] focus:outline-none focus:border-[var(--ink-1)] transition-colors resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[var(--ink-1)] text-[var(--bg)] font-ui text-[0.75rem] uppercase tracking-[0.08em] hover:bg-[var(--ink-2)] transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
