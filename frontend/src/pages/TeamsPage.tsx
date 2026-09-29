import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Compass,
  ArrowRight,
  ArrowLeft,
  Calendar,
  FolderKanban,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import eventService from '@/services/eventService'
import teamService from '@/services/teamService'
import type { Event, Team } from '@/types/participant'
import { getEventStatusBadge } from '@/components/participant/EventCard'

export default function TeamsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [teamsMap, setTeamsMap] = useState<Record<number, Team | null>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadData() {
      setIsLoading(true)
      try {
        const eventList = await eventService.getEvents().catch(() => [])
        const tMap: Record<number, Team | null> = {}
        await Promise.all(
          eventList.map(async (ev) => {
            const tm = await teamService.getMyTeamForEvent(ev.id)
            tMap[ev.id] = tm
          })
        )
        if (mounted) {
          setEvents(eventList)
          setTeamsMap(tMap)
        }
      } catch {
        // Fallbacks
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    loadData()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-20">
      {/* Contextual Back Navigation */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Dashboard</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-primary/15 text-primary-light border border-primary/30 uppercase tracking-wider">
              <Users className="h-3 w-3" />
              MULTI-HACKATHON CONTEXT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            My Teams
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            View your team formations and project submissions structured per hackathon competition.
          </p>
        </div>

        <Button asChild size="sm" className="bg-primary hover:bg-primary-hover text-white font-bold text-xs">
          <Link to="/events">
            <Plus className="h-4 w-4 mr-1.5" />
            Join Hackathon
          </Link>
        </Button>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-[#0B1020] border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-[#0B1020]">
          <Users className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="font-bold text-white text-base">No teams registered yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Join an active hackathon to form or join a team.
          </p>
          <Button asChild size="sm" className="mt-4 bg-primary hover:bg-primary-hover text-white font-bold text-xs">
            <Link to="/events">Explore Hackathons</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((ev) => {
            const evStatus = getEventStatusBadge(ev.status)
            const team = teamsMap[ev.id]
            const proj = team?.project

            return (
              <div
                key={ev.id}
                className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 hover:border-slate-700 shadow-md transition-all space-y-5"
              >
                {/* 1. Hackathon Level */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                      <Compass className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          Hackathon:
                        </span>
                        <h3 className="text-base font-bold text-white">{ev.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 font-mono">
                        <Calendar className="h-3 w-3 text-slate-500" />
                        {new Date(ev.start_time).toLocaleDateString()} – {new Date(ev.end_time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${evStatus.className}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${evStatus.dot}`} />
                    {evStatus.label}
                  </span>
                </div>

                {/* 2. Team → Project Relationship Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Team Box */}
                  <div className="p-4 rounded-xl bg-[#070A12] border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Team
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {team ? team.name : 'Solo / Not Assigned'}
                    </h4>
                    <p className="text-slate-400 font-mono text-[11px]">
                      {team ? `${team.members?.length || 1} / 5 Members` : 'No team formed for this event'}
                    </p>
                  </div>

                  {/* Project Box */}
                  <div className="p-4 rounded-xl bg-[#070A12] border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                      <FolderKanban className="h-3 w-3" />
                      Project Deliverable
                    </span>
                    <h4 className="text-sm font-bold text-white truncate">
                      {proj ? proj.title : 'Not Initialized'}
                    </h4>
                    <p className="text-slate-400 font-mono text-[11px] truncate">
                      {proj?.technologies || 'Ready to define stack'}
                    </p>
                  </div>

                  {/* Submission Box */}
                  <div className="p-4 rounded-xl bg-[#070A12] border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Submission Status
                    </span>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {proj?.is_submitted ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Submitted
                        </span>
                      ) : proj ? (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          In Progress
                        </span>
                      ) : (
                        <span className="text-slate-400">Open</span>
                      )}
                    </h4>
                    <p className="text-slate-400 font-mono text-[11px]">
                      {proj?.is_submitted ? 'Under evaluation' : 'Due by hackathon close'}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">
                    Hierarchy: <strong className="text-slate-300">{ev.name}</strong> → <strong className="text-primary">{team ? team.name : 'Team'}</strong> → <strong className="text-emerald-400">{proj ? proj.title : 'Submission'}</strong>
                  </span>

                  <Button asChild size="sm" className="bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-md">
                    <Link to={`/team/${ev.id}`}>
                      Open Team Workspace
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
