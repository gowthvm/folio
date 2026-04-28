'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Radio } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsTickerProps {
  message: string
  type?: 'breaking' | 'correction' | 'update'
  onClose?: () => void
  autoClose?: number // seconds
}

export function NewsTicker({ 
  message, 
  type = 'breaking', 
  onClose,
  autoClose 
}: NewsTickerProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, autoClose * 1000)
      return () => clearTimeout(timer)
    }
  }, [autoClose, onClose])

  if (!isVisible) return null

  const styles = {
    breaking: 'bg-[var(--accent-red)] text-[var(--bg)] border-[var(--accent-red)]',
    correction: 'bg-[var(--surface)] text-[var(--ink-1)] border-[var(--rule)] dark:bg-[var(--surface)] dark:text-[var(--ink-1)] dark:border-[var(--rule)]',
    update: 'bg-[var(--ink-1)] text-[var(--bg)] border-[var(--ink-1)]',
  }

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'border-b-2',
        styles[type]
      )}
    >
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          {/* Breaking news indicator */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              {type === 'breaking' && 'BREAKING NEWS'}
              {type === 'correction' && 'CORRECTION'}
              {type === 'update' && 'UPDATE'}
            </span>
          </div>
          
          {/* Scrolling ticker line */}
          <div className="flex-1 overflow-hidden">
            <div className="font-mono text-sm whitespace-nowrap animate-marquee">
              {message}
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false)
              onClose()
            }}
            className="p-1 hover:bg-[var(--bg)]/20 rounded flex-shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

// Toast provider for managing multiple toasts
interface Toast {
  id: string
  message: string
  type: 'breaking' | 'correction' | 'update'
}

export function useNewsTicker() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showTicker = (message: string, type: Toast['type'] = 'breaking') => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, message, type }])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
    
    return id
  }

  const removeTicker = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const TickerContainer = () => (
    <div className="fixed top-0 left-0 right-0 z-50 space-y-1">
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            style={{ marginTop: index > 0 ? '2px' : '0' }}
          >
            <NewsTicker
              message={toast.message}
              type={toast.type}
              onClose={() => removeTicker(toast.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )

  return { showTicker, removeTicker, TickerContainer }
}

// Simple toast hook for inline usage
export function Toast({ 
  children,
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn(
      'p-3 bg-[var(--bg)] dark:bg-[var(--surface)] border border-[var(--rule)]',
      'font-body text-sm',
      className
    )}>
      {children}
    </div>
  )
}
