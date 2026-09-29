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

export const FALLBACK_DISCOVER_USERS: DiscoveredUser[] = [
  {
    id: 1,
    user_id: 101,
    display_name: 'Elena Rostova',
    bio: 'Full-stack engineer passionate about distributed systems and rust. Built hackathon-winning dev tools.',
    profile_picture_url: '',
    skills: 'Rust, TypeScript, React, Go, Docker',
    interests: 'Developer Tooling, AI Agents, Systems',
    experience: 'Senior (5+ yrs)',
    preferred_role: 'Full-Stack Developer',
    availability: 'Full-time / 40h',
    previous_projects: 'OpenAgent CLI, Distributed Vector Cache',
    match_score: 8,
  },
  {
    id: 2,
    user_id: 102,
    display_name: 'Marcus Chen',
    bio: 'ML researcher & Python developer. Focused on small-model inference and automated agents.',
    profile_picture_url: '',
    skills: 'Python, PyTorch, LangChain, FastAPI, Flask',
    interests: 'Machine Learning, NLP, Autonomous Agents',
    experience: 'Intermediate (2-4 yrs)',
    preferred_role: 'AI / ML Engineer',
    availability: 'Weekends & Evenings',
    previous_projects: 'CodeDiff Synthesizer, MiniLLM Quantizer',
    match_score: 9,
  },
  {
    id: 3,
    user_id: 103,
    display_name: 'Aisha Al-Mansoor',
    bio: 'Product designer and frontend specialist. Obsessed with micro-interactions, clean design systems and accessible UI.',
    profile_picture_url: '',
    skills: 'Figma, TailwindCSS, React, Next.js, Design Systems',
    interests: 'UI/UX, Frontend Architecture, Design Systems',
    experience: 'Intermediate (3 yrs)',
    preferred_role: 'Product Designer',
    availability: 'Full-time / 40h',
    previous_projects: 'Aura Design System, DevPortfolio Canvas',
    match_score: 7,
  },
  {
    id: 4,
    user_id: 104,
    display_name: 'David Kim',
    bio: 'Backend architect specializing in Kubernetes, cloud platforms, and high-throughput microservices.',
    profile_picture_url: '',
    skills: 'Go, Kubernetes, AWS, PostgreSQL, gRPC',
    interests: 'Cloud Infra, Scalability, DevOps',
    experience: 'Senior (6 yrs)',
    preferred_role: 'Backend Developer',
    availability: 'Flexible / 25h',
    previous_projects: 'KubeMesh Router, LogStream DB',
    match_score: 6,
  },
]

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
  const role = u.role || seedMeta?.role || u.preferred_role || 'PARTICIPANT'
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
   * Discover potential teammates with optional filters.
   * GET /api/users/discover
   */
  async discoverUsers(filters?: DiscoverFilters): Promise<DiscoveredUser[]> {
    try {
      const params = new URLSearchParams()
      if (filters?.skills) params.append('skills', filters.skills)
      if (filters?.interests) params.append('interests', filters.interests)
      if (filters?.preferred_role) params.append('preferred_role', filters.preferred_role)
      if (filters?.availability) params.append('availability', filters.availability)
      if (filters?.experience) params.append('experience', filters.experience)
      if (filters?.mode) params.append('mode', filters.mode)

      const response = await apiClient.get<{ success: boolean; data: DiscoveredUser[] }>(
        `/api/users/discover${params.toString() ? `?${params.toString()}` : ''}`,
      )
      if (response.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data.map((u, idx) => enrichUserWithRole(u, idx))
      }
      return this.filterFallback(filters).map((u, idx) => enrichUserWithRole(u, idx))
    } catch {
      return this.filterFallback(filters).map((u, idx) => enrichUserWithRole(u, idx))
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
      return FALLBACK_DISCOVER_USERS.slice(0, 2)
    } catch {
      return FALLBACK_DISCOVER_USERS.slice(0, 2)
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
      // Fallback lookup
    }
    const found = FALLBACK_DISCOVER_USERS.find((u) => u.user_id === userId || u.id === userId)
    if (found) return found
    throw new Error(`Profile for user #${userId} not found`)
  },

  filterFallback(filters?: DiscoverFilters): DiscoveredUser[] {
    let list = [...FALLBACK_DISCOVER_USERS]
    if (filters?.skills) {
      const q = filters.skills.toLowerCase()
      list = list.filter((u) => u.skills?.toLowerCase().includes(q))
    }
    if (filters?.preferred_role) {
      list = list.filter((u) => u.preferred_role === filters.preferred_role)
    }
    if (filters?.mode === 'random') {
      list = list.sort(() => Math.random() - 0.5)
    }
    return list
  },
}

export default userService
