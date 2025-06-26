import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'card-stash-theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')

  // Get system preference
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  // Resolve theme based on current theme setting
  const resolveTheme = (currentTheme: Theme): ResolvedTheme => {
    if (currentTheme === 'system') {
      return getSystemTheme()
    }
    return currentTheme
  }

  // Apply theme to document
  const applyTheme = (resolved: ResolvedTheme) => {
    const root = window.document.documentElement
    root.classList.toggle('dark', resolved === 'dark')
    console.log('Applied theme:', resolved, 'dark class:', root.classList.contains('dark'))
    setResolvedTheme(resolved)
  }

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme
      if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
        setTheme(storedTheme)
      }
    } catch (error) {
      console.error('Error loading theme from localStorage:', error)
    }
  }, [])

  // Update resolved theme when theme changes
  useEffect(() => {
    const resolved = resolveTheme(theme)
    applyTheme(resolved)
  }, [theme])

  // Listen for system theme changes when theme is set to 'system'
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const resolved = resolveTheme('system')
      applyTheme(resolved)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  // Save theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch (error) {
      console.error('Error saving theme to localStorage:', error)
    }
  }, [theme])

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}