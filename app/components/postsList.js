import Link from 'next/link'
import Date from './date'
import ResponsiveImage from './responsive-image'

export default function PostsList({ posts = [], title = 'Lo Último' }) {
  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200 dark:border-slate-800/60 px-2">
          <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-black dark:text-slate-100">
            {title}
          </h2>
          <span className="text-xs text-black dark:text-slate-500 font-medium">
            {posts.length} {posts.length === 1 ? 'artículo' : 'artículos'}
          </span>
        </div>
      )}
      
      <ul className="space-y-4 px-2 sm:px-0">
        {posts.map(({ id, date, title: postTitle, description, tags, featured_image }, index) => (
          <li key={id}>
            <Link href={`/${id}`} className="block group !no-underline">
              <div className="flex flex-col sm:flex-row items-stretch gap-5 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/45 bg-white dark:bg-slate-900/20 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:shadow-md dark:hover:shadow-slate-950/30 transition-all duration-300">
                
                {featured_image && (
                  <div className="relative w-full h-[200px] sm:w-[200px] sm:h-[130px] rounded-xl overflow-hidden shrink-0 bg-white dark:bg-slate-800">
                    <ResponsiveImage
                      src={featured_image}
                      alt={postTitle || ''}
                      sizes="(max-width: 640px) 100vw, 200px"
                      priority={index === 0}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="flex flex-col flex-1 justify-between py-1 min-w-0">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold leading-snug font-display text-black dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors duration-250 line-clamp-2">
                      {postTitle}
                    </h3>
                    
                    {description ? (
                      <p className="text-black dark:text-slate-400 text-sm mt-2 line-clamp-2 leading-relaxed">
                        {description}
                      </p>
                    ) : null}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
                    {date ? (
                      <span className="text-black dark:text-slate-400 font-medium">
                        <Date dateString={date} />
                      </span>
                    ) : null}
                    
                    {tags && tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag, tagIndex) => {
                          const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
                          return (
                            <span 
                              key={tagIndex} 
                              className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-black dark:text-slate-400 border border-slate-200 dark:border-slate-700/30"
                            >
                              #{capitalizedTag}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
