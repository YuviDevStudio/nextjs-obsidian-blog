'use client'

import { useTheme } from './theme-provider'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out border-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
    >
      <span
        className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-4 h-4 transform ${theme === 'dark' ? 'bg-white' : 'bg-gray-800'} rounded-full transition-transform duration-200 ease-in-out`}
      />
    </button>
  )
}
