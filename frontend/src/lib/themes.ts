/**
 * DogFood Theme System
 * Two-Dimensional Theme Architecture:
 * 1. Brand Dimension: Maps localhost ports (5173-5177) to brand color variants.
 *    5173 -> Emerald Forge
 *    5174 -> Copper Flame
 *    5175 -> Crimson Core
 *    5176 -> Gold Olive
 *    5177 -> Terracotta Sage
 * 2. Appearance Dimension: Global Light / Dark mode toggle.
 *    Persisted across navigation and refresh in localStorage ('dogfood_theme_mode').
 *    Applied via document.documentElement.dataset.theme & document.documentElement.dataset.mode.
 */

export type ThemeName = 'emerald' | 'copper' | 'crimson' | 'gold' | 'terracotta'
export type ThemeMode = 'dark' | 'light'

export const THEME_MODE_STORAGE_KEY = 'dogfood_theme_mode'

export interface ThemeMeta {
  name: string
  label: string
  primary: string
  accent: string
  port: number
}

const PORT_THEME_MAP: Record<string, ThemeName> = {
  '5173': 'emerald',
  '5174': 'copper',
  '5175': 'crimson',
  '5176': 'gold',
  '5177': 'terracotta',
}

export const THEME_META: Record<ThemeName, ThemeMeta> = {
  emerald: {
    name: 'emerald',
    label: 'Emerald Forge',
    primary: '#10B981',
    accent: '#6EE7B7',
    port: 5173,
  },
  copper: {
    name: 'copper',
    label: 'Copper Flame',
    primary: '#F97316',
    accent: '#FDBA74',
    port: 5174,
  },
  crimson: {
    name: 'crimson',
    label: 'Crimson Core',
    primary: '#E11D48',
    accent: '#FB7185',
    port: 5175,
  },
  gold: {
    name: 'gold',
    label: 'Gold Olive',
    primary: '#EAB308',
    accent: '#D4B46A',
    port: 5176,
  },
  terracotta: {
    name: 'terracotta',
    label: 'Terracotta Sage',
    primary: '#C2410C',
    accent: '#84A98C',
    port: 5177,
  },
}

/**
 * Determines the active brand theme from the current browser port.
 * Falls back to 'emerald' for any unrecognised port (e.g. 5173 default dev).
 */
export function resolveTheme(): ThemeName {
  const port = window.location.port || '5173'
  return PORT_THEME_MAP[port] ?? 'emerald'
}

/**
 * Determines the active appearance mode from localStorage.
 * Defaults to 'dark' (DogFood's primary visual identity).
 */
export function resolveThemeMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_MODE_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
  } catch {
    // Ignore localStorage access restrictions if any
  }
  return 'dark'
}

/**
 * Applies the brand theme to the document root as a data attribute.
 * CSS selectors like [data-theme="emerald"] take effect immediately.
 */
export function applyTheme(theme: ThemeName): void {
  document.documentElement.dataset.theme = theme
}

/**
 * Applies the appearance mode (light/dark) to the document root.
 * Sets dataset.mode, syncs CSS class, and persists to localStorage.
 */
export function applyThemeMode(mode: ThemeMode): void {
  document.documentElement.dataset.mode = mode
  if (mode === 'dark') {
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
  } else {
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
  }

  try {
    localStorage.setItem(THEME_MODE_STORAGE_KEY, mode)
  } catch {
    // Ignore localStorage write failures
  }
}

/**
 * Toggles between 'dark' and 'light' mode and applies immediately.
 */
export function toggleThemeMode(): ThemeMode {
  const current = resolveThemeMode()
  const next: ThemeMode = current === 'dark' ? 'light' : 'dark'
  applyThemeMode(next)
  return next
}

/**
 * One-call boot function: resolve + apply both dimensions.
 * Called in main.tsx before React mounts to prevent flash.
 */
export function bootTheme(): { theme: ThemeName; mode: ThemeMode } {
  const theme = resolveTheme()
  const mode = resolveThemeMode()
  applyTheme(theme)
  applyThemeMode(mode)
  return { theme, mode }
}
