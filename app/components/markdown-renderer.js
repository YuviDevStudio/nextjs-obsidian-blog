'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import CodeBlock from './code-block';

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node, ...props }) => (
          <Link 
            href={props.href || ''} 
            className="text-indigo-600 dark:text-sky-400 font-semibold hover:underline decoration-2 underline-offset-2 transition-colors"
            {...props} 
          />
        ),
        h1: ({ node, ...props }) => <h1 className="text-3xl font-extrabold font-display mt-8 mb-4 text-slate-800 dark:text-slate-100 leading-tight" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold font-display mt-8 mb-4 text-slate-800 dark:text-slate-100 leading-snug border-b border-slate-100 dark:border-slate-800 pb-1.5" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-bold font-display mt-6 mb-3 text-slate-800 dark:text-slate-150 leading-normal" {...props} />,
        p: ({ node, ...props }) => <p className="text-slate-600 dark:text-slate-300 text-[16px] md:text-[17px] leading-relaxed mb-6 font-normal" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-600 dark:text-slate-350 text-[16px] md:text-[17px]" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-slate-600 dark:text-slate-350 text-[16px] md:text-[17px]" {...props} />,
        li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-indigo-500/80 dark:border-sky-500/80 pl-4 py-1.5 my-6 italic bg-slate-50/50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 rounded-r-lg" {...props} />
        ),
        img: ({ node, ...props }) => (
          <span className="block my-8 text-center">
            <img 
              src={props.src}
              alt={props.alt || ''}
              className="mx-auto rounded-2xl shadow-md dark:shadow-slate-950/50 border border-slate-200/20 dark:border-slate-800/45 max-w-full md:max-w-[85%] lg:max-w-[70%] max-h-[480px] object-cover transition-all hover:scale-[1.01] duration-300"
            />
            {props.alt && (
              <span className="block text-xs md:text-sm text-slate-400 dark:text-slate-500 mt-3 font-medium italic">
                {props.alt}
              </span>
            )}
          </span>
        ),
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <CodeBlock
              codestring={String(children).replace(/\n$/, '')}
              language={match[1]}
            />
          ) : (
            <code className={`px-1.5 py-0.5 rounded text-xs border bg-slate-100 border-slate-200/80 text-rose-600 dark:bg-slate-800 dark:border-slate-800 dark:text-rose-400 ${className || ''}`} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
