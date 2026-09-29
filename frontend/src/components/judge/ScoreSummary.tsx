import { useState } from 'react'
import { CheckCircle, AlertTriangle, Send, Loader2, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Criterion } from '@/types/judging'

interface ScoreSummaryProps {
  criteria: Criterion[]
  scores: Record<number, number>
  comments: Record<number, string>
  isSubmitting: boolean
  isScoredAlready: boolean
  onSubmitScores: () => Promise<void>
}

export function ScoreSummary({
  criteria,
  scores,
  isSubmitting,
  isScoredAlready,
  onSubmitScores,
}: ScoreSummaryProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Calculate totals
  const totalMaxRaw = criteria.reduce((sum, c) => sum + c.max_score, 0)
  const currentRaw = criteria.reduce((sum, c) => sum + (scores[c.id] || 0), 0)

  const weightedTotal = criteria.reduce((sum, c) => sum + (scores[c.id] || 0) * c.weight, 0)
  const maxWeightedTotal = criteria.reduce((sum, c) => sum + c.max_score * c.weight, 0)

  const rawPercent = totalMaxRaw > 0 ? Math.round((currentRaw / totalMaxRaw) * 100) : 0

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false)
    await onSubmitScores()
  }

  return (
    <div className="p-6 rounded-2xl border border-primary/40 bg-gradient-to-b from-[#121928] to-[#0A0F1A] shadow-xl sticky top-24 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          <h3 className="text-base font-bold text-white">Score Summary</h3>
        </div>
        <span className="text-[11px] font-mono font-bold text-primary-light px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
          {criteria.length} Criteria
        </span>
      </div>

      <div className="space-y-4 text-sm">
        {/* Breakdown by Criterion */}
        <div className="space-y-2 border-b border-slate-800/80 pb-3">
          {criteria.map((c) => {
            const val = scores[c.id] || 0
            const weighted = (val * c.weight).toFixed(1)
            return (
              <div key={c.id} className="flex justify-between items-center text-xs">
                <span className="text-slate-300 truncate max-w-[150px]">{c.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white font-bold">
                    {val} / {c.max_score}
                  </span>
                  <span className="text-[11px] text-primary font-mono">
                    ({weighted} pts)
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Aggregated Totals */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Raw Score</span>
            <span className="font-mono font-bold text-slate-200">
              {currentRaw.toFixed(1)} / {totalMaxRaw} ({rawPercent}%)
            </span>
          </div>

          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-white">Weighted Score</span>
            <span className="font-mono text-primary text-base">
              {weightedTotal.toFixed(1)} <span className="text-xs text-slate-500">/ {maxWeightedTotal.toFixed(1)}</span>
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-[#0B1020] border border-slate-800/80 p-3 text-[11px] text-slate-400 leading-relaxed">
          Scores are normalized and weighted across all assigned judges.
        </div>
      </div>

      <div className="pt-2">
        {isScoredAlready ? (
          <div className="w-full flex items-center justify-center gap-2 py-3 text-xs font-mono font-bold text-emerald-300 bg-emerald-500/15 rounded-xl border border-emerald-500/30">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            Score Submitted & Recorded
          </div>
        ) : (
          <Button
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-xs h-10 shadow-lg shadow-primary-600/30 rounded-xl"
            disabled={isSubmitting}
            onClick={() => setShowConfirmDialog(true)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting Score...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Score
              </>
            )}
          </Button>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md bg-[#0F1522] border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Submit Project Score?
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Confirm your final scores for this project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-sm">
            <div className="p-3 bg-[#0B1020] border border-slate-800 rounded-xl space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Raw Points:</span>
                <span className="font-bold text-white">{currentRaw.toFixed(1)} / {totalMaxRaw}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Weighted Result:</span>
                <span className="font-bold text-primary">{weightedTotal.toFixed(1)} pts</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Once submitted, this project will be recorded as <strong className="text-emerald-400 font-mono">SCORED</strong>.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSubmitting}
              className="bg-[#0B1020] border-slate-800 text-slate-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-hover text-white font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Confirm & Submit'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

