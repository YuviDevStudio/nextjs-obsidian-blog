import PostsList from '../../components/postsList';
import SearchBox from '../../components/search-box';
import { getPostsByTag, getAllTags, getSearchIndex } from '../../../lib/posts';
import Link from 'next/link';

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(tag => ({
    tag: tag,
  }));
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  const capitalizedTag = tag
    ? tag.charAt(0).toUpperCase() + tag.slice(1)
    : 'Tema';
  return {
    title: `Artículos sobre #${capitalizedTag}`,
  };
}

export default async function TagPage({ params }) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  const allTags = getAllTags();
  const searchIndex = getSearchIndex();
  const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);

  return (
    <div className="w-full">
      <header className="py-10 text-center border-b border-slate-200/50 dark:border-slate-800/50 mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-800 dark:text-slate-100">
          Artículos sobre <span className="text-indigo-600 dark:text-sky-400">#{capitalizedTag}</span>
        </h1>
        <p className="mt-2 text-xs md:text-sm text-slate-400 dark:text-slate-500 font-medium">
          Mostrando {posts.length} {posts.length === 1 ? 'artículo' : 'artículos'} de esta categoría
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start my-8 w-full">
        <div className="w-full lg:flex-grow lg:max-w-[780px]">
          <PostsList posts={posts} title={null} />
        </div>

        <aside className="w-full lg:w-[320px] shrink-0 space-y-6 lg:sticky lg:top-24 mt-4 lg:mt-0">
          <div className="bg-white/40 dark:bg-slate-900/10 p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/45">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Buscar</h3>
            <SearchBox
              posts={searchIndex}
              inputClassName="w-full p-2.5 pl-10 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-white/40 dark:bg-slate-900/10 p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/45">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Temas populares</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(t => {
                const cap = t.charAt(0).toUpperCase() + t.slice(1);
                const isActive = t === tag;
                return (
                  <Link
                    key={t}
                    href={`/tags/${encodeURIComponent(t)}`}
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

          <div className="w-full h-[250px] border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl flex flex-col items-center justify-center text-center p-4 select-none">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-1">Publicidad</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Espacio reservado (300x250)</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
