'use client'

import { useState, useEffect } from 'react'
import { Calendar, Cloud, Sun, CloudRain, Snowflake } from 'lucide-react'

interface WeatherWidgetProps {
  className?: string
}

export function WeatherWidget({ className = '' }: WeatherWidgetProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const now = new Date()
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })
  const dateStr = now.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
  
  // Pseudo-weather based on time of day
  const hour = now.getHours()
  const getWeatherIcon = () => {
    if (hour >= 6 && hour < 12) return <Sun className="w-4 h-4" />
    if (hour >= 12 && hour < 17) return <Cloud className="w-4 h-4" />
    if (hour >= 17 && hour < 21) return <CloudRain className="w-4 h-4" />
    return <Snowflake className="w-4 h-4" />
  }

  const getMood = () => {
    if (hour >= 6 && hour < 12) return 'PRIME PRACTICE TIME'
    if (hour >= 12 && hour < 17) return 'GOOD FOR FOCUSED WORK'
    if (hour >= 17 && hour < 21) return 'EVENING REVIEW SESSION'
    return 'REST & REFLECT'
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 text-[var(--ink-tertiary)]">
        <Calendar className="w-4 h-4" />
        <span className="font-ui text-[var(--text-caption)] uppercase tracking-wider">
          {dayName}
        </span>
        <span className="font-body text-[var(--text-caption)]">
          {dateStr}
        </span>
      </div>
      <div className="h-4 w-px bg-[var(--border-default)]" />
      <div className="flex items-center gap-2 text-[var(--ink-tertiary)]">
        {getWeatherIcon()}
        <span className="font-ui text-[var(--text-caption)] uppercase tracking-wider">
          {getMood()}
        </span>
      </div>
    </div>
  )
}
