import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Layouts & Auth Wrappers
import { AppLayout } from '@/components/layout/AppLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthLoadingScreen } from '@/components/auth/AuthLoadingScreen'

// Public pages
import LandingPage from '@/pages/LandingPage'
import EventsPage from '@/pages/EventsPage'
import EventDetailsPage from '@/pages/EventDetailsPage'
import ProjectsPage from '@/pages/ProjectsPage'
import ResultsPage from '@/pages/ResultsPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

// Authenticated Participant pages
import DashboardPage from '@/pages/DashboardPage'
import DiscoverPage from '@/pages/DiscoverPage'
import ProfilePage from '@/pages/ProfilePage'
import TeamPage from '@/pages/TeamPage'
import TeamsPage from '@/pages/TeamsPage'
import TeamInvitationsPage from '@/pages/TeamInvitationsPage'
import ProjectPage from '@/pages/ProjectPage'
import ProjectDetailsPage from '@/pages/ProjectDetailsPage'
import GuidancePage from '@/pages/GuidancePage'

// Judge Platform pages
import JudgeDashboardPage from '@/pages/judge/JudgeDashboardPage'
import JudgeAssignmentsPage from '@/pages/judge/JudgeAssignmentsPage'
import JudgeProjectReviewPage from '@/pages/judge/JudgeProjectReviewPage'

// Organizer Platform pages
import OrganizerDashboardPage from '@/pages/organizer/OrganizerDashboardPage'
import OrganizerEventsPage from '@/pages/organizer/OrganizerEventsPage'
import OrganizerJudgesPage from '@/pages/organizer/OrganizerJudgesPage'
import OrganizerAssignmentsPage from '@/pages/organizer/OrganizerAssignmentsPage'
import OrganizerProgressPage from '@/pages/organizer/OrganizerProgressPage'
import OrganizerRubricPage from '@/pages/organizer/OrganizerRubricPage'
import OrganizerParticipantsPage from '@/pages/organizer/OrganizerParticipantsPage'
import OrganizerTeamsPage from '@/pages/organizer/OrganizerTeamsPage'

// Admin Platform pages
import AdministrationPage from '@/pages/admin/AdministrationPage'
import SettingsPage from '@/pages/admin/SettingsPage'

// Auth Store
import { useAuthStore } from '@/store/authStore'

// ─── 404 ─────────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 text-center px-4 text-slate-200" style={{backgroundColor: 'var(--color-background)'}}>
      <div className="relative">
        <p className="text-8xl font-black text-slate-800/80 font-mono tracking-tighter select-none">404</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-mono uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/30">
            Route Missing
          </span>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-white tracking-tight">Endpoint or Page Not Found</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        The workspace path you requested does not exist or has been relocated within the platform.
      </p>
      <a
        href="/"
        className="mt-3 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors shadow-md glow-brand"
      >
        ← Return to Platform Root
      </a>
    </div>
  )
}


// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { initialized, initializeAuth } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  if (!initialized) {
    return <AuthLoadingScreen />
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes (Navbar only) ─────────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/"                 element={<LandingPage />} />
          <Route path="/events"           element={<EventsPage />} />
          <Route path="/events/:eventId"  element={<EventDetailsPage />} />
          <Route path="/projects"         element={<ProjectsPage />} />
          <Route path="/results"          element={<ResultsPage />} />
          <Route path="/login"            element={<LoginPage />} />
          <Route path="/register"         element={<RegisterPage />} />
        </Route>

        {/* ── Authenticated routes (ProtectedRoute + AppLayout) ───────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard"          element={<DashboardPage />} />
            <Route path="/discover"           element={<DiscoverPage />} />
            <Route path="/profile"            element={<ProfilePage />} />
            <Route path="/teams"              element={<TeamsPage />} />
            <Route path="/team"               element={<TeamsPage />} />
            <Route path="/team/:eventId"      element={<TeamPage />} />
            <Route path="/team/:eventId/invitations" element={<TeamInvitationsPage />} />
            <Route path="/project"            element={<ProjectPage />} />
            <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
            <Route path="/guidance"           element={<GuidancePage />} />
            <Route path="/settings"           element={<SettingsPage />} />

            {/* ── Judge Platform (Role-Guarded) ───────────────────────────── */}
            <Route element={<ProtectedRoute allowedRoles={['JUDGE', 'ADMIN']} />}>
              <Route path="/judge"                      element={<JudgeDashboardPage />} />
              <Route path="/judge/assignments"          element={<JudgeAssignmentsPage />} />
              <Route path="/judge/projects/:projectId"  element={<JudgeProjectReviewPage />} />
              <Route path="/judging"                    element={<JudgeDashboardPage />} />
            </Route>

            {/* ── Organizer Platform (Role-Guarded) ───────────────────────── */}
            <Route element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']} />}>
              <Route path="/organizer"                  element={<OrganizerDashboardPage />} />
              <Route path="/organizer/events"           element={<OrganizerEventsPage />} />
              <Route path="/organizer/judges"           element={<OrganizerJudgesPage />} />
              <Route path="/organizer/assignments"      element={<OrganizerAssignmentsPage />} />
              <Route path="/organizer/progress"         element={<OrganizerProgressPage />} />
              <Route path="/organizer/rubric"           element={<OrganizerRubricPage />} />
              <Route path="/organizer/participants"     element={<OrganizerParticipantsPage />} />
              <Route path="/organizer/teams"            element={<OrganizerTeamsPage />} />
            </Route>

            {/* ── Admin Platform (Role-Guarded) ────────────────────────────── */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/administration"             element={<AdministrationPage />} />
              <Route path="/admin"                      element={<AdministrationPage />} />
            </Route>
          </Route>
        </Route>

        {/* ── 404 ─────────────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
