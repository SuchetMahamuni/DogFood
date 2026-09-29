import { Calendar, FolderKanban, TrendingUp, Users } from 'lucide-react'
import type { OrganizerSummaryStats } from '@/types/judging'

interface OrganizerStatsCardsProps {
  stats: OrganizerSummaryStats
  judgesCount?: number
}

export function OrganizerStatsCards({ stats, judgesCount = 0 }: OrganizerStatsCardsProps) {
  const cards = [
    {
      label: 'ACTIVE HACKATHONS',
      value: stats.totalEvents,
      icon: Calendar,
      desc: 'Orchestrated events',
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
    },
    {
      label: 'TOTAL PROJECTS',
      value: stats.totalProjects,
      icon: FolderKanban,
      desc: `${stats.submittedProjects} submitted deliverables`,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
    {
      label: 'ACTIVE JUDGES',
      value: judgesCount,
      icon: Users,
      desc: 'Adjudicators on roster',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      label: 'ADJUDICATION COMPLETION',
      value: `${stats.judgingCompletionPercentage}%`,
      icon: TrendingUp,
      desc: `${stats.completedAssignments} of ${stats.submittedProjects || 1} evaluated`,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md transition-all hover:border-slate-700 space-y-2"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="tracking-wider text-[11px] font-bold">{card.label}</span>
              <div className={`p-1.5 rounded-lg ${card.bg} ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
              {card.value}
            </div>
            <p className="text-[11px] text-slate-400">
              {card.desc}
            </p>
          </div>
        )
      })}
    </div>
  )
}

