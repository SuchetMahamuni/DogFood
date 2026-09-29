import { useState } from 'react'
import { UserPlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { DiscoveredUser } from '@/types/participant'
import teamService from '@/services/teamService'
import { getApiErrorMessage } from '@/services/apiClient'

interface InviteTeammateDialogProps {
  teamId: number
  user: DiscoveredUser | null
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function InviteTeammateDialog({ teamId, user, open, onClose, onSuccess }: InviteTeammateDialogProps) {
  const [inviteeId, setInviteeId] = useState<string>(user?.user_id?.toString() || user?.id?.toString() || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    const targetId = parseInt(inviteeId, 10)
    if (isNaN(targetId) || targetId <= 0) {
      setError('Please provide a valid participant user ID.')
      return
    }

    setIsLoading(true)
    try {
      await teamService.inviteMember(teamId, targetId)
      setSuccessMsg(`Invitation successfully dispatched to user #${targetId}!`)
      if (onSuccess) onSuccess()
      setTimeout(() => {
        onClose()
        setSuccessMsg(null)
      }, 1500)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to send team invitation.'))
    } finally {
      setIsLoading(false)
    }
  }

  const name = user?.display_name || user?.name || `User #${inviteeId}`

  return (
    <Dialog open={open} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
            <UserPlus className="h-5 w-5" />
          </div>
          <DialogTitle>Invite to Team</DialogTitle>
          <DialogDescription>
            Send an invitation to join your hackathon team. They will receive it in their pending invites.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-3 text-xs text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="inviteeId">Participant ID</Label>
            <Input
              id="inviteeId"
              type="number"
              placeholder="e.g. 5"
              value={inviteeId}
              onChange={(e) => setInviteeId(e.target.value)}
              disabled={isLoading || !!user}
              required
            />
            {user && (
              <p className="text-[11px] text-muted-foreground">
                Inviting <span className="font-semibold text-foreground">{name}</span>
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  Sending...
                </>
              ) : (
                'Send Invitation'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
