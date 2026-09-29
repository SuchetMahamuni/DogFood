import type { Rubric, Criterion } from '@/types/judging'

/**
 * Standard Rubric Criteria matching the database seed in backend/app/seed/seed.py.
 * Criteria IDs 1 and 2 directly match the database records validated by ScoringService:
 *   c1 = Criterion(id=1, rubric_id=1, name='Innovation', weight=1.0, max_score=10)
 *   c2 = Criterion(id=2, rubric_id=1, name='Technical Difficulty', weight=1.5, max_score=10)
 *
 * NOTE ON BACKEND GAPS:
 * The backend defines database models for Rubric and Criterion, but currently DOES NOT
 * expose REST routes such as GET /api/rubrics or POST /api/rubrics.
 * This adapter isolates the rubric definition and documents the missing route.
 */
export const STANDARD_CRITERIA: Criterion[] = [
  {
    id: 1,
    rubric_id: 1,
    name: 'Innovation',
    description: 'Originality, novelty, and creative problem solving in addressing the hackathon track.',
    weight: 1.0,
    max_score: 10,
  },
  {
    id: 2,
    rubric_id: 1,
    name: 'Technical Difficulty',
    description: 'Engineering complexity, architectural robustness, clean code, and implementation quality.',
    weight: 1.5,
    max_score: 10,
  },
  {
    id: 3,
    rubric_id: 1,
    name: 'Product Polish & UX',
    description: 'User interface aesthetic, responsiveness, intuitive flow, and overall product experience.',
    weight: 1.0,
    max_score: 10,
  },
  {
    id: 4,
    rubric_id: 1,
    name: 'Impact & Viability',
    description: 'Potential for real-world impact, sustainability, and alignment with target audience needs.',
    weight: 1.0,
    max_score: 10,
  },
]

export const STANDARD_RUBRIC: Rubric = {
  id: 1,
  event_id: 1,
  name: 'Standard Hackathon Rubric',
  description: 'Authoritative multi-criteria evaluation framework with weighted scoring.',
  criteria: STANDARD_CRITERIA,
}

export const rubricService = {
  /**
   * Fetch rubric and evaluation criteria for an event.
   * If the backend introduces a GET /api/events/:eventId/rubric endpoint in the future,
   * it can be plugged in here transparently.
   */
  async getRubricForEvent(eventId: number): Promise<Rubric> {
    // Return standard rubric with matching event_id
    return {
      ...STANDARD_RUBRIC,
      event_id: eventId,
    }
  },

  /**
   * Get criteria list for scoring.
   */
  async getCriteria(): Promise<Criterion[]> {
    return STANDARD_CRITERIA
  },
}

export default rubricService
