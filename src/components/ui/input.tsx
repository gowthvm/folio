import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full border border-[var(--paper-ruled)] bg-[var(--surface-card)] px-[var(--space-3)] py-[var(--space-2)] font-body text-[var(--text-body)] placeholder:text-[var(--ink-faint)] focus-visible:border-[var(--ink-secondary)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40',
          'rounded-none',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
