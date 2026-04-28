'use client'

import { useEffect, useRef } from 'react'

// Single IntersectionObserver instance for all scroll reveals
let observerInstance: IntersectionObserver | null = null
const observedElements = new Set<Element>()

export function useScrollReveal() {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      element.classList.add('revealed')
      return
    }

    // Create observer if it doesn't exist
    if (!observerInstance) {
      observerInstance = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed')
              
              // Handle staggered children
              const parent = entry.target.closest('[data-reveal-stagger]')
              if (parent) {
                const children = parent.querySelectorAll('[data-reveal-child]')
                children.forEach((child, index) => {
                  setTimeout(() => {
                    child.classList.add('revealed')
                  }, index * 70) // 70ms delay between each child
                })
              }
            }
          })
        },
        {
          threshold: 0.15, // Trigger when 15% of element is visible
          rootMargin: '0px 0px -50px 0px'
        }
      )
    }

    // Add element to observer if not already observed
    if (!observedElements.has(element)) {
      observerInstance.observe(element)
      observedElements.add(element)
    }

    return () => {
      // Cleanup - remove from observer
      if (observerInstance && element) {
        observerInstance.unobserve(element)
        observedElements.delete(element)
      }
    }
  }, [])

  return elementRef
}

// Cleanup function to disconnect observer when app unmounts
export function cleanupScrollReveal() {
  if (observerInstance) {
    observerInstance.disconnect()
    observerInstance = null
    observedElements.clear()
  }
}
