import { getSortedPostsData, getAllTags, getSearchIndex } from '../lib/posts';
import FeaturedPosts from './components/featuredPosts';
import PostsList from './components/postsList';
import SearchBox from './components/search-box';
import Link from 'next/link';
import Script from 'next/script';
import AdSterra300x250 from './components/adSterra300x250';
import AdsterraAd from './components/adsterra';
import AdsterraNative from './components/adsterraNative';
export default function Page() {
  const allPostsData = getSortedPostsData();
  const allTags = getAllTags();
  const searchIndex = getSearchIndex();

  return (
    <div className="w-full">
      {/* Horizontal banner over Destacados (responsive sizes) */}
      <div className="flex justify-center mb-8">
        {/* Mobile: 320x50 */}
        <div className="md:hidden">
          <AdsterraAd
            adKey="600a62f273419ce5b266e40e08a81c33"
            invokeUrl="https://www.highperformanceformat.com/600a62f273419ce5b266e40e08a81c33/invoke.js"
            width={320}
            height={50}
          />
        </div>
        {/* Tablet: 468x60 */}
        <div className="hidden md:block lg:hidden">
          <AdsterraAd
            adKey="35b84f46d8daeef74382c1fa88fd3925"
            invokeUrl="https://www.highperformanceformat.com/35b84f46d8daeef74382c1fa88fd3925/invoke.js"
            width={468}
            height={60}
          />
        </div>
        {/* Desktop: 728x90 */}
        <div className="hidden lg:block">
          <AdsterraAd
            adKey="d582b729d318dfc560127c66866bc171"
            invokeUrl="https://www.highperformanceformat.com/d582b729d318dfc560127c66866bc171/invoke.js"
            width={728}
            height={90}
          />
        </div>
      </div>

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
          {/* Horizontal banner over Lo Último (desktop only) */}
          <div className="hidden lg:flex justify-center mb-6">
            <AdsterraAd
              adKey="35b84f46d8daeef74382c1fa88fd3925"
              invokeUrl="https://www.highperformanceformat.com/35b84f46d8daeef74382c1fa88fd3925/invoke.js"
              width={468}
              height={60}
            />
          </div>
          <PostsList posts={allPostsData} title="Lo Último" />
        </div>

        {/* Right Column: Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6 lg:sticky lg:top-24 mt-4 lg:mt-0">
          {/* Search Widget */}
          <div className="bg-white border border-slate-200 dark:bg-slate-900/10 dark:border-slate-800/45 p-5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
              Buscar
            </h3>
            <SearchBox posts={searchIndex} />
          </div>

          {/* Tags Cloud */}
          <div className="bg-white border border-slate-200 dark:bg-slate-900/10 dark:border-slate-800/45 p-5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
              Temas populares
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
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

          {/* Ad Space: Adsterra 300x250 */}
          <div className="w-full min-h-[250px] flex flex-col items-center justify-center">
            <AdSterra300x250 variant="home" />
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-2 select-none">
              Publicidad
            </span>
            <div
              id="adsterra-300x250-home"
              className="w-[300px] h-[250px] max-w-full overflow-hidden"
            />
          </div>
        </aside>
      </div>

      {/* Adsterra popunder and social banner scripts
      <Script
        src="https://indefinitelynutmegbile.com/43/e5/3b/43e53bdd9b809f2c4f8d75b9182cd75e.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://pl30757502.effectivecpmnetwork.com/94/ff/05/94ff05bbc2e8b841806c99819695b650.js"
        strategy="afterInteractive"
      /> */}

      {/* Native Banner (4:1) */}
      <AdsterraNative />
    </div>
  );
}
