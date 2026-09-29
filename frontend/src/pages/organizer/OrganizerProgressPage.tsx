import { useState, useEffect } from 'react'
import {
  Trophy,
  Loader2,
  AlertCircle,
  Clock,
  ExternalLink,
  Activity,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { JudgingProgressChart } from '@/components/organizer/JudgingProgressChart'
import eventService from '@/services/eventService'
import projectService from '@/services/projectService'
import judgingService from '@/services/judgingService'
import type { Event, Project } from '@/types/participant'
import type { EventRanking } from '@/types/judging'

export default function OrganizerProgressPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<number>(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [results, setResults] = useState<EventRanking[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const eventList = await eventService.getEvents()
      setEvents(eventList)

      const activeId = selectedEventId || eventList[0]?.id || 1
      setSelectedEventId(activeId)

      const [eventProjects, eventResults] = await Promise.all([
        projectService.getEventProjects(activeId, false).catch(() => []),
        judgingService.getEventResults(activeId).catch(() => []),
      ])

      setProjects(eventProjects)
      setResults(eventResults)
    } catch (err: unknown) {
      const e = err as Error
      setError(e.message || 'Failed to load judging progress.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedEventId])

  const submittedProjects = projects.filter((p) => p.is_submitted)
  const scoredCount = results.length
  const progressPercentage =
    submittedProjects.length > 0 ? Math.round((scoredCount / submittedProjects.length) * 100) : 0

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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Activity className="h-3 w-3 text-emerald-400" />
              ORGANIZER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            Judging Progress
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track judging completion rates, review scores, and monitor project standings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#0B1020] border border-slate-800 text-slate-300">
            {scoredCount} of {submittedProjects.length || 1} Evaluated ({progressPercentage}%)
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-xs rounded-xl bg-rose-950/30 text-rose-300 border border-rose-800/40">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Event filter */}
      {events.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-800 bg-[#0B1020] shadow-md">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Hackathon Event:
          </span>
          <select
            aria-label="Select hackathon event"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(Number(e.target.value))}
            className="text-xs font-bold text-white bg-[#070A12] border border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.name} ({ev.status})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Overall progress indicator card */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Evaluation Completion Ratio</h3>
          <span className="font-mono font-black text-sm text-emerald-400">
            {progressPercentage}%
          </span>
        </div>
        <p className="text-xs text-slate-400">
          {scoredCount} completed submissions out of {submittedProjects.length} submitted deliverables.
        </p>
        <Progress value={progressPercentage} className="h-2 bg-slate-800" />
        <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
          <span>0% (Not Started)</span>
          <span className="text-amber-300 font-bold">
            {Math.max(0, submittedProjects.length - scoredCount)} pending reviews remaining
          </span>
          <span>100% (Ready for Official Standings)</span>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 gap-6">
        <JudgingProgressChart projects={projects} results={results} />
      </div>

      {/* Official Rankings Table from Backend */}
      <div className="space-y-4 pt-2">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          Calculated Rankings & Normalized Scores ({results.length})
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span className="text-xs font-mono">Computing event rankings...</span>
          </div>
        ) : results.length === 0 ? (
          <div className="p-10 text-center rounded-2xl border border-dashed border-slate-800 bg-[#0B1020]">
            <Clock className="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">No scoring rankings computed yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Rankings are calculated automatically once judges submit evaluations through the rubric scoring workflow.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0B1020] shadow-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070A12] border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Rank</th>
                  <th className="px-4 py-3.5">Project Title</th>
                  <th className="px-4 py-3.5">Normalized Final Score</th>
                  <th className="px-4 py-3.5 text-right">Review Project</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {results.map((r) => {
                  const proj = projects.find((p) => p.id === r.project_id)
                  return (
                    <tr key={r.project_id} className="hover:bg-[#0F1522] transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-white">
                        <span
                          className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                            r.rank === 1
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : r.rank === 2
                              ? 'bg-slate-500/20 text-slate-300 border border-slate-500/40'
                              : r.rank === 3
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                              : 'text-slate-400'
                          }`}
                        >
                          #{r.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white text-sm">
                          {proj?.title || `Project #${r.project_id}`}
                        </div>
                        {proj?.short_description && (
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {proj.short_description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-primary font-bold">
                        {r.final_score.toFixed(2)} pts
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-primary hover:text-primary-light hover:bg-primary/8">
                          <Link to={`/project/${r.project_id}`}>
                            Details
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

