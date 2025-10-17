import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const FeaturedPosts = ({ allPosts = [] }) => {
    const featuredPosts = allPosts.sort(() => 0.5 - Math.random()).slice(0, 3);

    return (
    <section className='flex flex-row overflow-x-auto items-center mx-auto justify-start w-screen lg:w-full no-scrollbar'>
            {featuredPosts.map(({ id, title, featured_image }) => {
                return (
                    <div key={id} className='relative w-[300px] h-76 m-2 mb-4 flex-shrink-0'>
                        <Link href={`/${id}`}>
                            <Image
                                src={featured_image}
                                alt={title}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                            <div className='absolute bottom-0 left-0 right-0 p-4 text-white gradient-overlay max-w-full overflow-hidden'>
                                <h2 className='text-xl font-bold break-words truncate whitespace-normal max-w-full'>{title}</h2>
                            </div>
                        </Link>
                    </div>
                )
            })}
        </section>
    )
}

export default FeaturedPosts