import { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Loader2,
  AlertCircle,
  Code2,
  Calendar,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import organizerService from '@/services/organizerService'
import type { DiscoveredUser } from '@/types/participant'
import { getInitials } from '@/lib/auth'

export default function OrganizerParticipantsPage() {
  const [participants, setParticipants] = useState<DiscoveredUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL')

  useEffect(() => {
    async function fetchParticipants() {
      setIsLoading(true)
      try {
        const users = await organizerService.getParticipantCandidates()
        setParticipants(users)
      } catch (err: unknown) {
        const e = err as Error
        setError(e.message || 'Failed to fetch participants.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchParticipants()
  }, [])

  // Unique roles for filter chips
  const roles = ['ALL', ...Array.from(new Set(participants.map(p => p.preferred_role).filter(Boolean)))]

  const filtered = participants.filter((p) => {
    const q = searchQuery.toLowerCase().trim()
    const name = (p.display_name || p.name || '').toLowerCase()
    const skills = (p.skills || '').toLowerCase()
    const role = (p.preferred_role || '').toLowerCase()
    const interests = (p.interests || '').toLowerCase()

    const matchesSearch = !q || name.includes(q) || skills.includes(q) || role.includes(q) || interests.includes(q)
    const matchesRole = selectedRoleFilter === 'ALL' || p.preferred_role === selectedRoleFilter

    return matchesSearch && matchesRole
  })

  return (
    <PageContainer>
      <div className="space-y-6 pb-20">
        {/* Back Link */}
        <div className="flex items-center gap-2">
          <Link
            to="/organizer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Command Center
          </Link>
        </div>

        <PageHeader
          title="Participant Directory"
          description="Browse and monitor registered hackathon participants, technical skillsets, and availability status."
          actions={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs border-cyan-500/30 text-cyan-400 bg-cyan-950/20 px-3 py-1">
                <Users className="h-3.5 w-3.5 mr-1.5" />
                {participants.length} Registered
              </Badge>
            </div>
          }
        />

        {error && (
          <div className="flex items-center gap-2 p-4 text-xs rounded-xl bg-rose-950/40 text-rose-300 border border-rose-800/40">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Telemetry Control Bar */}
        <div className="bg-[#0B1020] p-4 rounded-xl border border-slate-800/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search by name, skills, role, or interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-[#070A12] border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50"
            />
          </div>

          {/* Role Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {roles.slice(0, 5).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRoleFilter(role as string)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors whitespace-nowrap ${
                  selectedRoleFilter === role
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow-xs'
                    : 'bg-[#070A12] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
            <span className="text-xs text-slate-500 font-mono ml-2 shrink-0">
              {filtered.length} found
            </span>
          </div>
        </div>

        {/* List / Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mb-3" />
            <p className="text-sm font-medium">Querying participant registry...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-[#0B1020]/40 p-8">
            <Users className="h-10 w-10 text-slate-600 mb-3" />
            <p className="font-semibold text-white">No participants found.</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {participants.length === 0
                ? 'Registered participants will appear in this directory as they sign up.'
                : 'No participant profiles matched your current search filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((user, idx) => {
              const name = user.display_name || user.name || `Participant #${user.user_id || idx + 1}`
              const initials = getInitials(name)

              return (
                <div
                  key={idx}
                  className="group relative bg-[#0B1020] rounded-xl border border-slate-800/80 p-5 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-950/20 transition-all duration-200"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start gap-3.5">
                      <Avatar className="h-11 w-11 rounded-xl border border-slate-700/80 bg-[#070A12] ring-2 ring-transparent group-hover:ring-cyan-500/20 transition-all">
                        <AvatarImage src={user.profile_picture_url} />
                        <AvatarFallback className="font-bold text-xs bg-slate-800 text-slate-200">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                            {name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 truncate">
                          <Briefcase className="h-3 w-3 text-slate-500 shrink-0" />
                          <span>{user.preferred_role || 'General Hacker'}</span>
                        </div>
                        {user.email && (
                          <div className="text-[11px] font-mono text-cyan-400 mt-0.5 truncate">
                            {user.email}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    {user.bio ? (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {user.bio}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-600 italic">No bio specified.</p>
                    )}

                    {/* Skills Chips */}
                    {user.skills && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Code2 className="h-3 w-3 text-slate-400" />
                          Technical Skills
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {user.skills.split(',').slice(0, 4).map((s, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-[#070A12] border border-slate-800 text-slate-300 font-mono font-medium"
                            >
                              {s.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer telemetry */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="h-3 w-3 text-slate-500 shrink-0" />
                      <span className="truncate">
                        {user.availability ? `Status: ${user.availability}` : 'Available'}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      Active
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
