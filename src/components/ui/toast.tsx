'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Toast {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

interface ToastContextValue {
  showToast: (message: string, type?: Toast['type']) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[var(--z-toast)] pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.length > 0 && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
            className="news-ticker pointer-events-auto"
          >
            {toasts.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onRemove={() => onRemove(toast.id)} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const prefix = {
    info: 'UPDATE:',
    success: 'CONFIRMED:',
    warning: 'NOTICE:',
    error: 'ALERT:',
  }[toast.type]

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="font-ui text-[var(--text-body)] text-[var(--ink-primary)]">
        <span className="font-ui text-[var(--text-caption)] uppercase tracking-[0.15em] text-[var(--ink-secondary)] mr-2">
          {prefix}
        </span>
        <span>{toast.message}</span>
      </p>
      <button
        onClick={onRemove}
        className="font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[var(--ink-primary)]"
      >
        DISMISS
      </button>
    </div>
  )
}