'use client'

import { useTheme } from './theme-provider'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out border ${
        isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
      }`}
    >
      <span
        className={`${
          isDark ? 'translate-x-6 bg-white' : 'translate-x-1 bg-gray-800'
        } inline-block w-4 h-4 transform rounded-full transition-transform duration-200 ease-in-out`}
      />
    </button>
  )
}
