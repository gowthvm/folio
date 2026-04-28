import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-ui uppercase tracking-[0.08em] transition-colors disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed active:translate-y-[1px] active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-[var(--ink-primary)] text-[var(--paper-primary)] hover:bg-[var(--ink-secondary)] dark:bg-[var(--paper-primary)] dark:text-[var(--ink-primary)] dark:hover:bg-[var(--paper-secondary)]',
        destructive:
          'bg-[var(--accent-red)] text-[var(--paper-primary)] hover:opacity-80',
        outline:
          'border border-[var(--border-default)] bg-transparent hover:bg-[var(--paper-tertiary)] hover:border-[var(--ink-secondary)] text-[var(--ink-primary)]',
        secondary:
          'bg-[var(--paper-tertiary)] text-[var(--ink-primary)] hover:bg-[var(--paper-ruled)]',
        ghost: 'hover:bg-[var(--paper-tertiary)] hover:text-[var(--ink-primary)] text-[var(--ink-primary)]',
        link: 'text-[var(--ink-secondary)] underline-offset-4 hover:underline hover:text-[var(--ink-primary)]',
      },
      size: {
        default: 'h-10 px-[var(--space-4)] py-[var(--space-2)] text-[var(--text-caption)]',
        sm: 'h-9 px-[var(--space-3)] py-[var(--space-2)] text-[var(--text-caption)]',
        lg: 'h-11 px-[var(--space-5)] py-[var(--space-3)] text-[var(--text-caption)]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        data-pressable
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
