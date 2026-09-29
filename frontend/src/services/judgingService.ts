import apiClient from '@/services/apiClient'
import type {
  JudgeAssignment,
  SubmitScoresPayload,
  EventRanking,
  AssignJudgePayload,
} from '@/types/judging'

export interface AssignJudgeResponse {
  id: number
  judge_id: number
  project_id: number
}

export const judgingService = {
  /**
   * Fetch assignments for the currently authenticated judge/organizer.
   * GET /api/judging/assignments
   * Roles: JUDGE, ORGANIZER, ADMIN
   */
  async getJudgeAssignments(): Promise<JudgeAssignment[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: JudgeAssignment[] }>(
        '/api/judging/assignments',
      )
      return response.data?.data ?? []
    } catch (err: unknown) {
      // Re-throw with descriptive message
      const error = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      const message = error.response?.data?.error?.message || error.message || 'Failed to fetch assignments'
      throw new Error(message)
    }
  },

  /**
   * Assign a judge to a project for an event.
   * POST /api/judging/assignments
   * Roles: ORGANIZER, ADMIN
   */
  async assignJudge(payload: AssignJudgePayload): Promise<AssignJudgeResponse> {
    try {
      const response = await apiClient.post<{ success: boolean; data: AssignJudgeResponse }>(
        '/api/judging/assignments',
        payload,
      )
      return response.data.data
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      const message = error.response?.data?.error?.message || error.message || 'Failed to assign judge'
      throw new Error(message)
    }
  },

  /**
   * Submit criterion scores for an assignment.
   * POST /api/judging/assignments/:assignmentId/scores
   * Role: JUDGE
   */
  async submitScores(assignmentId: number, payload: SubmitScoresPayload): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; data: { message: string } }>(
        `/api/judging/assignments/${assignmentId}/scores`,
        payload,
      )
      return response.data.data
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string | Record<string, string[]> } } }; message?: string }
      const errData = error.response?.data?.error?.message
      const message = typeof errData === 'string'
        ? errData
        : typeof errData === 'object'
          ? Object.values(errData).flat().join(', ')
          : error.message || 'Failed to submit scores'
      throw new Error(message)
    }
  },

  /**
   * Fetch final calculated event rankings and scores.
   * GET /api/judging/events/:eventId/results
   * Roles: ORGANIZER, ADMIN
   */
  async getEventResults(eventId: number): Promise<EventRanking[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: EventRanking[] }>(
        `/api/judging/events/${eventId}/results`,
      )
      return response.data?.data ?? []
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      const message = error.response?.data?.error?.message || error.message || 'Failed to fetch event results'
      throw new Error(message)
    }
  },
}

export default judgingService
