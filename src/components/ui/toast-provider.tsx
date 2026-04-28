'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

type ToastType = 'info' | 'success' | 'warning' | 'error'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

const MAX_TOASTS = 3
const AUTO_DISMISS_MS = 3500

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID()
    setToasts(prev => {
      // Max 3 toasts - if a 4th arrives, oldest auto-dismisses
      if (prev.length >= MAX_TOASTS) {
        return [...prev.slice(1), { id, message, type }]
      }
      return [...prev, { id, message, type }]
    })

    // Error toasts stay until manually dismissed
    if (type !== 'error') {
      setTimeout(() => {
        setToasts(current => current.filter(t => t.id !== id))
      }, AUTO_DISMISS_MS)
    }
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[var(--z-toast)] pointer-events-none flex flex-col gap-[var(--space-3)]">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ 
              duration: 0.24, 
              ease: [0.4, 0, 0.2, 1] 
            }}
            className="pointer-events-auto"
          >
            <ToastItem 
              toast={toast} 
              onDismiss={() => onDismiss(toast.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  onDismiss: () => void
}

const typeStyles: Record<ToastType, string> = {
  info: 'border-l-[var(--ink-primary)]',
  success: 'border-l-[var(--accent-green)]',
  warning: 'border-l-[var(--accent-sepia)]',
  error: 'border-l-[var(--accent-red)]',
}

// Loading dots animation component
function LoadingDots() {
  const [dots, setDots] = useState(1)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => (d % 3) + 1)
    }, 400)
    return () => clearInterval(interval)
  }, [])
  
  return <span className="tabular-nums">{'.'.repeat(dots)}</span>
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const isLoading = toast.message.includes('...') || toast.type === 'warning'
  
  return (
    <div
      className={cn(
        'p-[var(--space-3)] pr-[var(--space-4)]',
        'bg-[var(--surface-card)] border border-[var(--border-default)]',
        'border-l-[3px]',
        typeStyles[toast.type],
        'shadow-lg',
        'min-w-[280px] max-w-[400px]',
        'flex items-start gap-[var(--space-3)]'
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] text-[var(--ink-primary)]">
          {isLoading ? (
            <>
              {toast.message.replace(/\.+$/, '')}<LoadingDots />
            </>
          ) : (
            toast.message
          )}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 hover:bg-[var(--paper-tertiary)] transition-colors flex-shrink-0 focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[var(--ink-secondary)]"
        aria-label="Dismiss notification"
      >
        <X className="w-3 h-3 text-[var(--ink-tertiary)]" />
      </button>
    </div>
  )
}