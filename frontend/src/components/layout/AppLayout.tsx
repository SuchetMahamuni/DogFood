import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/navigation/Navbar'
import { Sidebar } from '@/components/navigation/Sidebar'
import { MobileNav } from '@/components/navigation/MobileNav'
import { useAuthStore } from '@/store/authStore'
import { roleNavMap } from '@/lib/navigation'
import type { AppUser, UserRole } from '@/types/navigation'
import type { User } from '@/types/auth'

interface AppLayoutProps {
  user?: AppUser | User
  onLogout?: () => void
}

/**
 * Authenticated application shell — dark developer workspace dashboard.
 *
 * Desktop: fixed Navbar (top 64px, h-16) + fixed Sidebar (left 256px, w-64) + scrollable main content.
 * Mobile:  fixed Navbar + slide-out drawer (MobileNav) + full-width main content.
 * Solves top clipping structurally with guaranteed pt-16 and md:pl-64 layout offsets.
 */
export function AppLayout({ user: propUser, onLogout }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const navigate = useNavigate()
  const { user: storeUser, logout } = useAuthStore()

  const activeUser = propUser ?? storeUser

  const handleLogout = async () => {
    if (onLogout) {
      onLogout()
    } else {
      await logout()
      navigate('/login')
    }
  }

  // Derive role safely from user with fallback to PARTICIPANT
  const rawRole = (activeUser?.role || 'PARTICIPANT').toUpperCase()
  const role: UserRole = rawRole in roleNavMap ? (rawRole as UserRole) : 'PARTICIPANT'

  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col relative selection:bg-primary/30">
      {/* Ambient background grid pattern */}
      <div className="fixed inset-0 pointer-events-none bg-grid-pattern opacity-40 z-0" />

      {/* Top navigation bar */}
      <Navbar
        isAuthenticated
        user={activeUser ?? undefined}
        onMobileNavToggle={() => setMobileNavOpen(true)}
        onLogout={handleLogout}
      />

      {/* Desktop sidebar */}
      <Sidebar role={role} />

      {/* Mobile nav drawer */}
      <MobileNav
        role={role}
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main content area — strictly offset below fixed header (pt-16) and right of fixed sidebar (md:pl-64) */}
      <main
        className="relative z-10 pt-16 md:pl-64 flex-1 min-h-dvh flex flex-col overflow-x-hidden"
        id="main-content"
      >
        <div className="flex-1 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
