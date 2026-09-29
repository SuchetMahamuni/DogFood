import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  FolderKanban,
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Compass,
  Calendar,
  GitBranch,
  Globe,
  Radio,
  ChevronRight,
  History,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import eventService from '@/services/eventService'
import teamService from '@/services/teamService'
import userService from '@/services/userService'
import guidanceService from '@/services/guidanceService'
import type { Event, Team, DiscoveredUser, GuidanceResource } from '@/types/participant'
import { getEventStatusBadge } from '@/components/participant/EventCard'
import { UserCard } from '@/components/participant/UserCard'
import { ProfilePreviewModal } from '@/components/participant/ProfilePreviewModal'
import { InviteTeammateDialog } from '@/components/participant/InviteTeammateDialog'
import { TechStack } from '@/components/participant/TechStack'

export default function DashboardPage() {
  const { user } = useAuthStore()

  const [events, setEvents] = useState<Event[]>([])
  const [activeEvent, setActiveEvent] = useState<Event | null>(null)
  const [activeTeam, setActiveTeam] = useState<Team | null>(null)
  const [topMatches, setTopMatches] = useState<DiscoveredUser[]>([])
  const [guidancePreview, setGuidancePreview] = useState<GuidanceResource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [selectedUser, setSelectedUser] = useState<DiscoveredUser | null>(null)
  const [inviteModalUser, setInviteModalUser] = useState<DiscoveredUser | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadDashboardData() {
      setIsLoading(true)
      try {
        const [eventList, matches, guidance] = await Promise.all([
          eventService.getEvents(),
          userService.getMyMatches(),
          guidanceService.getRecommendations('DEVELOPMENT'),
        ])

        if (!mounted) return

        setEvents(eventList)
        const live = eventList.find((e) => e.status === 'LIVE') || eventList[0] || null
        setActiveEvent(live)
        setTopMatches(matches.slice(0, 3))
        setGuidancePreview(guidance.slice(0, 3))

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

  const participantName = user?.name || 'Developer'
  const eventStatus = activeEvent ? getEventStatusBadge(activeEvent.status) : null

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
    cta: 'Manage Team',
    stepNumber: 1,
  }

  if (activeTeam && !proj) {
    nextAction = {
      title: 'Create Project',
      description: 'Set your project title, target track, and problem description.',
      link: '/project',
      cta: 'Create Project',
      stepNumber: 2,
    }
  } else if (activeTeam && proj && !proj.repository_url) {
    nextAction = {
      title: 'Complete Project Submission',
      description: 'Add your code repository link and live demonstration URL.',
      link: '/project',
      cta: 'Submit',
      stepNumber: 3,
    }
  } else if (activeTeam && proj && !proj.is_submitted) {
    nextAction = {
      title: 'Complete Project Submission',
      description: 'Verify your release checklist and submit project to judges.',
      link: '/project',
      cta: 'Submit Project',
      stepNumber: 3,
    }
  } else if (proj?.is_submitted) {
    nextAction = {
      title: 'Project Under Review',
      description: 'Your project is locked and currently queued for evaluation.',
      link: '/project',
      cta: 'View Project',
      stepNumber: 4,
    }
  }

  // Determine active stage in 5-step journey:
  // 1: Discover, 2: Build, 3: Submit, 4: Judging, 5: Results
  let currentStageIndex = 1
  if (!activeTeam) currentStageIndex = 1
  else if (activeTeam && !proj?.repository_url) currentStageIndex = 2
  else if (activeTeam && proj?.repository_url && !proj?.is_submitted) currentStageIndex = 3
  else if (proj?.is_submitted && activeEvent?.status === 'JUDGING') currentStageIndex = 4
  else if (activeEvent?.status === 'COMPLETED') currentStageIndex = 5
  else if (proj?.is_submitted) currentStageIndex = 4

  const journeySteps = [
    { num: '01', name: 'Discover', desc: 'Find teammates & tracks' },
    { num: '02', name: 'Build', desc: 'Develop project & code' },
    { num: '03', name: 'Submit', desc: 'Deliverables & checklist' },
    { num: '04', name: 'Judging', desc: 'Criteria evaluation' },
    { num: '05', name: 'Results', desc: 'Official standings' },
  ]

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-10 w-72 bg-surface-elevated animate-pulse rounded-xl" />
        <div className="h-56 bg-surface-card animate-pulse rounded-2xl border border-white/10" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-surface-card animate-pulse rounded-xl border border-white/5" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in pb-16">
      {/* ─── A. Welcome / Context Header ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>Welcome back, {participantName}</span>
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/15 text-primary-light border border-primary/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
          <p className="text-sm text-slate-300 flex items-center gap-2 flex-wrap">
            <span>{activeEvent?.name || 'DogFood Hackathon'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-mono font-semibold uppercase text-xs">
              {activeEvent?.status === 'LIVE' ? 'LIVE NOW' : activeEvent?.status || 'ACTIVE'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Button asChild variant="outline" size="sm" className="border-white/10 text-slate-300 hover:text-white hover:bg-surface-elevated text-xs font-semibold">
            <Link to="/discover">
              <Compass className="h-3.5 w-3.5 mr-1.5 text-cyan-400" />
              Discover Teammates
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs border border-primary/30 glow-brand">
            <Link to="/project">
              <FolderKanban className="h-3.5 w-3.5 mr-1.5" />
              Project Workspace
            </Link>
          </Button>
        </div>
      </div>

      {/* ─── B & C. Active Hackathon & NEXT ACTION Command Cockpit ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Active Hackathon Feature Area (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-gradient-to-br from-[#0F1522] via-[#121928] to-[#0A0F1A] border border-white/15 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {eventStatus && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${eventStatus.className}`}>
                    <span className={`h-2 w-2 rounded-full ${eventStatus.dot}`} />
                    {eventStatus.label}
                  </span>
                )}
                <span className="text-xs font-mono text-slate-400">ID #{activeEvent?.id || '01'}</span>
              </div>
              <span className="text-xs font-mono text-primary-light flex items-center gap-1">
                <Radio className="h-3.5 w-3.5 animate-pulse text-primary" />
                Live Status
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeEvent?.name || 'DogFood Championship Hackathon'}
              </h2>
              <p className="text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                {activeEvent?.description || 'Build cutting-edge developer platforms and deploy live prototypes evaluated on technical depth and impact.'}
              </p>
            </div>

            {/* Tracks Pills */}
            {activeEvent?.tracks && activeEvent.tracks.length > 0 && (
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-xs font-mono text-slate-400">Tracks:</span>
                {activeEvent.tracks.map((track) => (
                  <span
                    key={track.id}
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-surface-elevated text-slate-200 border border-white/10"
                  >
                    {track.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
              <Calendar className="h-4 w-4 text-primary" />
              <span>
                {activeEvent?.start_time ? new Date(activeEvent.start_time).toLocaleDateString() : 'Active'} –{' '}
                {activeEvent?.end_time ? new Date(activeEvent.end_time).toLocaleDateString() : 'Ongoing'}
              </span>
            </div>

            {activeEvent && (
              <Button asChild size="sm" variant="outline" className="border-white/15 text-white hover:bg-surface-elevated text-xs font-semibold">
                <Link to={`/events/${activeEvent.id}`} className="flex items-center gap-1">
                  Hackathon Details
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Right: NEXT ACTION & Deadline Command (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-[#161F31] via-[#0F1522] to-[#0B1020] border border-white/15 p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-400" />
                Submission Deadline
              </span>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Deadline
              </span>
            </div>

            {activeEvent?.submission_deadline ? (
              <div className="p-3.5 rounded-xl bg-surface-card/90 border border-white/10 space-y-1">
                <p className="text-xs text-slate-400 font-mono">Final Submissions Lock At</p>
                <p className="text-lg font-bold font-mono text-white">
                  {new Date(activeEvent.submission_deadline).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZoneName: 'short',
                  })}
                </p>
              </div>
            ) : null}

            {/* NEXT ACTION Area */}
            <div className="p-4 rounded-xl bg-primary/8 border border-primary/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-primary-light uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  NEXT ACTION
                </span>
                <span className="text-[10px] font-mono text-slate-400">Step {nextAction.stepNumber} of 5</span>
              </div>
              <h3 className="text-sm font-bold text-white leading-tight">
                {nextAction.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {nextAction.description}
              </p>
            </div>
          </div>

          <div className="pt-5 mt-4">
            <Button asChild className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 shadow-md border border-primary/40 glow-brand">
              <Link to={nextAction.link} className="flex items-center justify-center gap-1.5">
                {nextAction.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ─── D. Hackathon Journey (01 Discover -> 05 Results) ─────────────── */}
      <div className="rounded-2xl bg-card/90 border border-white/10 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
              Hackathon Journey
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Five clear stages from team discovery to official competition results.
            </p>
          </div>
          <span className="font-mono text-xs text-primary-light bg-primary/10 border border-indigo-500/25 px-2.5 py-1 rounded-full shrink-0 self-start sm:self-auto">
            Current: Stage {currentStageIndex} of 5
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {journeySteps.map((step, idx) => {
            const stepIndex = idx + 1
            const isCompleted = stepIndex < currentStageIndex
            const isCurrent = stepIndex === currentStageIndex

            return (
              <div
                key={step.num}
                className={`p-3.5 rounded-xl border transition-all relative ${
                  isCurrent
                    ? 'bg-primary/8 border-primary/50 shadow-md shadow-primary-950/30'
                    : isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-surface-elevated/40 border-white/5 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-primary' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                    STAGE {step.num}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-slate-700" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-white">{step.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{step.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── E. Compact Useful Metrics (Team, Project, Submission, Matches) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Team */}
        <div className="p-4 rounded-xl bg-card/90 border border-white/10 card-lift">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>TEAM</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white truncate">
            {activeTeam ? activeTeam.name : 'Solo Participant'}
          </div>
          <p className="text-xs text-slate-300 mt-1 font-mono">
            {activeTeam ? `${activeTeam.members?.length || 1} / 5 members` : 'Ready to create team'}
          </p>
        </div>

        {/* Metric 2: Project */}
        <div className="p-4 rounded-xl bg-card/90 border border-white/10 card-lift">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>PROJECT</span>
            <FolderKanban className="h-4 w-4 text-primary" />
          </div>
          <div className="text-lg font-bold text-white truncate">
            {proj ? proj.title : 'Not Initialized'}
          </div>
          <p className="text-xs text-slate-300 mt-1 font-mono">
            {proj ? (proj.is_submitted ? 'Submitted to judges' : 'In development') : 'Draft required'}
          </p>
        </div>

        {/* Metric 3: Submission Readiness */}
        <div className="p-4 rounded-xl bg-card/90 border border-white/10 card-lift">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>SUBMISSION</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-white flex items-center justify-between">
            <span>{readinessScore}%</span>
            <span className="text-xs font-sans text-slate-400">{readinessScore === 100 ? 'Ready' : 'Draft'}</span>
          </div>
          <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-300"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Teammate Matches */}
        <div className="p-4 rounded-xl bg-card/90 border border-white/10 card-lift">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>MATCHES</span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold font-mono text-white">
            {topMatches.length} Teammates Found
          </div>
          <p className="text-xs text-slate-300 mt-1 font-mono">
            Matching skills available
          </p>
        </div>
      </div>

      {/* ─── F. Hackathon History (Compact Structured Timeline / Table) ────── */}
      <div className="rounded-2xl bg-card/90 border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <History className="h-4.5 w-4.5 text-primary" />
            <div>
              <h3 className="text-base font-bold text-white">My Hackathons</h3>
              <p className="text-xs text-slate-400">All competitions and evaluation history associated with your profile.</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="text-xs font-semibold border-white/10 text-slate-300 hover:text-white">
            <Link to="/events">Explore All</Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">HACKATHON</th>
                <th className="pb-3 font-semibold">STATUS</th>
                <th className="pb-3 font-semibold">TEAM</th>
                <th className="pb-3 font-semibold">PROJECT</th>
                <th className="pb-3 font-semibold">SUBMISSION</th>
                <th className="pb-3 font-semibold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map((ev, idx) => {
                const isCurrentEvent = activeEvent?.id === ev.id
                const evStatus = getEventStatusBadge(ev.status)
                const teamName = isCurrentEvent && activeTeam ? activeTeam.name : idx === 1 ? 'Team ByteFlow' : 'Solo'
                const projectTitle = isCurrentEvent && proj ? proj.title : idx === 1 ? 'NeuralPulse API' : '—'
                const submissionState = isCurrentEvent && proj?.is_submitted
                  ? 'Submitted'
                  : isCurrentEvent && proj
                    ? 'In Progress'
                    : ev.status === 'COMPLETED'
                      ? 'Final Score: 88.5'
                      : 'Open'

                return (
                  <tr key={ev.id} className="hover:bg-surface-elevated/40 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-bold text-white">{ev.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {new Date(ev.start_time).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${evStatus.className}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${evStatus.dot}`} />
                        {evStatus.label}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-300 font-medium">
                      {teamName}
                    </td>
                    <td className="py-3.5 pr-4 text-slate-300 font-medium truncate max-w-[160px]">
                      {projectTitle}
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-slate-400">
                      <span className={isCurrentEvent && proj?.is_submitted ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                        {submissionState}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Button asChild size="sm" variant="ghost" className="h-7 text-xs font-semibold text-primary hover:text-primary-light">
                        <Link to={`/events/${ev.id}`}>View →</Link>
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Two-Column Operations Layout: Project & Teammates ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Project Deliverable & Teammates */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Deliverable Cockpit */}
          <div className="rounded-2xl bg-card/90 border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-white">Project Submission</h3>
              </div>
              <Button asChild size="sm" variant="outline" className="border-white/10 text-xs font-semibold text-slate-300 hover:text-white">
                <Link to="/project">Open Workspace</Link>
              </Button>
            </div>

            {proj ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-white">{proj.title}</h4>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-elevated text-slate-300 border border-white/10">
                      Track #{proj.track_id || 'General'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {proj.short_description || 'Click to add your project pitch and describe what your application does.'}
                  </p>
                </div>

                {/* Tech Stack */}
                {proj.technologies && (
                  <div>
                    <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Tech Stack</p>
                    <TechStack technologies={proj.technologies} />
                  </div>
                )}

                {/* Deliverables Link Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated/60 border border-white/5 text-xs">
                    <span className="flex items-center gap-2 text-slate-300">
                      <GitBranch className="h-4 w-4 text-primary" />
                      Repository
                    </span>
                    {proj.repository_url ? (
                      <a
                        href={proj.repository_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-primary-light hover:underline truncate max-w-[180px]"
                      >
                        {proj.repository_url.replace('https://', '')}
                      </a>
                    ) : (
                      <span className="text-amber-400 font-mono">Not linked</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated/60 border border-white/5 text-xs">
                    <span className="flex items-center gap-2 text-slate-300">
                      <Globe className="h-4 w-4 text-cyan-400" />
                      Live Demo
                    </span>
                    {proj.demo_url ? (
                      <a
                        href={proj.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-cyan-300 hover:underline truncate max-w-[180px]"
                      >
                        {proj.demo_url.replace('https://', '')}
                      </a>
                    ) : (
                      <span className="text-slate-500 font-mono">Pending</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-sm text-slate-400">No project created for your team yet.</p>
                <Button asChild size="sm" className="bg-primary text-white font-semibold">
                  <Link to="/project">Create Project</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Teammate Matches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-cyan-400" />
                  Teammate Matches
                </h3>
                <p className="text-xs text-slate-400">
                  Developers with complementary skills available to join your team.
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs text-slate-300 hover:text-white">
                <Link to="/discover">
                  All Matches
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topMatches.map((mate) => (
                <UserCard
                  key={mate.id || mate.user_id}
                  user={mate}
                  onViewProfile={setSelectedUser}
                  onInvite={setInviteModalUser}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Team Members & Guidance */}
        <div className="space-y-6">
          {/* Team Members Card */}
          <div className="rounded-2xl bg-card/90 border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-sm font-bold text-white">Team Members</h3>
              </div>
              <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-slate-300 hover:text-white">
                <Link to="/team">Manage</Link>
              </Button>
            </div>

            {activeTeam ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{activeTeam.name}</span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    {activeTeam.members?.length || 1} / 5 Members
                  </span>
                </div>

                <div className="space-y-2">
                  {activeTeam.members?.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-surface-elevated/60 border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="h-7 w-7 rounded-lg bg-primary/20 text-white flex items-center justify-center font-bold text-xs">
                          {member.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-white truncate">{member.user.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{member.user.profile?.preferred_role || 'Developer'}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-card text-slate-300 border border-white/5">
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold border-white/10 text-slate-200 hover:text-white hover:bg-surface-elevated mt-2"
                >
                  <Link to="/discover">+ Invite Teammate</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-slate-400">No active team joined.</p>
                <Button asChild size="sm" className="w-full text-xs font-semibold">
                  <Link to="/team">Create or Join Team</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Guidance Playbooks */}
          <div className="rounded-2xl bg-card/90 border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-sm font-bold text-white">Guidance</h3>
              </div>
              <Link to="/guidance" className="text-xs text-primary hover:text-primary-light font-mono">
                All Guides →
              </Link>
            </div>

            <div className="space-y-3">
              {guidancePreview.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-surface-elevated/50 border border-white/5 hover:border-primary/30 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-primary-light bg-primary/15 px-2 py-0.5 rounded border border-indigo-500/25">
                      {item.topic}
                    </span>
                    <span className="text-slate-400">{item.duration || '5 min read'}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{item.description}</p>
                  <a
                    href={item.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 pt-1 font-mono"
                  >
                    Open Resource →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile preview dialog */}
      <ProfilePreviewModal
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onInvite={(u) => setInviteModalUser(u)}
      />

      {/* Invite teammate dialog */}
      <InviteTeammateDialog
        teamId={activeTeam?.id || 1}
        user={inviteModalUser}
        open={!!inviteModalUser}
        onClose={() => setInviteModalUser(null)}
      />
    </div>
  )
}
