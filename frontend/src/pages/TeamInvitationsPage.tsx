import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Check, X, ArrowLeft, Users, Calendar, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import teamService from '@/services/teamService'
import type { TeamInvitation } from '@/types/participant'
import { getApiErrorMessage } from '@/services/apiClient'

export default function TeamInvitationsPage() {
  const navigate = useNavigate()
  const [invitations, setInvitations] = useState<TeamInvitation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const loadInvitations = async () => {
    setIsLoading(true)
    try {
      const data = await teamService.getMyInvitations()
      setInvitations(data)
    } catch {
      // Handled gracefully
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInvitations()
  }, [])

  const handleAccept = async (invitationId: number, teamId: number) => {
    setActionLoadingId(invitationId)
    setFeedback(null)
    try {
      const res = await teamService.acceptInvitation(invitationId)
      teamService.setActiveTeamId(teamId)
      setFeedback({ type: 'success', message: res.message || 'Invitation accepted! Redirecting to squad...' })
      setInvitations((prev) => prev.filter((i) => i.id !== invitationId))
      setTimeout(() => {
        navigate('/team')
      }, 1200)
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Failed to accept invitation.') })
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleReject = async (invitationId: number) => {
    setActionLoadingId(invitationId)
    setFeedback(null)
    try {
      const res = await teamService.rejectInvitation(invitationId)
      setFeedback({ type: 'success', message: res.message || 'Invitation declined.' })
      setInvitations((prev) => prev.filter((i) => i.id !== invitationId))
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Failed to decline invitation.') })
    } finally {
      setActionLoadingId(null)
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently'
    try {
      return new Date(dateStr).toLocaleDateString()
    } catch {
      return dateStr
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-16">
      {/* Contextual Back Navigation */}
      <div>
        <Link
          to="/team"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Squad Workspace</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Mail className="h-7 w-7 text-primary" />
            Squad Invitations
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Review invites from team leaders seeking your technical skills for their hackathon submission.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2.5 p-3.5 text-xs rounded-xl border ${
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
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-card animate-pulse border border-white/5" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && invitations.length === 0 && (
        <div className="p-16 text-center rounded-2xl border border-dashed border-white/10 bg-card/40">
          <Mail className="h-10 w-10 text-slate-500 mx-auto mb-2 opacity-50" />
          <h3 className="text-base font-bold text-white">No pending invitations</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            You don't have any incoming squad requests. Head over to the talent terminal to find teams or create your own squad.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Button asChild size="sm" variant="outline" className="text-xs font-semibold border-white/10 text-slate-200 hover:text-white">
              <Link to="/team">Create Squad</Link>
            </Button>
            <Button asChild size="sm" className="text-xs font-bold bg-primary hover:bg-primary-hover text-white border border-primary/30 glow-brand">
              <Link to="/discover">Discover Hackers</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Invitations List */}
      {!isLoading && invitations.length > 0 && (
        <div className="space-y-4">
          {invitations.map((inv) => (
            <Card
              key={inv.id}
              className="border-white/10 bg-card/90 shadow-sm rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary-light border border-primary/30">
                    Squad Invitation
                  </span>
                  {inv.event_name && (
                    <span className="text-xs font-mono text-slate-400">
                      {inv.event_name}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white">
                  {inv.team_name || `Squad #${inv.team_id}`}
                </h3>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    Invited by {inv.inviter_name || 'Team Leader'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {formatDate(inv.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(inv.id)}
                  disabled={actionLoadingId === inv.id}
                  className="text-xs font-semibold border-white/10 text-slate-300 hover:text-white hover:bg-surface-elevated"
                >
                  <X className="h-3.5 w-3.5 mr-1 text-slate-400" />
                  Decline
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleAccept(inv.id, inv.team_id)}
                  disabled={actionLoadingId === inv.id}
                  className="text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow-xs border border-primary/30 glow-brand"
                >
                  {actionLoadingId === inv.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  ) : (
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  Accept &amp; Join Squad
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
