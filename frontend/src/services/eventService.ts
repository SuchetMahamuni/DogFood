import apiClient from '@/services/apiClient'
import type { Event } from '@/types/participant'

export const eventService = {
  /**
   * Fetch all hackathon events.
   * GET /api/events/
   */
  async getEvents(): Promise<Event[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Event[] }>('/api/events/')
      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data
      }
      return []
    } catch {
      return []
    }
  },

  /**
   * Fetch a single event by ID.
   * GET /api/events/:eventId
   */
  async getEvent(eventId: number): Promise<Event> {
    const response = await apiClient.get<{ success: boolean; data: Event }>(`/api/events/${eventId}`)
    if (response.data?.success && response.data.data) {
      return response.data.data
    }
    throw new Error(`Event #${eventId} not found`)
  },

  /**
   * Create a new event.
   * POST /api/events/
   * Role: ORGANIZER, ADMIN
   */
  async createEvent(payload: Partial<Event>): Promise<Event> {
    try {
      const response = await apiClient.post<{ success: boolean; data: Event }>('/api/events/', payload)
      return response.data.data
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      const message = error.response?.data?.error?.message || error.message || 'Failed to create event'
      throw new Error(message)
    }
  },

  /**
   * Update an existing event.
   * PATCH /api/events/:eventId
   * Role: ORGANIZER, ADMIN
   */
  async updateEvent(eventId: number, payload: Partial<Event>): Promise<Event> {
    try {
      const response = await apiClient.patch<{ success: boolean; data: Event }>(`/api/events/${eventId}`, payload)
      return response.data.data
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      const message = error.response?.data?.error?.message || error.message || 'Failed to update event'
      throw new Error(message)
    }
  },
}

export default eventService
