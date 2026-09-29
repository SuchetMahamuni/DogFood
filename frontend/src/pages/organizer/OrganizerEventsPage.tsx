import { useState, useEffect } from 'react'
import {
  Calendar,
  Plus,
  Edit2,
  Clock,
  Loader2,
  AlertCircle,
  Tag,
  ArrowRight,
  Shield,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { EventEditorDialog } from '@/components/organizer/EventEditorDialog'
import eventService from '@/services/eventService'
import type { Event } from '@/types/participant'

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [editorOpen, setEditorOpen] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null)

  const fetchEvents = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await eventService.getEvents()
      setEvents(data)
    } catch (err: unknown) {
      const e = err as Error
      setError(e.message || 'Failed to fetch events.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleEdit = (ev: Event) => {
    setEventToEdit(ev)
    setEditorOpen(true)
  }

  const handleCreate = () => {
    setEventToEdit(null)
    setEditorOpen(true)
  }

  const filteredEvents = events.filter((ev) => {
    if (selectedStatus === 'ALL') return true
    return ev.status === selectedStatus
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-20">
      {/* Contextual Back Navigation */}
      <div>
        <Link
          to="/organizer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors group"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          <span>Back to Organizer</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-primary/15 text-primary-light border border-primary/30">
              <Shield className="h-3 w-3 text-primary" />
              ORGANIZER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            Hackathons
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create, schedule, configure tracks, and manage hackathon deadlines.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleCreate}
          className="bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-lg shadow-primary-600/30"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          New Hackathon
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-xs rounded-xl bg-rose-950/30 text-rose-300 border border-rose-800/40">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'LIVE', 'UPCOMING', 'JUDGING', 'COMPLETED', 'DRAFT'].map((st) => (
          <Button
            key={st}
            size="sm"
            variant="ghost"
            className={`text-xs h-9 font-bold px-3.5 rounded-xl capitalize ${
              selectedStatus === st
                ? 'bg-primary text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            onClick={() => setSelectedStatus(st)}
          >
            {st.toLowerCase()}
          </Button>
        ))}
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-medium">Fetching hackathon rosters...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-[#0B1020]">
          <Calendar className="h-10 w-10 text-slate-600 mb-3" />
          <p className="font-bold text-white">No events found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            No hackathons match the selected lifecycle filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 hover:border-slate-700 shadow-md flex flex-col justify-between transition-all">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      ev.status === 'LIVE'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : ev.status === 'JUDGING'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-primary/15 text-primary-light border border-primary/30'
                    }`}
                  >
                    {ev.status}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    ID #{ev.id}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {ev.name}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {ev.description || 'No description provided.'}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Starts: {new Date(ev.start_time).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>Deadline: {new Date(ev.submission_deadline).toLocaleString()}</span>
                  </div>
                </div>

                {ev.tracks && ev.tracks.length > 0 && (
                  <div className="pt-3">
                    <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1">
                      <Tag className="h-3 w-3 text-primary" />
                      Tracks ({ev.tracks.length}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ev.tracks.map((t) => (
                        <span
                          key={t.id}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-primary-light"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-5">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 bg-[#0F1522] border-slate-800 text-slate-200 hover:text-white"
                  onClick={() => handleEdit(ev)}
                >
                  <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                  Edit Details
                </Button>

                <Button asChild size="sm" variant="ghost" className="text-xs h-8 text-primary hover:text-primary-light hover:bg-primary/8">
                  <Link to={`/events/${ev.id}`}>
                    Public View
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <EventEditorDialog
        open={editorOpen}
        eventToEdit={eventToEdit}
        onOpenChange={setEditorOpen}
        onSuccess={() => fetchEvents()}
      />
    </div>
  )
}

