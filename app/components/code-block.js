'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { prism, vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useTheme } from './theme-provider'

const CodeBlock = ({ language, codestring }) => {
  const { theme } = useTheme()
  return (
    <SyntaxHighlighter language={language} style={theme === 'dark' ? vscDarkPlus : prism} PreTag="div">
      {codestring}
    </SyntaxHighlighter>
  )
}

export default CodeBlock
