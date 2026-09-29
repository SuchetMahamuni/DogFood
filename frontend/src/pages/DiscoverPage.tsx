import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Users, RefreshCcw, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserCard } from '@/components/participant/UserCard'
import { DiscoveryFilters } from '@/components/participant/DiscoveryFilters'
import { ProfilePreviewModal } from '@/components/participant/ProfilePreviewModal'
import { InviteTeammateDialog } from '@/components/participant/InviteTeammateDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import userService, { type DiscoverFilters } from '@/services/userService'
import teamService from '@/services/teamService'
import { useAuthStore } from '@/store/authStore'
import type { DiscoveredUser } from '@/types/participant'

export default function DiscoverPage() {
  const { user: currentUser } = useAuthStore()
  const [filters, setFilters] = useState<DiscoverFilters>({})
  const [users, setUsers] = useState<DiscoveredUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedUser, setSelectedUser] = useState<DiscoveredUser | null>(null)
  const [inviteUser, setInviteUser] = useState<DiscoveredUser | null>(null)
  const [invitedIds, setInvitedIds] = useState<number[]>([])

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [discoveredData, matchData] = await Promise.all([
        userService.discoverUsers(filters),
        userService.getMyMatches(),
      ])

      const userMap = new Map<number, DiscoveredUser>()
      discoveredData.forEach((u) => {
        const id = u.user_id || u.id || 0
        userMap.set(id, { ...u })
      })
      matchData.forEach((m) => {
        const id = m.user_id || m.id || 0
        const existing = userMap.get(id)
        if (existing) {
          existing.match_score = m.match_score
        } else {
          userMap.set(id, m)
        }
      })

      const currentUserId = currentUser?.id
      const currentEmail = currentUser?.email?.toLowerCase()

      // Teammate discovery should ONLY expose participants/builders (not Admin, Organizer, or Judges)
      const participantOnly = Array.from(userMap.values()).filter((u) => {
        const role = (u.role || '').toUpperCase()
        if (role === 'ADMIN' || role === 'ORGANIZER' || role === 'JUDGE') {
          return false
        }
        // Exclude current authenticated user
        const uid = u.user_id || u.id
        if (currentUserId && uid === currentUserId) return false
        if (currentEmail && u.email && u.email.toLowerCase() === currentEmail) return false
        return true
      })

      setUsers(participantOnly)
    } catch {
      setError('Unable to load teammate suggestions at this time.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [filters.preferred_role, filters.availability, filters.mode])

  // Debounced search on skills
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, 350)
    return () => clearTimeout(timer)
  }, [filters.skills])

  const activeTeamId = teamService.getActiveTeamId() || 1

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
      <PageHeader
        title="Discover Teammates"
        description="Find engineers and designers with complementary skills to join your team."
        badge={
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-emerald-400" /> Teammate Matches
          </span>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={isLoading}
            className="border-white/10 text-slate-300 hover:text-white hover:bg-surface-elevated text-xs font-semibold"
          >
            <RefreshCcw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Matches
          </Button>
        }
      />

      {/* Filter Component */}
      <DiscoveryFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({})}
      />

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers} className="border-rose-500/30 text-rose-200">
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 rounded-2xl bg-card animate-pulse border border-white/5" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && users.length === 0 && (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-white/10 bg-card/40">
          <div className="h-12 w-12 rounded-2xl bg-surface-elevated flex items-center justify-center mx-auto mb-3 text-slate-400 border border-white/5">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-base font-bold text-white">No hackers found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Try loosening your skill keyword filters or switching to all developer roles.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 text-xs font-semibold border-white/10 text-slate-200 hover:text-white"
            onClick={() => setFilters({})}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Users Grid */}
      {!isLoading && !error && users.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((discovered) => {
            const uid = discovered.user_id || discovered.id || 0
            const hasPending = invitedIds.includes(uid)
            return (
              <UserCard
                key={uid}
                user={discovered}
                hasPendingInvite={hasPending}
                onViewProfile={(u) => setSelectedUser(u)}
                onInvite={(u) => setInviteUser(u)}
              />
            )
          })}
        </div>
      )}

      {/* Profile inspection modal */}
      <ProfilePreviewModal
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onInvite={(u) => setInviteUser(u)}
      />

      {/* Invite modal */}
      <InviteTeammateDialog
        teamId={activeTeamId}
        user={inviteUser}
        open={!!inviteUser}
        onClose={() => setInviteUser(null)}
        onSuccess={() => {
          if (inviteUser) {
            const uid = inviteUser.user_id ?? inviteUser.id
            if (uid) setInvitedIds((prev) => [...prev, uid])
          }
        }}
      />
    </div>
  )
}
