'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback, useRef } from 'react';

const FeaturedPosts = ({ allPosts = [] }) => {
    const featuredPosts = allPosts.slice(0, 3);
    const [currentIndex, setCurrentIndex] = useState(0);
    const count = featuredPosts.length;
    const carouselRef = useRef(null);

    const handleScroll = useCallback(() => {
        const el = carouselRef.current;
        if (!el) return;
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        setCurrentIndex((prev) =>
            prev === idx ? prev : Math.min(idx, count - 1)
        );
    }, [count]);

    const scrollTo = useCallback((index) => {
        const el = carouselRef.current;
        if (!el) return;
        el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
    }, []);

    if (count === 0) {
        return null;
    }

    const renderPost = ({ id, title, featured_image, tags = [] }, isPriority = false) => {
        const displayTag = tags && tags.length > 0 ? tags[0] : null;
        const capitalizedTag = displayTag ? displayTag.charAt(0).toUpperCase() + displayTag.slice(1) : '';

        return (
            <div key={id} className='group relative h-[320px] rounded-2xl overflow-hidden shadow-md dark:shadow-slate-950/40 border border-slate-200/20 dark:border-slate-800/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-slate-100 dark:bg-slate-900'>
                <Link href={`/${id}`} className='relative block w-full h-full'>
                    {featured_image ? (
                    <Image
                        src={featured_image}
                        alt={title || ''}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={isPriority}
                        className="object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                    />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500/30 to-sky-500/30" />
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent z-10 transition-opacity group-hover:opacity-95' />
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
        );
    };

    return (
        <section className='my-6'>
            {/* Desktop: grid */}
            <div className='hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0'>
                {featuredPosts.map((post, i) => renderPost(post, true))}
            </div>

            {/* Mobile: carousel */}
            <div className='lg:hidden relative'>
                <div
                    ref={carouselRef}
                    onScroll={handleScroll}
                    className='flex overflow-x-auto snap-x snap-mandatory scrollbar-hide'
                >
                    {featuredPosts.map((post, i) => {
                        const displayTag = post.tags && post.tags.length > 0 ? post.tags[0] : null;
                        const capitalizedTag = displayTag ? displayTag.charAt(0).toUpperCase() + displayTag.slice(1) : '';

                        return (
                            <div
                                key={post.id}
                                className='w-full flex-shrink-0 snap-center px-4 md:px-0'
                                aria-hidden={i !== currentIndex}
                            >
                                <div className='group relative h-[320px] rounded-2xl overflow-hidden shadow-md dark:shadow-slate-950/40 border border-slate-200/20 dark:border-slate-800/40 transition-all duration-300 bg-slate-100 dark:bg-slate-900'>
                                    <Link href={`/${post.id}`} className='relative block w-full h-full'>
                                        {post.featured_image ? (
                                        <Image
                                            src={post.featured_image}
                                            alt={post.title || ''}
                                            fill
                                            sizes="(min-width: 768px) 100vw, calc(100vw - 2rem)"
                                            priority={i === 0}
                                            className="object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                                        />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-indigo-500/30 to-sky-500/30" />
                                        )}
                                        <div className='absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent z-10 transition-opacity group-hover:opacity-95' />
                                        <div className='absolute bottom-0 left-0 right-0 p-5 text-white z-20 flex flex-col justify-end h-full pointer-events-none'>
                                            {capitalizedTag && (
                                                <span className="inline-block self-start px-2 py-0.5 mb-2 rounded bg-indigo-600/90 text-[10px] font-bold uppercase tracking-wider text-indigo-50 dark:bg-sky-500/90 dark:text-sky-950">
                                                    {capitalizedTag}
                                                </span>
                                            )}
                                            <h2 className='text-lg md:text-xl text-white font-bold font-display leading-snug group-hover:text-indigo-200 dark:group-hover:text-sky-300 transition-colors duration-250 line-clamp-3'>
                                                {post.title}
                                            </h2>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Dots overlay for navigation */}
                {count > 1 && (
                    <div className='absolute bottom-3 left-0 right-0 z-30 flex items-center justify-center gap-1.5 pointer-events-auto'>
                        {featuredPosts.map((_, dotIndex) => (
                            <button
                                key={dotIndex}
                                type="button"
                                onClick={() => scrollTo(dotIndex)}
                                className={`rounded-full transition-all ${dotIndex === currentIndex ? 'bg-white w-3 h-1.5' : 'bg-white/50 w-1.5 h-1.5'}`}
                                aria-label={`Ir al destacado ${dotIndex + 1}`}
                                aria-current={dotIndex === currentIndex ? 'true' : undefined}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default FeaturedPosts
