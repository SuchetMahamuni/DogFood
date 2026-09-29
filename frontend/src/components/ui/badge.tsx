import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors font-mono',
  {
    variants: {
      variant: {
        default:
          'border-primary/40 bg-primary/20 text-white hover:bg-primary/30',
        secondary:
          'border-border bg-surface-elevated text-slate-300 hover:bg-border',
        outline:
          'border-border/80 bg-transparent text-slate-300',
        success:
          'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
        warning:
          'border-amber-500/30 bg-amber-500/15 text-amber-400',
        destructive:
          'border-rose-500/30 bg-rose-500/15 text-rose-400',
        accent:
          'border-cyan-500/30 bg-cyan-500/15 text-cyan-300',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
