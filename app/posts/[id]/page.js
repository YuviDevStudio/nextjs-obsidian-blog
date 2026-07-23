import { getPostData, getAllPostIds } from '../../../lib/posts';
import Date from '../../components/date';
import MarkdownRenderer from '../../components/markdown-renderer';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Force static generation for post pages and provide static params at build time
export const dynamic = 'force-static';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const postData = getPostData(resolvedParams.id);
  if (!postData) {
    return { title: 'Post no encontrado' };
  }
  return {
    title: postData.title || 'JotaEDRA',
    description: postData.description || undefined,
  };
}

export async function generateStaticParams() {
  const posts = getAllPostIds();
  return posts.map((p) => ({ id: p.params.id }));
}

export default async function Post({ params }) {
  const resolvedParams = await params;
  const postData = getPostData(resolvedParams.id);
  if (!postData) {
    notFound();
  }

  return (
    <div className="w-full flex flex-col xl:flex-row gap-8 justify-center items-start py-6">
      
      {/* Left Sidebar: Skyscraper Ad Placeholder (hidden on small viewports) */}
      <aside className="hidden xl:flex flex-col w-[160px] sticky top-24 shrink-0 select-none">
        <div className="h-[600px] w-[160px] border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl flex flex-col items-center justify-center text-center p-3">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-1">Publicidad</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">Ad (160x600)</span>
        </div>
      </aside>

      {/* Center Column: Main readable article content */}
      <article className="w-full max-w-[720px] flex-grow px-2 md:px-0">
        
        {/* Navigation back */}
        <Link 
          href="/" 
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-sky-400 mb-6 transition-colors !no-underline"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Volver al inicio
        </Link>

        {/* Article header details */}
        <header className="mb-6">
          {postData.tags && postData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {postData.tags.map((tag, idx) => {
                const cap = tag.charAt(0).toUpperCase() + tag.slice(1);
                return (
                  <Link 
                    key={idx}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-50/60 text-indigo-600 dark:bg-sky-500/10 dark:text-sky-400 hover:opacity-90 transition-opacity !no-underline"
                  >
                    #{cap}
                  </Link>
                );
              })}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-slate-800 dark:text-slate-100 leading-tight mb-3">
            {postData.title}
          </h1>
          <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 font-medium">
            <span>Publicado el:</span>
            <span className="ml-1 text-slate-500 dark:text-slate-400"><Date dateString={postData.date} /></span>
          </div>
        </header>

        {/* Hero image for the post */}
        {postData.featured_image && (
          <div className="relative w-full h-[240px] sm:h-[340px] rounded-2xl overflow-hidden mb-8 border border-slate-200/20 dark:border-slate-800/40">
            <Image
              src={postData.featured_image}
              alt={postData.title || ''}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Main rendered text body */}
        <div className="w-full">
          <MarkdownRenderer content={postData.content} />
        </div>
      </article>

      {/* Right Sidebar: Large Ad blocks (hidden on smaller screens) */}
      <aside className="hidden lg:flex flex-col w-[300px] sticky top-24 shrink-0 gap-6 select-none">
        
        {/* Banner Ad 1 */}
        <div className="w-[300px] h-[250px] border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl flex flex-col items-center justify-center text-center p-4">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-1">Publicidad</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">Espacio reservado (300x250)</span>
        </div>

        {/* Banner Ad 2 */}
        <div className="w-[300px] h-[600px] border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl flex flex-col items-center justify-center text-center p-4">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-1">Publicidad</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">Espacio reservado (300x600)</span>
        </div>
      </aside>

    </div>
  );
}
