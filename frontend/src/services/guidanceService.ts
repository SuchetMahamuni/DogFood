import apiClient from '@/services/apiClient'
import type { GuidanceResource, GuidanceStage } from '@/types/participant'

export const guidanceService = {
  /**
   * Fetch recommendations by stage and optional skills.
   * GET /api/recommendations?stage=...&skills=...
   */
  async getRecommendations(stage?: GuidanceStage | string, skills?: string): Promise<GuidanceResource[]> {
    try {
      const params = new URLSearchParams()
      if (stage) params.append('stage', stage)
      if (skills) params.append('skills', skills)

      const response = await apiClient.get<{ success: boolean; data: GuidanceResource[] }>(
        `/api/recommendations${params.toString() ? `?${params.toString()}` : ''}`,
      )
      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data
      }
      return []
    } catch {
      return []
    }
  },
}

export default guidanceService
