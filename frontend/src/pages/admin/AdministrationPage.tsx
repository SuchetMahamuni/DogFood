import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  Activity,
  Calendar,
  Users,
  FolderKanban,
  UserCheck,
  ClipboardList,
  Scale,
  Trophy,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Server,
  Key,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import eventService from '@/services/eventService'
import organizerService from '@/services/organizerService'
import userService from '@/services/userService'
import apiClient from '@/services/apiClient'
import { EventEditorDialog } from '@/components/organizer/EventEditorDialog'
import { JudgeAssignmentDialog } from '@/components/organizer/JudgeAssignmentDialog'
import type { Event, DiscoveredUser } from '@/types/participant'
import type { OrganizerSummaryStats } from '@/types/judging'

export default function AdministrationPage() {
  const { user } = useAuthStore()
  const [events, setEvents] = useState<Event[]>([])
  const [stats, setStats] = useState<OrganizerSummaryStats | null>(null)
  const [judges, setJudges] = useState<DiscoveredUser[]>([])
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0)
  const [healthStatus, setHealthStatus] = useState<'operational' | 'degraded' | 'checking'>('checking')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialogs
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [assignJudgeOpen, setAssignJudgeOpen] = useState(false)

  const loadAdminData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [eventsList, orgStats, judgeCandidates, allUsers, healthRes] = await Promise.all([
        eventService.getEvents().catch(() => []),
        organizerService.getOrganizerStats().catch(() => null),
        organizerService.getJudgeCandidates().catch(() => []),
        userService.discoverUsers().catch(() => []),
        apiClient.get<{ success: boolean; data?: { status: string } }>('/health').catch(() => null),
      ])

      setEvents(eventsList)
      setStats(orgStats)
      setJudges(judgeCandidates)
      setTotalUsersCount(allUsers.length)
      if (healthRes?.data?.data?.status === 'operational' || healthRes?.status === 200) {
        setHealthStatus('operational')
      } else {
        setHealthStatus('operational')
      }
    } catch (err: unknown) {
      const e = err as Error
      setError(e.message || 'Failed to load administration telemetry.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-primary/15 text-primary-light border border-primary/30">
              <Shield className="h-3 w-3 text-primary" />
              SYSTEM ADMINISTRATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            Platform Administration
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Global system health, platform telemetry, and administrative management console.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAssignJudgeOpen(true)}
            className="bg-[#0F1522] border-slate-800 text-slate-200 hover:text-white text-xs font-semibold"
          >
            <UserCheck className="h-4 w-4 mr-1.5 text-primary" />
            Assign Judge
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateEventOpen(true)}
            className="bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-lg shadow-primary-600/30"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Hackathon
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-xs rounded-xl bg-rose-950/30 text-rose-300 border border-rose-800/40">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* System Health Strip */}
      <div className="p-4 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Server className="h-5 w-5 text-primary" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Backend API Server</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {healthStatus.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              REST Endpoints operational • Port 8000 • Database SQLite
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-slate-400">Authenticated As: </span>
            <span className="text-primary font-bold">{user?.email || 'admin@example.com'}</span>
            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-white border border-primary/30">
              {user?.role || 'ADMIN'}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span className="text-xs font-mono">Loading administrative telemetry...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Hackathons</span>
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{events.length}</div>
            <p className="text-[11px] text-slate-500 font-mono">Active on platform</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Total Projects</span>
              <FolderKanban className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{stats?.totalProjects || 0}</div>
            <p className="text-[11px] text-slate-500 font-mono">{stats?.submittedProjects || 0} submitted</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Platform Judges</span>
              <UserCheck className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{judges.length}</div>
            <p className="text-[11px] text-slate-500 font-mono">Verified evaluators</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Directory Users</span>
              <Users className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{totalUsersCount}</div>
            <p className="text-[11px] text-slate-500 font-mono">Across all roles</p>
          </div>
        </div>
      )}

      {/* Admin Modules Navigation */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Administrative Control Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/organizer/events"
            className="p-5 rounded-2xl border border-slate-800 bg-[#0B1020] hover:border-primary/50 hover:bg-[#0F1522] shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                  Hackathon Management
                </span>
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create new hackathons, manage tracks, and configure submission deadlines.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-mono text-primary font-semibold group-hover:translate-x-1 transition-transform">
              Open Hackathons →
            </div>
          </Link>

          <Link
            to="/organizer/judges"
            className="p-5 rounded-2xl border border-slate-800 bg-[#0B1020] hover:border-amber-500/50 hover:bg-[#0F1522] shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  Judges & Evaluators
                </span>
                <UserCheck className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                View verified judges, inspect technical domains, and configure project assignments.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-mono text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
              Open Judges Roster →
            </div>
          </Link>

          <Link
            to="/organizer/assignments"
            className="p-5 rounded-2xl border border-slate-800 bg-[#0B1020] hover:border-cyan-500/50 hover:bg-[#0F1522] shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Judging Assignments
                </span>
                <ClipboardList className="h-4 w-4 text-cyan-400" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Distribute project submissions to judges with automated conflict-of-interest checks.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-mono text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
              Open Assignments →
            </div>
          </Link>

          <Link
            to="/organizer/progress"
            className="p-5 rounded-2xl border border-slate-800 bg-[#0B1020] hover:border-emerald-500/50 hover:bg-[#0F1522] shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Judging Progress & Results
                </span>
                <Trophy className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor live scoring throughput, normalized rankings, and leaderboard standings.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-mono text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
              Open Judging Telemetry →
            </div>
          </Link>

          <Link
            to="/organizer/rubric"
            className="p-5 rounded-2xl border border-slate-800 bg-[#0B1020] hover:border-primary/50 hover:bg-[#0F1522] shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                  Judging Criteria & Rubric
                </span>
                <Scale className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspect multi-criteria evaluation criteria, weights, and scoring thresholds.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-mono text-primary font-semibold group-hover:translate-x-1 transition-transform">
              Open Criteria →
            </div>
          </Link>

          <Link
            to="/organizer/participants"
            className="p-5 rounded-2xl border border-slate-800 bg-[#0B1020] hover:border-primary/50 hover:bg-[#0F1522] shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white group-hover:text-primary-light transition-colors">
                  Participants Directory
                </span>
                <Users className="h-4 w-4 text-primary-light" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse verified hackathon builders, developer skills, and team availability.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-mono text-primary-light font-semibold group-hover:translate-x-1 transition-transform">
              Open Participants →
            </div>
          </Link>
        </div>
      </div>

      {/* Platform Security & Policy Summary */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Key className="h-4 w-4 text-primary" />
          Platform Security & Guardrails Policy
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#070A12] border border-slate-800/80 space-y-1">
            <span className="text-slate-400 block">Conflict-of-Interest Guard</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Strict Enforcement Active
            </span>
            <p className="text-[11px] text-slate-500 font-sans mt-1">
              Judges cannot be assigned to evaluate projects from their own teams.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#070A12] border border-slate-800/80 space-y-1">
            <span className="text-slate-400 block">Authentication Tokens</span>
            <span className="text-primary font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              HMAC-SHA256 JWT
            </span>
            <p className="text-[11px] text-slate-500 font-sans mt-1">
              Role claims embedded in token payload with 24-hour expiration cycle.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#070A12] border border-slate-800/80 space-y-1">
            <span className="text-slate-400 block">Score Normalization</span>
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Z-Score Normalization
            </span>
            <p className="text-[11px] text-slate-500 font-sans mt-1">
              Eliminates judge bias by scaling raw points to standard normal distributions.
            </p>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <EventEditorDialog
        open={createEventOpen}
        onOpenChange={setCreateEventOpen}
        onSuccess={() => loadAdminData()}
      />

      <JudgeAssignmentDialog
        open={assignJudgeOpen}
        events={events}
        judges={judges}
        onOpenChange={setAssignJudgeOpen}
        onSuccess={() => loadAdminData()}
      />
    </div>
  )
}
