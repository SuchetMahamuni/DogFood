import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  ShieldAlert,
  Loader2,
  AlertCircle,
  FolderKanban,
  CheckCircle2,
  UserCheck,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JudgeAssignmentDialog } from '@/components/organizer/JudgeAssignmentDialog'
import eventService from '@/services/eventService'
import projectService from '@/services/projectService'
import judgingService from '@/services/judgingService'
import organizerService from '@/services/organizerService'
import type { Event, Project, DiscoveredUser } from '@/types/participant'
import type { EventRanking } from '@/types/judging'

export default function OrganizerAssignmentsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<number>(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [results, setResults] = useState<EventRanking[]>([])
  const [judges, setJudges] = useState<DiscoveredUser[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [eventList, judgeCandidates] = await Promise.all([
        eventService.getEvents().catch(() => []),
        organizerService.getJudgeCandidates().catch(() => []),
      ])

      setEvents(eventList)
      setJudges(judgeCandidates)

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
      setError(e.message || 'Failed to load assignments data.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedEventId])

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
            Judge Assignments
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Assign hackathon projects to judges with conflict-of-interest safeguards.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setAssignDialogOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-lg shadow-primary-600/30"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          New Assignment
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-xs rounded-xl bg-rose-950/30 text-rose-300 border border-rose-800/40">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Conflict of Interest Notice */}
      <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-xs">
        <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-300">Backend Conflict-of-Interest Guard</h4>
          <p className="text-slate-300 leading-relaxed">
            When assigning judges, the backend strictly prevents conflict of interest: if a judge is currently a member of a project's team, the assignment is rejected with HTTP 400. Duplicate assignments for the same project are also prevented automatically.
          </p>
        </div>
      </div>

      {/* Event context filter */}
      {events.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-800 bg-[#0B1020] shadow-md">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Filter by Event:
          </span>
          <select
            aria-label="Filter assignments by event"
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

      {/* Submissions & Assigned Status */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-medium">Synchronizing docket matrix...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-[#0B1020]">
          <FolderKanban className="h-10 w-10 text-slate-600 mb-3" />
          <p className="font-bold text-white">No submissions found for this event</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Submissions will populate here once teams submit projects.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0B1020] shadow-md">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070A12] border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Project ID & Title</th>
                <th className="px-4 py-3.5">Submission Status</th>
                <th className="px-4 py-3.5">Evaluation Status</th>
                <th className="px-4 py-3.5">Technologies</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {projects.map((proj) => {
                const isScored = results.some((r) => r.project_id === proj.id)
                return (
                  <tr key={proj.id} className="hover:bg-[#0F1522] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white text-sm">
                        #{proj.id} — {proj.title}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {proj.short_description || 'No description provided'}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          proj.is_submitted
                            ? 'bg-primary/15 text-primary-light border border-primary/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {proj.is_submitted ? 'Submitted' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isScored
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {isScored ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            Scored
                          </span>
                        ) : (
                          'Pending Evaluation'
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-primary-light text-[11px]">
                        {proj.technologies || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs bg-[#0F1522] border-slate-800 text-slate-200 hover:text-white"
                        onClick={() => setAssignDialogOpen(true)}
                      >
                        <UserCheck className="h-3.5 w-3.5 mr-1 text-primary" />
                        Assign Judge
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog */}
      <JudgeAssignmentDialog
        open={assignDialogOpen}
        events={events}
        judges={judges}
        selectedEventId={selectedEventId}
        onOpenChange={setAssignDialogOpen}
        onSuccess={() => loadData()}
      />
    </div>
  )
}

