import {
  ArrowRight,
  Users,
  CheckCircle2,
  Scale,
  GitBranch,
  Compass,
  Code2,
  Terminal,
  Trophy,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { getRoleDefaultPath } from '@/lib/auth'

const workflowSteps = [
  {
    step: '01',
    title: 'DISCOVER',
    subtitle: 'Find Teammates',
    description: 'Filter developers and engineers by skills, preferred roles, and availability. Direct squad invitations with instant status sync.',
    icon: Compass,
    accent: 'text-cyan-500',
    border: 'border-cyan-500/30',
  },
  {
    step: '02',
    title: 'BUILD',
    subtitle: 'Engineer Deliverables',
    description: 'Configure your project architecture, track selection, and tech stack in a dedicated developer workspace.',
    icon: Code2,
    accent: 'text-primary',
    border: 'border-primary/30',
  },
  {
    step: '03',
    title: 'SUBMIT',
    subtitle: 'Verify Release Checklist',
    description: 'Automated readiness checks verify repository links, deployment URLs, and demo videos before locking in your official submission.',
    icon: GitBranch,
    accent: 'text-emerald-500',
    border: 'border-emerald-500/30',
  },
  {
    step: '04',
    title: 'JUDGE',
    subtitle: 'Conflict-Free Scoring',
    description: 'Multi-criteria weighted rubrics with automated conflict-of-interest detection prevent evaluators from scoring affiliated squads.',
    icon: Scale,
    accent: 'text-amber-500',
    border: 'border-amber-500/30',
  },
  {
    step: '05',
    title: 'RESULTS',
    subtitle: 'Publish Standings',
    description: 'Statistically normalized rankings eliminate evaluator variance and generate transparent podium standings and project archives.',
    icon: Trophy,
    accent: 'text-primary',
    border: 'border-primary/30',
  },
]

export default function LandingPage() {
  const { isAuthenticated, user } = useAuthStore()
  const dashboardTarget = isAuthenticated && user ? getRoleDefaultPath(user.role) : '/dashboard'

  return (
    <div className="flex flex-col text-foreground min-h-dvh bg-background">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-border bg-dot-pattern">
        {/* Hero ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 blur-3xl pointer-events-none -z-10" style={{background: 'radial-gradient(ellipse at top, var(--hero-glow-color), transparent 70%)'}} />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8 animate-fade-in">
          {/* Announcement pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-surface-elevated/80 shadow-xs text-xs font-mono text-muted-foreground backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-foreground">DOGFOOD</span>
            <span className="text-muted-foreground">•</span>
            <span>The hackathon platform for builders, teams, judges, and organizers.</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              Discover teammates. Build together.{' '}
              <span className="brand-gradient-text-vivid">
                Submit with confidence.
              </span>{' '}
              <span className="text-foreground/90 font-bold block text-2xl sm:text-4xl mt-2">
                Judge fairly. See the results.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
              DogFood brings developers, organizers, and judges into one unified workspace: team matching, project deliverables, fair criteria scoring, and real-time standings.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            {isAuthenticated ? (
              <Button size="lg" className="h-11 px-7 shadow-lg font-bold bg-primary hover:bg-primary-hover text-white border border-primary/40 glow-brand" asChild>
                <Link to={dashboardTarget}>
                  Open Workspace
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="h-11 px-7 shadow-lg font-bold bg-primary hover:bg-primary-hover text-white border border-primary/40 glow-brand" asChild>
                  <Link to="/register">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-11 px-6 bg-surface-elevated/70 border-border text-foreground hover:bg-surface-elevated shadow-xs font-semibold" asChild>
                  <Link to="/events">Explore Hackathons</Link>
                </Button>
              </>
            )}
          </div>

          {/* Trust badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Multi-Criteria Weighted Rubrics
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Automated Conflict Safeguards
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Z-Score Normalization
            </span>
          </div>

          {/* ── Product UI Preview Mockup ──────────────────────────────────── */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden text-left">
              {/* Terminal Window Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-subtle">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    dogfood.internal/events/1/console
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    LIVE HACKATHON
                  </span>
                </div>
              </div>

              {/* Preview Content Grid */}
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-base">
                {/* Panel 1: Active Event */}
                <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold text-muted-foreground uppercase">Hackathon Status</span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">DogFood Global Hackathon</h4>
                  <p className="text-xs text-muted-foreground">Track: Developer Tools &amp; Infrastructure</p>
                  <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border font-mono">
                    <span>Judging:</span>
                    <span className="text-primary font-bold">In 2 Days</span>
                  </div>
                </div>

                {/* Panel 2: Project Submission */}
                <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold text-muted-foreground uppercase">Project Submission</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-bold">
                      Submitted
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground truncate">Synthetix AI Copilot</h4>
                  <p className="text-xs text-muted-foreground truncate">GitHub + Demo + Walkthrough</p>
                  <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border font-mono">
                    <span>Readiness:</span>
                    <span className="text-emerald-500 font-bold">100% Verified</span>
                  </div>
                </div>

                {/* Panel 3: Rubric & Score */}
                <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold text-muted-foreground uppercase">Judging Criteria</span>
                    <span className="text-[11px] font-mono text-cyan-500 font-bold">4 Criteria</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">Technical Architecture</h4>
                  <p className="text-xs text-muted-foreground">Multi-criteria weighted scoring</p>
                  <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border font-mono">
                    <span>Panel:</span>
                    <span className="text-cyan-500 font-bold">Designated Judges</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Visual Workflow Story (Discover -> Build -> Submit -> Judge -> Results) ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold tracking-wider text-primary uppercase">
            The Product Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            From Team Assembly to Official Results
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Every step in the competition lifecycle is supported with dedicated interfaces and operational safeguards.
          </p>
        </div>

        {/* Connected Signature Flow Strip */}
        <div className="hidden md:flex items-center justify-between max-w-4xl mx-auto px-6 py-3 rounded-2xl border border-border font-mono text-xs text-muted-foreground bg-surface-subtle">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="font-bold text-cyan-500">DISCOVER</span>
          </div>
          <div className="h-0.5 w-10 bg-gradient-to-r from-cyan-400 to-primary rounded-full" />
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
            <span className="font-bold text-primary">BUILD</span>
          </div>
          <div className="h-0.5 w-10 bg-gradient-to-r from-primary to-emerald-400 rounded-full" />
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-bold text-emerald-500">SUBMIT</span>
          </div>
          <div className="h-0.5 w-10 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full" />
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <span className="font-bold text-amber-500">JUDGE</span>
          </div>
          <div className="h-0.5 w-10 bg-gradient-to-r from-amber-400 to-violet-400 rounded-full" />
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
            <span className="font-bold text-primary">RESULTS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {workflowSteps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.step}
                className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between card-lift space-y-3 shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-muted-foreground">{step.step}</span>
                    <Icon className={`h-4 w-4 ${step.accent}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground tracking-wide">{step.title}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{step.subtitle}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Role Workspaces Overview ─────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-y border-border bg-surface-subtle/50">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Three Dedicated Workspaces in One Unified Platform
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Every persona gets tailored, distraction-free tooling designed specifically for their role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Participant */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-primary/15 text-primary border border-primary/30">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Participants</h3>
                    <p className="text-xs text-muted-foreground font-mono">Engineers &amp; Builders</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Discover peers by technical skills, manage team invitations, track project deliverables, and access curated development playbooks.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground pt-3 border-t border-border font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Talent discovery terminal
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Release readiness checklist
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  GitHub &amp; Demo integration
                </li>
              </ul>
            </div>

            {/* Judge */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Judges</h3>
                    <p className="text-xs text-muted-foreground font-mono">Evaluators &amp; Mentors</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dedicated evaluation console with multi-criteria rubric sliders, weighted scoring formulas, and conflict-of-interest safeguards.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground pt-3 border-t border-border font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Evaluation queue &amp; assignments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Weighted rubric scoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Conflict detection guardrails
                </li>
              </ul>
            </div>

            {/* Organizer */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-500 border border-cyan-500/30">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Organizers</h3>
                    <p className="text-xs text-muted-foreground font-mono">Mission Control</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Real-time command center for participant tracking, judge assignments, multi-track rubric configurations, and live event progression.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground pt-3 border-t border-border font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Hackathon analytics &amp; reporting
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Automated judge balancing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Normalized standings publisher
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-10 px-4 sm:px-6 lg:px-8 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-foreground font-mono text-sm">DogFood</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated text-muted-foreground border border-border">
              PLATFORM
            </span>
          </div>
          <p>© 2026 DogFood. Built for developers, organizers, and evaluators.</p>
        </div>
      </footer>
    </div>
  )
}
