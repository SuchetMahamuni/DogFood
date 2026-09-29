import { create } from 'zustand'
import { clearToken, getApiErrorMessage, getToken, setToken } from '@/services/apiClient'
import authService from '@/services/authService'
import type { AuthState, LoginPayload, RegisterPayload, User } from '@/types/auth'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  initialized: false,
  error: null,

  login: async (payload: LoginPayload): Promise<User> => {
    set({ isLoading: true, error: null })
    try {
      const data = await authService.login(payload)
      setToken(data.token)
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      return data.user
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to sign in. Please verify your credentials.')
      set({ isLoading: false, error: message })
      throw new Error(message)
    }
  },

  register: async (payload: RegisterPayload): Promise<User> => {
    set({ isLoading: true, error: null })
    try {
      const data = await authService.register(payload)
      setToken(data.token)
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      return data.user
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to create account. Please check your details.')
      set({ isLoading: false, error: message })
      throw new Error(message)
    }
  },

  logout: async (): Promise<void> => {
    set({ isLoading: true })
    try {
      await authService.logout()
    } catch {
      // If logout API fails because token was expired/invalid, continue clearing local state
    } finally {
      clearToken()
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  },

  initializeAuth: async (): Promise<void> => {
    const token = getToken()
    if (!token) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        initialized: true,
        isLoading: false,
      })
      return
    }

    set({ isLoading: true })
    try {
      const user = await authService.getMe()
      set({
        user,
        token,
        isAuthenticated: true,
        initialized: true,
        isLoading: false,
        error: null,
      })
    } catch {
      // Token is invalid or expired
      clearToken()
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        initialized: true,
        isLoading: false,
        error: null,
      })
    }
  },

  clearAuth: (): void => {
    clearToken()
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  },
}))

// Synchronize with external 401 response interceptor
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    useAuthStore.getState().clearAuth()
  })
}
