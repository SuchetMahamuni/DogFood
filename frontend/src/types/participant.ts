import type { Profile } from '@/types/auth'
export type { Profile }

export type EventStatus =
  | 'DRAFT'
  | 'UPCOMING'
  | 'LIVE'
  | 'SUBMISSIONS_CLOSED'
  | 'JUDGING'
  | 'COMPLETED'
  | 'ARCHIVED'

export interface Track {
  id: number
  name: string
  description?: string
}

export interface Event {
  id: number
  name: string
  description?: string
  start_time: string
  end_time: string
  submission_deadline: string
  status: EventStatus
  tracks?: Track[]
}

export type TeamMemberRole = 'LEADER' | 'MEMBER'

export interface TeamMember {
  id: number
  user: {
    id: number
    name: string
    email?: string
    profile?: {
      display_name?: string
      skills?: string
      preferred_role?: string
    }
  }
  role: TeamMemberRole | string
  joined_at?: string
}

export interface Project {
  id: number
  team_id?: number
  track_id?: number | null
  title: string
  short_description?: string
  detailed_description?: string
  repository_url?: string
  demo_url?: string
  video_url?: string
  technologies?: string
  is_submitted: boolean
  submitted_at?: string | null
}

export interface ProjectPayload {
  title: string
  short_description?: string
  detailed_description?: string
  repository_url?: string
  demo_url?: string
  video_url?: string
  technologies?: string
  track_id?: number | null
}

export interface Team {
  id: number
  event_id: number
  name: string
  created_at?: string
  members?: TeamMember[]
  project?: Project
  event?: Event
}

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export interface TeamInvitation {
  id: number
  team_id: number
  invitee_id: number
  status: InvitationStatus
  created_at?: string
  team_name?: string
  inviter_name?: string
  event_name?: string
}

export interface DiscoveredUser extends Profile {
  id?: number
  user_id?: number
  name?: string
  email?: string
  role?: string
  match_score?: number
}

export type GuidanceStage =
  | 'IDEATION'
  | 'TEAM_FORMATION'
  | 'DEVELOPMENT'
  | 'TESTING'
  | 'SUBMISSION'
  | 'JUDGING'

export interface GuidanceResource {
  id: number
  title: string
  description?: string
  topic?: string
  skill?: string
  stage: GuidanceStage | string
  difficulty?: string
  url?: string
  thumbnail_url?: string
  duration?: string
  source?: string
}
