import { Calendar, Clock, ArrowRight, Layers } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Event, EventStatus } from '@/types/participant'
import { cn } from '@/lib/utils'

interface EventCardProps {
  event: Event
  onJoinClick?: () => void
}

export function getEventStatusBadge(status: EventStatus) {
  switch (status) {
    case 'LIVE':
      return {
        label: 'Live Now',
        className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-mono font-semibold',
        dot: 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]',
      }
    case 'UPCOMING':
      return {
        label: 'Upcoming',
        className: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 font-mono font-semibold',
        dot: 'bg-cyan-400',
      }
    case 'SUBMISSIONS_CLOSED':
      return {
        label: 'Submissions Closed',
        className: 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-mono font-semibold',
        dot: 'bg-amber-400',
      }
    case 'JUDGING':
      return {
        label: 'Judging',
        className: 'bg-primary/15 text-primary-light border-primary/30 font-mono font-semibold',
        dot: 'bg-primary-light animate-pulse',
      }
    case 'COMPLETED':
      return {
        label: 'Completed',
        className: 'bg-slate-500/15 text-slate-300 border-slate-500/30 font-mono font-semibold',
        dot: 'bg-slate-400',
      }
    default:
      return {
        label: status,
        className: 'bg-surface-elevated text-slate-300 border-white/10 font-mono',
        dot: 'bg-slate-400',
      }
  }
}

export function EventCard({ event }: EventCardProps) {
  const statusInfo = getEventStatusBadge(event.status)

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  const isLive = event.status === 'LIVE'
  const isUpcoming = event.status === 'UPCOMING'
  const isCompleted = event.status === 'COMPLETED'

  return (
    <Link
      to={`/events/${event.id}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
    >
      <div
        className={cn(
          'card-lift flex flex-col h-full bg-[#0B1020] border border-white/10 rounded-2xl p-6 relative overflow-hidden transition-all duration-200',
          'hover:border-primary/50 hover:shadow-xl hover:shadow-primary-950/30',
          isLive && 'border-emerald-500/30 shadow-xs shadow-emerald-500/10 hover:border-emerald-500/60',
          isUpcoming && 'border-cyan-500/30 hover:border-cyan-500/60',
          isCompleted && 'border-white/10 opacity-90',
        )}
      >
        {/* Top Status Accent Line */}
        <div
          className={cn(
            'absolute top-0 inset-x-0 h-1',
            isLive && 'bg-gradient-to-r from-emerald-500 to-teal-400',
            isUpcoming && 'bg-gradient-to-r from-cyan-500 to-primary',
            isCompleted && 'bg-slate-600',
            !isLive && !isUpcoming && !isCompleted && 'bg-primary',
          )}
        />

        {/* Top Header metadata */}
        <div className="flex items-center justify-between gap-2 mb-3 pt-1">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border',
              statusInfo.className,
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', statusInfo.dot)} />
            {statusInfo.label}
          </span>
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-400" />
            Due {formatDate(event.submission_deadline)}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2 flex-1">
          <h3 className="text-base font-bold tracking-tight text-white group-hover:text-primary-light transition-colors line-clamp-1">
            {event.name}
          </h3>
          <p className="line-clamp-2 text-xs text-slate-300 leading-relaxed">
            {event.description || 'Global developer hackathon on the DogFood platform.'}
          </p>

          {/* Tracks */}
          {event.tracks && event.tracks.length > 0 && (
            <div className="pt-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Layers className="h-3 w-3 text-primary" />
                Tracks ({event.tracks.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {event.tracks.map((track) => (
                  <span
                    key={track.id}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-surface-elevated text-slate-200 border border-white/10 font-medium"
                  >
                    {track.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info & interactive arrow */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>
              {formatDate(event.start_time)} – {formatDate(event.end_time)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:text-primary-light transition-colors">
            <span>View Hackathon</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}
