import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { roleNavMap } from '@/lib/navigation'
import type { UserRole } from '@/types/navigation'

interface SidebarProps {
  role: UserRole
}

/**
 * Desktop sidebar — dashboard left rail showing role-based navigation.
 * Active indicator uses CSS variable --color-primary for per-theme accent.
 */
export function Sidebar({ role }: SidebarProps) {
  const sections = (role && roleNavMap[role]) ? roleNavMap[role] : roleNavMap.PARTICIPANT

  const roleLabel =
    role === 'JUDGE'
      ? 'Judge Workspace'
      : role === 'ORGANIZER'
        ? 'Organizer'
        : role === 'ADMIN'
          ? 'Admin Workspace'
          : 'Workspace'

  const roleDotColor =
    role === 'JUDGE'
      ? 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.7)]'
      : role === 'ORGANIZER'
        ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]'
        : role === 'ADMIN'
          ? 'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.7)]'
          : 'bg-primary'

  return (
    <aside
      aria-label="Sidebar navigation"
      className={cn(
        'hidden md:flex flex-col justify-between',
        'fixed left-0 z-30',
        'w-64 border-r border-border',
        'top-16 h-[calc(100dvh-4rem)]',
        'sidebar-scroll',
      )}
      style={{ backgroundColor: 'color-mix(in srgb, var(--color-background) 95%, transparent)' }}
    >
      <div className="p-3.5 space-y-4">
        {/* Workspace Context Tag */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-elevated/70 border border-border text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className={cn('h-2 w-2 rounded-full shrink-0', roleDotColor)} />
            <span className="font-bold text-foreground truncate text-xs">{roleLabel}</span>
          </div>
          <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
            {role.toLowerCase()}
          </span>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-4" aria-label="Main navigation">
          {sections.map((section, i) => (
            <div key={i} className="space-y-1">
              {section.title && (
                <p className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                  {section.title}
                </p>
              )}
              <ul className="space-y-0.5" role="list">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      end={item.exact}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 relative',
                          isActive
                            ? 'bg-primary/15 text-primary font-bold border border-primary/30 shadow-xs'
                            : 'text-muted-foreground hover:bg-surface-elevated/90 hover:text-foreground',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary glow-brand" />
                          )}
                          <item.icon
                            className={cn(
                              'h-4 w-4 shrink-0 transition-colors',
                              isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto text-[10px] font-bold tabular-nums bg-primary/20 text-primary rounded-full px-2 py-0.5 leading-none border border-primary/30">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-border bg-surface-card/40">
        <div className="flex items-center justify-between text-[11px] px-2 py-1">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-muted-foreground font-medium">Online</span>
          </span>
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider">v1.0</span>
        </div>
      </div>
    </aside>
  )
}
