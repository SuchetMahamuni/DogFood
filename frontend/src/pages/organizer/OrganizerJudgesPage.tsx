import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  UserCheck,
  Search,
  Plus,
  Loader2,
  AlertCircle,
  Code2,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { JudgeAssignmentDialog } from '@/components/organizer/JudgeAssignmentDialog'
import organizerService from '@/services/organizerService'
import eventService from '@/services/eventService'
import type { DiscoveredUser, Event } from '@/types/participant'
import { getInitials } from '@/lib/auth'

export default function OrganizerJudgesPage() {
  const [judges, setJudges] = useState<DiscoveredUser[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [assignDialogOpen, setAssignDialogOpen] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [judgeCandidates, eventList] = await Promise.all([
        organizerService.getJudgeCandidates().catch(() => []),
        eventService.getEvents().catch(() => []),
      ])

      // Only display actual JUDGE accounts
      const verifiedJudges = judgeCandidates.filter(
        (u) => (u.role || u.preferred_role || '').toUpperCase() === 'JUDGE',
      )

      setJudges(verifiedJudges)
      setEvents(eventList)
    } catch (err: unknown) {
      const e = err as Error
      setError(e.message || 'Failed to fetch judges roster.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredJudges = judges.filter((j) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const name = (j.display_name || j.name || '').toLowerCase()
    const skills = (j.skills || '').toLowerCase()
    const role = (j.preferred_role || '').toLowerCase()
    return name.includes(q) || skills.includes(q) || role.includes(q)
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-20">
      {/* Contextual Back Navigation */}
      <div>
        <Link
          to="/organizer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors group"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          <span>Back to Organizer</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Shield className="h-3 w-3 text-amber-400" />
              ORGANIZER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            Judges
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage judges, view technical domains, and allocate project assignments.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setAssignDialogOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-lg shadow-primary-600/30"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Assign Project to Judge
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-xs rounded-xl bg-rose-950/30 text-rose-300 border border-rose-800/40">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center justify-between gap-4 bg-[#0B1020] p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search judges by name or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-[#070A12] border-slate-800 text-white placeholder:text-slate-500 rounded-xl"
          />
        </div>

        <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#070A12] border border-slate-800 text-slate-300">
          {filteredJudges.length} Judges Available
        </span>
      </div>

      {/* Judges Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-medium">Loading judges roster...</p>
        </div>
      ) : filteredJudges.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-[#0B1020]">
          <UserCheck className="h-10 w-10 text-slate-600 mb-3" />
          <p className="font-bold text-white">
            {judges.length === 0 ? 'No judges available yet.' : 'No judges found'}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {judges.length === 0
              ? 'When evaluators register or are designated as judges, they will appear here.'
              : 'No judge profiles match your search criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJudges.map((judge, idx) => {
            const name = judge.display_name || judge.name || `Judge #${idx + 1}`
            const initials = getInitials(name)

            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 hover:border-slate-700 shadow-md flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start gap-3.5 mb-4">
                    <Avatar className="h-11 w-11 border border-primary/30">
                      <AvatarImage src={judge.profile_picture_url} />
                      <AvatarFallback className="font-bold text-xs bg-primary text-white font-mono">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">
                        {name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono truncate mt-0.5">
                        {judge.preferred_role || 'Hackathon Evaluator'}
                      </p>
                      {judge.email && (
                        <p className="text-[11px] text-primary font-mono truncate mt-0.5">
                          {judge.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {judge.bio && (
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {judge.bio}
                    </p>
                  )}

                  {judge.skills && (
                    <div className="space-y-1.5 mb-4">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Code2 className="h-3 w-3 text-primary" />
                        Expertise Domains
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {judge.skills.split(',').slice(0, 4).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-primary-light"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 mt-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs h-8 bg-[#0F1522] border-slate-800 text-slate-200 hover:text-white"
                    onClick={() => setAssignDialogOpen(true)}
                  >
                    <UserCheck className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    Assign Project
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Dialog */}
      <JudgeAssignmentDialog
        open={assignDialogOpen}
        events={events}
        judges={judges}
        onOpenChange={setAssignDialogOpen}
        onSuccess={() => fetchData()}
      />
    </div>
  )
}

