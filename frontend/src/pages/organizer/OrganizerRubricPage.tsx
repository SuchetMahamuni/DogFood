import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Scale,
  Award,
  Info,
  ShieldCheck,
  Loader2,
  FileCode,
} from 'lucide-react'
import rubricService from '@/services/rubricService'
import type { Criterion, Rubric } from '@/types/judging'

export default function OrganizerRubricPage() {
  const [rubric, setRubric] = useState<Rubric | null>(null)
  const [criteria, setCriteria] = useState<Criterion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadRubric() {
      setIsLoading(true)
      try {
        const data = await rubricService.getRubricForEvent(1)
        setRubric(data)
        setCriteria(data.criteria)
      } finally {
        setIsLoading(false)
      }
    }
    loadRubric()
  }, [])

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0)

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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              <Scale className="h-3 w-3 text-cyan-400" />
              ORGANIZER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            Judging Criteria
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Evaluation criteria definitions, score weights, and rating scale guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {rubric?.name && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-primary/8 border border-primary/30 text-primary-light">
              {rubric.name}
            </span>
          )}
          <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#0B1020] border border-slate-800 text-slate-300">
            {criteria.length} Criteria Active
          </span>
        </div>
      </div>

      {/* Backend Note Banner */}
      <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-primary/30 bg-primary/10 text-xs">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-primary-light">Authoritative Server-Enforced Rubric Architecture</h4>
          <p className="text-slate-300 leading-relaxed">
            Rubric criteria and mathematical weighting parameters are stored directly in the database (`rubrics` and `criteria` tables). The backend `ScoringService` and `NormalizationService` validate inputs against these exact thresholds and compute official final standings.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-medium">Loading evaluation rubric specs...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Criteria Cards */}
          <div className="lg:col-span-2 space-y-4">
            {criteria.map((c) => {
              const weightPercent = totalWeight > 0 ? Math.round((c.weight / totalWeight) * 100) : 0

              return (
                <div key={c.id} className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-3">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <Award className="h-5 w-5 text-amber-400" />
                      <h3 className="text-base font-bold text-white">{c.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-primary-light px-2.5 py-0.5 rounded-lg bg-primary/10 border border-primary/20">
                        Weight: {c.weight}x ({weightPercent}%)
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-300 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800">
                        0–{c.max_score} pts
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {c.description || 'Evaluated on standard quality dimensions.'}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Rubric Metadata & Info */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
                <Scale className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-white">Rubric Summary</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Total Criteria:</span>
                  <span className="font-mono font-bold text-white">{criteria.length}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Sum of Weights:</span>
                  <span className="font-mono font-bold text-primary-light">{totalWeight.toFixed(1)}x</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Standardization:</span>
                  <span className="font-mono font-bold text-cyan-400">Z-score Normalization</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Enforcement:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Locked on Backend
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#070A12] border border-slate-800 space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCode className="h-3.5 w-3.5 text-primary" />
                Evaluation Mechanics
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Judges score submissions between 0 and maximum point scale. The server normalizes for judge severity distribution prior to generating podium rankings.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

