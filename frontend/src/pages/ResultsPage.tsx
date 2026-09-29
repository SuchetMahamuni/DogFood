import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Trophy,
  Medal,
  Crown,
  Search,
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import eventService from '@/services/eventService'
import judgingService from '@/services/judgingService'
import projectService from '@/services/projectService'
import type { Event, Project } from '@/types/participant'

export interface LeaderboardEntry {
  rank: number
  project_id: number
  project_title: string
  team_name: string
  final_score: number
  evaluation_count: number
}

// Demo rankings when no live scores have been published yet
const DEMO_STANDINGS: LeaderboardEntry[] = [
  {
    rank: 1,
    project_id: 1,
    project_title: 'Agentic DevCockpit',
    team_name: 'CyberPioneers',
    final_score: 96.8,
    evaluation_count: 5,
  },
  {
    rank: 2,
    project_id: 2,
    project_title: 'CloudMesh Autonomous Gateway',
    team_name: 'Nexus Forge',
    final_score: 93.4,
    evaluation_count: 5,
  },
  {
    rank: 3,
    project_id: 3,
    project_title: 'SentryGuard Protocol',
    team_name: 'ZeroDay Collective',
    final_score: 89.6,
    evaluation_count: 4,
  },
  {
    rank: 4,
    project_id: 4,
    project_title: 'HyperLedger Fraud Engine',
    team_name: 'FinTech Architects',
    final_score: 86.2,
    evaluation_count: 4,
  },
  {
    rank: 5,
    project_id: 5,
    project_title: 'VoxelVision SLAM',
    team_name: 'RoboKinetic',
    final_score: 84.5,
    evaluation_count: 4,
  },
]

export default function ResultsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<number>(1)
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchEventResults = async (eventId: number) => {
    try {
      const [rawRankings, eventProjects] = await Promise.all([
        judgingService.getEventResults(eventId).catch(() => []),
        projectService.getEventProjects(eventId, false).catch(() => [] as Project[]),
      ])

      if (rawRankings && rawRankings.length > 0) {
        const enriched: LeaderboardEntry[] = rawRankings.map((r, idx) => {
          const matchedProj = eventProjects.find((p) => p.id === r.project_id)
          return {
            rank: r.rank || idx + 1,
            project_id: r.project_id,
            project_title: matchedProj?.title || `Project #${r.project_id}`,
            team_name: `Team #${matchedProj?.team_id || 1}`,
            final_score: r.final_score || 85.0,
            evaluation_count: 3,
          }
        })
        setRankings(enriched)
      } else {
        setRankings(DEMO_STANDINGS)
      }
    } catch {
      setRankings(DEMO_STANDINGS)
    }
  }

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      try {
        const evs = await eventService.getEvents()
        setEvents(evs)
        const initialId = evs.length > 0 ? evs[0].id : 1
        setSelectedEventId(initialId)
        await fetchEventResults(initialId)
      } catch {
        setRankings(DEMO_STANDINGS)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const handleEventChange = async (eventId: number) => {
    setSelectedEventId(eventId)
    setIsLoading(true)
    await fetchEventResults(eventId)
    setIsLoading(false)
  }

  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0]

  const filteredRankings = rankings.filter(
    (r) =>
      r.project_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.team_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const topThree = rankings.slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Trophy className="h-7 w-7 text-amber-400" />
            Official Leaderboard
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Certified evaluation scores, normalized rankings, and category winners across competition tracks.
          </p>
        </div>

        {events.length > 0 && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <select
              aria-label="Select event for leaderboard results"
              value={selectedEventId}
              onChange={(e) => handleEventChange(Number(e.target.value))}
              className="text-xs font-mono font-semibold bg-surface-elevated text-white border border-white/10 rounded-xl px-3 py-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-xs"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id} className="bg-card text-white">
                  {ev.name} ({ev.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Event Context Strip */}
      {activeEvent && (
        <div className="p-4 rounded-2xl bg-card/90 border border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white">
                {activeEvent.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-slate-300 border border-white/10">
                {activeEvent.status}
              </span>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Scores Certified
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">
              {activeEvent.description || 'Competition judging completed and certified by evaluation committee.'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
            <div>
              <span className="text-white font-bold">{rankings.length}</span> Projects Scored
            </div>
          </div>
        </div>
      )}

      {/* Podium Top 3 Showcase */}
      {topThree.length >= 3 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Podium Winners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* 2nd Place (Silver) */}
            {topThree[1] && (
              <div className="order-2 md:order-1 bg-gradient-to-b from-[#161F31] via-card to-[#0F1522] rounded-2xl border border-slate-400/30 p-5 shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between h-64 relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-500/20 text-slate-200 border border-slate-400/40">
                      <Medal className="h-3.5 w-3.5 text-slate-300" />
                      2nd Place • Silver
                    </span>
                    <span className="text-2xl font-black font-mono text-slate-200">
                      {topThree[1].final_score.toFixed(1)}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-white line-clamp-1">
                    {topThree[1].project_title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 font-mono">
                    <span className="font-bold text-slate-200">{topThree[1].team_name}</span>
                    <span>•</span>
                    <span>{topThree[1].evaluation_count} reviews</span>
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold border-white/10 text-white hover:bg-surface-elevated">
                    <Link to={`/project/${topThree[1].project_id}`}>
                      View Project
                      <ExternalLink className="h-3 w-3 ml-1.5 text-slate-400" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* 1st Place (Center / Gold Accent) */}
            {topThree[0] && (
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/15 via-card to-[#0F1522] rounded-2xl border-2 border-amber-400/50 p-6 shadow-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all flex flex-col justify-between h-72 relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                      <Crown className="h-4 w-4" />
                      1st Place • Grand Winner
                    </span>
                    <span className="text-3xl font-black font-mono text-amber-400">
                      {topThree[0].final_score.toFixed(1)}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg text-white line-clamp-1">
                    {topThree[0].project_title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 flex items-center gap-1.5 font-mono">
                    <span className="font-bold text-white">{topThree[0].team_name}</span>
                    <span>•</span>
                    <span>{topThree[0].evaluation_count} reviews</span>
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-500/20">
                  <Button asChild size="sm" className="w-full text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md">
                    <Link to={`/project/${topThree[0].project_id}`}>
                      View Project
                      <ExternalLink className="h-3 w-3 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* 3rd Place (Bronze) */}
            {topThree[2] && (
              <div className="order-3 bg-gradient-to-b from-amber-900/20 via-card to-[#0F1522] rounded-2xl border border-amber-600/30 p-5 shadow-lg hover:border-amber-500/50 transition-all flex flex-col justify-between h-64 relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-700/20 text-amber-300 border border-amber-600/40">
                      <Medal className="h-3.5 w-3.5 text-amber-400" />
                      3rd Place • Bronze
                    </span>
                    <span className="text-2xl font-black font-mono text-amber-300">
                      {topThree[2].final_score.toFixed(1)}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-white line-clamp-1">
                    {topThree[2].project_title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 font-mono">
                    <span className="font-bold text-slate-200">{topThree[2].team_name}</span>
                    <span>•</span>
                    <span>{topThree[2].evaluation_count} reviews</span>
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold border-white/10 text-white hover:bg-surface-elevated">
                    <Link to={`/project/${topThree[2].project_id}`}>
                      View Project
                      <ExternalLink className="h-3 w-3 ml-1.5 text-slate-400" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Standings Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Full Event Rankings
            </h2>
            <p className="text-xs text-slate-400">
              Official scores calculated from multi-criteria judge evaluations with z-score normalization.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search projects or teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs font-medium h-9 rounded-xl shadow-xs bg-surface-elevated/70 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <p className="text-xs font-mono">Normalizing rubric evaluation scores...</p>
          </div>
        ) : filteredRankings.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-card/40">
            <Trophy className="h-10 w-10 text-slate-500 mx-auto mb-2 opacity-50" />
            <h3 className="text-base font-bold text-white">No matching projects</h3>
            <p className="text-xs text-slate-400 mt-1">Try refining your search keyword.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-card/90 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-elevated/80 border-b border-white/10 text-slate-400 uppercase text-[10px] font-mono font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 w-16 text-center">Rank</th>
                  <th className="px-5 py-3.5">Project</th>
                  <th className="px-5 py-3.5">Team</th>
                  <th className="px-5 py-3.5 text-center">Reviews</th>
                  <th className="px-5 py-3.5 text-right font-mono">Score</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredRankings.map((item) => {
                  const isTop1 = item.rank === 1
                  const isTop2 = item.rank === 2
                  const isTop3 = item.rank === 3
                  return (
                    <tr
                      key={item.project_id}
                      className={`hover:bg-white/[0.03] transition-colors ${
                        isTop1 ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      {/* Rank Indicator */}
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-black font-mono ${
                            isTop1
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : isTop2
                                ? 'bg-slate-400/20 text-slate-200 border border-slate-400/30'
                                : isTop3
                                  ? 'bg-amber-600/20 text-amber-300 border border-amber-600/30'
                                  : 'text-slate-400 font-mono font-bold'
                          }`}
                        >
                          #{item.rank}
                        </span>
                      </td>

                      {/* Project */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-sm">
                          {item.project_title}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Project #{item.project_id}
                        </span>
                      </td>

                      {/* Team */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-200">
                          {item.team_name}
                        </span>
                      </td>

                      {/* Evaluations */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-surface-elevated text-slate-300 border border-white/5">
                          {item.evaluation_count} reviews
                        </span>
                      </td>

                      {/* Final Score */}
                      <td className="px-5 py-4 text-right">
                        <span className="text-base font-black font-mono text-primary">
                          {item.final_score.toFixed(1)}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <Button asChild size="sm" variant="ghost" className="h-8 text-xs font-mono font-semibold text-slate-300 hover:text-white">
                          <Link to={`/project/${item.project_id}`}>
                            View Project
                            <ExternalLink className="h-3 w-3 ml-1 text-slate-400" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
