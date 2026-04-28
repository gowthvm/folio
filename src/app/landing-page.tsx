'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { WeatherWidget } from '@/components/ui/weather-widget'
import { DailyTipCarousel } from '@/components/ui/daily-tip-carousel'
import { Footer as AppFooter } from '@/components/ui/footer'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import ClickSpark from '@/components/ui/click-spark'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface TickerHeadline {
  text: string
}

interface Milestone {
  title: string
  status: 'done' | 'in-progress'
}

// =============================================================================
// CONSTANTS & DATA
// =============================================================================

const TICKER_HEADLINES: TickerHeadline[] = [
  { text: 'MUSICIAN LEARNS FULL SONG IN 21 DAYS — MILESTONES CITED' },
  { text: 'LOCAL WRITER FINISHES CHAPTER AFTER 6-WEEK STREAK' },
  { text: 'FITNESS GOAL ACHIEVED: 12 MILESTONES, 0 EXCUSES' },
  { text: 'SKILL ACQUIRED: WATERCOLOUR PAINTING — EXPERT LEVEL REACHED' },
]

const MOCK_MILESTONES: Milestone[] = [
  { title: 'Learn basic chord shapes', status: 'done' },
  { title: 'Master thumb positioning', status: 'done' },
  { title: 'Play through measure 12', status: 'in-progress' },
]

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getCurrentDateHeader(): string {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  
  return reducedMotion
}

function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
): [React.MutableRefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  const reducedMotion = useReducedMotion()
  
  useEffect(() => {
    if (reducedMotion) {
      setInView(true)
      return
    }
    
    const element = ref.current
    if (!element) return
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    }, { threshold: 0.1, ...options })
    
    observer.observe(element)
    return () => observer.disconnect()
  }, [reducedMotion, options])
  
  return [ref, inView || reducedMotion]
}

// =============================================================================
// UI COMPONENTS
// =============================================================================

function NewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isErasing, setIsErasing] = useState(false)
  const reducedMotion = useReducedMotion()
  
  useEffect(() => {
    if (reducedMotion) {
      setDisplayText(TICKER_HEADLINES[0].text)
      return
    }
    
    const headline = TICKER_HEADLINES[currentIndex].text
    
    if (!isErasing) {
      // Type out text
      if (displayText.length < headline.length) {
        const timeout = setTimeout(() => {
          setDisplayText(headline.slice(0, displayText.length + 1))
        }, 40)
        return () => clearTimeout(timeout)
      } else {
        // Wait then start erasing
        const timeout = setTimeout(() => setIsErasing(true), 2500)
        return () => clearTimeout(timeout)
      }
    } else {
      // Erase text
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 30)
        return () => clearTimeout(timeout)
      } else {
        // Move to next headline
        setIsErasing(false)
        setCurrentIndex((prev) => (prev + 1) % TICKER_HEADLINES.length)
      }
    }
  }, [displayText, isErasing, currentIndex, reducedMotion])
  
  return (
    <div className="w-full bg-[var(--paper-secondary)] border-b border-[var(--border-default)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2 flex items-center">
          <span className="font-ui text-[var(--text-byline)] text-[var(--accent-red)] uppercase tracking-wider mr-4 shrink-0">
            BREAKING
          </span>
          <span className="font-body text-[var(--text-byline)] text-[var(--ink-secondary)] uppercase tracking-wider truncate">
            {displayText}
            <span className="inline-block w-[2px] h-[1em] bg-[var(--ink-secondary)] ml-0.5 align-middle animate-pulse" />
          </span>
        </div>
      </div>
    </div>
  )
}

function ProgressRing({ 
  progress, 
  size = 80, 
  strokeWidth = 3,
  animate = true 
}: { 
  progress: number
  size?: number
  strokeWidth?: number
  animate?: boolean 
}) {
  const [animatedProgress, setAnimatedProgress] = useState(animate ? 0 : progress)
  const reducedMotion = useReducedMotion()
  
  useEffect(() => {
    if (reducedMotion || !animate) {
      setAnimatedProgress(progress)
      return
    }
    
    const timer = setTimeout(() => setAnimatedProgress(progress), 300)
    return () => clearTimeout(timer)
  }, [progress, animate, reducedMotion])
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedProgress / 100) * circumference
  const isComplete = animatedProgress >= 100
  
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--paper-ruled)"
          strokeWidth={strokeWidth}
          strokeLinecap="square"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isComplete ? 'var(--accent-green)' : 'var(--ink-primary)'}
          strokeWidth={strokeWidth}
          strokeLinecap="square"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: reducedMotion ? 'none' : 'stroke-dashoffset 800ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-ui text-[var(--text-caption)] tabular-nums">{Math.round(animatedProgress)}%</span>
      </div>
    </div>
  )
}

function Stamp({ label, variant }: { label: string; variant: 'done' | 'in-progress' }) {
  const colors = {
    'done': 'text-[var(--accent-green)] border-[var(--accent-green)]',
    'in-progress': 'text-[var(--accent-sepia)] border-[var(--accent-sepia)]',
  }
  
  const rotation = label.length % 2 === 0 ? -1 : 1
  
  return (
    <span 
      className={`inline-flex items-center justify-center font-ui text-[10px] uppercase tracking-[0.08em] border-[3px] border-current opacity-85 px-2 py-1 ${colors[variant]}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {label}
    </span>
  )
}

function MockSkillCard() {
  const [typedText, setTypedText] = useState('')
  const fullText = 'Finally nailed the thumb independence on measure 4. Slower practice helped.'
  const reducedMotion = useReducedMotion()
  
  useEffect(() => {
    if (reducedMotion) {
      setTypedText(fullText)
      return
    }
    
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 35)
    
    return () => clearInterval(interval)
  }, [reducedMotion])
  
  return (
    <div className="bg-[var(--surface-card)] border border-[var(--border-default)] p-4 shadow-sm">
      {/* Category */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-ui text-[var(--text-caption)] uppercase tracking-[0.08em] px-2 py-1 bg-[var(--ink-primary)] text-[var(--paper-primary)] dark:bg-[var(--paper-primary)] dark:text-[var(--ink-primary)]">
          MUSIC
        </span>
      </div>
      
      {/* Title */}
      <h3 className="font-display text-[var(--text-headline)] leading-tight text-[var(--ink-primary)] mb-3">
        Learn Fingerpicking — Classical Guitar
      </h3>
      
      {/* Progress Ring */}
      <div className="flex items-center gap-4 mb-3">
        <ProgressRing progress={67} size={80} strokeWidth={3} />
        <div>
          <span className="font-ui text-[var(--text-caption)] text-[var(--ink-secondary)]">67% Complete</span>
          <p className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)]">Level 3</p>
        </div>
      </div>
      
      {/* Divider */}
      <div className="border-t border-[var(--border-default)] my-3" />
      
      {/* Milestones */}
      <div className="space-y-2 mb-3">
        {MOCK_MILESTONES.map((milestone, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <span className="font-body text-[var(--text-body)] text-[var(--ink-secondary)]">{milestone.title}</span>
            <Stamp 
              label={milestone.status === 'done' ? 'DONE' : 'IN PROGRESS'} 
              variant={milestone.status} 
            />
          </div>
        ))}
      </div>
      
      {/* Divider */}
      <div className="border-t border-[var(--border-default)] my-3" />
      
      {/* Session Log Entry */}
      <div className="bg-[var(--paper-secondary)] p-2" style={{ backgroundImage: 'var(--texture-log-lines)', backgroundSize: '100% 24px' }}>
        <p className="font-body text-[var(--text-caption)] text-[var(--ink-secondary)] leading-relaxed">
          {typedText}
          <span className="inline-block w-[2px] h-[1em] bg-[var(--ink-secondary)] ml-0.5 align-middle animate-pulse" />
        </p>
        <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] mt-2 block">— 2 days ago</span>
      </div>
    </div>
  )
}

function AnimatedNumeral({ numeral, inView }: { numeral: string; inView: boolean }) {
  const [displayNumeral, setDisplayNumeral] = useState('')
  const reducedMotion = useReducedMotion()
  
  useEffect(() => {
    if (!inView) return
    if (reducedMotion) {
      setDisplayNumeral(numeral)
      return
    }
    
    const numerals = ['0', 'I', 'II', 'III']
    let index = 0
    
    const interval = setInterval(() => {
      if (index <= numerals.indexOf(numeral)) {
        setDisplayNumeral(numerals[index])
        index++
      } else {
        clearInterval(interval)
      }
    }, 150)
    
    return () => clearInterval(interval)
  }, [inView, numeral, reducedMotion])
  
  return (
    <span className="font-display text-[6rem] leading-none text-[var(--ink-faint)] select-none">
      {displayNumeral}
    </span>
  )
}

function FeatureProgressRings() {
  const reducedMotion = useReducedMotion()
  
  return (
    <div className="flex items-center justify-center gap-8">
      <div className="text-center">
        <ProgressRing progress={25} size={70} strokeWidth={3} animate={!reducedMotion} />
        <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] uppercase mt-2 block">Beginner</span>
      </div>
      <div className="text-center">
        <ProgressRing progress={67} size={70} strokeWidth={3} animate={!reducedMotion} />
        <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] uppercase mt-2 block">Learning</span>
      </div>
      <div className="text-center relative">
        <ProgressRing progress={100} size={70} strokeWidth={3} animate={!reducedMotion} />
        <div className="absolute inset-0 flex items-center justify-center -mt-6">
          <span 
            className="font-ui text-[8px] uppercase text-[var(--accent-green)] border-2 border-[var(--accent-green)] px-1 py-0.5 rotate-[-2deg] opacity-90"
          >
            DONE
          </span>
        </div>
        <span className="font-ui text-[var(--text-caption)] text-[var(--accent-green)] uppercase mt-2 block">Complete</span>
      </div>
    </div>
  )
}

function FeatureAISuggestions() {
  const [inputText, setInputText] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const reducedMotion = useReducedMotion()

  const allSuggestions = useMemo(() => [
    'Learn basic chord shapes',
    'Practice thumb independence',
    'Study Travis picking pattern',
    'Master alternating bass',
  ], [])
  
  useEffect(() => {
    if (reducedMotion) {
      setInputText('Learn Fingerpicking')
      setSuggestions(allSuggestions)
      setShowSuggestions(true)
      return
    }
    
    // Type input
    const targetInput = 'Learn Fingerpicking'
    let inputIndex = 0
    const inputInterval = setInterval(() => {
      if (inputIndex <= targetInput.length) {
        setInputText(targetInput.slice(0, inputIndex))
        inputIndex++
      } else {
        clearInterval(inputInterval)
        setTimeout(() => setShowSuggestions(true), 300)
      }
    }, 80)
    
    return () => clearInterval(inputInterval)
  }, [reducedMotion, allSuggestions])
  
  useEffect(() => {
    if (!showSuggestions || reducedMotion) return
    
    let suggestionIndex = 0
    const suggestionInterval = setInterval(() => {
      if (suggestionIndex < allSuggestions.length) {
        setSuggestions(prev => [...prev, allSuggestions[suggestionIndex]])
        suggestionIndex++
      } else {
        clearInterval(suggestionInterval)
        // Loop after 6 seconds
        setTimeout(() => {
          setSuggestions([])
          setShowSuggestions(false)
          setTimeout(() => setShowSuggestions(true), 100)
        }, 6000)
      }
    }, 400)
    
    return () => clearInterval(suggestionInterval)
  }, [showSuggestions, reducedMotion, allSuggestions])
  
  return (
    <div className="bg-[var(--surface-card)] border border-[var(--border-default)] p-3 max-w-sm">
      <div className="flex items-center gap-2 mb-2 pb-3 border-b border-[var(--border-default)]">
        <span className="text-sm">🎵</span>
        <span className="font-body text-[var(--text-body)] text-[var(--ink-secondary)]">
          {inputText}
          {!reducedMotion && inputText.length < 'Learn Fingerpicking'.length && (
            <span className="inline-block w-[2px] h-[1em] bg-[var(--ink-secondary)] ml-0.5 align-middle animate-pulse" />
          )}
        </span>
      </div>
      <div className="space-y-1">
        {suggestions.map((suggestion, i) => (
          <div 
            key={i} 
            className="flex items-center gap-2 p-2 bg-[var(--paper-secondary)] opacity-0 animate-fadeIn"
            style={{
              animationDelay: `${i * 100}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)]">{i + 1}.</span>
            <span className="font-body text-[var(--text-caption)] text-[var(--ink-secondary)]">{suggestion}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeatureHeatmap() {
  const reducedMotion = useReducedMotion()
  const weeks = 8
  const days = 7
  
  // Generate consistent random data
  const data = Array.from({ length: weeks * days }, (_, i) => {
    const hash = Math.sin(i * 12.9898) * 43758.5453
    return Math.floor((hash - Math.floor(hash)) * 5)
  })
  
  const getOpacity = (level: number) => {
    const opacities = [0.1, 0.25, 0.45, 0.65, 0.9]
    return opacities[level] || 0.1
  }
  
  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {Array.from({ length: weeks }).map((_, week) => (
          <div key={week} className="flex flex-col gap-1">
            {Array.from({ length: days }).map((_, day) => {
              const index = week * days + day
              const level = data[index] || 0
              const targetOpacity = getOpacity(level)
              return (
                <div
                  key={day}
                  className="w-3 h-3 bg-[var(--ink-primary)]"
                  style={{
                    opacity: reducedMotion ? targetOpacity : 0,
                    transition: reducedMotion ? 'none' : `opacity 300ms ease ${index * 10}ms`,
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {['Apprentice', 'Practitioner', 'Expert', 'Master'].map((level, i) => (
          <div key={level} className="text-center">
            <span 
              className="inline-flex items-center justify-center font-ui text-[10px] uppercase tracking-[0.08em] border-[3px] border-current opacity-85 px-2 py-1 text-[var(--ink-secondary)] border-[var(--ink-secondary)]"
              style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
            >
              {level}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeatureSessionLog() {
  const sessions = [
    { note: 'Worked on thumb control. Still shaky on measure 8.', mood: '😓', time: '45 min', date: 'Yesterday' },
    { note: 'Much better today. The slow practice is paying off.', mood: '😐', time: '60 min', date: '3 days ago' },
  ]
  
  return (
    <div className="space-y-0 border border-[var(--border-default)]">
      {sessions.map((session, i) => (
        <div 
          key={i} 
          className="p-2 bg-[var(--paper-secondary)] border-b border-[var(--border-default)] last:border-b-0"
          style={{ backgroundImage: 'var(--texture-log-lines)', backgroundSize: '100% 24px' }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] tabular-nums">{session.date}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">{session.mood}</span>
              <span className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] tabular-nums">{session.time}</span>
            </div>
          </div>
          <p className="font-body text-[var(--text-caption)] text-[var(--ink-secondary)] leading-relaxed">
            {session.note}
          </p>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// SECTION COMPONENTS
// =============================================================================

function Masthead() {
  const editionNumber = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24))
  
  return (
    <header className="w-full">
      {/* Top bar with weather and tips */}
      <div className="bg-[var(--paper-secondary)] border-b border-[var(--border-default)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-ui text-[0.6rem] text-[var(--ink-tertiary)] uppercase tracking-wider">
              VOL. I · EDITION {editionNumber}
            </span>
            <div className="hidden md:block">
              <WeatherWidget />
            </div>
          </div>
          <div className="hidden lg:block w-96">
            <DailyTipCarousel />
          </div>
        </div>
      </div>
      
      {/* Double rule */}
      <div className="h-[3px] bg-[var(--border-default)]" />
      <div className="h-[1px] bg-[var(--border-default)] mt-[2px]" />
      
      {/* Main masthead content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: FOLIO */}
          <Link href="/" className="font-display text-[var(--text-masthead)] text-[var(--ink-primary)] tracking-tight hover:opacity-80 transition-opacity">
            FOLIO
          </Link>
          
          {/* Center: Subtitle */}
          <div className="hidden md:block">
            <span className="font-ui text-[var(--text-byline)] text-[var(--ink-tertiary)] uppercase tracking-[0.08em]">
              THE DAILY SKILL TRACKER
            </span>
          </div>
          
          {/* Right: Date and Theme Toggle */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:block font-body text-[var(--text-byline)] text-[var(--ink-tertiary)]">
              {getCurrentDateHeader()}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* Double rule */}
      <div className="h-[3px] bg-[var(--border-default)]" />
      <div className="h-[1px] bg-[var(--border-default)] mt-[2px]" />
    </header>
  )
}

function HeroSection() {
  const [ref, inView] = useInView<HTMLElement>()
  const reducedMotion = useReducedMotion()
  
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }
  
  return (
    <section 
      ref={ref}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      style={{
        opacity: reducedMotion || inView ? 1 : 0,
        transform: reducedMotion || inView ? 'translateY(0)' : 'translateY(16px)',
        transition: reducedMotion ? 'none' : 'opacity 480ms cubic-bezier(0.4, 0, 0.2, 1), transform 480ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[60%_1px_40%] gap-8 lg:gap-0">
        {/* Left column */}
        <div className="pr-0 lg:pr-8">
          <h1 className="font-display text-[var(--text-masthead)] text-[var(--ink-primary)] leading-tight mb-6">
            Track the skills<br />that matter.<br />Story by story.
          </h1>

          <p className="font-body text-[var(--text-subhead)] text-[var(--ink-secondary)] max-w-[50ch] mb-8 leading-relaxed">
            Folio turns every goal into a structured narrative — milestones, sessions, and progress you can actually see.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center font-ui text-[var(--text-byline)] uppercase tracking-wider bg-[var(--ink-primary)] text-[var(--paper-primary)] dark:bg-[var(--paper-primary)] dark:text-[var(--ink-primary)] px-6 py-3 hover:opacity-90 transition-opacity"
            >
              START YOUR FIRST STORY
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>

            <button
              onClick={scrollToFeatures}
              className="inline-flex items-center justify-center font-ui text-[var(--text-byline)] uppercase tracking-wider border border-[var(--ink-primary)] text-[var(--ink-primary)] px-6 py-3 hover:bg-[var(--ink-primary)] hover:text-[var(--paper-primary)] dark:hover:bg-[var(--paper-primary)] dark:hover:text-[var(--ink-primary)] transition-colors"
            >
              SEE HOW IT WORKS
              <ChevronDown className="ml-2 w-4 h-4" />
            </button>
          </div>
          
          <p className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] uppercase tracking-wider">
            JOINED BY 1,200+ LEARNERS · NO CREDIT CARD REQUIRED
          </p>
        </div>
        
        {/* Column rule - hidden on mobile */}
        <div className="hidden lg:block w-[1px] bg-[var(--paper-ruled)] self-stretch" />
        
        {/* Right column */}
        <div className="pl-0 lg:pl-8">
          <MockSkillCard />
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const [ref, inView] = useInView<HTMLElement>()
  const reducedMotion = useReducedMotion()
  
  const steps = [
    {
      numeral: 'I',
      headline: 'File a skill.',
      body: 'Name your goal, pick a category, set a target date. Whether it\'s a song, a chapter, or a marathon — Folio holds it.'
    },
    {
      numeral: 'II',
      headline: 'Break it into chapters.',
      body: 'Define milestones with weights. Let AI suggest a breakdown or write your own. Lock steps sequentially or tackle them in parallel.'
    },
    {
      numeral: 'III',
      headline: 'Log every session.',
      body: 'Record what you worked on, how it felt, how long it took. Watch your progress ring fill. Never lose track of where you left off.'
    },
  ]
  
  return (
    <section ref={ref} className="w-full border-t border-b border-[var(--border-default)] py-12">
      {/* Section label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-[var(--border-default)]" />
          <span className="font-ui text-[var(--text-byline)] text-[var(--ink-tertiary)] uppercase tracking-wider">
            HOW IT WORKS
          </span>
          <div className="flex-1 h-[1px] bg-[var(--border-default)]" />
        </div>
      </div>
      
      {/* Three columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
          {steps.map((step, i) => (
            <div 
              key={i} 
              className={`px-0 md:px-8 ${i < steps.length - 1 ? 'md:border-r border-[var(--paper-ruled)]' : ''}`}
              style={{
                opacity: reducedMotion || inView ? 1 : 0,
                transform: reducedMotion || inView ? 'translateY(0)' : 'translateY(16px)',
                transition: reducedMotion ? 'none' : `opacity 480ms cubic-bezier(0.4, 0, 0.2, 1) ${i * 80}ms, transform 480ms cubic-bezier(0.4, 0, 0.2, 1) ${i * 80}ms`
              }}
            >
              <AnimatedNumeral numeral={step.numeral} inView={inView} />
              <h3 className="font-display text-[var(--text-headline)] text-[var(--ink-primary)] mt-4 mb-3">
                {step.headline}
              </h3>
              <p className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] leading-relaxed max-w-[40ch]">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const [ref1, inView1] = useInView<HTMLDivElement>()
  const [ref2, inView2] = useInView<HTMLDivElement>()
  const [ref3, inView3] = useInView<HTMLDivElement>()
  const [ref4, inView4] = useInView<HTMLDivElement>()
  const reducedMotion = useReducedMotion()
  
  const getAnimationStyle = (inView: boolean, delay: number, direction: 'left' | 'right' = 'left') => ({
    opacity: reducedMotion || inView ? 1 : 0,
    transform: reducedMotion || inView 
      ? 'translateX(0)' 
      : direction === 'left' ? 'translateX(-24px)' : 'translateX(24px)',
    transition: reducedMotion ? 'none' : `opacity 480ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform 480ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`
  })
  
  return (
    <section id="features" className="w-full py-12">
      {/* Section label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-[var(--border-default)]" />
          <span className="font-ui text-[var(--text-byline)] text-[var(--ink-tertiary)] uppercase tracking-wider">
            WHAT&apos;S INSIDE THIS EDITION
          </span>
          <div className="flex-1 h-[1px] bg-[var(--border-default)]" />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Feature 1 - Progress Rings */}
        <div ref={ref1} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div style={getAnimationStyle(inView1, 0, 'left')}>
            <h3 className="font-display text-[var(--text-headline)] text-[var(--ink-primary)] mb-4">
              See exactly how far you&apos;ve come.
            </h3>
            <p className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] leading-relaxed max-w-[50ch]">
              Every skill has a progress ring that fills as you complete milestones. Weighted by importance, so a harder chapter counts more.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end" style={getAnimationStyle(inView1, 80, 'right')}>
            <FeatureProgressRings />
          </div>
        </div>
        
        <div className="h-[1px] bg-[var(--border-default)]" />
        
        {/* Feature 2 - AI Milestone Suggestions */}
        <div ref={ref2} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start" style={getAnimationStyle(inView2, 0, 'left')}>
            <FeatureAISuggestions />
          </div>
          <div className="order-1 lg:order-2" style={getAnimationStyle(inView2, 80, 'right')}>
            <h3 className="font-display text-[var(--text-headline)] text-[var(--ink-primary)] mb-4">
              Don&apos;t know where to start? Ask the editor.
            </h3>
            <p className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] leading-relaxed max-w-[50ch]">
              Type your skill, and Folio&apos;s AI breaks it into practical milestones — specific, ordered, and weighted. Edit freely or accept as-is.
            </p>
          </div>
        </div>
        
        <div className="h-[1px] bg-[var(--border-default)]" />
        
        {/* Feature 3 - Streaks & XP */}
        <div ref={ref3} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div style={getAnimationStyle(inView3, 0, 'left')}>
            <h3 className="font-display text-[var(--text-headline)] text-[var(--ink-primary)] mb-4">
              Show up daily. The numbers remember.
            </h3>
            <p className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] leading-relaxed max-w-[50ch]">
              Log a session every day to build your streak. Earn XP on every completed milestone. Level up from Apprentice to Master.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end" style={getAnimationStyle(inView3, 80, 'right')}>
            <FeatureHeatmap />
          </div>
        </div>
        
        <div className="h-[1px] bg-[var(--border-default)]" />
        
        {/* Feature 4 - Session Journal */}
        <div ref={ref4} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start" style={getAnimationStyle(inView4, 0, 'left')}>
            <FeatureSessionLog />
          </div>
          <div className="order-1 lg:order-2" style={getAnimationStyle(inView4, 80, 'right')}>
            <h3 className="font-display text-[var(--text-headline)] text-[var(--ink-primary)] mb-4">
              Every practice session, documented.
            </h3>
            <p className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] leading-relaxed max-w-[50ch]">
              Add notes, log your mood, record duration. Build a running record of your journey from first attempt to final achievement.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function SocialProofSection() {
  const [ref, inView] = useInView<HTMLElement>()
  const reducedMotion = useReducedMotion()
  
  const quotes = [
    {
      text: 'I finally finished learning a Chopin étude I\'d been attempting for two years. Seeing the milestones laid out made it feel possible.',
      attribution: 'M.K., Pianist'
    },
    {
      text: 'I used it to track writing my thesis chapter by chapter. The streak kept me honest.',
      attribution: 'R.T., Graduate Student'
    },
    {
      text: 'Nothing else made fitness goals feel this structured without being a spreadsheet.',
      attribution: 'D.A., Runner'
    },
  ]
  
  return (
    <section ref={ref} className="w-full py-16 border-t border-[var(--border-default)]">
      {/* Section label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-[var(--border-default)]" />
          <span className="font-ui text-[var(--text-byline)] text-[var(--ink-tertiary)] uppercase tracking-wider">
            FROM THE FIELD
          </span>
          <div className="flex-1 h-[1px] bg-[var(--border-default)]" />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quotes.map((quote, i) => (
            <div 
              key={i}
              className="border border-[var(--paper-ruled)] p-6"
              style={{
                opacity: reducedMotion || inView ? 1 : 0,
                transform: reducedMotion || inView ? 'translateY(0)' : 'translateY(16px)',
                transition: reducedMotion ? 'none' : `opacity 480ms cubic-bezier(0.4, 0, 0.2, 1) ${i * 120}ms, transform 480ms cubic-bezier(0.4, 0, 0.2, 1) ${i * 120}ms`
              }}
            >
              <p className="font-display text-[var(--text-subhead)] text-[var(--ink-primary)] italic leading-relaxed mb-4">
                &ldquo;{quote.text}&rdquo;
              </p>
              <p className="font-ui text-[var(--text-caption)] text-[var(--ink-tertiary)] uppercase tracking-wider">
                — {quote.attribution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const [ref, inView] = useInView<HTMLElement>()
  const reducedMotion = useReducedMotion()
  
  return (
    <section 
      ref={ref}
      className="w-full py-16 md:py-24"
      style={{
        opacity: reducedMotion || inView ? 1 : 0,
        transform: reducedMotion || inView ? 'translateY(0)' : 'translateY(16px)',
        transition: reducedMotion ? 'none' : 'opacity 480ms cubic-bezier(0.4, 0, 0.2, 1), transform 480ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-[var(--text-headline)] text-[var(--ink-primary)] mb-4">
          Your first story starts today.
        </h2>
        <p className="font-body text-[var(--text-body)] text-[var(--ink-secondary)] mb-8">
          Free to use. No credit card. Cancel the excuses.
        </p>
        
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <ClickSpark sparkColor="#22c55e" sparkSize={15} sparkRadius={20} sparkCount={12} duration={500}>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center font-ui text-[var(--text-byline)] uppercase tracking-wider bg-[var(--ink-primary)] text-[var(--paper-primary)] dark:bg-[var(--paper-primary)] dark:text-[var(--ink-primary)] px-8 py-4 hover:opacity-90 transition-opacity"
            >
              OPEN YOUR FOLIO
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </ClickSpark>
        </div>
        
        <p className="font-body text-[var(--text-caption)] text-[var(--ink-tertiary)] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--ink-secondary)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  )
}


// =============================================================================
// MAIN EXPORT
// =============================================================================

export function LandingPageContent() {
  return (
    <div className="min-h-screen bg-[var(--paper-primary)]">
      <Masthead />
      <NewsTicker />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <SocialProofSection />
        <CTASection />
      </main>
      <AppFooter />
    </div>
  )
}
