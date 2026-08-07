import Image from 'next/image';
import Link from 'next/link';

const RelatedPosts = ({ posts = [] }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-12 mb-2">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-slate-800 dark:text-slate-100">
          Relacionados
        </h2>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          {posts.length} {posts.length === 1 ? 'artículo' : 'artículos'}
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 snap-x snap-mandatory">
        {posts.map((post) => {
          const displayTag =
            post.tags && post.tags.length > 0 ? post.tags[0] : null;
          const capitalizedTag = displayTag
            ? displayTag.charAt(0).toUpperCase() + displayTag.slice(1)
            : '';

          return (
            <div
              key={post.id}
              className="group relative flex-shrink-0 w-[240px] sm:w-[260px] h-[200px] rounded-2xl overflow-hidden shadow-md dark:shadow-slate-950/40 border border-slate-200/20 dark:border-slate-800/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-slate-100 dark:bg-slate-900 snap-start"
            >
              <Link
                href={`/${post.id}`}
                className="relative block w-full h-full !no-underline"
              >
                {post.featured_image ? (
                  <Image
                    src={post.featured_image}
                    alt={post.title || ''}
                    fill
                    sizes="(max-width: 640px) 240px, 260px"
                    className="object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500/30 to-sky-500/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent z-10 transition-opacity group-hover:opacity-95" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20 flex flex-col justify-end">
                  {capitalizedTag && (
                    <span className="inline-block self-start px-2 py-0.5 mb-2 rounded bg-indigo-600/90 text-[10px] font-bold uppercase tracking-wider text-indigo-50 dark:bg-sky-500/90 dark:text-sky-950">
                      {capitalizedTag}
                    </span>
                  )}
                  <h3 className="text-sm md:text-base text-white font-bold font-display leading-snug group-hover:text-indigo-200 dark:group-hover:text-sky-300 transition-colors duration-250 line-clamp-3">
                    {post.title}
                  </h3>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedPosts;
