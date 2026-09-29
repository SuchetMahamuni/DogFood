import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Scale,
  Plus,
  UserCheck,
  TrendingUp,
  Loader2,
  AlertCircle,
  FolderKanban,
  ExternalLink,
  Shield,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { OrganizerStatsCards } from '@/components/organizer/OrganizerStatsCards'
import { JudgingProgressChart } from '@/components/organizer/JudgingProgressChart'
import { EventEditorDialog } from '@/components/organizer/EventEditorDialog'
import { JudgeAssignmentDialog } from '@/components/organizer/JudgeAssignmentDialog'
import eventService from '@/services/eventService'
import projectService from '@/services/projectService'
import judgingService from '@/services/judgingService'
import organizerService from '@/services/organizerService'
import type { Event, Project, DiscoveredUser } from '@/types/participant'
import type { EventRanking, OrganizerSummaryStats } from '@/types/judging'

export default function OrganizerDashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<number>(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [results, setResults] = useState<EventRanking[]>([])
  const [judges, setJudges] = useState<DiscoveredUser[]>([])
  const [stats, setStats] = useState<OrganizerSummaryStats>({
    totalEvents: 0,
    totalProjects: 0,
    submittedProjects: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    judgingCompletionPercentage: 0,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [assignJudgeOpen, setAssignJudgeOpen] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [eventsList, judgeCandidates] = await Promise.all([
        eventService.getEvents().catch(() => []),
        organizerService.getJudgeCandidates().catch(() => []),
      ])

      setEvents(eventsList)
      setJudges(judgeCandidates)

      const activeEventId = selectedEventId || eventsList[0]?.id || 1
      setSelectedEventId(activeEventId)

      let eventProjects: Project[] = []
      let eventResults: EventRanking[] = []

      try {
        eventProjects = await projectService.getEventProjects(activeEventId, false)
      } catch {
        eventProjects = []
      }

      try {
        eventResults = await judgingService.getEventResults(activeEventId)
      } catch {
        eventResults = []
      }

      setProjects(eventProjects)
      setResults(eventResults)

      const submitted = eventProjects.filter((p) => p.is_submitted).length
      const scored = eventResults.length
      const percentage = submitted > 0 ? Math.round((scored / submitted) * 100) : 0

      setStats({
        totalEvents: eventsList.length,
        totalProjects: eventProjects.length,
        submittedProjects: submitted,
        totalAssignments: submitted,
        completedAssignments: scored,
        judgingCompletionPercentage: percentage,
      })
    } catch (err: unknown) {
      const e = err as Error
      setError(e.message || 'Failed to load organizer dashboard.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedEventId])

  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-primary/15 text-primary-light border border-primary/30">
              <Shield className="h-3 w-3 text-primary" />
              ORGANIZER DASHBOARD
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            Organizer Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage hackathons, assign judges, track evaluation progress, and review submissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAssignJudgeOpen(true)}
            className="bg-[#0F1522] border-slate-800 text-slate-200 hover:text-white text-xs font-semibold"
          >
            <UserCheck className="h-4 w-4 mr-1.5 text-primary" />
            Assign Judge
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateEventOpen(true)}
            className="bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-lg shadow-primary-600/30"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Hackathon
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-xs rounded-xl bg-rose-950/30 text-rose-300 border border-rose-800/40">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Event Selector Strip */}
      {events.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-800 bg-[#0B1020] shadow-md">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Selected Hackathon:
            </span>
            <select
              aria-label="Select active event context"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(Number(e.target.value))}
              className="text-xs font-bold text-white bg-[#070A12] border border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} ({ev.status})
                </option>
              ))}
            </select>
          </div>

          {activeEvent && (
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded-lg bg-primary/15 text-primary-light border border-primary/30 font-bold uppercase text-[10px]">
                {activeEvent.status}
              </span>
              <span className="text-slate-400">
                Deadline: {new Date(activeEvent.submission_deadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Stat Cards */}
      <OrganizerStatsCards stats={stats} judgesCount={judges.length} />

      {/* Quick Nav Command Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/organizer/events"
          className="p-5 rounded-2xl border border-slate-800 bg-[#0B1020] hover:border-primary/50 hover:bg-[#0F1522] shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">Hackathons</span>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <p className="text-[11px] text-slate-400">
            Lifecycle statuses, deadlines & tracks
          </p>
        </Link>

        <Link
          to="/organizer/judges"
          className="p-5 rounded-2xl border border-slate-800 bg-[#0B1020] hover:border-amber-500/50 hover:bg-[#0F1522] shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">Judges</span>
            <UserCheck className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-[11px] text-slate-400">
            Judge profiles & project assignments
          </p>
        </Link>

        <Link
          to="/organizer/progress"
          className="p-5 rounded-2xl border border-slate-800 bg-[#0B1020] hover:border-emerald-500/50 hover:bg-[#0F1522] shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Judging Progress</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400">
            Monitor scores & ranking calculations
          </p>
        </Link>

        <Link
          to="/organizer/rubric"
          className="p-5 rounded-2xl border border-slate-800 bg-[#0B1020] hover:border-cyan-500/50 hover:bg-[#0F1522] shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">Judging Criteria</span>
            <Scale className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-[11px] text-slate-400">
            Evaluation criteria & weight configuration
          </p>
        </Link>
      </div>

      {/* Charts & Submission Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Judging progress chart */}
        <div className="lg:col-span-2">
          <JudgingProgressChart projects={projects} results={results} />
        </div>

        {/* Judging Status Summary Card */}
        <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Judging Progress
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Live</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Judging Completion</span>
                <span className="font-mono font-bold text-white">
                  {stats.completedAssignments} / {stats.submittedProjects || 1} ({stats.judgingCompletionPercentage}%)
                </span>
              </div>
              <Progress value={stats.judgingCompletionPercentage} className="h-2 bg-slate-800" />
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Projects Registered:</span>
                <span className="font-mono font-bold text-white">{stats.totalProjects}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Submitted Projects:</span>
                <span className="font-mono font-bold text-primary-light">{stats.submittedProjects}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Scored Projects:</span>
                <span className="font-mono font-bold text-emerald-400">{stats.completedAssignments}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Pending Review:</span>
                <span className="font-mono font-bold text-amber-400">
                  {Math.max(0, stats.submittedProjects - stats.completedAssignments)}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold bg-[#0F1522] border-slate-800 text-slate-200 hover:text-white"
              onClick={() => setAssignJudgeOpen(true)}
            >
              <UserCheck className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Assign Another Judge
            </Button>
          </div>
        </div>
      </div>

      {/* Projects in Selected Event */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FolderKanban className="h-4 w-4 text-primary" />
            Projects ({projects.length})
          </h2>
          <Link
            to="/organizer/teams"
            className="text-xs font-semibold text-primary hover:text-primary-light flex items-center gap-1"
          >
            View teams & participants
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span className="text-xs font-mono">Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-10 text-center rounded-2xl border border-dashed border-slate-800 bg-[#0B1020]">
            <FolderKanban className="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">No projects registered yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Teams that create and submit projects for this hackathon will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0B1020] shadow-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070A12] border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Project Title</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Stack</th>
                  <th className="px-4 py-3.5">Submitted</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {projects.map((proj) => {
                  const isScored = results.some((r) => r.project_id === proj.id)
                  return (
                    <tr key={proj.id} className="hover:bg-[#0F1522] transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white text-sm">{proj.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {proj.short_description || 'No description provided'}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                            isScored
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : proj.is_submitted
                              ? 'bg-primary/15 text-primary-light border border-primary/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isScored ? 'Scored' : proj.is_submitted ? 'Submitted' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[11px] font-mono text-primary-light">
                          {proj.technologies || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">
                        {proj.submitted_at
                          ? new Date(proj.submitted_at).toLocaleDateString()
                          : 'In draft'}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-primary hover:text-primary-light hover:bg-primary/8">
                            <Link to={`/project/${proj.id}`}>View</Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs bg-[#0F1522] border-slate-800 text-slate-200 hover:text-white"
                            onClick={() => {
                              setAssignJudgeOpen(true)
                            }}
                          >
                            Assign
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <EventEditorDialog
        open={createEventOpen}
        onOpenChange={setCreateEventOpen}
        onSuccess={() => loadData()}
      />

      <JudgeAssignmentDialog
        open={assignJudgeOpen}
        events={events}
        judges={judges}
        selectedEventId={selectedEventId}
        onOpenChange={setAssignJudgeOpen}
        onSuccess={() => loadData()}
      />
    </div>
  )
}

