import apiClient from '@/services/apiClient'
import type { GuidanceResource, GuidanceStage } from '@/types/participant'

export const FALLBACK_GUIDANCE_RESOURCES: GuidanceResource[] = [
  {
    id: 1,
    title: 'Hackathon Ideation & Rapid Value Discovery',
    description: 'Frameworks to brainstorm, validate, and narrow down hackathon ideas within the first 4 hours.',
    topic: 'Ideation',
    skill: 'Product Strategy',
    stage: 'IDEATION',
    difficulty: 'Beginner',
    url: 'https://dogfood.dev/guides/ideation',
    duration: '15 min read',
    source: 'DogFood Team',
  },
  {
    id: 2,
    title: 'Teammate Chemistry & Role Distribution',
    description: 'How to divide architecture, API contracts, UI components, and demo prep to avoid bottlenecks.',
    topic: 'Teamwork',
    skill: 'Collaboration',
    stage: 'TEAM_FORMATION',
    difficulty: 'Beginner',
    url: 'https://dogfood.dev/guides/team-roles',
    duration: '10 min read',
    source: 'DogFood Team',
  },
  {
    id: 3,
    title: 'Fast-Track API Prototyping with Flask & React',
    description: 'Setting up schema validation, JWT auth, and Axios client interceptors in under 30 minutes.',
    topic: 'Architecture',
    skill: 'Python, TypeScript',
    stage: 'DEVELOPMENT',
    difficulty: 'Intermediate',
    url: 'https://dogfood.dev/guides/flask-react-stack',
    duration: '25 min tutorial',
    source: 'Dev Community',
  },
  {
    id: 4,
    title: 'Stress-Testing & Demo Resilience Checklist',
    description: 'Ensure your app works seamlessly during live demos without getting tripped up by network latency.',
    topic: 'Testing',
    skill: 'QA & Reliability',
    stage: 'TESTING',
    difficulty: 'Intermediate',
    url: 'https://dogfood.dev/guides/demo-testing',
    duration: '12 min read',
    source: 'DogFood Team',
  },
  {
    id: 5,
    title: 'High-Impact Hackathon Demos & Pitching',
    description: 'How to craft a 2-minute video and repository README that captivates judges.',
    topic: 'Submission',
    skill: 'Pitching',
    stage: 'SUBMISSION',
    difficulty: 'All Levels',
    url: 'https://dogfood.dev/guides/pitching',
    duration: '18 min video',
    source: 'Hackathon Alumni',
  },
  {
    id: 6,
    title: 'Understanding Hackathon Rubrics & Scoring Criteria',
    description: 'How judges evaluate technical complexity, design execution, and business viability.',
    topic: 'Judging',
    skill: 'Evaluation',
    stage: 'JUDGING',
    difficulty: 'Beginner',
    url: 'https://dogfood.dev/guides/rubrics',
    duration: '8 min read',
    source: 'DogFood Team',
  },
]

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
      if (response.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data
      }
      return this.filterFallback(stage)
    } catch {
      return this.filterFallback(stage)
    }
  },

  filterFallback(stage?: string): GuidanceResource[] {
    if (!stage) return FALLBACK_GUIDANCE_RESOURCES
    const filtered = FALLBACK_GUIDANCE_RESOURCES.filter((r) => r.stage.toUpperCase() === stage.toUpperCase())
    return filtered.length > 0 ? filtered : FALLBACK_GUIDANCE_RESOURCES
  },
}

export default guidanceService
