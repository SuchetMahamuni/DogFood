import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FolderKanban,
  GitBranch,
  Globe,
  Video,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Edit3,
  Clock,
  Code2,
  ArrowLeft,
  ShieldCheck,
  Terminal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import projectService from '@/services/projectService'
import teamService from '@/services/teamService'
import type { Project, ProjectPayload, Team } from '@/types/participant'
import { SubmissionReadiness } from '@/components/participant/SubmissionReadiness'
import { TechStack } from '@/components/participant/TechStack'
import { getApiErrorMessage } from '@/services/apiClient'

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId?: string }>()

  const [team, setTeam] = useState<Team | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState<ProjectPayload>({
    title: '',
    short_description: '',
    detailed_description: '',
    repository_url: '',
    demo_url: '',
    video_url: '',
    technologies: '',
    track_id: null,
  })

  const initForm = (proj: Project) => {
    setFormData({
      title: proj.title || '',
      short_description: proj.short_description || '',
      detailed_description: proj.detailed_description || '',
      repository_url: proj.repository_url || '',
      demo_url: proj.demo_url || '',
      video_url: proj.video_url || '',
      technologies: proj.technologies || '',
      track_id: proj.track_id || null,
    })
  }

  const loadData = async () => {
    setIsLoading(true)
    setFeedback(null)
    try {
      if (projectId) {
        const projData = await projectService.getProject(parseInt(projectId, 10))
        setProject(projData)
        initForm(projData)
      } else {
        const activeTeamId = teamService.getActiveTeamId() || 1
        const teamData = await teamService.getTeam(activeTeamId)
        setTeam(teamData)
        if (teamData.project) {
          setProject(teamData.project)
          initForm(teamData.project)
        } else {
          setIsEditing(true)
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [projectId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setFeedback({ type: 'error', message: 'Project title is required.' })
      return
    }

    setIsSaving(true)
    setFeedback(null)
    try {
      if (project) {
        const updated = await projectService.updateProject(project.id, formData)
        setProject(updated)
        setIsEditing(false)
        setFeedback({ type: 'success', message: 'Project specifications updated successfully!' })
      } else {
        const targetTeamId = team?.id || 1
        const created = await projectService.createProject(targetTeamId, formData)
        setProject(created)
        setIsEditing(false)
        setFeedback({ type: 'success', message: 'Project created and attached to your squad workspace!' })
      }
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Failed to save project.') })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmitForJudging = async () => {
    if (!project) return
    if (!window.confirm('Are you ready to submit your project? This locks in your submission and routes it to judges for scoring.')) {
      return
    }

    setIsSubmitting(true)
    setFeedback(null)
    try {
      const res = await projectService.submitProject(project.id)
      setProject({ ...project, is_submitted: true, submitted_at: new Date().toISOString() })
      setFeedback({ type: 'success', message: res.message || 'Project officially submitted for judge evaluation!' })
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Failed to submit project.') })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-6 w-32 bg-surface-elevated rounded animate-pulse" />
        <div className="h-10 w-72 bg-surface-card rounded-lg animate-pulse" />
        <div className="h-96 bg-card rounded-2xl border border-white/10 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-16">
      {/* Contextual Back Navigation */}
      <div className="flex items-center gap-3">
        <Link
          to="/team"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Team</span>
        </Link>
        <span className="text-slate-600">•</span>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-md">
              <FolderKanban className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {project ? project.title : 'Project Workspace'}
            </h1>
            {project?.is_submitted ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Submitted
              </span>
            ) : project ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                In Progress
              </span>
            ) : null}
          </div>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            {project?.short_description || 'Build, document, and submit your project for judging.'}
          </p>
        </div>

        {/* Global Header Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {project && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-xs font-semibold border-white/10 text-slate-200 hover:text-white hover:bg-surface-elevated shadow-xs"
            >
              <Edit3 className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              Edit Project
            </Button>
          )}

          {project && !project.is_submitted && (
            <Button
              size="sm"
              onClick={handleSubmitForJudging}
              disabled={isSubmitting}
              className="shadow-sm font-bold text-xs bg-primary hover:bg-primary-hover text-white border border-primary/30 glow-brand"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Submitting Project...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Submit Project
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-2.5 p-3.5 text-xs rounded-xl border transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Main Grid: Left Specs & Deliverables, Right Readiness & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submission Notice Banner */}
          {project?.is_submitted && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/5 to-transparent border border-emerald-500/30 flex items-start gap-3.5">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">
                  Project Submitted Successfully
                </h4>
                <p className="text-xs text-slate-300">
                  Locked on {project.submitted_at ? new Date(project.submitted_at).toLocaleString() : 'Recent timestamp'}. Your project is now available for judging.
                </p>
              </div>
            </div>
          )}

          {/* Form Mode */}
          {isEditing ? (
            <Card className="border-white/10 shadow-xl rounded-2xl bg-card/95">
              <CardHeader className="pb-4 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary border border-primary/30 flex items-center justify-center">
                    <Edit3 className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-white">
                      {project ? 'Edit Project Specifications' : 'Register New Project'}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Provide repository links, architecture summary, and tech specifications.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-5">
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-xs font-semibold text-slate-200">
                      Project Title <span className="text-rose-400">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g. DogFood Agentic IDE"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="font-medium bg-surface-elevated/70 border-white/10 text-white placeholder:text-slate-500 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="short_description" className="text-xs font-semibold text-slate-200">
                      Short Pitch / Problem Summary (max 500 chars)
                    </Label>
                    <Input
                      id="short_description"
                      placeholder="An autonomous developer cockpit with multi-agent orchestration."
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      maxLength={500}
                      className="bg-surface-elevated/70 border-white/10 text-white placeholder:text-slate-500 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="detailed_description" className="text-xs font-semibold text-slate-200">
                      Technical Architecture &amp; Implementation Details
                    </Label>
                    <textarea
                      id="detailed_description"
                      rows={6}
                      className="w-full rounded-xl border border-white/10 bg-surface-elevated/70 p-3 text-xs text-white placeholder:text-slate-500 shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary font-mono"
                      placeholder="Explain problem statement, system architecture, APIs used, performance benchmarks, and challenges overcome..."
                      value={formData.detailed_description}
                      onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="repository_url" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <GitBranch className="h-3.5 w-3.5 text-primary" /> Repository URL
                      </Label>
                      <Input
                        id="repository_url"
                        type="url"
                        placeholder="https://github.com/myteam/project"
                        value={formData.repository_url}
                        onChange={(e) => setFormData({ ...formData, repository_url: e.target.value })}
                        className="bg-surface-elevated/70 border-white/10 text-white placeholder:text-slate-500 rounded-xl font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="demo_url" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-cyan-400" /> Live Demo URL
                      </Label>
                      <Input
                        id="demo_url"
                        type="url"
                        placeholder="https://my-app.vercel.app"
                        value={formData.demo_url}
                        onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                        className="bg-surface-elevated/70 border-white/10 text-white placeholder:text-slate-500 rounded-xl font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="video_url" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Video className="h-3.5 w-3.5 text-amber-400" /> Walkthrough Video URL
                      </Label>
                      <Input
                        id="video_url"
                        type="url"
                        placeholder="https://youtube.com/watch?v=..."
                        value={formData.video_url}
                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                        className="bg-surface-elevated/70 border-white/10 text-white placeholder:text-slate-500 rounded-xl font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="technologies" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Code2 className="h-3.5 w-3.5 text-primary" /> Technologies (comma separated)
                      </Label>
                      <Input
                        id="technologies"
                        placeholder="React, TypeScript, Python, Flask, Docker"
                        value={formData.technologies}
                        onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                        className="bg-surface-elevated/70 border-white/10 text-white placeholder:text-slate-500 rounded-xl font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-white/10">
                    {project && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                        className="text-xs border-white/10 text-slate-300 hover:text-white"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" size="sm" disabled={isSaving} className="text-xs font-bold bg-primary hover:bg-primary-hover text-white border border-primary/30 glow-brand">
                      {isSaving ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                          Saving Specs...
                        </>
                      ) : (
                        'Save Specifications'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : project ? (
            /* View Mode: High-End Developer Layout */
            <div className="space-y-6">
              {/* Deliverable Assets Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Repository Card */}
                <div className="bg-card/90 p-4 rounded-2xl border border-white/10 shadow-xs hover:border-primary/40 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <GitBranch className="h-3.5 w-3.5 text-primary" /> Repository
                    </span>
                    {project.repository_url ? (
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-slate-600" />
                    )}
                  </div>
                  {project.repository_url ? (
                    <a
                      href={project.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-medium text-primary-light hover:underline flex items-center gap-1 truncate block"
                    >
                      <span className="truncate">{project.repository_url.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 ml-auto text-slate-400" />
                    </a>
                  ) : (
                    <p className="text-xs text-slate-400 italic font-mono">No repo connected</p>
                  )}
                </div>

                {/* Live Demo Card */}
                <div className="bg-card/90 p-4 rounded-2xl border border-white/10 shadow-xs hover:border-cyan-500/40 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-cyan-400" /> Live Demo
                    </span>
                    {project.demo_url ? (
                      <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-slate-600" />
                    )}
                  </div>
                  {project.demo_url ? (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-medium text-cyan-300 hover:underline flex items-center gap-1 truncate block"
                    >
                      <span className="truncate">{project.demo_url.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 ml-auto text-slate-400" />
                    </a>
                  ) : (
                    <p className="text-xs text-slate-400 italic font-mono">No demo deployed</p>
                  )}
                </div>

                {/* Pitch Video Card */}
                <div className="bg-card/90 p-4 rounded-2xl border border-white/10 shadow-xs hover:border-amber-500/40 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Video className="h-3.5 w-3.5 text-amber-400" /> Walkthrough
                    </span>
                    {project.video_url ? (
                      <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-slate-600" />
                    )}
                  </div>
                  {project.video_url ? (
                    <a
                      href={project.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-medium text-amber-300 hover:underline flex items-center gap-1 truncate block"
                    >
                      <span className="truncate">{project.video_url.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 ml-auto text-slate-400" />
                    </a>
                  ) : (
                    <p className="text-xs text-slate-400 italic font-mono">No video linked</p>
                  )}
                </div>
              </div>

              {/* Technologies Stack */}
              <div className="bg-card/90 p-6 rounded-2xl border border-white/10 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span>Configured Technologies &amp; Libraries</span>
                </div>
                <TechStack technologies={project.technologies} />
              </div>

              {/* Architecture & Detailed Specs */}
              <div className="bg-card/90 p-6 rounded-2xl border border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                  <Terminal className="h-4.5 w-4.5 text-primary" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Architecture &amp; Solution
                  </h3>
                </div>

                {project.detailed_description ? (
                  <div className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line bg-surface-elevated/40 p-4 rounded-xl border border-white/5">
                    {project.detailed_description}
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-xl space-y-2">
                    <p className="text-xs text-slate-400">No architecture details written yet.</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs font-semibold border-white/10 text-white"
                      onClick={() => setIsEditing(true)}
                    >
                      Add Architecture Details
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center rounded-2xl border border-dashed border-white/10 bg-card/40 space-y-4">
              <FolderKanban className="h-10 w-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No project created yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Your team hasn't registered a project yet. Create a project to begin building your hackathon submission.
              </p>
              <Button size="sm" onClick={() => setIsEditing(true)} className="text-xs font-bold bg-primary hover:bg-primary-hover text-white border border-primary/30">
                Create Project
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Submission Readiness & Evaluation Meta */}
        <div className="space-y-6">
          <SubmissionReadiness project={project || {}} />

          {/* Team Details Card */}
          {team && (
            <Card className="border-white/10 bg-card/90 shadow-xs rounded-2xl">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Team Name:</span>
                  <span className="font-bold text-white">{team.name}</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-slate-400">Members:</span>
                  <span className="text-slate-200">{team.members?.length || 1} Members</span>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <Button asChild variant="ghost" size="sm" className="w-full text-xs text-primary hover:text-white font-mono">
                    <Link to="/team">Open Team Workspace →</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
