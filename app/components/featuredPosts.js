import { getSortedPostsData } from '../../lib/posts';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const FeaturedPosts = () => {
    const allPosts = getSortedPostsData()
    const featuredPosts = allPosts.sort(() => 0.5 - Math.random()).slice(0, 3);

    return (
        <section className='flex flex-row overflow-x-auto whitespace-nowrap items-center mx-auto justify-start w-screen lg:w-full no-scrollbar'>
            {featuredPosts.map(({ id, title, featured_image }) => {
                return (
                    <div key={id} className='relative w-[300px] h-76 m-2 mb-9 flex-shrink-0'>
                        <Link href={`/${id}`}>
                            <Image
                                src={featured_image}
                                alt={title}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                            <div className='absolute bottom-0 left-0 right-0 p-4 text-white gradient-overlay'>
                                <h2 className='text-xl font-bold'>{title}</h2>
                            </div>
                        </Link>
                    </div>
                )
            })}
        </section>
    )
}

export default FeaturedPosts