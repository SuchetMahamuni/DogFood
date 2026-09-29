import { CheckCircle2, Circle, Clock } from 'lucide-react'
import type { Event } from '@/types/participant'
import { cn } from '@/lib/utils'

interface EventTimelineProps {
  event: Event
}

export function EventTimeline({ event }: EventTimelineProps) {
  const now = new Date()
  const start = new Date(event.start_time)
  const deadline = new Date(event.submission_deadline)
  const end = new Date(event.end_time)

  const steps = [
    {
      title: 'Registration & Team Formation',
      description: 'Find teammates and assemble your squad',
      date: start.toLocaleDateString(),
      completed: now >= start,
      active: now < start,
    },
    {
      title: 'Hacking & Project Development',
      description: 'Build your prototype and integrate technical architectures',
      date: `${start.toLocaleDateString()} – ${deadline.toLocaleDateString()}`,
      completed: now >= deadline,
      active: now >= start && now < deadline,
    },
    {
      title: 'Submission Deadline',
      description: 'Submit repository, video demo, and tech stack for verification',
      date: deadline.toLocaleDateString(),
      completed: now > deadline,
      active: event.status === 'SUBMISSIONS_CLOSED',
    },
    {
      title: 'Judging & Evaluation',
      description: 'Evaluators score multi-criteria weighted rubrics',
      date: `${deadline.toLocaleDateString()} – ${end.toLocaleDateString()}`,
      completed: event.status === 'COMPLETED',
      active: event.status === 'JUDGING',
    },
    {
      title: 'Results Announcement',
      description: 'Normalized rankings and podium awards published',
      date: end.toLocaleDateString(),
      completed: event.status === 'COMPLETED',
      active: event.status === 'COMPLETED',
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
        Hackathon Timeline
      </h3>
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex items-start gap-3">
            <span
              className={cn(
                'absolute -left-6 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-background ring-4 ring-background',
                step.completed && 'text-emerald-400',
                step.active && 'text-primary animate-pulse',
                !step.completed && !step.active && 'text-slate-600',
              )}
            >
              {step.completed ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : step.active ? (
                <Clock className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={cn(
                    'text-sm font-bold',
                    step.active ? 'text-primary' : step.completed ? 'text-white' : 'text-slate-400',
                  )}
                >
                  {step.title}
                </p>
                <span className="text-xs font-mono text-slate-400 whitespace-nowrap">{step.date}</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
