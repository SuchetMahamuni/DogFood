import { Sparkles, UserPlus, Briefcase, Clock, Code, Heart, FolderGit2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { DiscoveredUser } from '@/types/participant'
import { getInitials } from '@/lib/auth'

interface ProfilePreviewModalProps {
  user: DiscoveredUser | null
  open: boolean
  onClose: () => void
  onInvite?: (user: DiscoveredUser) => void
}

export function ProfilePreviewModal({ user, open, onClose, onInvite }: ProfilePreviewModalProps) {
  if (!user) return null

  const name = user.display_name || user.name || 'Anonymous Hacker'
  const initials = getInitials(name)
  const skillsList = user.skills ? user.skills.split(',').map((s) => s.trim()).filter(Boolean) : []
  const interestsList = user.interests ? user.interests.split(',').map((s) => s.trim()).filter(Boolean) : []

  return (
    <Dialog open={open} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2 border-b border-border">
          <div className="flex items-start gap-3">
            <Avatar className="h-14 w-14 border border-border">
              {user.profile_picture_url && <AvatarImage src={user.profile_picture_url} alt={name} />}
              <AvatarFallback className="text-base font-bold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-lg font-bold text-foreground">{name}</DialogTitle>
              {user.preferred_role && (
                <p className="text-xs font-semibold text-primary mt-0.5">{user.preferred_role}</p>
              )}
              {user.match_score !== undefined && (
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Sparkles className="h-3.5 w-3.5" />
                  Compatibility score: {user.match_score} pts
                </div>
              )}
            </div>
          </div>
          <DialogDescription className="sr-only">Profile details for {name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Bio */}
          {user.bio && (
            <div>
              <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-1">About</p>
              <p className="text-foreground leading-relaxed bg-muted/30 p-2.5 rounded-lg border border-border/40">
                {user.bio}
              </p>
            </div>
          )}

          {/* Experience & Availability */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-card border border-border/60">
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Briefcase className="h-3 w-3" />
                <span className="font-medium text-[10px] uppercase tracking-wider">Experience</span>
              </div>
              <p className="font-semibold text-foreground">{user.experience || 'Not specified'}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-card border border-border/60">
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Clock className="h-3 w-3" />
                <span className="font-medium text-[10px] uppercase tracking-wider">Availability</span>
              </div>
              <p className="font-semibold text-foreground">{user.availability || 'Flexible'}</p>
            </div>
          </div>

          {/* Skills */}
          {skillsList.length > 0 && (
            <div>
              <div className="flex items-center gap-1 font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-1.5">
                <Code className="h-3 w-3" />
                Skills & Technologies
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md font-medium text-xs bg-accent text-accent-foreground border border-border/40"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {interestsList.length > 0 && (
            <div>
              <div className="flex items-center gap-1 font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-1.5">
                <Heart className="h-3 w-3" />
                Interests & Domains
              </div>
              <div className="flex flex-wrap gap-1.5">
                {interestsList.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md font-medium text-xs bg-muted text-foreground border border-border/40"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Previous Projects */}
          {user.previous_projects && (
            <div>
              <div className="flex items-center gap-1 font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-1">
                <FolderGit2 className="h-3 w-3" />
                Previous Projects
              </div>
              <p className="text-muted-foreground leading-relaxed p-2.5 rounded-lg bg-muted/20 border border-border/40">
                {user.previous_projects}
              </p>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          {onInvite && (
            <Button
              size="sm"
              onClick={() => {
                onInvite(user)
                onClose()
              }}
            >
              <UserPlus className="h-3.5 w-3.5 mr-1" />
              Invite to Team
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
