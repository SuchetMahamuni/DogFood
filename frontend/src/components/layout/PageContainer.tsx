import * as React from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Restrict max width (defaults to 7xl) */
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full'
  /** Remove horizontal padding (e.g. for full-bleed sections) */
  noPad?: boolean
}

const maxWidthClasses: Record<NonNullable<PageContainerProps['maxWidth']>, string> = {
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-xl',
  '2xl':'max-w-2xl',
  '4xl':'max-w-4xl',
  '6xl':'max-w-6xl',
  '7xl':'max-w-7xl',
  full: 'max-w-full',
}

/**
 * Wraps a page's main content with consistent padding and max-width.
 * All authenticated pages should use this inside their route component.
 */
export function PageContainer({
  className,
  maxWidth = '7xl',
  noPad = false,
  children,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        maxWidthClasses[maxWidth],
        !noPad && 'px-4 py-6 sm:px-6 lg:px-8',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
