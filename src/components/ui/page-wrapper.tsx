'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageWrapperProps {
  children: ReactNode
}

// Consistent page entrance animation variants for typesetting effect
export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }
}

// Stagger delay for children sections
export const staggerChildren = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  )
}

// Staggered section wrapper for page content
interface StaggeredSectionProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function StaggeredSection({ children, delay = 0.06, className }: StaggeredSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.25, 
        ease: [0.4, 0.0, 0.2, 1],
        delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
