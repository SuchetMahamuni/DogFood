import type { ComponentType } from 'react'

// ─── Roles ────────────────────────────────────────────────────────────────────
export type UserRole = 'PARTICIPANT' | 'JUDGE' | 'ORGANIZER' | 'ADMIN'

// ─── Nav item ─────────────────────────────────────────────────────────────────
export interface NavItem {
  label: string
  href: string
  /** Lucide icon component */
  icon: ComponentType<{ className?: string }>
  /** Optional badge label (e.g. count) */
  badge?: string
  /** Match exact path only (default: startsWith) */
  exact?: boolean
}

// ─── Nav section (group of items with optional heading) ───────────────────────
export interface NavSection {
  title?: string
  items: NavItem[]
}

// ─── Per-role map ─────────────────────────────────────────────────────────────
export type RoleNavMap = Record<UserRole, NavSection[]>

// ─── User info passed through the app shell ───────────────────────────────────
export interface AppUser {
  name: string
  email: string
  role: UserRole
  /** URL to avatar image (optional) */
  avatarUrl?: string
  /** Two-letter initials fallback */
  initials: string
}
