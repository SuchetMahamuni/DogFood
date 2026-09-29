import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  UserPlus,
  LogOut,
  FolderKanban,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Loader2,
  Mail,
  Plus,
  Crown,
  ChevronRight,
  ArrowLeft,
  Compass,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import teamService from '@/services/teamService'
import eventService from '@/services/eventService'
import type { Team, Event } from '@/types/participant'
import { getInitials } from '@/lib/auth'
import { InviteTeammateDialog } from '@/components/participant/InviteTeammateDialog'
import { getApiErrorMessage } from '@/services/apiClient'
import { getEventStatusBadge } from '@/components/participant/EventCard'

export default function TeamPage() {
  const [team, setTeam] = useState<Team | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Creation form state
  const [newTeamName, setNewTeamName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Invite modal
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const loadTeam = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const allEvents = await eventService.getEvents()
      setEvents(allEvents)
      if (allEvents.length > 0) {
        setSelectedEventId(allEvents[0].id)
      }

      const activeId = teamService.getActiveTeamId()
      if (activeId) {
        const teamData = await teamService.getTeam(activeId)
        setTeam(teamData)
      } else {
        const teamData = await teamService.getTeam(1)
        setTeam(teamData)
      }
    } catch {
      setError('Unable to load team details.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTeam()
  }, [])

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName.trim()) {
      setCreateError('Please enter a team name.')
    } else {
      setIsCreating(true)
      setCreateError(null)
      try {
        const created = await teamService.createTeam(selectedEventId, newTeamName.trim())
        setTeam(created)
        setNewTeamName('')
      } catch (err) {
        setCreateError(getApiErrorMessage(err, 'Failed to create team.'))
      } finally {
        setIsCreating(false)
      }
    }
  }

  const handleLeaveTeam = async () => {
    if (!team) return
    if (!window.confirm('Are you sure you want to leave this team?')) return

    setIsLeaving(true)
    try {
      await teamService.leaveTeam(team.id)
      setTeam(null)
    } catch (err) {
      alert(getApiErrorMessage(err, 'Failed to leave team.'))
    } finally {
      setIsLeaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-6 w-32 bg-surface-elevated rounded animate-pulse" />
        <div className="h-10 w-72 bg-surface-card rounded-lg animate-pulse" />
        <div className="h-64 bg-card rounded-2xl border border-white/10 animate-pulse" />
      </div>
    )
  }

  const currentEvent = team?.event || events.find((e) => e.id === team?.event_id) || events[0]
  const eventStatus = currentEvent ? getEventStatusBadge(currentEvent.status) : null
  const memberCount = team?.members?.length || 1
  const maxCapacity = 5
  const capacityPercent = Math.min(100, Math.round((memberCount / maxCapacity) * 100))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in pb-16">
      {/* Contextual Back Navigation */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Dashboard</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Users className="h-7 w-7 text-primary" />
            Team Workspace
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Coordinate with teammates, invite members, and build your project submission.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild variant="outline" size="sm" className="text-xs font-semibold border-white/10 text-slate-200 hover:text-white hover:bg-surface-elevated">
            <Link to="/team/invitations">
              <Mail className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              Invitations
            </Link>
          </Button>

          {team && (
            <Button size="sm" onClick={() => setIsInviteOpen(true)} className="text-xs font-semibold bg-primary hover:bg-primary-hover text-white shadow-xs border border-primary/30 glow-brand">
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Invite Teammate
            </Button>
          )}
        </div>
      </div>

      {/* ─── REQUIRED HACKATHON → TEAM → PROJECT HIERARCHY BANNER ────────── */}
      {currentEvent && (
        <div className="rounded-2xl bg-[#0F1522] border border-white/10 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Target Hackathon:
                </span>
                <span className="text-xs font-bold text-white">
                  {currentEvent.name}
                </span>
                {eventStatus && (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${eventStatus.className}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${eventStatus.dot}`} />
                    {eventStatus.label}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Relationship: <strong className="text-slate-200">{currentEvent.name}</strong> → <strong className="text-primary-light">{team ? team.name : 'Create Team'}</strong> → <strong className="text-emerald-300">{team?.project ? team.project.title : 'Project Submission'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild size="sm" variant="outline" className="border-white/10 text-xs text-slate-300 hover:text-white">
              <Link to={`/events/${currentEvent.id}`}>Hackathon Details →</Link>
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2.5 p-3.5 text-xs rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/25">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* When participant has NO active team */}
      {!team && (
        <div className="max-w-xl mx-auto py-12">
          <Card className="border-white/10 shadow-2xl rounded-2xl bg-card">
            <CardHeader className="text-center pb-4 border-b border-white/5">
              <div className="h-12 w-12 rounded-2xl bg-primary/15 text-primary-light border border-primary/30 flex items-center justify-center mx-auto mb-3 shadow-md glow-brand">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold text-white">Create a New Team</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Register a team to invite teammates, link code repositories, and submit for evaluation.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              {createError && (
                <div className="mb-4 flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-xl">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{createError}</span>
                </div>
              )}

              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="teamName" className="text-xs font-semibold text-slate-200">Team Name</Label>
                  <Input
                    id="teamName"
                    placeholder="e.g. Team Alpha"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    required
                    className="bg-surface-elevated/70 border-white/10 text-white placeholder:text-slate-500 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="eventSelect" className="text-xs font-semibold text-slate-200">Target Hackathon</Label>
                  <select
                    id="eventSelect"
                    className="w-full h-10 rounded-xl border border-white/10 bg-surface-elevated px-3 py-1 text-xs text-white shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary font-medium"
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(parseInt(e.target.value, 10))}
                  >
                    {events.map((e) => (
                      <option key={e.id} value={e.id} className="bg-card text-white">
                        {e.name} ({e.status})
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" className="w-full text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow-md rounded-xl h-10 border border-primary/30 glow-brand" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      Creating Team...
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Create Team
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* When participant HAS an active team */}
      {team && (
        <div className="space-y-8">
          {/* Team Overview Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0F1522] via-[#121928] to-[#0A0F1A] border border-white/15 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Active Team
                </span>
                <span className="text-xs font-mono text-slate-400">ID #{team.id}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {team.name}
              </h2>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Formed {team.created_at ? new Date(team.created_at).toLocaleDateString() : 'Active'}
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-200">
                  {memberCount} of {maxCapacity} members
                </span>
              </div>

              {/* Capacity Bar */}
              <div className="w-52 pt-1 space-y-1">
                <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full transition-all duration-300"
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button asChild variant="outline" size="sm" className="text-xs font-semibold border-white/10 text-slate-200 hover:text-white hover:bg-surface-elevated">
                <Link to="/project">
                  <FolderKanban className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  Project Workspace
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLeaveTeam}
                disabled={isLeaving}
                className="text-xs font-semibold border border-rose-500/30"
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                {isLeaving ? 'Leaving...' : 'Leave Team'}
              </Button>
            </div>
          </div>

          {/* Members Roster Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-primary" />
                  Team Members ({memberCount})
                </h3>
                <p className="text-xs text-slate-400">
                  Teammates working together on this hackathon submission.
                </p>
              </div>

              {memberCount < maxCapacity && (
                <Button size="sm" variant="outline" className="text-xs font-semibold border-white/10 text-slate-200 hover:text-white hover:bg-surface-elevated" onClick={() => setIsInviteOpen(true)}>
                  <UserPlus className="h-3.5 w-3.5 mr-1.5 text-cyan-400" />
                  Invite Member
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.members?.map((member) => {
                const initials = getInitials(member.user.name)
                const isLeader = member.role === 'LEADER'
                return (
                  <Card
                    key={member.id}
                    className={`border transition-all rounded-2xl bg-card/90 ${
                      isLeader
                        ? 'border-primary/40 shadow-sm'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <CardHeader className="pb-3 flex flex-row items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white/15 bg-surface-elevated">
                        <AvatarFallback className="font-bold bg-primary/20 text-white text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 truncate">
                        <CardTitle className="text-sm font-bold text-white truncate">
                          {member.user.name}
                        </CardTitle>
                        <p className="text-xs text-slate-400 truncate">
                          {member.user.profile?.display_name || member.user.email}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                          isLeader
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-surface-elevated text-slate-300 border border-white/5'
                        }`}
                      >
                        {isLeader && <Crown className="h-3 w-3 text-amber-400" />}
                        {member.role}
                      </span>
                    </CardHeader>
                    <CardContent className="text-xs text-slate-300 pb-4 pt-0 space-y-2">
                      {member.user.profile?.skills && (
                        <div className="flex flex-wrap gap-1">
                          {member.user.profile.skills.split(',').map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-elevated border border-white/5 text-slate-300"
                            >
                              {s.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-[11px] font-mono text-slate-400 pt-1">
                        Joined {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : 'Active member'}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}

              {/* Slot to Invite */}
              {memberCount < maxCapacity && (
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(true)}
                  className="rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-surface-elevated/40 p-6 flex flex-col items-center justify-center text-center transition-all group cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-surface-elevated group-hover:bg-primary/20 text-slate-400 group-hover:text-primary-light flex items-center justify-center mb-2 transition-colors border border-white/5">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-white">
                    Invite Teammate
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {maxCapacity - memberCount} open slot{maxCapacity - memberCount > 1 ? 's' : ''} available
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Linked Hackathon Project Banner */}
          <Card className="border-white/10 shadow-xs rounded-2xl bg-card/90">
            <CardHeader className="pb-3 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary border border-primary/30 flex items-center justify-center">
                    <FolderKanban className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-white">
                      Project Submission
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      The technical submission and code repository attached to this team.
                    </CardDescription>
                  </div>
                </div>

                {team.project?.is_submitted ? (
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Submitted
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    In Progress
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {team.project ? (
                <div className="space-y-2 bg-surface-elevated/50 p-4 rounded-xl border border-white/5">
                  <p className="font-bold text-sm text-white">{team.project.title}</p>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {team.project.short_description || 'Click below to view repository links, live demonstrations, and technical specifications.'}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Your team has not created a project yet. Create one now to begin your hackathon submission.
                </p>
              )}
            </CardContent>
            <CardFooter className="pt-3 border-t border-white/10">
              <Button asChild size="sm" className="w-full text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow-xs border border-primary/30 glow-brand">
                <Link to="/project">
                  <FolderKanban className="h-3.5 w-3.5 mr-1.5" />
                  Open Project Workspace
                  <ChevronRight className="h-3.5 w-3.5 ml-1 text-primary-light" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Invite Teammate Modal */}
      {team && (
        <InviteTeammateDialog
          teamId={team.id}
          user={null}
          open={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          onSuccess={loadTeam}
        />
      )}
    </div>
  )
}
