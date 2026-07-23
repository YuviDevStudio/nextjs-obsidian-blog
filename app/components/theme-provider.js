'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} })

function getPreferredTheme() {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') return stored
  } catch {
    // ignore
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

export function ThemeProvider({ children }) {
  // Match the inline script in layout (class on <html>) to avoid a flash.
  const [theme, setTheme] = useState('light')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const initial = document.documentElement.classList.contains('dark')
      ? 'dark'
      : getPreferredTheme()
    setTheme(initial)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // ignore
    }
  }, [theme, ready])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
