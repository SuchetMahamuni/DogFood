import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { Navbar } from '@/components/navigation/Navbar'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuthStore } from '@/store/authStore'
import { getRoleDefaultPath } from '@/lib/auth'

/**
 * Public layout — adapts intelligently to authenticated status.
 * 
 * If the user is logged in:
 * - If they visit /login or /register, redirect to their role-appropriate dashboard.
 * - If they visit public content pages (/events, /projects, /results), render inside AppLayout
 *   so they retain the full authenticated workspace, active sidebar, and role context!
 * - If they visit / (landing page), render public landing with authenticated navbar (user menu + quick access).
 * 
 * If unauthenticated:
 * - Top Navbar with public links + Sign in / Get Started.
 * - Strict pt-16 offset to prevent any clipping under the fixed header.
 */
export function PublicLayout() {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  // If already authenticated and visiting login/register, redirect to dashboard
  if (isAuthenticated && user && isAuthPage) {
    return <Navigate to={getRoleDefaultPath(user.role)} replace />
  }

  // If authenticated and visiting content pages (e.g. /events, /projects, /results),
  // render inside the full workspace shell!
  if (isAuthenticated && user && !isAuthPage && location.pathname !== '/') {
    return <AppLayout />
  }

  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col relative selection:bg-primary/30">
      {/* Top Navbar */}
      <Navbar isAuthenticated={isAuthenticated} user={user ?? undefined} />

      {/* Main content strictly offset below 64px header */}
      <main className="flex-1 pt-16 overflow-x-hidden" id="main-content">
        <Outlet />
      </main>
    </div>
  )
}
