import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { JudgeAssignment } from '@/types/judging'

interface AssignmentCardProps {
  assignment: JudgeAssignment
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const isScored = assignment.status === 'SCORED'
  const projectTitle = assignment.project?.title || `Project #${assignment.project_id}`
  const projectDesc = assignment.project?.short_description || 'Assigned hackathon project for evaluation.'

  return (
    <div className={`flex flex-col justify-between rounded-2xl p-5 border transition-all duration-200 ${
      isScored
        ? 'bg-[#0B1020] border-slate-800/80 hover:border-slate-700'
        : 'bg-gradient-to-b from-[#121928] to-[#0A0F1A] border-primary/40 shadow-lg shadow-primary-950/20 hover:border-indigo-400'
    }`}>
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
              isScored
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
            }`}
          >
            {isScored ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                Scored & Verified
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 text-amber-400" />
                Pending Evaluation
              </>
            )}
          </span>

          {assignment.event && (
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 truncate max-w-[130px]">
              <Calendar className="h-3 w-3 text-slate-500 shrink-0" />
              {assignment.event.name}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-white line-clamp-1 mb-1.5">
          {projectTitle}
        </h3>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {projectDesc}
        </p>

        {assignment.project?.technologies && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {assignment.project.technologies.split(',').slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-primary-light"
              >
                {tech.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-auto">
        <span className="text-[11px] font-mono text-slate-500">
          {assignment.assigned_at
            ? `Assigned ${new Date(assignment.assigned_at).toLocaleDateString()}`
            : `ID #${assignment.id}`}
        </span>

        <Button
          asChild
          size="sm"
          className={`h-8 text-xs font-bold ${
            isScored
              ? 'bg-[#0F1522] border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800'
              : 'bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary-600/30'
          }`}
        >
          <Link to={`/judge/projects/${assignment.project_id}?assignmentId=${assignment.id}`}>
            {isScored ? 'View Score' : 'Score Project'}
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

