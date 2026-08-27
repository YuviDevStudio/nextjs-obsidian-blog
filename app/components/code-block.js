'use client'

import 'prismjs/themes/prism.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import { useEffect, useRef } from 'react'
import { useTheme } from './theme-provider'

// Lightweight client-side code block that uses Prism if available.
// It intentionally lazy-loads Prism only on the client to avoid server/runtime bundling.
const CodeBlock = ({ language = 'text', codestring = '' }) => {
  const { theme } = useTheme()
  const codeRef = useRef(null)

  useEffect(() => {
    let mounted = true
    // Try to dynamically import prism on client; if it fails, leave the plain code block.
    ;(async () => {
      try {
        const Prism = await import('prismjs')
        // load common languages if available (prism auto-registers some)
        try {
          await Promise.all([
            import('prismjs/components/prism-javascript'),
            import('prismjs/components/prism-jsx'),
            import('prismjs/components/prism-markup'),
            import('prismjs/components/prism-css'),
          ])
        } catch (e) {
          // ignore missing components — Prism will still highlight basic tokens
        }

        if (!mounted) return
        if (codeRef.current && Prism && Prism.highlightElement) {
          Prism.highlightElement(codeRef.current)
        }
      } catch (e) {
        // prism not installed or failed to load — fallback to plain code block
      }
    })()

    return () => {
      mounted = false
    }
  }, [language, codestring])

  const preClass = theme === 'dark' ? 'language-' + language + ' bg-gray-800 text-white p-4 rounded' : 'language-' + language + ' bg-gray-100 p-4 rounded'

  return (
    <pre className={preClass}>
      <code ref={codeRef} className={`language-${language}`}>
        {codestring}
      </code>
    </pre>
  )
}

export default CodeBlock
