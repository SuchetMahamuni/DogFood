import { useState, useEffect } from 'react'
import { Calendar, Loader2, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import eventService from '@/services/eventService'
import type { Event, EventStatus } from '@/types/participant'

interface EventEditorDialogProps {
  open: boolean
  eventToEdit?: Event | null
  onOpenChange: (open: boolean) => void
  onSuccess: (event: Event) => void
}

const EVENT_STATUSES: EventStatus[] = [
  'DRAFT',
  'UPCOMING',
  'LIVE',
  'SUBMISSIONS_CLOSED',
  'JUDGING',
  'COMPLETED',
  'ARCHIVED',
]

export function EventEditorDialog({
  open,
  eventToEdit,
  onOpenChange,
  onSuccess,
}: EventEditorDialogProps) {
  const isEditing = Boolean(eventToEdit)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [submissionDeadline, setSubmissionDeadline] = useState('')
  const [status, setStatus] = useState<EventStatus>('DRAFT')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Populate fields when editing or reset when creating
  useEffect(() => {
    if (eventToEdit) {
      setName(eventToEdit.name || '')
      setDescription(eventToEdit.description || '')
      setStartTime(eventToEdit.start_time ? eventToEdit.start_time.substring(0, 16) : '')
      setEndTime(eventToEdit.end_time ? eventToEdit.end_time.substring(0, 16) : '')
      setSubmissionDeadline(
        eventToEdit.submission_deadline ? eventToEdit.submission_deadline.substring(0, 16) : '',
      )
      setStatus(eventToEdit.status || 'DRAFT')
    } else {
      const now = new Date()
      const start = new Date(now.getTime() + 24 * 3600 * 1000)
      const deadline = new Date(now.getTime() + 4 * 24 * 3600 * 1000)
      const end = new Date(now.getTime() + 5 * 24 * 3600 * 1000)

      setName('')
      setDescription('')
      setStartTime(start.toISOString().substring(0, 16))
      setEndTime(end.toISOString().substring(0, 16))
      setSubmissionDeadline(deadline.toISOString().substring(0, 16))
      setStatus('DRAFT')
    }
    setErrorMessage(null)
  }, [eventToEdit, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!name.trim()) {
      setErrorMessage('Event name is required.')
      return
    }

    if (!startTime || !endTime || !submissionDeadline) {
      setErrorMessage('All dates (start, end, and deadline) are required.')
      return
    }

    setIsLoading(true)

    const payload: Partial<Event> = {
      name: name.trim(),
      description: description.trim() || undefined,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      submission_deadline: new Date(submissionDeadline).toISOString(),
      status,
    }

    try {
      let savedEvent: Event
      if (isEditing && eventToEdit) {
        savedEvent = await eventService.updateEvent(eventToEdit.id, payload)
      } else {
        savedEvent = await eventService.createEvent(payload)
      }
      onSuccess(savedEvent)
      onOpenChange(false)
    } catch (err: unknown) {
      const error = err as Error
      setErrorMessage(error.message || 'Failed to save event.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-[#0F1522] border-slate-800 text-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white font-bold">
              <Calendar className="h-5 w-5 text-primary" />
              {isEditing ? 'Edit Hackathon Event' : 'Create New Hackathon Event'}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              {isEditing
                ? 'Update event metadata, schedule, and current lifecycle state.'
                : 'Configure a new hackathon event with official tracks and deadlines.'}
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-rose-950/30 text-rose-300 border border-rose-800/40">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="event-name" className="text-xs font-mono font-medium text-slate-300">
                Event Name <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="event-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. DogFood Agentic Sprint 2026"
                disabled={isLoading}
                required
                className="bg-[#070A12] border-slate-800 text-white placeholder:text-slate-600 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="event-desc" className="text-xs font-mono font-medium text-slate-300">
                Event Description
              </Label>
              <Textarea
                id="event-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Overview, theme, guidelines, and goals for participants..."
                rows={3}
                disabled={isLoading}
                className="bg-[#070A12] border-slate-800 text-slate-200 placeholder:text-slate-600 rounded-xl resize-none text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="start-time" className="text-xs font-mono font-medium text-slate-300">
                  Start Date & Time <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="start-time"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-[#070A12] border-slate-800 text-white rounded-xl text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="end-time" className="text-xs font-mono font-medium text-slate-300">
                  End Date & Time <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="end-time"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-[#070A12] border-slate-800 text-white rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="sub-deadline" className="text-xs font-mono font-medium text-slate-300">
                  Submission Deadline <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="sub-deadline"
                  type="datetime-local"
                  value={submissionDeadline}
                  onChange={(e) => setSubmissionDeadline(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-[#070A12] border-slate-800 text-white rounded-xl text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="event-status" className="text-xs font-mono font-medium text-slate-300">
                  Lifecycle Status
                </Label>
                <select
                  id="event-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EventStatus)}
                  disabled={isLoading}
                  aria-label="Lifecycle Status"
                  className="flex h-9 w-full rounded-xl border border-slate-800 bg-[#070A12] px-3 py-1 text-xs text-white shadow-xs focus:outline-none focus:border-indigo-500 font-mono"
                >
                  {EVENT_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="bg-[#0B1020] border-slate-800 text-slate-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary-hover text-white font-bold text-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Update Event'
              ) : (
                'Create Event'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

