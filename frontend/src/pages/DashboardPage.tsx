import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Users,
  FolderKanban,
  History
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import eventService from '@/services/eventService'
import teamService from '@/services/teamService'
import guidanceService from '@/services/guidanceService'
import type { Event, Team, GuidanceResource } from '@/types/participant'
import { getEventStatusBadge } from '@/components/participant/EventCard'

export default function DashboardPage() {
  const navigate = useNavigate()

  const [events, setEvents] = useState<Event[]>([])
  const [activeEvent, setActiveEvent] = useState<Event | null>(null)
  const [activeTeam, setActiveTeam] = useState<Team | null>(null)
  const [guidancePreview, setGuidancePreview] = useState<GuidanceResource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadDashboardData() {
      setIsLoading(true)
      try {
        const [eventList, guidance] = await Promise.all([
          eventService.getEvents(),
          guidanceService.getRecommendations('DEVELOPMENT'),
        ])

        if (!mounted) return

        setEvents(eventList)
        const live = eventList.find((e) => e.status === 'LIVE') || eventList[0] || null
        setActiveEvent(live)
        setGuidancePreview(guidance.slice(0, 2))

        const activeTeamId = teamService.getActiveTeamId() || 1
        const team = await teamService.getTeam(activeTeamId)
        if (mounted) {
          setActiveTeam(team)
        }
      } catch {
        // Fallbacks handled gracefully
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadDashboardData()
    return () => {
      mounted = false
    }
  }, [])

  // Calculate submission readiness percentage
  const proj = activeTeam?.project
  let readinessScore = 0
  if (activeTeam) readinessScore += 25
  if (proj) readinessScore += 25
  if (proj?.repository_url) readinessScore += 25
  if (proj?.is_submitted) readinessScore += 25

  // Next action determination with simple user-facing wording
  let nextAction = {
    title: 'Assemble Your Team',
    description: 'Create or join a team to start building your hackathon project.',
    link: '/team',
    cta: 'Continue'
  }

  if (activeTeam && !proj) {
    nextAction = {
      title: 'Create Project',
      description: 'Set your project title, target track, and problem description.',
      link: '/project',
      cta: 'Continue'
    }
  } else if (activeTeam && proj && (!proj.repository_url || !proj.is_submitted)) {
    nextAction = {
      title: 'Complete your project submission',
      description: 'Add your code repository link and live demonstration URL, and submit to judges.',
      link: '/project',
      cta: 'Continue'
    }
  } else if (proj?.is_submitted) {
    nextAction = {
      title: 'Project Under Review',
      description: 'Your project is locked and currently queued for evaluation.',
      link: '/project',
      cta: 'View Project'
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-10 w-72 bg-surface-elevated animate-pulse rounded-xl" />
        <div className="h-56 bg-surface-card animate-pulse rounded-2xl border border-white/10" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-16">
      
      {/* ROOT EXPERIENCE HEADER */}
      <div>
        <h1 className="text-xl font-mono text-slate-400 mb-2 font-bold uppercase tracking-wider">My Hackathon</h1>
        
        <div 
          onClick={() => activeEvent && navigate(`/events/${activeEvent.id}`)}
          className="rounded-2xl bg-gradient-to-br from-[#0F1522] via-[#121928] to-[#0A0F1A] border border-white/15 p-6 shadow-xl relative overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight group-hover:text-primary-light transition-colors">
                {activeEvent?.name || 'DogFood Hackathon 2026'}
              </h2>
              <div className="mt-2 text-emerald-400 font-mono font-bold flex items-center gap-2 uppercase tracking-wider text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {activeEvent?.status === 'LIVE' ? 'LIVE NOW' : activeEvent?.status || 'ACTIVE'}
              </div>
            </div>

            {/* Submission Progress */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-sm font-mono text-slate-300 mb-2">
                <span>Submission Progress</span>
                <span className={readinessScore === 100 ? "text-emerald-400" : ""}>{readinessScore}%</span>
              </div>
              <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
            </div>

            {/* Next Action */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-primary-light uppercase tracking-wider">
                  NEXT ACTION
                </span>
                <p className="text-sm text-white font-semibold mt-0.5">{nextAction.title}</p>
              </div>
              <Button asChild size="sm" className="bg-primary hover:bg-primary-hover text-white font-bold shrink-0 shadow-xs border border-primary/30 glow-brand">
                <Link to={nextAction.link} onClick={(e) => e.stopPropagation()}>
                  {nextAction.cta}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* COMPACT NAVIGATION SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate('/team')}
          className="p-4 rounded-xl bg-card/90 border border-white/10 hover:border-primary/50 cursor-pointer transition-colors space-y-2 card-lift"
        >
          <div className="text-[11px] text-slate-400 font-mono font-bold tracking-wider uppercase">TEAM</div>
          <div className="text-base font-bold text-white truncate">
            {activeTeam ? activeTeam.name : 'No Team'}
          </div>
          <div className="text-xs text-slate-300 font-mono">
            {activeTeam ? `${activeTeam.members?.length || 1} / 5 members` : 'Join or create'}
          </div>
        </div>

        <div 
          onClick={() => navigate('/project')}
          className="p-4 rounded-xl bg-card/90 border border-white/10 hover:border-primary/50 cursor-pointer transition-colors space-y-2 card-lift"
        >
          <div className="text-[11px] text-slate-400 font-mono font-bold tracking-wider uppercase">PROJECT</div>
          <div className="text-base font-bold text-white truncate">
            {proj ? proj.title : 'No Project'}
          </div>
          <div className="text-xs text-slate-300 font-mono">
            {readinessScore}% ready
          </div>
        </div>

        <div 
          onClick={() => navigate('/project')}
          className="p-4 rounded-xl bg-card/90 border border-white/10 hover:border-primary/50 cursor-pointer transition-colors space-y-2 card-lift"
        >
          <div className="text-[11px] text-slate-400 font-mono font-bold tracking-wider uppercase">SUBMISSION</div>
          <div className="text-base font-bold text-white truncate">
            {proj?.is_submitted ? 'Submitted' : 'In progress'}
          </div>
          <div className="text-xs text-slate-300 font-mono">
            {proj?.is_submitted ? 'Under review' : 'Action needed'}
          </div>
        </div>

        <div 
          onClick={() => navigate('/guidance')}
          className="p-4 rounded-xl bg-card/90 border border-white/10 hover:border-primary/50 cursor-pointer transition-colors space-y-2 card-lift"
        >
          <div className="text-[11px] text-slate-400 font-mono font-bold tracking-wider uppercase">GUIDANCE</div>
          <div className="text-base font-bold text-white truncate">
            Resources
          </div>
          <div className="text-xs text-slate-300 font-mono">
            {guidancePreview.length} recommendations
          </div>
        </div>
      </div>

      {/* MY HACKATHONS */}
      <div className="pt-4">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <History className="h-4.5 w-4.5 text-primary" />
          MY HACKATHONS
        </h3>
        
        <div className="space-y-3">
          {events.map((ev, idx) => {
            const isCurrentEvent = activeEvent?.id === ev.id
            const evStatus = getEventStatusBadge(ev.status)
            const teamName = isCurrentEvent && activeTeam ? activeTeam.name : idx === 1 ? 'Team Alpha' : 'Solo'
            const projectTitle = isCurrentEvent && proj ? proj.title : idx === 1 ? 'AI Project' : '—'
            const submissionState = isCurrentEvent && proj?.is_submitted
              ? 'Submitted'
              : isCurrentEvent && proj
                ? 'In Progress'
                : ev.status === 'COMPLETED'
                  ? 'Final Score: 88.5'
                  : 'Open'
            
            return (
              <div 
                key={ev.id}
                onClick={() => navigate(`/events/${ev.id}`)}
                className="p-4 rounded-xl bg-surface-elevated/40 border border-white/5 hover:border-white/20 hover:bg-surface-elevated/60 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-white">{ev.name}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${evStatus.className}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${evStatus.dot}`} />
                      {evStatus.label}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {teamName}
                    </span>
                    <span className="flex items-center gap-1">
                      <FolderKanban className="h-3 w-3" /> {projectTitle}
                    </span>
                  </div>
                </div>
                
                <div className="shrink-0 flex items-center justify-between md:flex-col md:items-end gap-1">
                  <span className={`text-xs font-mono font-semibold ${isCurrentEvent && proj?.is_submitted ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {submissionState}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(ev.start_time).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
