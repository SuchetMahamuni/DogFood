import { LogOut, User as UserIcon, Shield, Laptop, Moon, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useThemeStore } from '@/store/themeStore'
import type { AppUser } from '@/types/navigation'
import type { User } from '@/types/auth'
import { getInitials } from '@/lib/auth'

interface UserMenuProps {
  user: User | AppUser
  onLogout?: () => void
}

/**
 * Avatar-triggered dropdown with user info, settings link, mode toggle, and logout.
 */
export function UserMenu({ user, onLogout }: UserMenuProps) {
  const { mode, toggleMode } = useThemeStore()
  const isDark = mode === 'dark'

  const avatarUrl =
    'avatarUrl' in user && user.avatarUrl
      ? user.avatarUrl
      : 'profile' in user && user.profile?.profile_picture_url
        ? user.profile.profile_picture_url
        : undefined
  const initials = 'initials' in user && user.initials ? user.initials : getInitials(user.name)

  const roleBadgeStyle =
    user.role === 'JUDGE'
      ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
      : user.role === 'ORGANIZER'
        ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
        : user.role === 'ADMIN'
          ? 'bg-rose-500/15 text-rose-500 border-rose-500/30'
          : 'bg-primary/15 text-primary border-primary/30'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary p-0.5 border border-border hover:border-slate-500 transition-colors"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8 bg-surface-elevated text-foreground border border-border">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={user.name} />}
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 bg-card border-border shadow-xl">
        {/* User info header */}
        <div className="px-3 py-2.5">
          <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border uppercase tracking-wider ${roleBadgeStyle}`}>
              {user.role}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem asChild className="focus:bg-surface-elevated focus:text-foreground cursor-pointer">
          <Link to="/profile" className="flex items-center gap-2.5 w-full text-xs text-foreground/80 hover:text-foreground">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            Profile & Developer Settings
          </Link>
        </DropdownMenuItem>

        {user.role === 'PARTICIPANT' && (
          <DropdownMenuItem asChild className="focus:bg-surface-elevated focus:text-foreground cursor-pointer">
            <Link to="/project" className="flex items-center gap-2.5 w-full text-xs text-foreground/80 hover:text-foreground">
              <Laptop className="h-4 w-4 text-muted-foreground" />
              Active Project Workspace
            </Link>
          </DropdownMenuItem>
        )}

        {(user.role === 'ORGANIZER' || user.role === 'ADMIN') && (
          <DropdownMenuItem asChild className="focus:bg-surface-elevated focus:text-foreground cursor-pointer">
            <Link to="/organizer" className="flex items-center gap-2.5 w-full text-xs text-foreground/80 hover:text-foreground">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Organizer Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-border" />

        {/* Quick appearance switch */}
        <DropdownMenuItem
          onClick={toggleMode}
          className="focus:bg-surface-elevated focus:text-foreground cursor-pointer text-xs flex items-center justify-between"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="flex items-center gap-2.5 text-foreground/80">
            {isDark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-primary" />}
            <span>Appearance: {isDark ? 'Light' : 'Dark'}</span>
          </span>
          <span className="font-mono text-[10px] uppercase text-muted-foreground px-1.5 py-0.5 rounded bg-surface-subtle border border-border">
            {isDark ? 'Dark' : 'Light'}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          variant="destructive"
          onClick={onLogout}
          className="focus:bg-rose-500/20 focus:text-rose-400 cursor-pointer text-xs"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
