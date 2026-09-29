import { ChevronRight } from 'lucide-react'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const Breadcrumb = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <nav aria-label="Breadcrumb" className={cn('flex', className)} {...props} />
)
Breadcrumb.displayName = 'Breadcrumb'

const BreadcrumbList = ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
  <ol
    className={cn('flex flex-wrap items-center gap-1.5 text-xs text-slate-400', className)}
    {...props}
  />
)
BreadcrumbList.displayName = 'BreadcrumbList'

const BreadcrumbItem = ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
  <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />
)
BreadcrumbItem.displayName = 'BreadcrumbItem'

interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  asChild?: boolean
}

const BreadcrumbLink = ({ className, ...props }: BreadcrumbLinkProps) => (
  <Link
    className={cn('hover:text-white transition-colors text-slate-400 font-medium', className)}
    {...props}
  />
)
BreadcrumbLink.displayName = 'BreadcrumbLink'

/** Current / active page — not a link */
const BreadcrumbPage = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    role="link"
    aria-current="page"
    aria-disabled="true"
    className={cn('font-semibold text-white', className)}
    {...props}
  />
)
BreadcrumbPage.displayName = 'BreadcrumbPage'

const BreadcrumbSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('text-slate-500', className)}
    {...props}
  >
    <ChevronRight className="h-3 w-3" />
  </span>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
}
