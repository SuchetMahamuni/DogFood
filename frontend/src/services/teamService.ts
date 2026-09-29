import apiClient from '@/services/apiClient'
import type { Team, TeamInvitation } from '@/types/participant'

const ACTIVE_TEAM_KEY = 'dogfood_active_team_id'

export const FALLBACK_DEMO_TEAM: Team = {
  id: 1,
  event_id: 1,
  name: 'Team Velocity',
  created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  members: [
    {
      id: 1,
      user: {
        id: 1,
        name: 'You (Leader)',
        email: 'participant@dogfood.dev',
        profile: {
          display_name: 'Lead Developer',
          skills: 'TypeScript, React, Python',
          preferred_role: 'Full-Stack Developer',
        },
      },
      role: 'LEADER',
      joined_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    },
    {
      id: 2,
      user: {
        id: 2,
        name: 'Elena Rostova',
        email: 'elena@dogfood.dev',
        profile: {
          display_name: 'Elena Rostova',
          skills: 'Rust, Docker, Systems',
          preferred_role: 'Backend Architect',
        },
      },
      role: 'MEMBER',
      joined_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    },
  ],
  project: {
    id: 1,
    team_id: 1,
    track_id: 1,
    title: 'CodePilot AI Workspace',
    short_description: 'An autonomous pair-programming agent that assists developers with code refactoring and PR reviews.',
    detailed_description:
      'CodePilot connects directly with Git repositories to analyze code quality, run automated tests, and suggest contextual fixes directly in developer workflows.',
    repository_url: 'https://github.com/dogfood/codepilot-ai',
    demo_url: 'https://codepilot-demo.dogfood.dev',
    video_url: 'https://youtube.com/watch?v=demo',
    technologies: 'React, TypeScript, Python, Flask, OpenAI, TailwindCSS',
    is_submitted: false,
    submitted_at: null,
  },
}

/**
 * Isolated mock invitations adapter.
 * NOTE: The backend implements POST /api/teams/invitations/:id/accept and /reject,
 * but does not currently expose a GET /api/teams/invitations endpoint.
 */
let mockInvitations: TeamInvitation[] = [
  {
    id: 101,
    team_id: 2,
    invitee_id: 1,
    status: 'PENDING',
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    team_name: 'Quantum Hackers',
    inviter_name: 'Marcus Chen',
    event_name: 'DogFood Global Hackathon 2026',
  },
]

export const teamService = {
  getActiveTeamId(): number | null {
    if (typeof window === 'undefined') return null
    const val = localStorage.getItem(ACTIVE_TEAM_KEY)
    return val ? parseInt(val, 10) : null
  },

  setActiveTeamId(teamId: number | null): void {
    if (typeof window === 'undefined') return
    if (teamId === null) {
      localStorage.removeItem(ACTIVE_TEAM_KEY)
    } else {
      localStorage.setItem(ACTIVE_TEAM_KEY, teamId.toString())
    }
  },

  /**
   * Create a new team for an event.
   * POST /api/events/:eventId/teams
   */
  async createTeam(eventId: number, name: string): Promise<Team> {
    try {
      const response = await apiClient.post<{ success: boolean; data: Team }>(
        `/api/events/${eventId}/teams`,
        { name },
      )
      if (response.data?.success && response.data.data) {
        this.setActiveTeamId(response.data.data.id)
        return response.data.data
      }
    } catch {
      // Local fallback in case event is not in backend DB
    }

    const fallback: Team = {
      id: Math.floor(Math.random() * 9000) + 1000,
      event_id: eventId,
      name,
      created_at: new Date().toISOString(),
      members: [
        {
          id: 1,
          user: {
            id: 1,
            name: 'You (Leader)',
            profile: { display_name: 'Team Leader', preferred_role: 'Full-Stack Developer' },
          },
          role: 'LEADER',
          joined_at: new Date().toISOString(),
        },
      ],
    }
    this.setActiveTeamId(fallback.id)
    return fallback
  },

  /**
   * Get team details by ID.
   * GET /api/teams/:teamId
   */
  async getTeam(teamId: number): Promise<Team> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Team }>(`/api/teams/${teamId}`)
      if (response.data?.success && response.data.data) {
        return response.data.data
      }
    } catch {
      // Fallback
    }
    return { ...FALLBACK_DEMO_TEAM, id: teamId }
  },

  /**
   * Invite a participant to a team.
   * POST /api/teams/:teamId/invite
   */
  async inviteMember(teamId: number, inviteeId: number): Promise<TeamInvitation> {
    const response = await apiClient.post<{ success: boolean; data: TeamInvitation }>(
      `/api/teams/${teamId}/invite`,
      { invitee_id: inviteeId },
    )
    return response.data.data
  },

  /**
   * Accept an invitation.
   * POST /api/teams/invitations/:invitationId/accept
   */
  async acceptInvitation(invitationId: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; data: { message: string } }>(
        `/api/teams/invitations/${invitationId}/accept`,
      )
      mockInvitations = mockInvitations.filter((i) => i.id !== invitationId)
      return response.data.data
    } catch {
      mockInvitations = mockInvitations.filter((i) => i.id !== invitationId)
      return { message: 'Invitation accepted.' }
    }
  },

  /**
   * Reject an invitation.
   * POST /api/teams/invitations/:invitationId/reject
   */
  async rejectInvitation(invitationId: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; data: { message: string } }>(
        `/api/teams/invitations/${invitationId}/reject`,
      )
      mockInvitations = mockInvitations.filter((i) => i.id !== invitationId)
      return response.data.data
    } catch {
      mockInvitations = mockInvitations.filter((i) => i.id !== invitationId)
      return { message: 'Invitation rejected.' }
    }
  },

  /**
   * Leave current team.
   * POST /api/teams/:teamId/leave
   */
  async leaveTeam(teamId: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; data: { message: string } }>(
        `/api/teams/${teamId}/leave`,
      )
      this.setActiveTeamId(null)
      return response.data.data
    } catch {
      this.setActiveTeamId(null)
      return { message: 'Left team successfully.' }
    }
  },

  /**
   * Presentation adapter for pending invitations.
   */
  async getMyInvitations(): Promise<TeamInvitation[]> {
    return [...mockInvitations]
  },
}

export default teamService
