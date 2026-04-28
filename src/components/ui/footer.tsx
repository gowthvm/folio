'use client'

import Link from 'next/link'
import { Github, Twitter, Mail } from 'lucide-react'

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`border-t border-[var(--border-default)] mt-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="font-display text-2xl text-[var(--ink-primary)] tracking-tight">
              FOLIO
            </Link>
            <p className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] mt-2 max-w-md">
              The daily skill tracker. Turn your goals into structured narratives — milestones, sessions, and progress you can trace.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center hover:bg-[var(--paper-tertiary)] transition-colors">
                <Github className="w-4 h-4 text-[var(--ink-secondary)]" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center hover:bg-[var(--paper-tertiary)] transition-colors">
                <Twitter className="w-4 h-4 text-[var(--ink-secondary)]" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center hover:bg-[var(--paper-tertiary)] transition-colors">
                <Mail className="w-4 h-4 text-[var(--ink-secondary)]" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-ui text-[0.65rem] text-[var(--ink-tertiary)] uppercase tracking-wider mb-4">
              PRODUCT
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/skills" className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]">
                  Skills
                </Link>
              </li>
              <li>
                <Link href="/dashboard/stats" className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/dashboard/archive" className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]">
                  Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-ui text-[0.65rem] text-[var(--ink-tertiary)] uppercase tracking-wider mb-4">
              SUPPORT
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help-center" className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border-default)] mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-ui text-[0.6rem] text-[var(--ink-tertiary)] uppercase tracking-wider">
            © {new Date().getFullYear()} FOLIO. ALL RIGHTS RESERVED.
          </p>
          <p className="font-body text-[var(--text-caption)] text-[var(--ink-tertiary)]">
            Vol. I · Edition {Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24))}
          </p>
        </div>
      </div>
    </footer>
  )
}
