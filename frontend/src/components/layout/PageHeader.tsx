import * as React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  /** Optional back link for contextual hierarchy (e.g. '← All Events') */
  backTo?: string
  backLabel?: string
  /** Badge / Telemetry info beside title */
  badge?: React.ReactNode
  /** Rendered right of the title row (e.g. action buttons) */
  actions?: React.ReactNode
  className?: string
}

/**
 * Standard page header with contextual back navigation,
 * status badge, and primary action controls.
 * Ensures crisp contrast in both dark and light modes.
 */
export function PageHeader({
  title,
  description,
  backTo,
  backLabel,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-3 mb-6', className)}>
      {backTo && (
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>{backLabel || 'Back'}</span>
        </Link>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2 pt-1">{actions}</div>
        )}
      </div>
    </div>
  )
}
