'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import CodeBlock from './code-block';
import ResponsiveImage from './responsive-image';

function isExternalHref(href) {
  if (!href) return false;
  return /^(https?:|mailto:|tel:)/i.test(href) || href.startsWith('//');
}

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children, ...props }) => {
          if (isExternalHref(href)) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-sky-400 font-semibold hover:underline decoration-2 underline-offset-2 transition-colors"
                {...props}
              >
                {children}
              </a>
            );
          }
          return (
            <Link
              href={href || '/'}
              className="text-indigo-600 dark:text-sky-400 font-semibold hover:underline decoration-2 underline-offset-2 transition-colors"
              {...props}
            >
              {children}
            </Link>
          );
        },
        h1: ({ ...props }) => <h1 className="text-3xl font-extrabold font-display mt-8 mb-4 text-slate-800 dark:text-slate-100 leading-tight" {...props} />,
        h2: ({ ...props }) => <h2 className="text-2xl font-bold font-display mt-8 mb-4 text-slate-800 dark:text-slate-100 leading-snug border-b border-slate-100 dark:border-slate-800 pb-1.5" {...props} />,
        h3: ({ ...props }) => <h3 className="text-xl font-bold font-display mt-6 mb-3 text-slate-800 dark:text-slate-100 leading-normal" {...props} />,
        p: ({ ...props }) => <p className="text-slate-600 dark:text-slate-300 text-[16px] md:text-[17px] leading-relaxed mb-6 font-normal" {...props} />,
        ul: ({ ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-600 dark:text-slate-300 text-[16px] md:text-[17px]" {...props} />,
        ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-slate-600 dark:text-slate-300 text-[16px] md:text-[17px]" {...props} />,
        li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
        blockquote: ({ ...props }) => (
          <blockquote className="border-l-4 border-indigo-500/80 dark:border-sky-500/80 pl-4 py-1.5 my-6 italic bg-slate-50/50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 rounded-r-lg" {...props} />
        ),
        img: ({ src, alt, ...props }) => {
          const isLocal = typeof src === 'string' && /^\/posts\/images\/[^/]+\.webp$/.test(src);
          return (
            <span className="block my-8 text-center">
              {isLocal ? (
                <ResponsiveImage
                  src={src}
                  alt={alt || ''}
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="mx-auto rounded-2xl shadow-md dark:shadow-slate-950/50 border border-slate-200/20 dark:border-slate-800/45 max-w-full md:max-w-[85%] lg:max-w-[70%] max-h-[480px] object-cover transition-all hover:scale-[1.01] duration-300"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={src}
                  alt={alt || ''}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto rounded-2xl shadow-md dark:shadow-slate-950/50 border border-slate-200/20 dark:border-slate-800/45 max-w-full md:max-w-[85%] lg:max-w-[70%] max-h-[480px] object-cover transition-all hover:scale-[1.01] duration-300"
                  {...props}
                />
              )}
              {alt ? (
                <span className="block text-xs md:text-sm text-slate-400 dark:text-slate-500 mt-3 font-medium italic">
                  {alt}
                </span>
              ) : null}
            </span>
          );
        },
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const codeText = String(children).replace(/\n$/, '');
          // Fenced blocks get a language-* class from remark; inline code usually does not.
          const isBlock = Boolean(match) || (typeof children === 'string' && children.includes('\n'));

          if (isBlock) {
            return (
              <CodeBlock
                codestring={codeText}
                language={match ? match[1] : 'text'}
              />
            );
          }

          return (
            <code
              className={`px-1.5 py-0.5 rounded text-xs border bg-slate-100 border-slate-200/80 text-rose-600 dark:bg-slate-800 dark:border-slate-800 dark:text-rose-400 ${className || ''}`}
              {...props}
            >
              {children}
            </code>
          );
        },
        pre: ({ children }) => <>{children}</>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
