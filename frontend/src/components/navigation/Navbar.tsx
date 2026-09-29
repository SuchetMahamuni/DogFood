import { Menu, LayoutDashboard, Compass, Trophy } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/navigation/UserMenu'
import { ThemeModeToggle } from '@/components/navigation/ThemeModeToggle'
import { publicNavItems } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import type { AppUser } from '@/types/navigation'
import type { User } from '@/types/auth'
import { useAuthStore } from '@/store/authStore'
import { getRoleDefaultPath } from '@/lib/auth'

interface NavbarProps {
  /** When provided, overrides the auth store state */
  isAuthenticated?: boolean
  user?: AppUser | User
  /** Mobile: open sidebar drawer */
  onMobileNavToggle?: () => void
  onLogout?: () => void
}

/**
 * Top navigation bar — sticky, glass-morphic dashboard with theme & appearance controls.
 * Strictly 64px (h-16) to align with layout offsets.
 */
export function Navbar({
  isAuthenticated: propIsAuthenticated,
  user: propUser,
  onMobileNavToggle,
  onLogout,
}: NavbarProps) {
  const navigate = useNavigate()
  const { isAuthenticated: storeIsAuth, user: storeUser, logout } = useAuthStore()

  const isAuthenticated = propIsAuthenticated ?? storeIsAuth
  const user = propUser ?? (storeUser ?? undefined)

  const handleLogout = async () => {
    if (onLogout) {
      onLogout()
    } else {
      await logout()
      navigate('/login')
    }
  }

  const role = user?.role || 'PARTICIPANT'
  const logoTarget = isAuthenticated && user ? getRoleDefaultPath(user.role) : '/'

  const roleBadgeStyle =
    role === 'JUDGE'
      ? 'border-amber-500/30 bg-amber-500/10 text-amber-500'
      : role === 'ORGANIZER'
        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
        : role === 'ADMIN'
          ? 'border-rose-500/30 bg-rose-500/10 text-rose-500'
          : 'border-primary/30 bg-primary/10 text-primary'

  return (
    <header
      className="fixed top-0 inset-x-0 z-40 h-16 glass border-b border-border"
      style={{ backgroundColor: 'color-mix(in srgb, var(--color-background) 90%, transparent)' }}
    >
      <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

        {/* ── Left: Logo & Wordmark ────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <Link
            to={logoTarget}
            className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg group"
            aria-label="DogFood Home"
          >
            <img
              src="/assets/dogfood-logo.svg"
              alt="DogFood"
              className="logo-img group-hover:scale-105 transition-transform"
              onError={(e) => {
                // Fallback: show text if image fails to load
                const el = e.currentTarget as HTMLImageElement
                el.style.display = 'none'
              }}
            />
            <span className="text-lg font-bold tracking-tight text-foreground font-mono">
              DogFood
            </span>
          </Link>
        </div>

        {/* ── Center: Contextual Navigation ───────────────────────────────── */}
        {!isAuthenticated ? (
          <nav
            className="hidden md:flex items-center gap-1 bg-surface-elevated/70 p-1 rounded-full border border-border/80"
            aria-label="Public navigation"
          >
            {publicNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.exact}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'text-primary bg-primary/15 border border-primary/40 shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : (
          <div className="hidden lg:flex items-center gap-1.5 bg-surface-elevated/50 p-1 rounded-full border border-border/70 text-xs">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-colors',
                  isActive ? 'bg-primary/20 text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Workspace
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-colors',
                  isActive ? 'bg-primary/20 text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              <Compass className="h-3.5 w-3.5" />
              Hackathons
            </NavLink>
            <NavLink
              to="/results"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-colors',
                  isActive ? 'bg-primary/20 text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              <Trophy className="h-3.5 w-3.5" />
              Leaderboard
            </NavLink>
          </div>
        )}

        {/* ── Right: Appearance Toggle & Auth / User Controls ────────────── */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Global Light / Dark Mode Appearance Control */}
          <ThemeModeToggle />

          {isAuthenticated ? (
            <>
              {/* Role Indicator Beacon */}
              <div className="hidden sm:flex items-center gap-1.5">
                <span className={cn('text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider', roleBadgeStyle)}>
                  {role}
                </span>
              </div>

              {/* Hamburger Toggle (Mobile) */}
              <button
                className={cn(
                  'md:hidden flex items-center justify-center h-8 w-8 rounded-lg',
                  'text-muted-foreground hover:text-foreground hover:bg-surface-elevated',
                  'transition-colors border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                )}
                onClick={onMobileNavToggle}
                aria-label="Open mobile navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* User Avatar Menu */}
              {user && (
                <div className="flex items-center">
                  <UserMenu user={user} onLogout={handleLogout} />
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-2.5">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground hover:bg-surface-elevated text-xs font-semibold"
              >
                <Link to="/login">Sign in</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm border border-primary/40 glow-brand"
              >
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
