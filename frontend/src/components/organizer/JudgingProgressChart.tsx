import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import type { EventRanking } from '@/types/judging'
import type { Project } from '@/types/participant'

interface JudgingProgressChartProps {
  projects: Project[]
  results: EventRanking[]
  className?: string
}

export function JudgingProgressChart({
  projects,
  results,
  className,
}: JudgingProgressChartProps) {
  // If there are results, show project final scores ranking chart
  if (results.length > 0) {
    const chartData = results.slice(0, 8).map((r) => {
      const proj = projects.find((p) => p.id === r.project_id)
      return {
        name: proj?.title ? (proj.title.length > 14 ? `${proj.title.substring(0, 14)}…` : proj.title) : `Proj #${r.project_id}`,
        score: parseFloat(r.final_score.toFixed(1)),
        rank: r.rank,
      }
    })

    return (
      <div className={`p-6 rounded-2xl bg-card border border-border shadow-md ${className || ''}`}>
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Standardized Project Scores
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Weighted multi-criteria scores normalized across judge assignments.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
            Top {chartData.length}
          </span>
        </div>

        <div className="h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} stroke="var(--color-border)" />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} stroke="var(--color-border)" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload
                    return (
                      <div className="bg-popover border border-border px-3.5 py-2.5 rounded-xl shadow-xl text-xs text-popover-foreground">
                        <p className="font-bold text-foreground">{item.name}</p>
                        <p className="text-primary font-mono mt-1 font-bold">
                          Final Score: {item.score} pts (Rank #{item.rank})
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? 'var(--color-primary)' : 'color-mix(in srgb, var(--color-primary) 70%, transparent)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  // Otherwise show submission and evaluation pipeline breakdown
  const submittedCount = projects.filter((p) => p.is_submitted).length
  const draftCount = projects.length - submittedCount

  const statusData = [
    { name: 'Draft Stage', count: draftCount, color: '#64748B' },
    { name: 'Submitted Deliverables', count: submittedCount, color: 'var(--color-primary)' },
    { name: 'Scored Submissions', count: results.length, color: '#10b981' },
  ]

  return (
    <div className={`p-6 rounded-2xl bg-card border border-border shadow-md ${className || ''}`}>
      <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Submission &amp; Adjudication Pipeline
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Distribution of projects across preparation, submission, and judging review.
          </p>
        </div>
      </div>

      <div className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} stroke="var(--color-border)" />
            <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} allowDecimals={false} stroke="var(--color-border)" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload
                  return (
                    <div className="bg-popover border border-border px-3.5 py-2.5 rounded-xl shadow-xl text-xs text-popover-foreground">
                      <p className="font-bold text-foreground">{item.name}</p>
                      <p className="text-muted-foreground font-mono mt-1">
                        {item.count} projects in slice
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {statusData.map((entry, index) => (
                <Cell key={`status-cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
