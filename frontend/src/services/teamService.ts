import apiClient from '@/services/apiClient'
import type { Team, TeamInvitation } from '@/types/participant'

const ACTIVE_TEAM_KEY = 'dogfood_active_team_id'

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
        { name }
      )
      if (response.data?.success && response.data.data) {
        this.setActiveTeamId(response.data.data.id)
        return response.data.data
      }
      throw new Error('Failed to create team')
    } catch (err: any) {
      throw new Error(err.response?.data?.error?.message || err.message || 'Failed to create team')
    }
  },

  /**
   * Fetch a specific team.
   * GET /api/teams/:teamId
   */
  async getTeam(teamId: number): Promise<Team> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Team }>(`/api/teams/${teamId}`)
      if (response.data?.success && response.data.data) {
        this.setActiveTeamId(response.data.data.id)
        return response.data.data
      }
      throw new Error('Team not found')
    } catch (err: any) {
      throw new Error(err.response?.data?.error?.message || err.message || 'Failed to fetch team')
    }
  },

  /**
   * Invite a user to a team.
   * POST /api/teams/:teamId/invite
   */
  async inviteMember(teamId: number, inviteeId: number): Promise<TeamInvitation> {
    try {
      const response = await apiClient.post<{ success: boolean; data: TeamInvitation }>(
        `/api/teams/${teamId}/invite`,
        { invitee_id: inviteeId }
      )
      if (response.data?.success && response.data.data) {
        return response.data.data
      }
      throw new Error('Failed to invite user')
    } catch (err: any) {
      throw new Error(err.response?.data?.error?.message || err.message || 'Failed to invite user')
    }
  },

  /**
   * Get invitations for the current user.
   */
  async getMyInvitations(): Promise<TeamInvitation[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: TeamInvitation[] }>('/api/teams/invitations')
      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data
      }
      return []
    } catch {
      return []
    }
  },

  /**
   * Accept an invitation.
   */
  async acceptInvitation(invitationId: number): Promise<{ message: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; data: { message: string } }>(`/api/teams/invitations/${invitationId}/accept`)
      return res.data?.data || { message: 'Invitation accepted.' }
    } catch (err: any) {
      throw new Error(err.response?.data?.error?.message || err.message || 'Failed to accept invitation')
    }
  },

  /**
   * Reject an invitation.
   */
  async rejectInvitation(invitationId: number): Promise<{ message: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; data: { message: string } }>(`/api/teams/invitations/${invitationId}/reject`)
      return res.data?.data || { message: 'Invitation rejected.' }
    } catch (err: any) {
      throw new Error(err.response?.data?.error?.message || err.message || 'Failed to reject invitation')
    }
  },

  /**
   * Leave a team.
   */
  async leaveTeam(teamId: number): Promise<{ message: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; data: { message: string } }>(`/api/teams/${teamId}/leave`)
      this.setActiveTeamId(null)
      return res.data?.data || { message: 'Left team.' }
    } catch (err: any) {
      throw new Error(err.response?.data?.error?.message || err.message || 'Failed to leave team')
    }
  },
}

export default teamService
