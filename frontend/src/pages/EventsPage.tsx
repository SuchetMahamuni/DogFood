import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, RefreshCcw, AlertCircle, Compass, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/participant/EventCard'
import { PageHeader } from '@/components/layout/PageHeader'
import eventService from '@/services/eventService'
import type { Event, EventStatus } from '@/types/participant'
import { useAuthStore } from '@/store/authStore'

type StatusFilter = 'ALL' | EventStatus

export default function EventsPage() {
  const { isAuthenticated } = useAuthStore()
  const [events, setEvents] = useState<Event[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await eventService.getEvents()
      setEvents(data)
    } catch {
      setError('Unable to load hackathons at this time. Please retry.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(search.toLowerCase())) ||
      (e.tracks && e.tracks.some((t) => t.name.toLowerCase().includes(search.toLowerCase())))

    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in pb-16">
      {/* Contextual Back Navigation */}
      {isAuthenticated && (
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Dashboard</span>
          </Link>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Hackathons"
        description="Browse active and upcoming competitions, review prize tracks, and register your team to build."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchEvents}
            disabled={isLoading}
            className="border-white/10 text-slate-300 hover:text-white hover:bg-surface-elevated text-xs font-semibold"
          >
            <RefreshCcw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/90 p-3 rounded-2xl border border-white/10 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by hackathon name, technical tracks, or description..."
            className="pl-9 h-9 text-xs bg-surface-elevated/70 border-white/10 text-white placeholder:text-slate-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'LIVE', 'UPCOMING', 'COMPLETED'] as StatusFilter[]).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-colors border ${
                statusFilter === st
                  ? 'bg-primary text-white border-primary/50 shadow-sm glow-brand'
                  : 'bg-surface-elevated/60 text-slate-300 border-white/5 hover:bg-surface-elevated hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'All Hackathons' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchEvents} className="border-rose-500/30 text-rose-200">
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-surface-card animate-pulse border border-white/5" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredEvents.length === 0 && (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-white/10 bg-card/40">
          <div className="h-12 w-12 rounded-2xl bg-surface-elevated flex items-center justify-center mx-auto mb-3 text-slate-400 border border-white/5">
            <Compass className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-base font-bold text-white">No hackathons found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            No events match your current search query or status filter.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 text-xs font-semibold border-white/10 text-slate-200 hover:text-white"
            onClick={() => {
              setSearch('')
              setStatusFilter('ALL')
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && !error && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
