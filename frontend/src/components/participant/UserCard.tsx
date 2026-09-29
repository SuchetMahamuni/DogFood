import { Sparkles, UserPlus, Eye, Briefcase, Clock } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { DiscoveredUser } from '@/types/participant'
import { getInitials } from '@/lib/auth'

interface UserCardProps {
  user: DiscoveredUser
  onViewProfile: (user: DiscoveredUser) => void
  onInvite: (user: DiscoveredUser) => void
  hasPendingInvite?: boolean
}

export function UserCard({ user, onViewProfile, onInvite, hasPendingInvite }: UserCardProps) {
  const name = user.display_name || user.name || 'Developer'
  const initials = getInitials(name)
  const skillsList = user.skills ? user.skills.split(',').map((s) => s.trim()).filter(Boolean) : []

  return (
    <Card 
      className="card-lift flex flex-col h-full bg-card/90 border-white/10 hover:border-primary/40 hover:shadow-[0_0_24px_rgba(99,102,241,0.2)] transition-all duration-200 cursor-pointer"
      onClick={() => onViewProfile(user)}
    >
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-white/15 bg-surface-elevated">
              {user.profile_picture_url && <AvatarImage src={user.profile_picture_url} alt={name} />}
              <AvatarFallback className="font-bold bg-primary/20 text-white text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">{name}</h4>
              {user.preferred_role && (
                <p className="text-xs font-mono font-medium text-primary-light mt-0.5">{user.preferred_role}</p>
              )}
            </div>
          </div>

          {user.match_score !== undefined && user.match_score > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="h-3 w-3" />
              {user.match_score} pts
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pb-4">
        {user.bio ? (
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{user.bio}</p>
        ) : (
          <p className="text-xs text-slate-400 italic">Ready to collaborate on hackathon deliverables.</p>
        )}

        {/* Skills */}
        {skillsList.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skillsList.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-surface-elevated text-slate-200 border border-white/10"
              >
                {skill}
              </span>
            ))}
            {skillsList.length > 4 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400 bg-surface-elevated/50 border border-white/5 font-mono">
                +{skillsList.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Availability & Experience */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
          {user.experience && (
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3 text-slate-400" />
              <span className="text-slate-300">{user.experience}</span>
            </span>
          )}
          {user.availability && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-400" />
              <span className="text-slate-300">{user.availability}</span>
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-white/10 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs h-8 border-white/10 text-slate-300 hover:text-white hover:bg-surface-elevated"
          onClick={(e) => {
            e.stopPropagation()
            onViewProfile(user)
          }}
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          Profile
        </Button>

        <Button
          size="sm"
          className="flex-1 text-xs h-8 font-semibold bg-primary hover:bg-primary-hover text-white shadow-xs"
          disabled={hasPendingInvite}
          onClick={(e) => {
            e.stopPropagation()
            onInvite(user)
          }}
        >
          <UserPlus className="h-3.5 w-3.5 mr-1" />
          {hasPendingInvite ? 'Invited' : 'Connect'}
        </Button>
      </CardFooter>
    </Card>
  )
}
