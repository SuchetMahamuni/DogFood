import type { UserRole } from '@/types/navigation'

export interface Profile {
  display_name?: string
  bio?: string
  profile_picture_url?: string
  skills?: string
  interests?: string
  experience?: string
  preferred_role?: string
  availability?: string
  previous_projects?: string
}

export interface User {
  id: number
  name: string
  email: string
  role: UserRole | string
  active: boolean
  created_at?: string
  updated_at?: string
  profile?: Profile
}

export interface AuthSuccessData {
  user: User
  token: string
}

export interface AuthResponse {
  success: boolean
  data?: AuthSuccessData
  error?: {
    code: string
    message: string | Record<string, string[]>
  }
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  initialized: boolean
  error: string | null

  login: (payload: LoginPayload) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
  initializeAuth: () => Promise<void>
  clearAuth: () => void
}
