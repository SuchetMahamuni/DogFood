import type { UserRole } from '@/types/navigation'

/**
 * Maps a user's role to their designated default home route.
 */
export function getRoleDefaultPath(role?: string | UserRole): string {
  switch (role) {
    case 'JUDGE':
      return '/judge'
    case 'ORGANIZER':
    case 'ADMIN':
      return '/organizer'
    case 'PARTICIPANT':
    default:
      return '/dashboard'
  }
}

/**
 * Generate 2-character uppercase initials for user avatars.
 */
export function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'DF'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
