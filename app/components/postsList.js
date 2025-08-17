'use client'

import Link from 'next/link'
import Image from 'next/image'
import Date from './date'
import { useTheme } from './theme-provider'

export default function PostsList({ posts = [] }) {
  const { theme } = useTheme()

  return (
    <>
      <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} py-1 mb-4`}>
        <h1 className={`text-[22px] ${theme === 'dark' ? 'text-gray-100' : 'text-gray-600'} ml-6`}>Lo Último</h1>
      </div>
      <ul>
        {posts.map(({ id, date, title, description, tags, featured_image }) => (
          <li key={id} className=' px-1 md:px-0'>
            <Link href={`/${id}`} className='!no-underline'>
              <div className='flex flex-row justify-between max-w-[600px] mx-auto'>
                <div className='flex flex-col'>
                  <h1 className='text-[26px] font-semibold'>{title}</h1>
                  <p className='text-gray-400 text-[12px] my-1 md:my-0'>
                    <Date dateString={date} />
                  </p>
                  <p className="text-gray-600 text-[14px] hidden md:block">{description}</p>
                  <p className='text-gray-400 text-[12px] mb-1 hidden md:block'>
                    {tags && tags.map((tag, index) => (
                      <span key={index} className='mr-2'>#{tag}</span>
                    ))}
                  </p>
                </div>
                <div>
                  {featured_image && (
                    <Image src={featured_image} alt={title} width={365} height={140} className='w-[200px] md:w-[365px] h-[90px] md:h-[140px] overflow-hidden object-cover' />
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-[14px] md:hidden">{description}</p>
              <p className='text-gray-400 text-[12px] mb-1 md:hidden'>
                {tags && tags.map((tag, index) => (
                  <span key={index} className='mr-2'>#{tag}</span>
                ))}
              </p>
              <hr className='border-t-0.5 border-gray-200' />
            </Link>
            <br />
          </li>
        ))}
      </ul>
    </>
  )
}
