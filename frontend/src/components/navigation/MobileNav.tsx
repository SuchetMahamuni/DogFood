import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { roleNavMap } from '@/lib/navigation'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ThemeModeToggle } from '@/components/navigation/ThemeModeToggle'
import type { UserRole } from '@/types/navigation'

interface MobileNavProps {
  role: UserRole
  isOpen: boolean
  onClose: () => void
}

/**
 * Mobile navigation drawer — dark/light adaptive console sheet with global appearance toggle.
 */
export function MobileNav({ role, isOpen, onClose }: MobileNavProps) {
  const sections = (role && roleNavMap[role]) ? roleNavMap[role] : roleNavMap.PARTICIPANT

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent side="left" className="flex flex-col p-0 bg-card border-r border-border text-foreground">
        {/* Header */}
        <SheetHeader className="px-4 py-4 border-b border-border">
          <SheetTitle asChild>
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/dogfood-logo.svg"
                alt="DogFood"
                className="logo-img"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement
                  el.style.display = 'none'
                }}
              />
              <span className="text-base font-bold text-foreground tracking-tight font-mono">DogFood</span>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto p-3.5 space-y-5" aria-label="Mobile navigation">
          {sections.map((section, i) => (
            <div key={i} className="space-y-1">
              {section.title && (
                <p className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground select-none">
                  {section.title}
                </p>
              )}
              <ul className="space-y-0.5" role="list">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      end={item.exact}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                          isActive
                            ? 'bg-primary/15 text-primary font-bold border border-primary/30'
                            : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground',
                        )
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-[10px] font-semibold tabular-nums bg-primary/20 text-primary rounded-full px-2 py-0.5 leading-none border border-primary/30">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer with Appearance Toggle */}
        <div className="p-3.5 border-t border-border mt-auto flex items-center justify-between bg-surface-subtle/50">
          <span className="text-xs font-mono font-medium text-muted-foreground">Appearance</span>
          <ThemeModeToggle />
        </div>
      </SheetContent>
    </Sheet>
  )
}
