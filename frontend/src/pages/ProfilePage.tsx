import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail,
  Briefcase,
  Code,
  Heart,
  FolderGit2,
  ShieldCheck,
  Award,
  Cpu,
  ArrowLeft,
  User as UserIcon,
  History,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/auth'
import eventService from '@/services/eventService'
import teamService from '@/services/teamService'
import type { Event, Team } from '@/types/participant'
import { getEventStatusBadge } from '@/components/participant/EventCard'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [events, setEvents] = useState<Event[]>([])
  const [activeTeam, setActiveTeam] = useState<Team | null>(null)

  useEffect(() => {
    let mounted = true
    async function loadData() {
      try {
        const [eventList, team] = await Promise.all([
          eventService.getEvents().catch(() => []),
          teamService.getTeam(teamService.getActiveTeamId() || 1).catch(() => null),
        ])
        if (mounted) {
          setEvents(eventList)
          setActiveTeam(team)
        }
      } catch {
        // Fallbacks
      }
    }
    loadData()
    return () => {
      mounted = false
    }
  }, [])

  if (!user) {
    return null
  }

  const name = user.name || 'Anonymous User'
  const initials = getInitials(name)
  const profile = user.profile || {}
  const skillsList = profile.skills ? profile.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : []
  const interestsList = profile.interests ? profile.interests.split(',').map((s: string) => s.trim()).filter(Boolean) : []

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in pb-20">
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

      {/* Header Profile Hero */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0F1522] via-[#0B1020] to-[#0A0F1A] border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] pointer-events-none rounded-full" />

        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary/40 shadow-xl shrink-0">
          {profile.profile_picture_url && <AvatarImage src={profile.profile_picture_url} alt={name} />}
          <AvatarFallback className="text-2xl font-black bg-primary text-white font-mono">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3 z-10 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/15 text-primary-light border border-primary/30 uppercase tracking-wider">
                  <UserIcon className="h-3 w-3" />
                  PROFILE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{name}</h1>
              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 mt-1 font-mono">
                <Mail className="h-3.5 w-3.5 text-primary" />
                {user.email}
              </p>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-2.5">
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#161F31] text-primary-light border border-primary/30 capitalize">
                {user.role?.toLowerCase()}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Verified
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 max-w-3xl">
            {profile.bio || 'Participant on DogFood hackathon platform. Shipping high-performance developer tools and resilient production architectures.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-primary" />
              Primary: <strong className="text-slate-200">{profile.preferred_role || 'Full-Stack Engineer'}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-primary" />
              Exp: <strong className="text-slate-200">{profile.experience || 'Intermediate (2-4 yrs)'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Professional Information */}
        <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Professional Information
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Availability</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0F1522] border border-slate-800/80">
              <span className="text-slate-400 font-medium">Preferred Track / Role</span>
              <span className="font-mono font-bold text-white">
                {profile.preferred_role || 'Full-Stack Developer'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0F1522] border border-slate-800/80">
              <span className="text-slate-400 font-medium">Experience Level</span>
              <span className="font-mono font-bold text-slate-200">
                {profile.experience || 'Intermediate (2-4 yrs)'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0F1522] border border-slate-800/80">
              <span className="text-slate-400 font-medium">Bandwidth Availability</span>
              <span className="font-mono font-bold text-emerald-400">
                {profile.availability || 'Full-time / 40h Sprint'}
              </span>
            </div>
          </div>
        </div>

        {/* Skills & Interests */}
        <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              Skills &amp; Interests
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Stack</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Core Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {skillsList.length > 0 ? (
                  skillsList.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-[#121928] text-primary-light border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic font-mono">TypeScript, React, Python, Go</span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-primary" />
                Interests &amp; Problem Domains
              </p>
              <div className="flex flex-wrap gap-2">
                {interestsList.length > 0 ? (
                  interestsList.map((interest: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-[#161F31] text-slate-300 border border-slate-800"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic font-mono">Autonomous Agents, Distributed Systems, DevTools</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Past Projects */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-primary" />
            Past Projects
          </h3>
        </div>
        <div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed p-4 rounded-xl bg-[#0F1522] border border-slate-800/80">
            {profile.previous_projects ||
              'OpenAgent CLI (Rust developer agent with 1.2k GitHub stars), DogFood System, Distributed Vector Cache.'}
          </p>
        </div>
      </div>

      {/* ── My Hackathons Section ─────────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <History className="h-4.5 w-4.5 text-primary" />
            <div>
              <h3 className="text-base font-bold text-white">My Hackathons</h3>
              <p className="text-xs text-slate-400">Competitions and teams associated with your profile.</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="text-xs font-semibold border-white/10 text-slate-300 hover:text-white">
            <Link to="/events">Explore Hackathons</Link>
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
                const isCurrent = idx === 0
                const evStatus = getEventStatusBadge(ev.status)
                const teamName = isCurrent && activeTeam ? activeTeam.name : 'Solo'
                const projectTitle = isCurrent && activeTeam?.project ? activeTeam.project.title : '—'
                const submissionState = isCurrent && activeTeam?.project?.is_submitted
                  ? 'Submitted'
                  : isCurrent && activeTeam?.project
                    ? 'In Progress'
                    : ev.status === 'COMPLETED'
                      ? 'Final Score: 88.5'
                      : 'Open'

                return (
                  <tr key={ev.id} className="hover:bg-[#0F1522] transition-colors">
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
                      <span className={isCurrent && activeTeam?.project?.is_submitted ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
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
    </div>
  )
}
