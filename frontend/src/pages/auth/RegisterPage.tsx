import { useState, type FormEvent } from 'react'
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/store/authStore'
import { getRoleDefaultPath } from '@/lib/auth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated, user, initialized } = useAuthStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already authenticated and initialized
  if (initialized && isAuthenticated && user) {
    return <Navigate to={getRoleDefaultPath(user.role)} replace />
  }

  const validate = (): string | null => {
    if (!name.trim()) {
      return 'Full name is required.'
    }
    if (name.trim().length > 100) {
      return 'Name must be 100 characters or fewer.'
    }
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
    if (password.length < 6) {
      return 'Password must be at least 6 characters.'
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
      const newUser = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      })
      navigate(getRoleDefaultPath(newUser.role), { replace: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message)
      } else {
        setFormError('Failed to create account. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
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
            Create Developer Account
          </h1>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            Join the DogFood hackathon platform, assemble engineering squads, and compete for category prizes.
          </p>
        </div>

        {/* Card */}
        <Card className="shadow-2xl border-white/10 rounded-2xl bg-card/95">
          <CardHeader className="pb-4 border-b border-white/5">
            <CardTitle className="text-base font-bold text-white">Profile Setup</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Provide your developer credentials to initialize your account.
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
                <Label htmlFor="name" className="text-xs font-semibold text-slate-200">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (formError) setFormError(null)
                  }}
                  disabled={isSubmitting}
                  required
                  className="rounded-xl font-medium bg-surface-elevated/70 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-200">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="developer@example.com"
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
                    Min. 6 chars
                  </span>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Initialize Account
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </>
                )}
              </Button>
            </form>

            <Separator className="my-5 bg-white/10" />

            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary hover:text-primary-hover hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
