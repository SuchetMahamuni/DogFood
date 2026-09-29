import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderKanban,
  Search,
  GitBranch,
  Globe,
  Video,
  Sparkles,
  Loader2,
  Calendar,
  Layers,
  ChevronRight,
  Code2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import eventService from '@/services/eventService'
import projectService from '@/services/projectService'
import type { Event, Project } from '@/types/participant'

export default function ProjectsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<number>(1)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTech, setSelectedTech] = useState<string>('ALL')

  useEffect(() => {
    async function initPage() {
      setIsLoading(true)
      try {
        const evs = await eventService.getEvents()
        setEvents(evs)
        const initialEventId = evs.length > 0 ? evs[0].id : 1
        setSelectedEventId(initialEventId)
        await loadProjectsForEvent(initialEventId)
      } catch {
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }
    initPage()
  }, [])

  const loadProjectsForEvent = async (eventId: number) => {
    try {
      const data = await projectService.getEventProjects(eventId, true)
      if (data && data.length > 0) {
        setProjects(data)
      } else {
        setProjects([])
      }
    } catch {
      setProjects([])
    }
  }

  const handleEventChange = async (eventId: number) => {
    setSelectedEventId(eventId)
    setIsLoading(true)
    await loadProjectsForEvent(eventId)
    setIsLoading(false)
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.short_description && p.short_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.technologies && p.technologies.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTech =
      selectedTech === 'ALL' ||
      (p.technologies && p.technologies.toLowerCase().includes(selectedTech.toLowerCase()))

    return matchesSearch && matchesTech
  })

  const featured = filteredProjects[0]
  const gallery = filteredProjects.slice(1)
  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <FolderKanban className="h-7 w-7 text-primary" />
            Projects
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Explore submitted projects, live demos, and repositories built by hackathon participants.
          </p>
        </div>

        {events.length > 0 && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <select
              aria-label="Filter project gallery by event"
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

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card/90 border border-white/10 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search projects by name, specs, or technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs font-medium h-9 rounded-xl shadow-xs bg-surface-elevated/70 border-white/10 text-white placeholder:text-slate-500"
          />
        </div>

        {/* Tech Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'React', 'Python', 'TypeScript', 'Docker', 'Rust'].map((tech) => (
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all border ${
                selectedTech === tech
                  ? 'bg-primary text-white border-primary/50 shadow-xs glow-brand'
                  : 'bg-surface-elevated/60 text-slate-300 border-white/5 hover:bg-surface-elevated hover:text-white'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-xs font-mono">Querying showcase repository...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProjects.length === 0 && (
        <div className="p-16 text-center rounded-2xl border border-dashed border-white/10 bg-card/40">
          <FolderKanban className="h-10 w-10 text-slate-500 mx-auto mb-2 opacity-50" />
          <h3 className="text-base font-bold text-white">No projects found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or technology filters.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-4 text-xs font-semibold border-white/10 text-white"
            onClick={() => {
              setSearchQuery('')
              setSelectedTech('ALL')
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Featured Project Spotlight */}
      {!isLoading && featured && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Featured Spotlight</span>
          </div>

          <div className="bg-gradient-to-r from-surface-card via-surface-elevated to-surface-base rounded-2xl border border-primary/30 p-6 sm:p-8 shadow-xl hover:border-indigo-400/50 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-3 max-w-3xl relative z-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/20 text-white border border-primary/30">
                  {activeEvent?.name || 'Hackathon Showcase'}
                </span>
                <span className="text-xs font-mono text-slate-400">Project #{featured.id}</span>
                {featured.is_submitted && (
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Official Submission
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-extrabold text-white">
                {featured.title}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                {featured.short_description || featured.detailed_description}
              </p>

              {/* Technologies */}
              {featured.technologies && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <Code2 className="h-3.5 w-3.5 text-primary" />
                  {featured.technologies.split(',').map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-md bg-surface-elevated border border-white/10 text-slate-200"
                    >
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Links and CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 relative z-10">
              <Button asChild size="sm" className="text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow-xs border border-primary/30 glow-brand">
                <Link to={`/project/${featured.id}`}>
                  View Project Specs
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>

              <div className="flex items-center gap-2">
                {featured.repository_url && (
                  <Button asChild variant="outline" size="sm" className="text-xs font-mono font-semibold flex-1 border-white/10 text-slate-200 hover:text-white hover:bg-surface-elevated">
                    <a href={featured.repository_url} target="_blank" rel="noopener noreferrer">
                      <GitBranch className="h-3.5 w-3.5 mr-1 text-primary" />
                      Repo
                    </a>
                  </Button>
                )}
                {featured.demo_url && (
                  <Button asChild variant="outline" size="sm" className="text-xs font-mono font-semibold flex-1 border-white/10 text-slate-200 hover:text-white hover:bg-surface-elevated">
                    <a href={featured.demo_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                      Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Other Projects */}
      {!isLoading && gallery.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              All Submissions ({filteredProjects.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {gallery.map((proj) => (
              <Card
                key={proj.id}
                className="rounded-2xl border-white/10 bg-card/90 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Project #{proj.id}
                    </span>
                    {proj.is_submitted && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        Submitted
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base font-bold text-white line-clamp-1">
                    {proj.title}
                  </CardTitle>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                    {proj.short_description || 'Hackathon project deliverable.'}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3 pb-3">
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.split(',').slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-slate-300 border border-white/5"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {proj.repository_url && (
                      <a
                        href={proj.repository_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                        title="Repository"
                      >
                        <GitBranch className="h-4 w-4" />
                      </a>
                    )}
                    {proj.demo_url && (
                      <a
                        href={proj.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 p-1 rounded transition-colors"
                        title="Live Demo"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                    {proj.video_url && (
                      <a
                        href={proj.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300 p-1 rounded transition-colors"
                        title="Video Walkthrough"
                      >
                        <Video className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  <Button asChild size="sm" variant="ghost" className="text-xs text-primary hover:text-white font-mono">
                    <Link to={`/project/${proj.id}`}>
                      Details →
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
