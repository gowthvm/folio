'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--bg)] p-8">
          <div className="max-w-2xl mx-auto">
            <div className="font-ui text-[var(--text-caption)] text-[var(--accent-red)] uppercase tracking-[0.15em] mb-4">
              EDITION ERROR
            </div>
            <div className="h-[3px] bg-[var(--accent-red)] mb-6" />
            
            <h1 className="font-display text-[var(--text-headline)] text-[var(--ink-primary)] mb-4">
              Something went wrong
            </h1>
            
            <p className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] mb-6 leading-relaxed">
              We encountered an unexpected error while loading this page. The issue has been logged, and you can try refreshing or returning to the dashboard.
            </p>

            {this.state.error && (
              <details className="mb-6 p-4 bg-[var(--surface)] border border-[var(--rule)]">
                <summary className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] uppercase tracking-[0.08em] cursor-pointer">
                  Technical Details
                </summary>
                <pre className="mt-4 font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] overflow-auto text-xs">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            
            <div className="flex gap-4">
              <Button
                onClick={() => window.location.reload()}
                className="font-ui uppercase tracking-wider"
              >
                Refresh Page
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = '/dashboard')}
                className="font-ui uppercase tracking-wider"
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
