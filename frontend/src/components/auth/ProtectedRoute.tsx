import { type ReactNode } from 'react'
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getRoleDefaultPath } from '@/lib/auth'
import { AuthLoadingScreen } from '@/components/auth/AuthLoadingScreen'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ProtectedRouteProps {
  children?: ReactNode
  allowedRoles?: string[]
}

/**
 * Route protection wrapper.
 * - Redirects unauthenticated users to /login preserving the requested path in state
 * - Displays an Access Denied state if the user role is not authorized for the route
 * - Defers rendering until auth state is initialized
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, initialized, user } = useAuthStore()
  const location = useLocation()

  if (!initialized) {
    return <AuthLoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If role restrictions apply, check user.role
  if (allowedRoles && allowedRoles.length > 0 && user) {
    const userRole = (user.role || '').toUpperCase()
    const isAllowed = allowedRoles.map((r) => r.toUpperCase()).includes(userRole)

    if (!isAllowed) {
      const defaultDashboard = getRoleDefaultPath(user.role)
      return (
        <div className="min-h-[calc(100vh-var(--navbar-height))] flex items-center justify-center p-6">
          <Card className="max-w-md w-full border-border/80 shadow-md animate-fade-in text-center">
            <CardHeader className="flex flex-col items-center gap-2 pb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-2">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Access Restricted</CardTitle>
              <CardDescription>
                This area is intended for{' '}
                <span className="font-semibold text-foreground">
                  {allowedRoles.join(' or ')}
                </span>{' '}
                roles. Your account is assigned the{' '}
                <span className="font-semibold text-foreground capitalize">
                  {user.role.toLowerCase()}
                </span>{' '}
                role.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link to={defaultDashboard}>
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Return to your dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
