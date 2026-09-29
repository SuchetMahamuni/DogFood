import apiClient from '@/services/apiClient'
import type {
  AuthSuccessData,
  LoginPayload,
  RegisterPayload,
  User,
} from '@/types/auth'

export const authService = {
  /**
   * Authenticate user with email and password.
   * POST /api/auth/login
   */
  async login(payload: LoginPayload): Promise<AuthSuccessData> {
    const response = await apiClient.post<{
      success: boolean
      data: AuthSuccessData
    }>('/api/auth/login', payload)
    return response.data.data
  },

  /**
   * Register a new user account.
   * POST /api/auth/register
   */
  async register(payload: RegisterPayload): Promise<AuthSuccessData> {
    const response = await apiClient.post<{
      success: boolean
      data: AuthSuccessData
    }>('/api/auth/register', payload)
    return response.data.data
  },

  /**
   * Invalidate current user session on backend.
   * POST /api/auth/logout
   */
  async logout(): Promise<void> {
    await apiClient.post<{
      success: boolean
      data: { message: string }
    }>('/api/auth/logout')
  },

  /**
   * Retrieve current authenticated user profile.
   * GET /api/auth/me
   */
  async getMe(): Promise<User> {
    const response = await apiClient.get<{
      success: boolean
      data: User
    }>('/api/auth/me')
    return response.data.data
  },
}

export default authService
