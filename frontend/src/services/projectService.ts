import apiClient from '@/services/apiClient'
import type { Project, ProjectPayload } from '@/types/participant'

export const projectService = {
  /**
   * Create a project for a team.
   * POST /api/teams/:teamId/project
   */
  async createProject(teamId: number, payload: ProjectPayload): Promise<Project> {
    const response = await apiClient.post<{ success: boolean; data: Project }>(
      `/api/teams/${teamId}/project`,
      payload,
    )
    return response.data.data
  },

  /**
   * Fetch project by ID.
   * GET /api/projects/:projectId
   */
  async getProject(projectId: number): Promise<Project> {
    const response = await apiClient.get<{ success: boolean; data: Project }>(
      `/api/projects/${projectId}`,
    )
    return response.data.data
  },

  /**
   * Update project details.
   * PATCH /api/projects/:projectId
   */
  async updateProject(projectId: number, payload: Partial<ProjectPayload>): Promise<Project> {
    const response = await apiClient.patch<{ success: boolean; data: Project }>(
      `/api/projects/${projectId}`,
      payload,
    )
    return response.data.data
  },

  /**
   * Submit project for judging.
   * POST /api/projects/:projectId/submit
   */
  async submitProject(projectId: number): Promise<{ message: string }> {
    const response = await apiClient.post<{ success: boolean; data: { message: string } }>(
      `/api/projects/${projectId}/submit`,
    )
    return response.data.data
  },

  /**
   * Get all public projects for an event.
   * GET /api/events/:eventId/projects
   */
  async getEventProjects(eventId: number, publicOnly = true): Promise<Project[]> {
    const response = await apiClient.get<{ success: boolean; data: Project[] }>(
      `/api/events/${eventId}/projects?public_only=${publicOnly}`,
    )
    return response.data.data
  },
}

export default projectService
