import { CheckCircle2, AlertCircle, HelpCircle, Sparkles } from 'lucide-react'
import type { Project } from '@/types/participant'
import { cn } from '@/lib/utils'

interface SubmissionReadinessProps {
  project: Partial<Project>
}

export function SubmissionReadiness({ project }: SubmissionReadinessProps) {
  const checks = [
    { label: 'Project Title', valid: !!project.title?.trim(), hint: 'Concise, memorable name' },
    { label: 'Executive Pitch', valid: !!project.short_description?.trim(), hint: 'Core problem and solution statement' },
    { label: 'Technical Architecture', valid: !!project.detailed_description?.trim(), hint: 'System design and methodology' },
    { label: 'Code Repository', valid: !!project.repository_url?.trim(), hint: 'Public GitHub/GitLab repository' },
    { label: 'Live Demonstration', valid: !!project.demo_url?.trim(), hint: 'Accessible web/cloud deployment' },
    { label: 'Technologies & Stack', valid: !!project.technologies?.trim(), hint: 'Languages, APIs, and frameworks' },
  ]

  const total = checks.length
  const completed = checks.filter((c) => c.valid).length
  const percentage = Math.round((completed / total) * 100)
  const isSubmissionReady = completed >= 4 // At least title, pitch, repo, and demo/specs

  return (
    <div className="bg-card rounded-2xl border border-white/10 shadow-xs p-5 space-y-4">
      {/* Header with completion pill */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-white">Submission Readiness</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Operational release checklist
          </p>
        </div>
        <div className="text-right">
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border',
              isSubmissionReady
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            )}
          >
            {percentage}% Ready
          </span>
        </div>
      </div>

      {/* Modern gradient progress track */}
      <div className="space-y-1.5">
        <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              isSubmissionReady
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]'
                : 'bg-gradient-to-r from-primary to-primary-hover shadow-[0_0_8px_rgba(99,102,241,0.7)]',
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{completed} of {total} criteria verified</span>
          <span className={isSubmissionReady ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
            {isSubmissionReady ? 'Eligible for Judging' : 'Actions Required'}
          </span>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-1.5 pt-1">
        {checks.map((check, idx) => (
          <div
            key={idx}
            className={cn(
              'flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs',
              check.valid
                ? 'bg-emerald-500/10 border-emerald-500/25 text-slate-200'
                : 'bg-surface-elevated/40 border-white/5 text-slate-400',
            )}
          >
            <div className="flex items-center gap-2.5 truncate">
              {check.valid ? (
                <div className="h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              ) : (
                <div className="h-4 w-4 rounded-full bg-surface-elevated text-slate-500 flex items-center justify-center shrink-0 border border-white/5">
                  <AlertCircle className="h-3 w-3" />
                </div>
              )}
              <div className="truncate">
                <span className={cn('font-semibold text-xs leading-none block', check.valid ? 'text-white' : 'text-slate-300')}>
                  {check.label}
                </span>
                <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                  {check.hint}
                </span>
              </div>
            </div>

            <span
              className={cn(
                'text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0',
                check.valid
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-surface-elevated text-slate-400 border border-white/5',
              )}
            >
              {check.valid ? 'PASSED' : 'MISSING'}
            </span>
          </div>
        ))}
      </div>

      {/* Helper notes */}
      <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 flex items-start gap-2">
        <HelpCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
        <span className="leading-snug">
          Judges review code structure, commit velocity, and live functionality. Ensure public repository access prior to official submission.
        </span>
      </div>
    </div>
  )
}
