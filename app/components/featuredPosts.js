import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const FeaturedPosts = ({ allPosts = [] }) => {
    // Select the latest 3 posts stably to prevent Next.js hydration mismatches
    const featuredPosts = allPosts.slice(0, 3);

    return (
        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6 px-4 md:px-0'>
            {featuredPosts.map(({ id, title, featured_image, tags = [] }) => {
                const displayTag = tags && tags.length > 0 ? tags[0] : null;
                const capitalizedTag = displayTag ? displayTag.charAt(0).toUpperCase() + displayTag.slice(1) : '';

                return (
                    <div key={id} className='group relative h-[320px] rounded-2xl overflow-hidden shadow-md dark:shadow-slate-950/40 border border-slate-200/20 dark:border-slate-800/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-slate-100 dark:bg-slate-900'>
                        <Link href={`/posts/${id}`} className='relative block w-full h-full'>
                            <Image
                                src={featured_image}
                                alt={title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                priority
                                className="object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                            />
                            {/* Gradient Overlay */}
                            <div className='absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent z-10 transition-opacity group-hover:opacity-95' />
                            
                            {/* Text content */}
                            <div className='absolute bottom-0 left-0 right-0 p-5 text-white z-20 flex flex-col justify-end h-full'>
                                {capitalizedTag && (
                                    <span className="inline-block self-start px-2 py-0.5 mb-2 rounded bg-indigo-600/90 text-[10px] font-bold uppercase tracking-wider text-indigo-50 dark:bg-sky-500/90 dark:text-sky-950">
                                        {capitalizedTag}
                                    </span>
                                )}
                                <h2 className='text-lg md:text-xl text-white font-bold font-display leading-snug group-hover:text-indigo-200 dark:group-hover:text-sky-300 transition-colors duration-250 line-clamp-3'>
                                    {title}
                                </h2>
                            </div>
                        </Link>
                    </div>
                )
            })}
        </section>
    )
}


export default FeaturedPosts