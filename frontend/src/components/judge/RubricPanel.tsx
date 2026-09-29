import { Scale, Award, Info } from 'lucide-react'
import type { Criterion } from '@/types/judging'

interface RubricPanelProps {
  criteria: Criterion[]
  className?: string
}

export function RubricPanel({ criteria, className }: RubricPanelProps) {
  return (
    <div className={`p-6 rounded-2xl border border-slate-800 bg-[#0B1020] shadow-md space-y-4 ${className || ''}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          <h3 className="text-base font-bold text-white">Event Rubric</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
          Official Benchmark
        </span>
      </div>

      <div className="space-y-3">
        {criteria.map((criterion) => (
          <div
            key={criterion.id}
            className="p-3.5 rounded-xl border border-slate-800/80 bg-[#0F1522] space-y-1.5 transition-colors hover:border-slate-700"
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                {criterion.name}
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  Weight: <strong className="text-primary">{criterion.weight}x</strong>
                </span>
                <span className="rounded bg-slate-900 border border-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-300">
                  0–{criterion.max_score} pts
                </span>
              </div>
            </div>

            {criterion.description && (
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {criterion.description}
              </p>
            )}
          </div>
        ))}

        <div className="flex items-start gap-2 p-3 rounded-xl bg-indigo-950/20 text-xs text-primary-light border border-primary/40">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span className="text-[11px] leading-relaxed">
            Multi-criterion weights and z-score standardizations are calculated deterministically on the backend.
          </span>
        </div>
      </div>
    </div>
  )
}

