import apiClient from '@/services/apiClient'
import type { DiscoveredUser, Profile } from '@/types/participant'

export interface DiscoverFilters {
  skills?: string
  interests?: string
  preferred_role?: string
  availability?: string
  experience?: string
  mode?: 'random' | string
}

export const SEEDED_USER_METADATA: Record<string, { id: number; user_id: number; email: string; role: string; name: string }> = {
  'admin': { id: 1, user_id: 1, email: 'admin@example.com', role: 'ADMIN', name: 'Admin' },
  'organizer': { id: 2, user_id: 2, email: 'organizer@example.com', role: 'ORGANIZER', name: 'Organizer' },
  'judge one': { id: 3, user_id: 3, email: 'judge1@example.com', role: 'JUDGE', name: 'Judge One' },
  'judge two': { id: 4, user_id: 4, email: 'judge2@example.com', role: 'JUDGE', name: 'Judge Two' },
  'participant 1': { id: 5, user_id: 5, email: 'participant1@example.com', role: 'PARTICIPANT', name: 'Participant 1' },
  'participant 2': { id: 6, user_id: 6, email: 'participant2@example.com', role: 'PARTICIPANT', name: 'Participant 2' },
}

function enrichUserWithRole(u: DiscoveredUser, index: number): DiscoveredUser {
  const nameKey = (u.display_name || u.name || '').trim().toLowerCase()
  const seedMeta = SEEDED_USER_METADATA[nameKey]

  const userId = u.user_id || u.id || seedMeta?.user_id || index + 1
  const id = u.id || u.user_id || seedMeta?.id || userId
  const email = u.email || seedMeta?.email
  const role = u.role || seedMeta?.role || 'PARTICIPANT'
  const name = u.name || u.display_name || seedMeta?.name || `User #${userId}`

  return {
    ...u,
    id,
    user_id: userId,
    email,
    role,
    name,
    display_name: u.display_name || name,
  }
}

export const userService = {
  /**
   * Search for users based on criteria.
   * GET /api/users/discover?skills=...
   */
  async discoverUsers(filters?: DiscoverFilters): Promise<DiscoveredUser[]> {
    try {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value)
        })
      }
      const response = await apiClient.get<{ success: boolean; data: DiscoveredUser[] }>(
        `/api/users/discover${params.toString() ? `?${params.toString()}` : ''}`
      )
      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data.map((u, idx) => enrichUserWithRole(u, idx))
      }
      return []
    } catch {
      return []
    }
  },

  /**
   * Retrieve matched users based on current user's profile.
   * GET /api/users/me/matches
   */
  async getMyMatches(): Promise<DiscoveredUser[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: DiscoveredUser[] }>('/api/users/me/matches')
      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data
      }
      return []
    } catch {
      return []
    }
  },

  /**
   * Retrieve public profile of a specific user.
   * GET /api/users/:userId/profile
   */
  async getUserProfile(userId: number): Promise<Profile> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Profile }>(`/api/users/${userId}/profile`)
      if (response.data?.success && response.data.data) {
        return response.data.data
      }
    } catch {
      // Ignore
    }
    throw new Error(`Profile for user #${userId} not found`)
  }
}

export default userService
