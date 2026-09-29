import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList,
  Search,
  Loader2,
  AlertCircle,
  Scale,
  ArrowLeft,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AssignmentCard } from '@/components/judge/AssignmentCard'
import judgingService from '@/services/judgingService'
import projectService from '@/services/projectService'
import eventService from '@/services/eventService'
import type { JudgeAssignment } from '@/types/judging'

type FilterStatus = 'ALL' | 'PENDING' | 'SCORED'

export default function JudgeAssignmentsPage() {
  const [assignments, setAssignments] = useState<JudgeAssignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let active = true

    async function loadData() {
      setIsLoading(true)
      setError(null)

      try {
        const [rawAssignments, events] = await Promise.all([
          judgingService.getJudgeAssignments().catch(() => []),
          eventService.getEvents().catch(() => []),
        ])

        if (!active) return

        const enriched = await Promise.all(
          rawAssignments.map(async (a) => {
            let project = undefined
            try {
              project = await projectService.getProject(a.project_id)
            } catch {
              // Ignore
            }
            const event = events.find((e) => e.id === a.event_id)
            return {
              ...a,
              project,
              event,
            }
          }),
        )

        setAssignments(enriched)
      } catch (err: unknown) {
        if (!active) return
        const e = err as Error
        setError(e.message || 'Failed to load assignments.')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [])

  const filteredAssignments = assignments.filter((a) => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) {
      return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const title = a.project?.title?.toLowerCase() || ''
      const tech = a.project?.technologies?.toLowerCase() || ''
      return title.includes(q) || tech.includes(q) || String(a.project_id).includes(q)
    }
    return true
  })

  const pendingCount = assignments.filter((a) => a.status === 'PENDING').length
  const scoredCount = assignments.filter((a) => a.status === 'SCORED').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in pb-20">
      {/* Contextual Back Navigation */}
      <div>
        <Link
          to="/judge"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Judge Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Scale className="h-3 w-3 text-amber-400" />
              ASSIGNMENTS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            Assigned Projects
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Search, filter, and review all projects assigned to you for scoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#0B1020] border border-slate-800 text-slate-300">
            {assignments.length} Projects Total
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-xs rounded-xl bg-rose-950/30 text-rose-300 border border-rose-800/40">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0B1020] p-3 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setStatusFilter('ALL')}
            className={`text-xs h-9 font-bold px-3.5 rounded-xl ${
              statusFilter === 'ALL'
                ? 'bg-primary text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All ({assignments.length})
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setStatusFilter('PENDING')}
            className={`text-xs h-9 font-bold px-3.5 rounded-xl ${
              statusFilter === 'PENDING'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Pending ({pendingCount})
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setStatusFilter('SCORED')}
            className={`text-xs h-9 font-bold px-3.5 rounded-xl ${
              statusFilter === 'SCORED'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Completed ({scoredCount})
          </Button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search by title, tech or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-[#070A12] border-slate-800 text-white placeholder:text-slate-500 rounded-xl"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-medium">Fetching adjudication assignments...</p>
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-[#0B1020]">
          <ClipboardList className="h-10 w-10 text-slate-600 mb-3" />
          <p className="font-bold text-white">
            {assignments.length === 0 ? 'No assignments yet.' : 'No assignments match your criteria'}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {searchQuery || statusFilter !== 'ALL'
              ? 'Try adjusting your search query or status filter.'
              : 'No projects have been assigned to your judging queue yet.'}
          </p>
          {(searchQuery || statusFilter !== 'ALL') && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4 bg-[#0F1522] border-slate-800 text-slate-300 hover:text-white"
              onClick={() => {
                setStatusFilter('ALL')
                setSearchQuery('')
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </div>
  )
}

