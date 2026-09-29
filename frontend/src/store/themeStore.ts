import { create } from 'zustand'
import {
  type ThemeMode,
  type ThemeName,
  applyThemeMode,
  resolveTheme,
  resolveThemeMode,
} from '@/lib/themes'

interface ThemeStoreState {
  theme: ThemeName
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

export const useThemeStore = create<ThemeStoreState>((set) => ({
  theme: resolveTheme(),
  mode: resolveThemeMode(),

  setMode: (mode: ThemeMode) => {
    applyThemeMode(mode)
    set({ mode })
  },

  toggleMode: () => {
    set((state) => {
      const nextMode: ThemeMode = state.mode === 'dark' ? 'light' : 'dark'
      applyThemeMode(nextMode)
      return { mode: nextMode }
    })
  },
}))
