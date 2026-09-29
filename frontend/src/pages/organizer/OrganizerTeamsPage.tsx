import { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import eventService from '@/services/eventService'
import projectService from '@/services/projectService'
import type { Event, Project } from '@/types/participant'

export default function OrganizerTeamsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<number>(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [submissionFilter, setSubmissionFilter] = useState<'ALL' | 'SUBMITTED' | 'DRAFT'>('ALL')

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const eventList = await eventService.getEvents()
      setEvents(eventList)

      const activeId = selectedEventId || eventList[0]?.id || 1
      setSelectedEventId(activeId)

      const eventProjects = await projectService.getEventProjects(activeId, false)
      setProjects(eventProjects)
    } catch (err: unknown) {
      const e = err as Error
      setError(e.message || 'Failed to load teams.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedEventId])

  const filtered = projects.filter((p) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.technologies || '').toLowerCase().includes(q) ||
      (p.short_description || '').toLowerCase().includes(q)

    const matchesStatus =
      submissionFilter === 'ALL' ||
      (submissionFilter === 'SUBMITTED' && p.is_submitted) ||
      (submissionFilter === 'DRAFT' && !p.is_submitted)

    return matchesSearch && matchesStatus
  })

  const submittedCount = projects.filter(p => p.is_submitted).length
  const draftCount = projects.length - submittedCount

  return (
    <PageContainer>
      <div className="space-y-6 pb-20">
        {/* Context Back Navigation */}
        <div className="flex items-center gap-2">
          <Link
            to="/organizer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors group"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            <span>Back to Organizer</span>
          </Link>
        </div>

        <PageHeader
          title="Teams & Projects"
          description="Track team formation and project submissions across hackathons."
          actions={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary bg-primary/10 px-3 py-1">
                <Users className="h-3.5 w-3.5 mr-1.5" />
                {projects.length} Total Teams
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

        {/* Telemetry Filter Strip */}
        <div className="bg-[#0B1020] p-4 rounded-xl border border-slate-800/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {events.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Event:
                </span>
                <select
                  aria-label="Filter teams by event"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(Number(e.target.value))}
                  className="text-xs font-medium bg-[#070A12] border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 focus:border-indigo-500 focus:outline-none"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name} ({ev.status})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Submission Status Buttons */}
            <div className="flex items-center gap-1 bg-[#070A12] p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setSubmissionFilter('ALL')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  submissionFilter === 'ALL'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({projects.length})
              </button>
              <button
                onClick={() => setSubmissionFilter('SUBMITTED')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  submissionFilter === 'SUBMITTED'
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Submitted ({submittedCount})
              </button>
              <button
                onClick={() => setSubmissionFilter('DRAFT')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  submissionFilter === 'DRAFT'
                    ? 'bg-amber-950/60 border border-amber-500/40 text-amber-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Draft ({draftCount})
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search team or deliverables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-[#070A12] border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-primary/50"
            />
          </div>
        </div>

        {/* Grid of Teams / Projects */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <p className="text-sm font-medium">Loading teams and project submissions...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-[#0B1020]/40 p-8">
            <Users className="h-10 w-10 text-slate-600 mb-3" />
            <p className="font-semibold text-white">No teams found for this hackathon.</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {searchQuery
                ? 'Try adjusting your search query or status filter.'
                : 'No teams have formed or submitted deliverables for this event yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((proj) => (
              <div
                key={proj.id}
                className="group relative bg-[#0B1020] rounded-xl border border-slate-800/80 p-5 flex flex-col justify-between hover:border-primary/40 hover:shadow-lg hover:shadow-primary-950/20 transition-all duration-200"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 border ${
                        proj.is_submitted
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/30'
                          : 'border-amber-500/30 text-amber-400 bg-amber-950/30'
                      }`}
                    >
                      {proj.is_submitted ? (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3" />
                          Submitted
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          In Development
                        </span>
                      )}
                    </Badge>

                    <span className="text-[11px] font-mono text-slate-500">
                      Team #{proj.team_id || proj.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-primary-light transition-colors line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {proj.short_description || 'No project description recorded.'}
                    </p>
                  </div>

                  {proj.technologies && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex flex-wrap gap-1">
                        {proj.technologies.split(',').slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#070A12] border border-slate-800 text-slate-300"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="text-[11px] text-slate-500 flex items-center justify-between font-mono">
                    <span>Artifact ID: #{proj.id}</span>
                    <span>
                      {proj.submitted_at
                        ? `Finalized ${new Date(proj.submitted_at).toLocaleDateString()}`
                        : 'Draft state'}
                    </span>
                  </div>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs w-full bg-[#070A12] border-slate-800 text-slate-300 hover:text-white hover:border-primary/50 hover:bg-indigo-950/20"
                  >
                    <Link to={`/project/${proj.id}`}>
                      Inspect Submission Dossier
                      <ExternalLink className="h-3 w-3 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
