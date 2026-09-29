import eventService from '@/services/eventService'
import projectService from '@/services/projectService'
import judgingService from '@/services/judgingService'
import userService from '@/services/userService'
import type { Event, Project, DiscoveredUser } from '@/types/participant'
import type { EventRanking, OrganizerSummaryStats } from '@/types/judging'

export interface OrganizerEventOverview {
  event: Event
  projects: Project[]
  results: EventRanking[]
  stats: {
    totalProjects: number
    submittedProjects: number
    scoredProjects: number
    judgingProgressPercentage: number
  }
}

export const organizerService = {
  /**
   * Aggregate high-level organizer statistics from real backend collections.
   */
  async getOrganizerStats(activeEventId?: number): Promise<OrganizerSummaryStats> {
    try {
      const events = await eventService.getEvents()
      const targetEventId = activeEventId || events[0]?.id

      let totalProjects = 0
      let submittedProjects = 0
      let scoredProjects = 0

      if (targetEventId) {
        try {
          const projects = await projectService.getEventProjects(targetEventId, false)
          totalProjects = projects.length
          submittedProjects = projects.filter((p) => p.is_submitted).length

          const results = await judgingService.getEventResults(targetEventId)
          scoredProjects = results.length
        } catch {
          // If no projects or results yet
        }
      }

      const judgingCompletionPercentage = submittedProjects > 0
        ? Math.round((scoredProjects / submittedProjects) * 100)
        : 0

      return {
        totalEvents: events.length,
        totalProjects,
        submittedProjects,
        totalAssignments: submittedProjects,
        completedAssignments: scoredProjects,
        judgingCompletionPercentage,
      }
    } catch {
      return {
        totalEvents: 0,
        totalProjects: 0,
        submittedProjects: 0,
        totalAssignments: 0,
        completedAssignments: 0,
        judgingCompletionPercentage: 0,
      }
    }
  },

  /**
   * Fetch complete event overview including projects and results.
   */
  async getEventOverview(eventId: number): Promise<OrganizerEventOverview> {
    const event = await eventService.getEvent(eventId)
    let projects: Project[] = []
    let results: EventRanking[] = []

    try {
      projects = await projectService.getEventProjects(eventId, false)
    } catch {
      projects = []
    }

    try {
      results = await judgingService.getEventResults(eventId)
    } catch {
      results = []
    }

    const totalProjects = projects.length
    const submittedProjects = projects.filter((p) => p.is_submitted).length
    const scoredProjects = results.length
    const judgingProgressPercentage = submittedProjects > 0
      ? Math.round((scoredProjects / submittedProjects) * 100)
      : 0

    return {
      event,
      projects,
      results,
      stats: {
        totalProjects,
        submittedProjects,
        scoredProjects,
        judgingProgressPercentage,
      },
    }
  },

  /**
   * Fetch candidates available to act as judges.
   * Filters discovered users to actual JUDGE role.
   */
  async getJudgeCandidates(): Promise<DiscoveredUser[]> {
    try {
      const users = await userService.discoverUsers()
      return users.filter((u) => (u.role || '').toUpperCase() === 'JUDGE')
    } catch {
      return []
    }
  },

  /**
   * Fetch candidates registered as participants.
   * Filters discovered users to actual PARTICIPANT role.
   */
  async getParticipantCandidates(): Promise<DiscoveredUser[]> {
    try {
      const users = await userService.discoverUsers()
      return users.filter((u) => (u.role || '').toUpperCase() === 'PARTICIPANT')
    } catch {
      return []
    }
  },
}

export default organizerService
