import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { Criterion } from '@/types/judging'

interface CriterionScoreRowProps {
  criterion: Criterion
  value: number
  comment: string
  disabled?: boolean
  error?: string
  onChangeValue: (val: number) => void
  onChangeComment: (comment: string) => void
}

export function CriterionScoreRow({
  criterion,
  value,
  comment,
  disabled = false,
  error,
  onChangeValue,
  onChangeComment,
}: CriterionScoreRowProps) {
  const max = criterion.max_score || 10
  const weightedValue = (value * criterion.weight).toFixed(1)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (!isNaN(val)) {
      onChangeValue(Math.min(max, Math.max(0, val)))
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (!isNaN(val)) {
      onChangeValue(Math.min(max, Math.max(0, val)))
    } else {
      onChangeValue(0)
    }
  }

  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-[#0B1020] space-y-4 shadow-md transition-all hover:border-slate-700">
      {/* Criterion Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="font-bold text-white text-base">
            {criterion.name}
          </h3>
          {criterion.description && (
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl leading-relaxed">
              {criterion.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <span className="text-xs text-slate-400 font-mono">
            Weight: <strong className="text-primary">{criterion.weight}x</strong>
          </span>
          <div className="flex items-baseline gap-1 bg-[#121928] border border-slate-800 px-3 py-1 rounded-xl">
            <span className="text-lg font-black text-white font-mono">{value}</span>
            <span className="text-xs font-mono text-slate-400">/ {max}</span>
          </div>
        </div>
      </div>

      {/* Score Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={max}
            step={0.5}
            value={value}
            disabled={disabled}
            onChange={handleSliderChange}
            aria-label={`Score for ${criterion.name}`}
            className="flex-1 accent-indigo-500 h-2 bg-[#121928] rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          />

          <div className="w-20 shrink-0">
            <Input
              type="number"
              min={0}
              max={max}
              step={0.5}
              value={value}
              disabled={disabled}
              onChange={handleNumberChange}
              className="text-center font-mono font-bold text-white bg-[#070A12] border-slate-800 h-9 rounded-xl"
              aria-label={`Exact numeric score for ${criterion.name}`}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 px-1">
          <span>0 (Unsatisfactory)</span>
          <span className="text-primary-light font-bold">Weighted score: ~{weightedValue} pts</span>
          <span>{max} (Exceptional)</span>
        </div>

        {error && (
          <p className="text-xs font-medium text-rose-400">{error}</p>
        )}
      </div>

      {/* Comments Area */}
      <div className="space-y-1.5 pt-1">
        <Label htmlFor={`comment-${criterion.id}`} className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          Judge Feedback & Observations (optional)
        </Label>
        <Textarea
          id={`comment-${criterion.id}`}
          placeholder={`Add constructive feedback regarding ${criterion.name.toLowerCase()}...`}
          value={comment}
          disabled={disabled}
          onChange={(e) => onChangeComment(e.target.value)}
          rows={2}
          className="text-xs resize-none bg-[#070A12] border-slate-800 text-slate-200 placeholder:text-slate-600 rounded-xl"
        />
      </div>
    </div>
  )
}

