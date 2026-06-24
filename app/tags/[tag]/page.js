import PostsList from '../../components/postsList';
import { getPostsByTag, getAllTags } from '../../../lib/posts';
import Link from 'next/link';

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(tag => ({
    tag: tag,
  }));
}

export default async function TagPage({ params }) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  const allTags = getAllTags();
  const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);

  return (
    <div className="w-full">
      {/* Page Header */}
      <header className="py-10 text-center border-b border-slate-200/50 dark:border-slate-800/50 mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-800 dark:text-slate-100">
          Artículos sobre <span className="text-indigo-600 dark:text-sky-400">#{capitalizedTag}</span>
        </h1>
        <p className="mt-2 text-xs md:text-sm text-slate-400 dark:text-slate-500 font-medium">
          Mostrando {posts.length} {posts.length === 1 ? 'artículo' : 'artículos'} de esta categoría
        </p>
      </header>

      {/* Main Content Area: 2 Columns on Desktop */}
      <div className="flex flex-col lg:flex-row gap-8 items-start my-8 w-full">
        {/* Left Column: Posts List */}
        <div className="w-full lg:flex-grow lg:max-w-[780px]">
          <PostsList posts={posts} title={null} />
        </div>

        {/* Right Column: Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6 lg:sticky lg:top-24 mt-4 lg:mt-0">
          {/* Search Widget */}
          <div className="bg-white/40 dark:bg-slate-900/10 p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/45">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Buscar</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar en el blog..."
                className="w-full p-2.5 pl-10 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          {/* Tags Cloud */}
          <div className="bg-white/40 dark:bg-slate-900/10 p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/45">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Temas populares</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(t => {
                const cap = t.charAt(0).toUpperCase() + t.slice(1);
                const isActive = t === tag;
                return (
                  <Link
                    key={t}
                    href={`/tags/${t}`}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all font-medium ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-400'
                        : 'border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 hover:border-indigo-200 dark:hover:border-sky-500/30'
                    }`}
                  >
                    #{cap}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Ad Space Placeholder */}
          <div className="w-full h-[250px] border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl flex flex-col items-center justify-center text-center p-4 select-none">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-1">Publicidad</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Espacio reservado (300x250)</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

