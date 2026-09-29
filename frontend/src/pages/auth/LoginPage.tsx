import { useState, type FormEvent } from 'react'
import { ArrowRight, Loader2, AlertCircle, Shield } from 'lucide-react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/store/authStore'
import { getRoleDefaultPath } from '@/lib/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const { login, isAuthenticated, user, initialized } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already authenticated and initialized
  if (initialized && isAuthenticated && user) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname
    return <Navigate to={from || getRoleDefaultPath(user.role)} replace />
  }

  const validate = (): string | null => {
    if (!email.trim()) {
      return 'Email address is required.'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.'
    }
    if (!password) {
      return 'Password is required.'
    }
    return null
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)

    const clientError = validate()
    if (clientError) {
      setFormError(clientError)
      return
    }

    setIsSubmitting(true)
    try {
      const loggedUser = await login({
        email: email.trim(),
        password,
      })
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname
      const destination = from || getRoleDefaultPath(loggedUser.role)
      navigate(destination, { replace: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message)
      } else {
        setFormError('Failed to sign in. Please verify your credentials.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('password123')
    setFormError(null)
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-12 bg-dot-pattern">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Brand Lockup */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <img
            src="/assets/dogfood-logo.svg"
            alt="DogFood"
            className="logo-img-lg mb-1"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Sign In to DogFood
          </h1>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            Access your developer workspace, squad collaboration rooms, and hackathon judging consoles.
          </p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-2xl border-white/10 rounded-2xl bg-card/95">
          <CardHeader className="pb-4 border-b border-white/5">
            <CardTitle className="text-base font-bold text-white">Credentials</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Enter your registered email and password.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            {formError && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-200">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="participant1@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (formError) setFormError(null)
                  }}
                  disabled={isSubmitting}
                  required
                  className="rounded-xl font-medium bg-surface-elevated/70 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-slate-200">
                    Password
                  </Label>
                  <span className="text-[11px] font-mono text-slate-400 select-none">
                    Default: password123
                  </span>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (formError) setFormError(null)
                  }}
                  disabled={isSubmitting}
                  required
                  className="rounded-xl font-medium bg-surface-elevated/70 border-white/10 text-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full text-xs font-bold shadow-md rounded-xl h-10 bg-primary hover:bg-primary-hover text-white border border-primary/30 glow-brand"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Workspace
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </>
                )}
              </Button>
            </form>

            {/* Documented Test Accounts (Accurate Seeding) */}
            <div className="mt-5 p-3.5 rounded-xl bg-surface-elevated/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  Test Accounts
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">Click to fill</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleFillDemo('participant1@example.com')}
                  className="text-left p-2 rounded-lg border border-white/10 hover:border-primary/40 bg-card text-[10px] font-medium text-slate-300 hover:text-white transition-all truncate"
                >
                  <div className="font-bold text-white font-mono">Participant</div>
                  <div className="text-slate-400 font-mono truncate">participant1@example.com</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('judge1@example.com')}
                  className="text-left p-2 rounded-lg border border-white/10 hover:border-amber-500/40 bg-card text-[10px] font-medium text-slate-300 hover:text-white transition-all truncate"
                >
                  <div className="font-bold text-amber-300 font-mono">Judge</div>
                  <div className="text-slate-400 font-mono truncate">judge1@example.com</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('organizer@example.com')}
                  className="text-left p-2 rounded-lg border border-white/10 hover:border-emerald-500/40 bg-card text-[10px] font-medium text-slate-300 hover:text-white transition-all truncate"
                >
                  <div className="font-bold text-emerald-300 font-mono">Organizer</div>
                  <div className="text-slate-400 font-mono truncate">organizer@example.com</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin@example.com')}
                  className="text-left p-2 rounded-lg border border-white/10 hover:border-rose-500/40 bg-card text-[10px] font-medium text-slate-300 hover:text-white transition-all truncate"
                >
                  <div className="font-bold text-rose-300 font-mono">Admin</div>
                  <div className="text-slate-400 font-mono truncate">admin@example.com</div>
                </button>
              </div>
            </div>

            <Separator className="my-5 bg-white/10" />

            <p className="text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-bold text-primary hover:text-primary-hover hover:underline">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
