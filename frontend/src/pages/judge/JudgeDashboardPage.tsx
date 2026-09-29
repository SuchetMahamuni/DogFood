import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Scale,
  ClipboardList,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  Calendar,
  AlertCircle,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AssignmentCard } from '@/components/judge/AssignmentCard'
import { useAuthStore } from '@/store/authStore'
import judgingService from '@/services/judgingService'
import projectService from '@/services/projectService'
import eventService from '@/services/eventService'
import type { JudgeAssignment } from '@/types/judging'
import type { Event } from '@/types/participant'

export default function JudgeDashboardPage() {
  const { user } = useAuthStore()

  const [assignments, setAssignments] = useState<JudgeAssignment[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function fetchData() {
      setIsLoading(true)
      setError(null)

      try {
        const [rawAssignments, eventList] = await Promise.all([
          judgingService.getJudgeAssignments().catch(() => []),
          eventService.getEvents().catch(() => []),
        ])

        if (!active) return

        // Enrich assignments with project and event details
        const enriched = await Promise.all(
          rawAssignments.map(async (a) => {
            let project = undefined
            try {
              project = await projectService.getProject(a.project_id)
            } catch {
              // Ignore if project not found
            }
            const event = eventList.find((e) => e.id === a.event_id)
            return {
              ...a,
              project,
              event,
            }
          }),
        )

        setAssignments(enriched)
        setEvents(eventList)
      } catch (err: unknown) {
        if (!active) return
        const e = err as Error
        setError(e.message || 'Failed to load assignments.')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      active = false
    }
  }, [])

  // Derived metrics
  const total = assignments.length
  const completed = assignments.filter((a) => a.status === 'SCORED').length
  const pending = assignments.filter((a) => a.status === 'PENDING')
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const nextPendingAssignment = pending[0]
  const activeEvent = events[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-20">
      {/* Console Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Scale className="h-3 w-3 text-amber-400" />
              EVALUATION CONSOLE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            Welcome, {user?.name || 'Judge'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Official adjudication environment. Score assigned submissions against multi-criteria weighted rubrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {nextPendingAssignment && (
            <Button asChild size="sm" className="bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-lg shadow-primary-600/30">
              <Link
                to={`/judge/projects/${nextPendingAssignment.project_id}?assignmentId=${nextPendingAssignment.id}`}
              >
                Review Next Project
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-xs rounded-xl bg-rose-950/30 text-rose-300 border border-rose-800/40">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Judging Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>ASSIGNED PROJECTS</span>
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <ClipboardList className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {isLoading ? '—' : total}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Projects assigned for scoring
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>SCORED PROJECTS</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {isLoading ? '—' : completed}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Scores submitted
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>PENDING REVIEWS</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            {isLoading ? '—' : pending.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Awaiting rubric scoring
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>PROGRESS RATIO</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {isLoading ? '—' : `${completionRate}%`}
          </div>
          <Progress value={completionRate} className="mt-2 h-1.5 bg-slate-800" />
        </div>
      </div>

      {/* Event Context & Next Up banner */}
      {activeEvent && (
        <div className="p-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-indigo-950/30 via-[#0B1020] to-[#0A0F1A] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-bold text-sm text-white">
                Active Adjudication: {activeEvent.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/15 text-primary-light border border-primary/30 uppercase">
                {activeEvent.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Evaluation window closes: {new Date(activeEvent.end_time || activeEvent.submission_deadline).toLocaleString()}
            </p>
          </div>

          {nextPendingAssignment && (
            <Button asChild size="sm" className="shrink-0 bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-md">
              <Link
                to={`/judge/projects/${nextPendingAssignment.project_id}?assignmentId=${nextPendingAssignment.id}`}
              >
                Score Next Project (#{nextPendingAssignment.project_id})
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-medium">Synchronizing adjudication queue...</p>
        </div>
      )}

      {/* Content Section */}
      {!isLoading && (
        <div className="space-y-8">
          {/* Pending Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                Pending Evaluations ({pending.length})
              </h2>
              {pending.length > 0 && (
                <Button asChild variant="ghost" size="sm" className="text-xs text-primary hover:text-primary-light hover:bg-primary/8">
                  <Link to="/judge/assignments">View all assignments</Link>
                </Button>
              )}
            </div>

            {pending.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 bg-[#0B1020]">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <p className="font-bold text-sm text-white">Queue completely cleared!</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  You have evaluated all currently assigned submissions. New entries will appear automatically if allotted by organizers.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {pending.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            )}
          </div>

          {/* Completed Section */}
          {completed > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Completed Evaluations ({completed})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {assignments
                  .filter((a) => a.status === 'SCORED')
                  .map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} />
                  ))}
              </div>
            </div>
          )}

          {/* Global Empty State */}
          {total === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-[#0B1020]">
              <Scale className="h-10 w-10 text-slate-600 mb-3" />
              <p className="font-bold text-white">No submissions allotted to your docket yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Event organizers allocate submissions once project releases freeze. Please check back shortly.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

