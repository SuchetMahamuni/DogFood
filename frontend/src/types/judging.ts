import type { Project, Event } from '@/types/participant'

export type JudgeAssignmentStatus = 'PENDING' | 'SCORED'

export interface JudgeAssignment {
  id: number
  judge_id?: number
  project_id: number
  event_id?: number
  status: JudgeAssignmentStatus
  assigned_at?: string
  completed_at?: string | null
  // UI-enriched fields
  project?: Project
  event?: Event
  judge_name?: string
  judge_email?: string
}

export interface Criterion {
  id: number
  rubric_id: number
  name: string
  description?: string
  weight: number
  max_score: number
}

export interface Rubric {
  id: number
  event_id: number
  name: string
  description?: string
  criteria: Criterion[]
}

export interface ScoreItemPayload {
  criterion_id: number
  value: number
  comment?: string
}

export interface SubmitScoresPayload {
  scores: ScoreItemPayload[]
}

export interface EventRanking {
  project_id: number
  final_score: number
  rank: number
  project?: Project
}

export interface JudgeDashboardStats {
  totalAssignments: number
  completedAssignments: number
  pendingAssignments: number
  completionRate: number
}

export interface OrganizerSummaryStats {
  totalEvents: number
  totalProjects: number
  submittedProjects: number
  totalAssignments: number
  completedAssignments: number
  judgingCompletionPercentage: number
}

export interface AssignJudgePayload {
  judge_id: number
  project_id: number
  event_id: number
}
