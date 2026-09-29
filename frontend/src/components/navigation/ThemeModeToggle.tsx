import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/lib/utils'

interface ThemeModeToggleProps {
  className?: string
  showText?: boolean
  compact?: boolean
}

/**
 * Global Light / Dark Mode Appearance Toggle
 * Visually indicates the current mode (Moon + Dark or Sun + Light).
 * Meets accessibility standards with clear aria-labels and keyboard focus.
 */
export function ThemeModeToggle({
  className,
  showText = true,
  compact = false,
}: ThemeModeToggleProps) {
  const { mode, toggleMode } = useThemeStore()
  const isDark = mode === 'dark'

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'group relative inline-flex items-center justify-center gap-1.5 rounded-full',
        'border border-border bg-surface-elevated/80 hover:bg-surface-elevated',
        'text-foreground hover:border-primary/50 hover:text-foreground',
        'transition-all duration-200 ease-out select-none cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background',
        compact ? 'h-8 w-8 p-0' : 'h-8 px-2.5 sm:px-3 text-xs font-medium shadow-xs',
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Moon
            className={cn(
              'h-3.5 w-3.5 text-primary-light transition-all duration-200',
              'group-hover:scale-110 group-hover:-rotate-12',
            )}
            aria-hidden="true"
          />
        ) : (
          <Sun
            className={cn(
              'h-3.5 w-3.5 text-amber-500 transition-all duration-200',
              'group-hover:scale-110 group-hover:rotate-45',
            )}
            aria-hidden="true"
          />
        )}
      </div>

      {showText && !compact && (
        <span className="font-mono text-[11px] font-semibold tracking-tight transition-colors duration-150">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  )
}
