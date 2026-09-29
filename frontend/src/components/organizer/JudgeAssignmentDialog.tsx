import { useState, useEffect } from 'react'
import { UserCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import judgingService from '@/services/judgingService'
import projectService from '@/services/projectService'
import type { Event, Project, DiscoveredUser } from '@/types/participant'

interface JudgeAssignmentDialogProps {
  open: boolean
  events: Event[]
  judges: DiscoveredUser[]
  selectedEventId?: number
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function JudgeAssignmentDialog({
  open,
  events,
  judges,
  selectedEventId,
  onOpenChange,
  onSuccess,
}: JudgeAssignmentDialogProps) {
  const [eventId, setEventId] = useState<number>(selectedEventId || events[0]?.id || 1)
  const [projectId, setProjectId] = useState<number>(0)
  const [judgeId, setJudgeId] = useState<number>(0)

  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Load projects whenever eventId changes
  useEffect(() => {
    if (!eventId) return
    let active = true

    async function fetchProjects() {
      setLoadingProjects(true)
      try {
        const list = await projectService.getEventProjects(eventId, false)
        if (active) {
          setProjects(list)
          if (list.length > 0) {
            setProjectId(list[0].id)
          } else {
            setProjectId(0)
          }
        }
      } catch {
        if (active) setProjects([])
      } finally {
        if (active) setLoadingProjects(false)
      }
    }

    fetchProjects()

    return () => {
      active = false
    }
  }, [eventId])

  // Set default judge when list available
  useEffect(() => {
    if (judges.length > 0 && !judgeId) {
      setJudgeId(judges[0].user_id || judges[0].id || 3)
    }
  }, [judges, judgeId])

  useEffect(() => {
    if (selectedEventId) {
      setEventId(selectedEventId)
    }
    setErrorMessage(null)
    setSuccessMessage(null)
  }, [selectedEventId, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!eventId || !projectId || !judgeId) {
      setErrorMessage('Please select an event, a project, and a judge.')
      return
    }

    setIsSubmitting(true)

    try {
      await judgingService.assignJudge({
        event_id: Number(eventId),
        project_id: Number(projectId),
        judge_id: Number(judgeId),
      })

      setSuccessMessage('Judge assigned successfully!')
      setTimeout(() => {
        onSuccess()
        onOpenChange(false)
      }, 1200)
    } catch (err: unknown) {
      const error = err as Error
      setErrorMessage(error.message || 'Failed to create judge assignment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#0F1522] border-slate-800 text-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white font-bold">
              <UserCheck className="h-5 w-5 text-primary" />
              Assign Project to Judge
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Pair an event submission with an official judge for scoring.
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <div className="flex items-start gap-2 p-3 text-xs rounded-xl bg-rose-950/30 text-rose-300 border border-rose-800/40">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-emerald-950/30 text-emerald-300 border border-emerald-800/40">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="space-y-3.5">
            {/* Event selection */}
            <div className="space-y-1">
              <Label htmlFor="assign-event" className="text-xs font-mono font-medium text-slate-300">
                Hackathon Event
              </Label>
              <select
                id="assign-event"
                value={eventId}
                onChange={(e) => setEventId(Number(e.target.value))}
                disabled={isSubmitting}
                className="flex h-9 w-full rounded-xl border border-slate-800 bg-[#070A12] px-3 py-1 text-xs text-white shadow-xs focus:outline-none focus:border-indigo-500 font-mono"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name} ({ev.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Project selection */}
            <div className="space-y-1">
              <Label htmlFor="assign-project" className="text-xs font-mono font-medium text-slate-300">
                Target Project Submission
              </Label>
              {loadingProjects ? (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-2 font-mono">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  Loading event projects...
                </div>
              ) : projects.length === 0 ? (
                <p className="text-xs text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 font-mono">
                  No projects found for this event yet.
                </p>
              ) : (
                <select
                  id="assign-project"
                  value={projectId}
                  onChange={(e) => setProjectId(Number(e.target.value))}
                  disabled={isSubmitting}
                  className="flex h-9 w-full rounded-xl border border-slate-800 bg-[#070A12] px-3 py-1 text-xs text-white shadow-xs focus:outline-none focus:border-indigo-500 font-mono"
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      #{proj.id} — {proj.title} {proj.is_submitted ? '(Submitted)' : '(Draft)'}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Judge selection */}
            <div className="space-y-1">
              <Label htmlFor="assign-judge" className="text-xs font-mono font-medium text-slate-300">
                Select Judge
              </Label>
              <select
                id="assign-judge"
                value={judgeId}
                onChange={(e) => setJudgeId(Number(e.target.value))}
                disabled={isSubmitting}
                className="flex h-9 w-full rounded-xl border border-slate-800 bg-[#070A12] px-3 py-1 text-xs text-white shadow-xs focus:outline-none focus:border-indigo-500 font-mono"
              >
                {judges.length > 0 ? (
                  judges.map((j, idx) => {
                    const id = j.user_id || j.id || idx + 1
                    const name = j.display_name || j.name || `Judge #${id}`
                    return (
                      <option key={id} value={id}>
                        {name} {j.skills ? `(${j.skills})` : ''}
                      </option>
                    )
                  })
                ) : (
                  <>
                    <option value={3}>Judge One (judge1@example.com)</option>
                    <option value={4}>Judge Two (judge2@example.com)</option>
                  </>
                )}
              </select>
            </div>

            <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
              Conflict-of-interest checks are enforced on the backend (judges cannot evaluate their own projects).
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="bg-[#0B1020] border-slate-800 text-slate-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || projects.length === 0}
              className="bg-primary hover:bg-primary-hover text-white font-bold text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Assign Judge'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

