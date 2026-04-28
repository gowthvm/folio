'use client'

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface XPEntry {
  id: string
  amount: number
}

interface XPContextValue {
  showXP: (amount: number) => void
}

const XPContext = createContext<XPContextValue | null>(null)

export function useXP() {
  const context = useContext(XPContext)
  if (!context) {
    throw new Error('useXP must be used within an XPProvider')
  }
  return context
}

interface XPProviderProps {
  children: ReactNode
}

export function XPProvider({ children }: XPProviderProps) {
  const [entries, setEntries] = useState<XPEntry[]>([])

  const showXP = useCallback((amount: number) => {
    const id = crypto.randomUUID()
    setEntries(prev => [...prev, { id, amount }])

    setTimeout(() => {
      setEntries(prev => prev.filter(e => e.id !== id))
    }, 1500)
  }, [])

  return (
    <XPContext.Provider value={{ showXP }}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-[var(--z-toast)] overflow-hidden">
        <AnimatePresence>
          {entries.map((entry, index) => (
            <XPFloatingText 
              key={entry.id} 
              amount={entry.amount} 
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </XPContext.Provider>
  )
}

interface XPFloatingTextProps {
  amount: number
  index: number
}

function XPFloatingText({ amount, index }: XPFloatingTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: 1, y: -32, scale: 1 }}
      exit={{ opacity: 0, y: -64 }}
      transition={{ 
        duration: 0.9, 
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="absolute left-1/2 -translate-x-1/2 top-1/3"
      style={{ 
        top: `${35 + index * 15}%`,
        ['--accent-green' as string]: 'var(--accent-green)',
      } as React.CSSProperties}
    >
      <span className="
        font-ui text-2xl font-bold
        tabular-nums
        xp-float
      " style={{ color: 'var(--accent-green)' }}>
        +{amount} XP
      </span>
    </motion.div>
  )
}