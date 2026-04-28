'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  label?: string
}

export function Checkbox({ 
  checked = false, 
  onChange, 
  disabled = false,
  className,
  label,
}: CheckboxProps) {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked)
    }
  }

  return (
    <label className={cn('flex items-center gap-2 cursor-pointer', disabled && 'opacity-50', className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          'w-5 h-5 border-2 border-[var(--ink-secondary)] bg-transparent',
          'flex items-center justify-center',
          'transition-transform duration-[var(--duration-fast)] ease-[var(--ease-ink)]',
          'focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[var(--ink-primary)]',
          checked ? 'scale-100' : 'active:scale-[0.92]'
        )}
      >
        <motion.span
          initial={false}
          animate={checked ? { scale: [1, 1.1, 1] } : { scale: 0 }}
          transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-[var(--accent-green)]"
        >
          {checked && (
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 12 12" 
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M2 6L5 9L10 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              />
            </svg>
          )}
        </motion.span>
      </button>
      {label && (
        <span className="font-body text-sm text-[var(--ink-primary)] select-none">
          {label}
        </span>
      )}
    </label>
  )
}

// Radio group version
interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

interface RadioGroupProps {
  options: RadioOption[]
  value: string | null
  onChange: (value: string | null) => void
  name: string
  className?: string
}

export function RadioGroup({ options, value, onChange, name, className }: RadioGroupProps) {
  return (
    <div role="radiogroup" className={className}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex items-center gap-2 cursor-pointer py-2',
            option.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <button
            type="button"
            role="radio"
            aria-checked={value === option.value}
            disabled={option.disabled}
            onClick={() => !option.disabled && onChange(option.value)}
            className={cn(
              'w-5 h-5 rounded-full border-2 border-[var(--ink-secondary)] bg-transparent',
              'flex items-center justify-center',
              'transition-transform duration-[var(--duration-fast)] ease-[var(--ease-ink)]',
              'focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[var(--ink-primary)]',
              value === option.value && 'scale-100',
              !option.disabled && 'active:scale-[0.92]'
            )}
          >
            {value === option.value && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                className="w-2 h-2 rounded-full bg-[var(--accent-green)]"
              />
            )}
          </button>
          <span className="font-body text-sm text-[var(--ink-primary)]">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  )
}