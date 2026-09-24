import {
  getPostData,
  getAllPostIds,
  getRelatedPosts,
  getTagSlug,
} from '../../../lib/posts';
import Date from '../../components/date';
import MarkdownRenderer from '../../components/markdown-renderer';
import RelatedPosts from '../../components/relatedPosts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ResponsiveImage from '../../components/responsive-image';
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
    // Public short URL (/:slug) is the canonical one. /posts/:slug serves
    // the same content via internal rewrite, so point Google at one URL.
    alternates: {
      canonical: `/${resolvedParams.id}`,
    },
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
    <div className="w-full flex justify-center items-start py-6">
      {/* Center Column: Main readable article content */}
      <article className="w-full max-w-[720px] flex-grow px-2 md:px-0">
        {/* Navigation back */}
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-sky-400 mb-6 transition-colors !no-underline"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
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
                    href={`/tags/${getTagSlug(tag)}`}
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
            <span className="ml-1 text-slate-500 dark:text-slate-400">
              <Date dateString={postData.date} />
            </span>
          </div>
        </header>

        {/* Hero image for the post */}
        {postData.featured_image && (
          <div className="relative w-full h-[240px] sm:h-[340px] rounded-2xl overflow-hidden mb-8 border border-slate-200/20 dark:border-slate-800/40">
            <ResponsiveImage
              src={postData.featured_image}
              alt={postData.title || ''}
              sizes="(max-width: 640px) 100vw, 720px"
              priority
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main rendered text body */}
        <div className="w-full">
          <MarkdownRenderer content={postData.content} />
        </div>

        {/* Related posts */}
        <RelatedPosts posts={getRelatedPosts(postData.id)} />
      </article>
    </div>
  );
}
