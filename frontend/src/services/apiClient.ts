import axios, { isAxiosError } from 'axios'

export const TOKEN_STORAGE_KEY = 'dogfood_token'

/**
 * Token management helper functions.
 * Uses a single consistent storage key: dogfood_token.
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

/**
 * Determine Axios base URL:
 * - In development, an empty base URL ensures requests use relative paths
 *   (e.g., /api/...) that are handled by the Vite dev server proxy (localhost:5173 -> 127.0.0.1:8000).
 *   This prevents cross-origin requests and eliminates browser CORS errors.
 * - In production, VITE_API_URL can provide the full backend origin if deployed separately.
 */
function resolveApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL
  if (import.meta.env.DEV) {
    // If not set, or pointing to local backend, use relative URL for Vite proxy
    if (!envUrl || envUrl === 'http://127.0.0.1:8000' || envUrl === 'http://localhost:8000') {
      return ''
    }
  }
  return envUrl || ''
}

const BASE_URL = resolveApiBaseUrl()

/**
 * Pre-configured Axios instance for DogFood backend.
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15_000,
})

/* ─── Request interceptor – attach Bearer token ────────────────────────── */
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

/* ─── Response interceptor – handle 401 & session expiry ────────────────── */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken()
      // Dispatch a custom event so the auth store can react cleanly
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout'))
      }
    }
    return Promise.reject(error)
  },
)

/**
 * Format and extract user-friendly error message from backend response or network failure.
 */
export function getApiErrorMessage(error: unknown, fallback = 'An unexpected error occurred.'): string {
  if (!isAxiosError(error)) {
    if (error instanceof Error) return error.message
    return fallback
  }

  // Network error (server down or unreachable)
  if (!error.response) {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return 'Unable to reach the server. Please ensure the backend is running.'
    }
    return error.message || fallback
  }

  const data = error.response.data

  // Expected backend contract: { success: false, error: { code: '...', message: '...' } }
  if (data?.error?.message) {
    const msg = data.error.message
    if (typeof msg === 'string') {
      return msg
    }
    if (typeof msg === 'object') {
      // Flatten Marshmallow field error object: { email: ["Not a valid email."], name: [...] }
      const errors = Object.entries(msg)
        .map(([field, errList]) => {
          const text = Array.isArray(errList) ? errList.join(', ') : String(errList)
          return `${field}: ${text}`
        })
        .join(' ')
      if (errors) return errors
    }
  }

  // Alternative backend error messages
  if (data?.message && typeof data.message === 'string') {
    return data.message
  }

  // Status code fallbacks
  switch (error.response.status) {
    case 400:
      return 'Invalid request data. Please check your inputs.'
    case 401:
      return 'Invalid email or password.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 404:
      return 'Requested resource not found.'
    case 409:
      return 'A record with this information already exists.'
    case 500:
      return 'Internal server error. Please try again later.'
    default:
      return fallback
  }
}

export default apiClient
