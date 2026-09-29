/**
 * Shared API response envelope.
 * Most backend responses wrap data in { data, message } or return arrays directly.
 */
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  pages: number
}

/** Generic record with an integer primary key */
export interface BaseRecord {
  id: number
  created_at: string
  updated_at: string
}
