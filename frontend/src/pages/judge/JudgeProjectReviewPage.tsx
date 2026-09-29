import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Video,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Layers,
  Scale,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RubricPanel } from '@/components/judge/RubricPanel'
import { CriterionScoreRow } from '@/components/judge/CriterionScoreRow'
import { ScoreSummary } from '@/components/judge/ScoreSummary'
import projectService from '@/services/projectService'
import judgingService from '@/services/judgingService'
import rubricService from '@/services/rubricService'
import type { Project } from '@/types/participant'
import type { Criterion, JudgeAssignment } from '@/types/judging'

export default function JudgeProjectReviewPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [searchParams] = useSearchParams()

  const assignmentIdParam = searchParams.get('assignmentId')

  const [project, setProject] = useState<Project | null>(null)
  const [assignment, setAssignment] = useState<JudgeAssignment | null>(null)
  const [criteria, setCriteria] = useState<Criterion[]>([])

  const [scores, setScores] = useState<Record<number, number>>({})
  const [comments, setComments] = useState<Record<number, string>>({})

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadReviewData() {
      if (!projectId) return
      setIsLoading(true)
      setError(null)

      try {
        const pId = Number(projectId)
        const [projData, rubricData, assignmentsList] = await Promise.all([
          projectService.getProject(pId).catch(() => null),
          rubricService.getCriteria(),
          judgingService.getJudgeAssignments().catch(() => []),
        ])

        if (!active) return

        if (!projData) {
          setError(`Project #${projectId} not found.`)
          setIsLoading(false)
          return
        }

        setProject(projData)
        setCriteria(rubricData)

        // Find matching assignment
        let matchedAssignment: JudgeAssignment | undefined
        if (assignmentIdParam) {
          matchedAssignment = assignmentsList.find((a) => a.id === Number(assignmentIdParam))
        }
        if (!matchedAssignment) {
          matchedAssignment = assignmentsList.find((a) => a.project_id === pId)
        }

        setAssignment(matchedAssignment || null)

        // Initialize score defaults (mid-range or 7.0)
        const initialScores: Record<number, number> = {}
        const initialComments: Record<number, string> = {}
        rubricData.forEach((c) => {
          initialScores[c.id] = 7.0
          initialComments[c.id] = ''
        })
        setScores(initialScores)
        setComments(initialComments)
      } catch (err: unknown) {
        if (!active) return
        const e = err as Error
        setError(e.message || 'Failed to load project review data.')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadReviewData()

    return () => {
      active = false
    }
  }, [projectId, assignmentIdParam])

  const isScoredAlready = assignment?.status === 'SCORED' || Boolean(successMessage)

  const handleScoreChange = (criterionId: number, val: number) => {
    setScores((prev) => ({
      ...prev,
      [criterionId]: val,
    }))
  }

  const handleCommentChange = (criterionId: number, comment: string) => {
    setComments((prev) => ({
      ...prev,
      [criterionId]: comment,
    }))
  }

  const handleSubmitEvaluation = async () => {
    if (!assignment) {
      setError('Cannot submit evaluation: No active judge assignment was found for this project.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const payload = {
      scores: criteria.map((c) => ({
        criterion_id: c.id,
        value: Number(scores[c.id] ?? 0),
        comment: comments[c.id]?.trim() || undefined,
      })),
    }

    try {
      await judgingService.submitScores(assignment.id, payload)
      setSuccessMessage('Evaluation submitted and saved successfully! The project is now marked as scored.')

      // Update local assignment status
      setAssignment((prev) => (prev ? { ...prev, status: 'SCORED' } : prev))
    } catch (err: unknown) {
      const e = err as Error
      setError(e.message || 'Failed to submit evaluation scores.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-28 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm font-medium">Loading project submission and evaluation rubric...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h1 className="text-xl font-bold text-white">Project Not Found</h1>
        <p className="text-sm text-slate-400">
          {error || `Could not find submission details for project #${projectId}.`}
        </p>
        <Button asChild variant="outline" className="bg-[#0B1020] border-slate-800 text-slate-200">
          <Link to="/judge">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Judge Dashboard
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-20">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link to="/judge" className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          Judge Dashboard
        </Link>
        <span>/</span>
        <Link to="/judge/assignments" className="hover:text-white">
          Assigned Projects
        </Link>
        <span>/</span>
        <span className="text-slate-200 font-bold truncate max-w-[200px]">
          {project.title}
        </span>
      </div>

      {/* Header with Project Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Scale className="h-3 w-3 text-amber-400" />
              PROJECT REVIEW
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {project.title}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            {project.short_description || 'Hackathon project submission under review'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold ${
              isScoredAlready
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
            }`}
          >
            {isScoredAlready ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Scored
              </>
            ) : (
              'Pending Score'
            )}
          </span>
          {assignment && (
            <span className="text-xs font-mono text-slate-500">
              ID #{assignment.id}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-xs rounded-xl bg-rose-950/30 text-rose-300 border border-rose-800/40">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 p-4 text-xs rounded-xl bg-emerald-950/30 text-emerald-300 border border-emerald-800/40">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Project Submission & Scoring Controls */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Overview Card */}
          <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Project Submission
              </h3>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Details</span>
            </div>

            {project.detailed_description && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Project Description
                </h4>
                <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                  {project.detailed_description}
                </p>
              </div>
            )}

            {/* Tech Stack */}
            {project.technologies && (
              <div className="space-y-2 pt-2">
                <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.split(',').map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#121928] text-primary-light border border-primary/20"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800/80">
              {project.repository_url && (
                <Button asChild variant="outline" size="sm" className="bg-[#0F1522] border-slate-800 text-slate-200 hover:text-white">
                  <a
                    href={project.repository_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs"
                  >
                    <GitBranch className="h-3.5 w-3.5 text-primary" />
                    Repository
                    <ExternalLink className="h-3 w-3 text-slate-500" />
                  </a>
                </Button>
              )}

              {project.demo_url && (
                <Button asChild variant="outline" size="sm" className="bg-[#0F1522] border-slate-800 text-slate-200 hover:text-white">
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs"
                  >
                    <Globe className="h-3.5 w-3.5 text-cyan-400" />
                    Live Demo
                    <ExternalLink className="h-3 w-3 text-slate-500" />
                  </a>
                </Button>
              )}

              {project.video_url && (
                <Button asChild variant="outline" size="sm" className="bg-[#0F1522] border-slate-800 text-slate-200 hover:text-white">
                  <a
                    href={project.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs"
                  >
                    <Video className="h-3.5 w-3.5 text-primary" />
                    Demo Video
                    <ExternalLink className="h-3 w-3 text-slate-500" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Scoring Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Scoring Criteria</h2>
                <p className="text-xs text-slate-400">
                  Score each criterion according to the judging criteria.
                </p>
              </div>
              {isScoredAlready && (
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  Score Recorded
                </span>
              )}
            </div>

            <div className="space-y-4">
              {criteria.map((criterion) => (
                <CriterionScoreRow
                  key={criterion.id}
                  criterion={criterion}
                  value={scores[criterion.id] ?? 0}
                  comment={comments[criterion.id] ?? ''}
                  disabled={isScoredAlready || isSubmitting}
                  onChangeValue={(val) => handleScoreChange(criterion.id, val)}
                  onChangeComment={(cmt) => handleCommentChange(criterion.id, cmt)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Score Summary & Rubric Explanations */}
        <div className="space-y-6">
          <ScoreSummary
            criteria={criteria}
            scores={scores}
            comments={comments}
            isSubmitting={isSubmitting}
            isScoredAlready={isScoredAlready}
            onSubmitScores={handleSubmitEvaluation}
          />

          <RubricPanel criteria={criteria} />
        </div>
      </div>
    </div>
  )
}

