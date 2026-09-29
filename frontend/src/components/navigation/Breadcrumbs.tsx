import { useLocation } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

/**
 * Auto-generates breadcrumbs from the current URL pathname.
 *
 * /dashboard          → Dashboard
 * /events/42/details  → Events › 42 › Details
 *
 * Pass a `labelMap` to override segment labels.
 */
interface BreadcrumbsProps {
  /** Override labels for specific segments (e.g. { '42': 'HackFest 2026' }) */
  labelMap?: Record<string, string>
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ')
}

export function Breadcrumbs({ labelMap = {} }: BreadcrumbsProps) {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  const crumbs = segments.map((seg, i) => ({
    label: labelMap[seg] ?? capitalise(seg),
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }))

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb) =>
          crumb.isLast ? (
            <BreadcrumbItem key={crumb.href}>
              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem key={crumb.href}>
              <BreadcrumbLink to={crumb.href}>{crumb.label}</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
          ),
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
