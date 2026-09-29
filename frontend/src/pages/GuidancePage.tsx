import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Compass,
  Code2,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Play,
  Video,
  Bot,
  Terminal,
  Server,
  Layout,
  MessageSquare,
  Lightbulb,
  CheckSquare,
  Cpu,
  HelpCircle,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type GuidanceView = 'HUB' | 'MENTORS' | 'STEP_BY_STEP' | 'VIDEOS'

// ─── Mentors Definition ───────────────────────────────────────────────────────
interface VirtualMentor {
  id: string
  name: string
  specialty: string
  icon: typeof Code2
  accent: string
  borderAccent: string
  bgAccent: string
  description: string
  areasOfHelp: string[]
  advice: string[]
  checklist: string[]
}

const VIRTUAL_MENTORS: VirtualMentor[] = [
  {
    id: 'frontend',
    name: 'Frontend Mentor',
    specialty: 'React, Component Hierarchy & UI State',
    icon: Layout,
    accent: 'text-cyan-400',
    borderAccent: 'border-cyan-500/30 hover:border-cyan-500/60',
    bgAccent: 'bg-cyan-500/10',
    description:
      'Master responsive layouts, clean component decomposition, predictable React state, and accessible developer interfaces.',
    areasOfHelp: [
      'React architecture',
      'Component structure',
      'Responsive UI',
      'State management',
      'Frontend debugging',
      'UX implementation',
    ],
    advice: [
      'Decompose complex dashboards into self-contained sub-components with typed props.',
      'Prefer derived state over duplicate useState hooks to prevent race conditions.',
      'Ensure high contrast ratios for dark theme text readability across screens.',
    ],
    checklist: [
      'All interactive controls have distinct hover and active states',
      'No layout shifts or horizontal scrollbars at 390px mobile breakpoint',
      'Loading and empty states implemented for every data query',
    ],
  },
  {
    id: 'backend',
    name: 'Backend Mentor',
    specialty: 'Flask, REST APIs & Data Modeling',
    icon: Server,
    accent: 'text-primary',
    borderAccent: 'border-primary/30 hover:border-primary/60',
    bgAccent: 'bg-primary/10',
    description:
      'Construct robust REST endpoints, schema validation with Marshmallow, relational models, and secure JWT session handling.',
    areasOfHelp: [
      'Flask blueprint architecture',
      'REST APIs',
      'Database schemas',
      'Authentication & JWT',
      'Backend debugging',
      'Deployment configurations',
    ],
    advice: [
      'Always return standardized JSON responses with { success: boolean, data?: any, error?: { code, message } }.',
      'Enforce role-based access control decorators on mutating routes (@require_role).',
      'Use database transactions and try/except blocks to avoid orphan records during multi-table writes.',
    ],
    checklist: [
      'Every route validates payload structure before committing DB changes',
      'JWT tokens include clear expiry timestamps and subject identifiers',
      'All endpoints respond with appropriate HTTP status codes (200, 201, 400, 403, 404)',
    ],
  },
  {
    id: 'integration',
    name: 'Integration Mentor',
    specialty: 'Axios, CORS & Full-Stack Contracts',
    icon: Cpu,
    accent: 'text-emerald-400',
    borderAccent: 'border-emerald-500/30 hover:border-emerald-500/60',
    bgAccent: 'bg-emerald-500/10',
    description:
      'Seamlessly wire frontend Axios clients to backend services, handle asynchronous errors, and keep Zustand stores in sync.',
    areasOfHelp: [
      'Frontend/backend connection',
      'Axios interceptors',
      'CORS headers',
      'Authentication handshakes',
      'API contracts',
      'State integration',
    ],
    advice: [
      'Attach Authorization Bearer tokens via Axios request interceptors to keep API calls clean.',
      'Provide fallback responses or graceful empty states when background microservices are unreachable.',
      'Align TypeScript interface contracts strictly with backend serialization schemas.',
    ],
    checklist: [
      'CORS headers allow credentials and standard client origins in development',
      'Session expired (401) responses trigger automatic client logout/redirect',
      'Network failures show actionable user-facing messages rather than blank screens',
    ],
  },
  {
    id: 'architecture',
    name: 'System Architecture Mentor',
    specialty: 'Service Boundaries & Scalable Infra',
    icon: Terminal,
    accent: 'text-amber-400',
    borderAccent: 'border-amber-500/30 hover:border-amber-500/60',
    bgAccent: 'bg-amber-500/10',
    description:
      'Define clear architectural boundaries, containerize with Docker, design database relationships, and plan deployment topology.',
    areasOfHelp: [
      'System architecture',
      'Database architecture',
      'API architecture',
      'Service boundaries',
      'Docker & compose',
      'Infrastructure decisions',
    ],
    advice: [
      'Keep the MVP surface narrow but deep: solve one specific problem exceptionally well.',
      'Maintain an explicit architecture diagram in your repository README for judges to inspect.',
      'Isolate external third-party API dependencies behind adapter interfaces so mock tests remain deterministic.',
    ],
    checklist: [
      'Database schemas use foreign keys and index lookup columns appropriately',
      'Environment variables configure all ports, database URLs, and secret keys',
      'Container build passes cleanly without residual dev artifacts in production image',
    ],
  },
  {
    id: 'ux',
    name: 'UX Mentor',
    specialty: 'User Journeys, Ergonomics & Flow',
    icon: Bot,
    accent: 'text-primary-light',
    borderAccent: 'border-primary/30 hover:border-primary/60',
    bgAccent: 'bg-primary/10',
    description:
      'Eliminate friction from user journeys, establish visual hierarchy, clarify technical language, and design intuitive navigation.',
    areasOfHelp: [
      'User journeys',
      'Navigation pathways',
      'Screen hierarchy',
      'Onboarding clarity',
      'Usability heuristics',
      'Interaction design',
    ],
    advice: [
      'Follow the rule: Technical under the hood, simple on the surface. Avoid confusing system jargon.',
      'Ensure every detail page has an intuitive, contextual back link so the user never feels trapped.',
      'Use color purposefully: Emerald for success, Amber for warning, Indigo for brand action.',
    ],
    checklist: [
      'Navigation tabs highlight the current active route reliably',
      'Action buttons change state to reflect async progress (e.g., "Saving...")',
      'Typography hierarchy clearly distinguishes page headers, section labels, and body text',
    ],
  },
  {
    id: 'presentation',
    name: 'Presentation Mentor',
    specialty: 'Pitching, Storytelling & Demo Rehearsal',
    icon: MessageSquare,
    accent: 'text-rose-400',
    borderAccent: 'border-rose-500/30 hover:border-rose-500/60',
    bgAccent: 'bg-rose-500/10',
    description:
      'Craft a compelling 2-minute pitch, structure slide narratives, run flawless live demos, and defend technical decisions.',
    areasOfHelp: [
      'Pitch narrative',
      'Slide deck structure',
      'Storytelling hooks',
      'Technical explanation',
      'Demo flow & staging',
      'Problem/solution framing',
    ],
    advice: [
      'Hook the judges in the first 20 seconds: state the exact problem, who suffers from it, and your solution.',
      'Never open an unscripted live editor during a 2-minute pitch: show a rehearsed, reliable click-through demo.',
      'Anticipate judge questions on scalability, security, and edge-case handling before your presentation.',
    ],
    checklist: [
      '2-minute elevator pitch rehearsed with a timer at least 3 times',
      'Demo project pre-loaded with realistic sample data before judging begins',
      'Clear explanation of the team technical differentiator ready for Q&A',
    ],
  },
]

// ─── Step-by-Step Stages Definition ───────────────────────────────────────────
interface GuidanceStageContent {
  id: string
  stageNumber: string
  title: string
  subtitle: string
  focus: string[]
  checklist: string[]
  usefulTip: string
  engineeringAdvice: string
  hackathonAdvice: string
}

const GUIDANCE_STAGES: GuidanceStageContent[] = [
  {
    id: '01',
    stageNumber: '01',
    title: 'Ideation',
    subtitle: 'Define problem statement, target audience, and lock MVP scope',
    focus: [
      'Understand the root problem before writing code',
      'Identify target user persona and their primary friction point',
      'Define differentiated value proposition versus existing solutions',
      'Lock in MVP boundaries to prevent feature bloat during the sprint',
    ],
    checklist: [
      'Problem statement clearly articulated in one sentence',
      'Target user persona and workflow identified',
      'Primary differentiator established',
      'MVP scope locked: 2-3 core features maximum',
      'Success criteria defined for final submission',
    ],
    usefulTip: 'A simple project that works flawlessly will score higher than a massive project that is half-broken.',
    engineeringAdvice: 'Write user stories with explicit inputs and outputs before writing backend models.',
    hackathonAdvice: 'Spend no more than 3 hours on ideation. The clock is ticking—lock scope early and start building.',
  },
  {
    id: '02',
    stageNumber: '02',
    title: 'Team Formation',
    subtitle: 'Assemble complementary skills, assign roles, and align git workflows',
    focus: [
      'Identify required technical disciplines (Frontend, Backend, Design)',
      'Assign explicit ownership over each component and user flow',
      'Establish team communication channels and standup rhythm',
      'Set up Git repository, branching strategy, and issue board',
    ],
    checklist: [
      'Complementary team roles agreed upon (Leader, Frontend, Backend)',
      'Repository initialized with branch protection and linter rules',
      'API contract agreed upon between frontend and backend engineers',
      'Shared staging/development environment accessible to all members',
      'Contact channels established for rapid debugging',
    ],
    usefulTip: 'Agree on the API contract in hour 2: define JSON payloads on a whiteboard so frontend and backend work in parallel.',
    engineeringAdvice: 'Create mock JSON responses in the frontend early so UI development is never blocked on backend APIs.',
    hackathonAdvice: 'Schedule short 10-minute check-ins every 4 hours to verify blockers and progress.',
  },
  {
    id: '03',
    stageNumber: '03',
    title: 'Development',
    subtitle: 'Implement core product, database schemas, and end-to-end user flow',
    focus: [
      'Implement the primary user journey from login to result',
      'Establish frontend/backend communication with proper authentication',
      'Connect relational database and write initial database seed data',
      'Build the primary technical differentiator that sets your project apart',
    ],
    checklist: [
      'Core user journey functional from end to end',
      'Frontend and backend successfully connected via API client',
      'Authentication and session state working reliably',
      'Database integrated with seeded test data ready for inspection',
      'Differentiator feature implemented and verified',
    ],
    usefulTip: 'Focus 80% of development time on the killer differentiator—the feature judges will remember.',
    engineeringAdvice: 'Never write ad-hoc fetch calls: use a centralized API client with token interceptors and typed schemas.',
    hackathonAdvice: 'Aim to have the core happy-path working 12 hours before the submission deadline.',
  },
  {
    id: '04',
    stageNumber: '04',
    title: 'Testing & QA',
    subtitle: 'Harden edge cases, verify error boundaries, and validate production build',
    focus: [
      'End-to-end functional testing across all user roles',
      'Test edge cases: missing inputs, invalid tokens, network timeouts',
      'Verify role-based access control guards on protected routes',
      'Run production build and linting checks locally to catch build breaks',
    ],
    checklist: [
      'Critical API endpoints tested with valid and invalid payloads',
      'Authentication and role guards verified for each persona',
      'Empty and error states tested for missing data views',
      'npm run build and npm run lint pass with zero errors',
      'Mobile responsive check performed at 390px viewport',
    ],
    usefulTip: 'Test the application in an incognito window with a freshly registered account to catch hardcoded assumptions.',
    engineeringAdvice: 'Ensure all error handlers render user-friendly banners instead of dumping raw stack traces.',
    hackathonAdvice: 'Do not introduce brand new features during the testing phase. Focus exclusively on stability and polish.',
  },
  {
    id: '05',
    stageNumber: '05',
    title: 'Release & Submission',
    subtitle: 'Deploy live demo, write README documentation, and submit project',
    focus: [
      'Deploy frontend and backend to accessible public URLs',
      'Write comprehensive repository README with architecture overview',
      'Verify public demo links, video demo links, and GitHub access',
      'Lock in submission on the platform well before deadline',
    ],
    checklist: [
      'Production deployment live and responding smoothly',
      'README contains project description, architecture diagram, and setup instructions',
      'Demo video recorded, uploaded, and playable without authentication restrictions',
      'Official submission form submitted and verified on DogFood platform',
      'Backup screenshots and slides prepared',
    ],
    usefulTip: 'Submit your project at least 1 hour before the deadline. Network traffic spikes right at the end.',
    engineeringAdvice: 'Double check that your production demo uses HTTPS and does not suffer from mixed-content browser blocks.',
    hackathonAdvice: 'Treat your submission description like a landing page: clear headline, bulleted features, and clean links.',
  },
  {
    id: '06',
    stageNumber: '06',
    title: 'Judging',
    subtitle: 'Rehearse pitch, demonstrate architecture, and defend technical choices',
    focus: [
      'Deliver concise problem and solution framing in under 2 minutes',
      'Walk through working software with real, relatable test data',
      'Explain architectural decisions, trade-offs, and technical difficulty',
      'Answer evaluator questions with confidence and technical honesty',
    ],
    checklist: [
      'Pitch rehearsed and timed (problem, solution, live demo, architecture)',
      'Working demo tab open with clean test data pre-loaded',
      'Technical architecture slide ready to explain system boundaries',
      'Team members aligned on who answers questions for each domain',
      'Q&A prepared for questions on scalability and future roadmap',
    ],
    usefulTip: 'Judges score working code and technical execution far higher than aspirational slides.',
    engineeringAdvice: 'Be upfront about what was built during the hackathon versus pre-existing libraries.',
    hackathonAdvice: 'Smile, speak clearly, and lead directly with your product in action.',
  },
]

// ─── Curated Video Resources Definition ───────────────────────────────────────
interface CuratedVideo {
  id: string
  title: string
  category: string
  url: string
  youtubeId: string
  duration: string
  description: string
  tag: string
}

const CURATED_VIDEOS: CuratedVideo[] = [
  {
    id: 'pitching',
    title: 'How I Won 21x Hackthon || Hackathon Presentation Tips to Pitch & Win',
    category: 'Presentation / Pitching',
    url: 'https://youtu.be/ConzkRP2mpk',
    youtubeId: 'ConzkRP2mpk',
    duration: '11:15',
    description: 'Master the 2-minute hackathon pitch: frame the problem statement, structure your demo narrative, and convince judges with clarity.',
    tag: 'Recommended for All Teams',
  },
  {
    id: 'eng-masterclass',
    title: 'Hackathon Engineering Masterclass',
    category: 'Engineering & Strategy',
    url: 'https://youtu.be/DizrlqWIEWs',
    youtubeId: 'DizrlqWIEWs',
    duration: '14:20',
    description: 'Key frameworks for rapid full-stack execution, cutting unnecessary scope, and shipping high-impact prototypes on a deadline.',
    tag: 'Core Strategy',
  },
  {
    id: 'rapid-prototyping',
    title: 'Building & Validating Prototypes Fast',
    category: 'Engineering & Strategy',
    url: 'https://youtu.be/vz4Xf1QlYm8',
    youtubeId: 'vz4Xf1QlYm8',
    duration: '18:45',
    description: 'Architectural principles for rapid validation, component reusability, and focusing engineering effort on the primary differentiator.',
    tag: 'Build Phase',
  },
]

export default function GuidancePage() {
  const [activeView, setActiveView] = useState<GuidanceView>('HUB')

  // Step-by-step state: currently expanded stage
  const [expandedStage, setExpandedStage] = useState<string>('01')
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  // Mentor detail modal
  const [selectedMentor, setSelectedMentor] = useState<VirtualMentor | null>(null)

  // Video filter category
  const [videoCategory, setVideoCategory] = useState<string>('ALL')

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredVideos = CURATED_VIDEOS.filter((v) => {
    if (videoCategory === 'ALL') return true
    return v.category === videoCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-24">
      {/* ── Context Navigation ────────────────────────────────────────────── */}
      {activeView === 'HUB' ? (
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Dashboard</span>
          </Link>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setActiveView('HUB')}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:text-primary-light transition-colors group cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Guidance &amp; Mentoring</span>
          </button>
        </div>
      )}

      {/* ── View 1: Primary Guidance & Mentoring Hub ──────────────────────── */}
      {activeView === 'HUB' && (
        <div className="space-y-10 animate-fade-in">
          {/* Main Hero Header */}
          <div className="pb-6 border-b border-slate-800 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-primary/15 text-primary-light border border-primary/30 uppercase tracking-wider">
                <Sparkles className="h-3 w-3 text-primary" />
                BUILDER RESOURCES
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Guidance &amp; Mentoring
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Get help, learn faster, and move your hackathon project forward with specialized virtual mentors, stage playbooks, and pitch workshops.
            </p>
          </div>

          {/* Section Question */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-cyan-400" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                What do you need help with?
              </h2>
            </div>

            {/* THREE PRIMARY DOMINANT ENTRY POINTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Option 1: Mentors */}
              <div
                onClick={() => setActiveView('MENTORS')}
                className="group relative cursor-pointer rounded-2xl bg-[#0B1020] border border-slate-800 p-6 sm:p-7 flex flex-col justify-between hover:border-primary/50 hover:shadow-2xl hover:shadow-primary-950/40 transition-all duration-300 card-lift"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                      01 • Virtual Advisors
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1 group-hover:text-primary-light transition-colors">
                      Mentors
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Get help from a specialized virtual mentor across Frontend, Backend, Integration, Architecture, UX, and Pitching.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-primary group-hover:text-primary-light">
                  <span>Explore Mentors (6)</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Option 2: Step-by-Step Guidance */}
              <div
                onClick={() => setActiveView('STEP_BY_STEP')}
                className="group relative cursor-pointer rounded-2xl bg-[#0B1020] border border-slate-800 p-6 sm:p-7 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-950/40 transition-all duration-300 card-lift"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                    <Compass className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                      02 • Phased Journey
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                      Step-by-Step Guidance
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Follow the hackathon journey from idea to judging with actionable checklists, engineering advice, and milestone goals.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span>View 6 Stages</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Option 3: Recommended Videos */}
              <div
                onClick={() => setActiveView('VIDEOS')}
                className="group relative cursor-pointer rounded-2xl bg-[#0B1020] border border-slate-800 p-6 sm:p-7 flex flex-col justify-between hover:border-primary/50 hover:shadow-2xl hover:shadow-violet-950/40 transition-all duration-300 card-lift"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary-light group-hover:scale-105 transition-transform">
                    <Video className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary-light">
                      03 • Curated Library
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1 group-hover:text-primary-light transition-colors">
                      Recommended Videos
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Watch curated resources for building, architecture, and delivering a pitch that wins judge scores.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-primary-light group-hover:text-primary-light">
                  <span>Watch Video Guides</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── View 2: Mentors Experience ────────────────────────────────────── */}
      {activeView === 'MENTORS' && (
        <div className="space-y-8 animate-fade-in">
          <div className="pb-6 border-b border-slate-800 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-primary/15 text-primary-light border border-primary/30">
              <Bot className="h-3 w-3" />
              SPECIALIZED ADVISORS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Virtual Mentors
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Specialized domain mentors ready to help you navigate technical decisions, architecture, and presentation strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VIRTUAL_MENTORS.map((m) => {
              const Icon = m.icon
              return (
                <div
                  key={m.id}
                  className={`p-6 rounded-2xl bg-[#0B1020] border ${m.borderAccent} shadow-md flex flex-col justify-between transition-all`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-3.5">
                      <div className={`h-11 w-11 rounded-xl ${m.bgAccent} border border-white/10 flex items-center justify-center shrink-0`}>
                        <Icon className={`h-5 w-5 ${m.accent}`} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{m.name}</h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{m.specialty}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {m.description}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Areas of Help:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.areasOfHelp.map((area, aIdx) => (
                          <span
                            key={aIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#070A12] border border-slate-800 text-slate-300"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-800/80">
                    <Button
                      size="sm"
                      onClick={() => setSelectedMentor(m)}
                      className="w-full text-xs font-bold bg-[#0F1522] hover:bg-[#161F31] border border-slate-800 text-slate-200 hover:text-white"
                    >
                      Get Guidance
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── View 3: Step-by-Step Guidance (Horizontal Expandable Rows) ─────── */}
      {activeView === 'STEP_BY_STEP' && (
        <div className="space-y-8 animate-fade-in">
          <div className="pb-6 border-b border-slate-800 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              <Compass className="h-3 w-3" />
              STRUCTURED JOURNEY
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Step-by-Step Guidance
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Follow the six chronological phases of the hackathon journey. Click any stage to inspect objectives, checklists, and advice.
            </p>
          </div>

          {/* Expandable Rows */}
          <div className="space-y-4">
            {GUIDANCE_STAGES.map((st) => {
              const isExpanded = expandedStage === st.id
              return (
                <div
                  key={st.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'bg-[#0B1020] border-cyan-500/40 shadow-xl shadow-cyan-950/20'
                      : 'bg-[#090D18] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Compact Header Row */}
                  <button
                    type="button"
                    onClick={() => setExpandedStage(isExpanded ? '' : st.id)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#070A12] text-cyan-400 border border-cyan-500/20 shrink-0">
                        {st.stageNumber}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-white truncate">{st.title}</h3>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{st.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </span>
                      <div className="h-8 w-8 rounded-lg bg-[#070A12] border border-slate-800 flex items-center justify-center text-slate-400">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content Panel */}
                  {isExpanded && (
                    <div className="p-6 pt-2 border-t border-slate-800/80 space-y-6 animate-fade-in text-xs">
                      {/* Focus points & Checklist Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* Key Focus */}
                        <div className="space-y-3 p-4 rounded-xl bg-[#070A12] border border-slate-800">
                          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                            Key Focus &amp; Objectives
                          </h4>
                          <ul className="space-y-2">
                            {st.focus.map((f, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2 text-slate-300 leading-relaxed">
                                <span className="text-cyan-400 font-bold shrink-0">•</span>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Interactive Checklist */}
                        <div className="space-y-3 p-4 rounded-xl bg-[#070A12] border border-slate-800">
                          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                            <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
                            Stage Checklist
                          </h4>
                          <div className="space-y-2">
                            {st.checklist.map((item, cIdx) => {
                              const checkKey = `${st.id}-${cIdx}`
                              const isChecked = !!checkedItems[checkKey]
                              return (
                                <label
                                  key={cIdx}
                                  onClick={() => toggleCheck(checkKey)}
                                  className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0F1522] border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    readOnly
                                    className="h-4 w-4 rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                                  />
                                  <span className={`text-xs ${isChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                    {item}
                                  </span>
                                </label>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Practical Advice Strip */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-200">
                          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                            💡 Useful Tip
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">{st.usefulTip}</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-slate-200">
                          <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider block mb-1">
                            ⚙️ Engineering Advice
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">{st.engineeringAdvice}</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-slate-200">
                          <span className="text-[10px] font-mono font-bold text-primary-light uppercase tracking-wider block mb-1">
                            🏆 Hackathon Strategy
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">{st.hackathonAdvice}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── View 4: Recommended Videos Experience ─────────────────────────── */}
      {activeView === 'VIDEOS' && (
        <div className="space-y-8 animate-fade-in">
          <div className="pb-6 border-b border-slate-800 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-primary/15 text-primary-light border border-primary/30">
              <Video className="h-3 w-3" />
              CURATED MEDIA
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Recommended Videos
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Curated masterclasses and pitch guides to help you architect effectively and present a winning project.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              'ALL',
              'Presentation / Pitching',
              'Engineering & Strategy',
              'Frontend',
              'Backend',
              'Architecture',
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setVideoCategory(cat)}
                className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  videoCategory === cat
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-[#0B1020] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredVideos.map((vid) => (
              <div
                key={vid.id}
                className="group p-5 rounded-2xl bg-[#0B1020] border border-slate-800 hover:border-primary/40 shadow-md flex flex-col justify-between transition-all"
              >
                <div className="space-y-3.5">
                  {/* Video Thumbnail Placeholder / Card preview */}
                  <div className="relative aspect-video rounded-xl bg-gradient-to-br from-[#0F1522] to-[#070A12] border border-slate-800 flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://img.youtube.com/vi/${vid.youtubeId}/maxresdefault.jpg`}
                      alt={vid.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.nextElementSibling) {
                          (target.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                    {/* Fallback container (hidden by default unless image fails) */}
                    <div className="absolute inset-0 flex-col items-center justify-center p-4 text-center hidden bg-gradient-to-br from-[#0F1522] to-[#070A12]">
                      <div className="h-10 w-10 mb-2 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                        <Play className="h-5 w-5 ml-0.5 fill-current" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-primary-light uppercase mb-1">
                        {vid.category}
                      </span>
                      <span className="text-xs font-bold text-white line-clamp-2">
                        {vid.title}
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="h-12 w-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="h-5 w-5 ml-0.5 fill-white" />
                      </div>
                    </div>
                    
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-slate-300 border border-white/10 z-10">
                      {vid.duration}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/15 text-primary-light border border-primary/30">
                        {vid.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-primary-light transition-colors">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80">
                  <a
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-primary hover:bg-violet-500 text-white transition-colors shadow-md shadow-violet-900/20"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Virtual Mentor Guidance Detail Modal ──────────────────────────── */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-[#0B1020] border border-slate-800 shadow-2xl p-6 sm:p-7 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedMentor(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-[#070A12] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-xl ${selectedMentor.bgAccent} border border-white/10 flex items-center justify-center`}>
                <selectedMentor.icon className={`h-6 w-6 ${selectedMentor.accent}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedMentor.name}</h3>
                <p className="text-xs font-mono text-slate-400">{selectedMentor.specialty}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedMentor.description}
            </p>

            {/* Advice Strip */}
            <div className="space-y-2 p-4 rounded-xl bg-[#070A12] border border-slate-800">
              <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider block">
                Recommended Best Practices
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedMentor.advice.map((adv, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Checklist */}
            <div className="space-y-2 p-4 rounded-xl bg-[#070A12] border border-slate-800">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                Domain Inspection Checklist
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedMentor.checklist.map((chk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{chk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              className="w-full text-xs font-bold bg-primary hover:bg-primary-hover text-white"
              onClick={() => setSelectedMentor(null)}
            >
              Done Reviewing
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
