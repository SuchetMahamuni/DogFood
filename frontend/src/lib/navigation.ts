import {
  BookOpen,
  Calendar,
  ClipboardList,
  Compass,
  FolderKanban,
  Home,
  LayoutDashboard,
  Scale,
  Settings,
  Shield,
  Trophy,
  UserCheck,
  Users,
} from 'lucide-react'
import type { NavItem, RoleNavMap } from '@/types/navigation'

// ─── Public navigation (shown in Navbar when not authenticated) ───────────────
export const publicNavItems: NavItem[] = [
  { label: 'Home',        href: '/',         icon: Home,        exact: true },
  { label: 'Hackathons',  href: '/events',   icon: Calendar },
  { label: 'Projects',    href: '/projects', icon: FolderKanban },
  { label: 'Leaderboard', href: '/results',  icon: Trophy },
]

// ─── Role-based sidebar navigation ───────────────────────────────────────────
export const roleNavMap: RoleNavMap = {
  PARTICIPANT: [
    {
      items: [
        { label: 'Dashboard',  href: '/dashboard', icon: LayoutDashboard, exact: true },
        { label: 'Hackathons', href: '/events',    icon: Calendar },
        { label: 'Discover',   href: '/discover',  icon: Compass },
      ],
    },
    {
      title: 'My Space',
      items: [
        { label: 'Team',     href: '/team',     icon: Users },
        { label: 'Project',  href: '/project',  icon: FolderKanban },
        { label: 'Guidance', href: '/guidance', icon: BookOpen },
        { label: 'Profile',  href: '/profile',  icon: Settings },
      ],
    },
  ],

  JUDGE: [
    {
      items: [
        { label: 'Judge Dashboard', href: '/judge',             icon: LayoutDashboard, exact: true },
        { label: 'Assignments',     href: '/judge/assignments', icon: ClipboardList },
        { label: 'Profile',         href: '/profile',           icon: Settings },
      ],
    },
  ],

  ORGANIZER: [
    {
      items: [
        { label: 'Organizer Dashboard', href: '/organizer',              icon: LayoutDashboard, exact: true },
        { label: 'Hackathons',          href: '/organizer/events',       icon: Calendar },
        { label: 'Participants',        href: '/organizer/participants', icon: Users },
        { label: 'Teams',               href: '/organizer/teams',        icon: FolderKanban },
        { label: 'Judges',              href: '/organizer/judges',       icon: UserCheck },
        { label: 'Assignments',         href: '/organizer/assignments',  icon: ClipboardList },
        { label: 'Judging Criteria',    href: '/organizer/rubric',       icon: Scale },
        { label: 'Judging Progress',    href: '/organizer/progress',     icon: Trophy },
        { label: 'Profile',             href: '/profile',                icon: Settings },
      ],
    },
  ],

  ADMIN: [
    {
      items: [
        { label: 'Dashboard',      href: '/dashboard',              icon: LayoutDashboard, exact: true },
        { label: 'Organizer Hub',  href: '/organizer',              icon: LayoutDashboard },
        { label: 'Hackathons',     href: '/organizer/events',       icon: Calendar },
        { label: 'Users',          href: '/organizer/participants', icon: Users },
        { label: 'Administration', href: '/administration',         icon: Shield },
        { label: 'Settings',       href: '/settings',               icon: Settings },
      ],
    },
  ],
}
