import { getSortedPostsData, getAllTags, getSearchIndex } from '../lib/posts';
import FeaturedPosts from './components/featuredPosts';
import PostsList from './components/postsList';
import SearchBox from './components/search-box';
import Link from 'next/link';

export default function Page() {
  const allPostsData = getSortedPostsData();
  const allTags = getAllTags();
  const searchIndex = getSearchIndex();

  return (
    <div className="w-full">
      {/* Featured Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-lg md:text-xl font-bold font-display uppercase tracking-wider text-slate-700 dark:text-slate-400">
            Destacados
          </h2>
        </div>
        <FeaturedPosts allPosts={allPostsData} />
      </section>

      {/* Main Content Area: 2 Columns on Desktop */}
      <div className="flex flex-col lg:flex-row gap-8 items-start my-8 w-full">
        {/* Left Column: Posts List */}
        <div className="w-full lg:flex-grow lg:max-w-[780px]">
          <PostsList posts={allPostsData} title="Lo Último" />
        </div>

        {/* Right Column: Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6 lg:sticky lg:top-24 mt-4 lg:mt-0">
          {/* Search Widget */}
          <div className="bg-white border border-slate-200 dark:bg-slate-900/10 dark:border-slate-800/45 p-5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">Buscar</h3>
            <SearchBox posts={searchIndex} />
          </div>

          {/* Tags Cloud */}
          <div className="bg-white border border-slate-200 dark:bg-slate-900/10 dark:border-slate-800/45 p-5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">Temas populares</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => {
                const capitalized = tag.charAt(0).toUpperCase() + tag.slice(1);
                return (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 hover:border-indigo-300 dark:hover:border-sky-500/30 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all font-medium"
                  >
                    #{capitalized}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Ad Space Placeholder */}
          <div className="w-full h-[250px] border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/10 rounded-2xl flex flex-col items-center justify-center text-center p-4 select-none shadow-sm">
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 tracking-widest uppercase mb-1">Publicidad</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">Espacio reservado (300x250)</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
