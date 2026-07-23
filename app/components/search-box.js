'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'

/**
 * Client-side search over a lightweight posts index.
 * @param {{ id: string, title: string, description?: string, tags?: string[] }[]} posts
 */
export default function SearchBox({
  posts = [],
  placeholder = 'Buscar en el blog...',
  inputClassName = '',
  wrapperClassName = '',
  onNavigate,
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return posts
      .filter((p) => {
        const inTitle = (p.title || '').toLowerCase().includes(q)
        const inDesc = (p.description || '').toLowerCase().includes(q)
        const inTags = (p.tags || []).some((t) =>
          String(t).toLowerCase().includes(q)
        )
        return inTitle || inDesc || inTags
      })
      .slice(0, 8)
  }, [query, posts])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={`relative ${wrapperClassName}`}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none z-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Buscar en el blog"
        aria-expanded={open && results.length > 0}
        aria-controls="search-results"
        className={
          inputClassName ||
          'w-full p-2.5 pl-10 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500'
        }
      />

      {open && query.trim() && (
        <ul
          id="search-results"
          role="listbox"
          className="absolute z-50 mt-1.5 w-full max-h-72 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400">
              No se encontraron artículos
            </li>
          ) : (
            results.map((post) => (
              <li key={post.id} role="option">
                <Link
                  href={`/${post.id}`}
                  className="block px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 hover:bg-indigo-50 dark:hover:bg-slate-800 !no-underline border-b border-slate-100 dark:border-slate-800 last:border-0"
                  onClick={() => {
                    setOpen(false)
                    setQuery('')
                    onNavigate?.()
                  }}
                >
                  <span className="font-semibold line-clamp-1">{post.title}</span>
                  {post.description ? (
                    <span className="block text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {post.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
