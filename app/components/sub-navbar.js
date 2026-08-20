'use client'

import Link from "next/link"

const SubNavbar = ({ tags = [] }) => {
  if (!tags.length) return null;

  return (
    <div className={`w-full py-2 border-b transition-colors bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/60`}>
      <nav className="max-w-[1340px] mx-auto px-4 md:px-6 text-sm" aria-label="Temas">
        <ul className="flex flex-row items-center overflow-x-auto whitespace-nowrap justify-start md:justify-center gap-3 no-scrollbar py-1">
          {tags.map(tag => {
            const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
            return (
              <li key={tag}>
                <Link
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 !no-underline bg-slate-50 border-slate-300 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-400 dark:hover:border-sky-500/30`}
                >
                  #{capitalizedTag}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  )
}

export default SubNavbar
