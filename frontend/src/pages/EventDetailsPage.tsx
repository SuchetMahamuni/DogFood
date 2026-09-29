import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  ArrowLeft,
  Users,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FolderKanban,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import eventService from '@/services/eventService'
import type { Event } from '@/types/participant'
import { getEventStatusBadge } from '@/components/participant/EventCard'
import { EventTimeline } from '@/components/participant/EventTimeline'

export default function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>()

  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEvent() {
      if (!eventId) return
      setIsLoading(true)
      setError(null)
      try {
        const data = await eventService.getEvent(parseInt(eventId, 10))
        setEvent(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Failed to load hackathon details.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [eventId])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="h-6 w-36 bg-surface-elevated animate-pulse rounded" />
        <div className="h-56 bg-card animate-pulse rounded-2xl border border-white/10" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Event Not Found</h2>
        <p className="text-sm text-slate-400">{error || 'This hackathon event does not exist.'}</p>
        <Button asChild variant="outline" className="border-white/10 text-white">
          <Link to="/events">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hackathons
          </Link>
        </Button>
      </div>
    )
  }

  const statusInfo = getEventStatusBadge(event.status)
  const deadlineDate = new Date(event.submission_deadline)
  const isSubmissionOpen = event.status === 'LIVE' || event.status === 'UPCOMING'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-16">
      {/* Contextual Back Navigation */}
      <div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Hackathons</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F1522] via-[#121928] to-[#0A0F1A] border border-white/15 p-6 sm:p-8 shadow-xl">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.className}`}>
              <span className={`h-2 w-2 rounded-full ${statusInfo.dot}`} />
              {statusInfo.label}
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              {new Date(event.start_time).toLocaleDateString()} – {new Date(event.end_time).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {event.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>

      {/* Main Grid: Details Left, Action Panel Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Tracks & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tracks */}
          {event.tracks && event.tracks.length > 0 && (
            <Card className="border-white/10 bg-card/90">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Challenge Tracks &amp; Focus Areas
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Target specific technical problem areas for focused rubric evaluation.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {event.tracks.map((track) => (
                  <div
                    key={track.id}
                    className="p-4 rounded-xl bg-surface-elevated/50 border border-white/10 hover:border-primary/40 transition-colors space-y-1.5"
                  >
                    <p className="font-bold text-sm text-white">{track.name}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {track.description || 'Focus on technical depth, innovative execution, and measurable impact.'}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Timeline Card */}
          <Card className="border-white/10 bg-card/90">
            <CardContent className="pt-6">
              <EventTimeline event={event} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Deadline Card & Actions */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card className="border-white/15 bg-card/95 shadow-xl">
            <CardHeader className="pb-3 border-b border-white/10">
              <CardTitle className="text-sm font-bold text-white">Participant Operations</CardTitle>
              <CardDescription className="text-xs text-slate-400">Collaborate with your squad or build solo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
                <p className="text-xs font-mono font-bold text-primary-light flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Squad Requirement
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Teams must be registered before submitting projects to judges.
                </p>
              </div>

              <Button asChild className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold border border-primary/30 glow-brand" size="md">
                <Link to="/team">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Team
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full border-white/10 text-slate-200 hover:text-white hover:bg-surface-elevated text-xs font-semibold" size="md">
                <Link to="/discover">
                  <Sparkles className="h-4 w-4 mr-2 text-cyan-400" />
                  Discover Teammates
                </Link>
              </Button>

              <Button asChild variant="ghost" className="w-full text-xs text-slate-400 hover:text-white" size="sm">
                <Link to="/project">
                  <FolderKanban className="h-3.5 w-3.5 mr-1 text-slate-400" />
                  Open Project Workspace
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Deadline Countdown Card */}
          <Card className="border-white/10 bg-card/90">
            <CardHeader className="pb-2 border-b border-white/5">
              <CardTitle className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-400">
                <Clock className="h-4 w-4 text-amber-400" />
                Submission Deadline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-3">
              <p className="text-lg font-extrabold font-mono text-white">
                {deadlineDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-xs font-mono text-slate-400">
                {deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
              </p>
              <div className="pt-2 border-t border-white/10 text-xs">
                {isSubmissionOpen ? (
                  <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Submissions Active
                  </span>
                ) : (
                  <span className="text-amber-400 font-mono font-semibold">Submissions Locked</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
