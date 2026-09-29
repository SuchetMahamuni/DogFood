import apiClient from '@/services/apiClient'
import type { Event } from '@/types/participant'

/**
 * Isolated default demo events used when backend database has not been seeded yet.
 */
export const FALLBACK_DEMO_EVENTS: Event[] = [
  {
    id: 1,
    name: 'DogFood Global Hackathon 2026',
    description:
      'The premier open-source hackathon for software engineers, product builders, and designers building next-generation developer platforms.',
    start_time: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    end_time: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    submission_deadline: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    status: 'LIVE',
    tracks: [
      { id: 1, name: 'AI & Developer Agents', description: 'Intelligent tooling for software development workflows.' },
      { id: 2, name: 'Cloud Infrastructure & DevOps', description: 'Next-generation cloud platforms and developer productivity.' },
      { id: 3, name: 'Open Web & Decentralized Apps', description: 'Decentralized architectures and privacy-centric web applications.' },
    ],
  },
  {
    id: 2,
    name: 'Autonomous Systems & Robotics Sprint',
    description:
      'A 48-hour intensive building challenge focusing on autonomous agents, robotics simulation, and edge intelligence.',
    start_time: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    end_time: new Date(Date.now() + 9 * 24 * 3600 * 1000).toISOString(),
    submission_deadline: new Date(Date.now() + 9 * 24 * 3600 * 1000).toISOString(),
    status: 'UPCOMING',
    tracks: [
      { id: 4, name: 'Autonomous Navigation', description: 'SLAM, computer vision, and spatial awareness.' },
      { id: 5, name: 'Edge Inference', description: 'Optimized on-device machine learning.' },
    ],
  },
  {
    id: 3,
    name: 'FinTech & Web Security Challenge',
    description:
      'Building ultra-reliable financial software, verification protocols, and real-time fraud detection systems.',
    start_time: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    end_time: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    submission_deadline: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    status: 'COMPLETED',
    tracks: [
      { id: 6, name: 'Fraud Prevention', description: 'Algorithmic fraud and anomaly detection.' },
    ],
  },
]

export const eventService = {
  /**
   * Fetch all hackathon events.
   * GET /api/events/
   */
  async getEvents(): Promise<Event[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Event[] }>('/api/events/')
      if (response.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data
      }
      return FALLBACK_DEMO_EVENTS
    } catch {
      return FALLBACK_DEMO_EVENTS
    }
  },

  /**
   * Fetch a single event by ID.
   * GET /api/events/:eventId
   */
  async getEvent(eventId: number): Promise<Event> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Event }>(`/api/events/${eventId}`)
      if (response.data?.success && response.data.data) {
        return response.data.data
      }
    } catch {
      // Fallback lookup
    }
    const found = FALLBACK_DEMO_EVENTS.find((e) => e.id === Number(eventId))
    if (found) return found
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
