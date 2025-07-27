
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from './components/date';
import Image from 'next/image';
import FeaturedPosts from './components/featuredPosts';

export default function Page() {
  const allPostsData = getSortedPostsData();
  return (
    <>
      <section>
        <h2 className='text-bold text-center mt-2 mb-6'>Bienvenidos al Blog de JotaEDRA</h2>
        <FeaturedPosts />
        <ul>
          {allPostsData.map(({ id, date, title, description, tags, featured_image }) => (
            <li key={id}>
              <Link href={`/${id}`} className='!no-underline'>
              <div className='flex flex-row justify-center w-[900px]'>
                <div className='flex flex-col leading-tight mr-4'>
                <h1 className='text-[22px] max-w-[300px]'>{title}</h1>
                <p className='text-gray-600 text-[12px] mb-1'>
                <Date dateString={date} />
              </p>
                <p className='text-gray-600 text-[12px] mb-4'>
                  {tags && tags.map((tag, index) => (
                    <span key={index} className='mr-2'>#{tag}</span>
                  ))}
                </p>
                <p className="text-gray-600 text-[14px] max-w-[300px]">{description}</p>
                </div>
                <div>
                {featured_image && (
                  <Image src={featured_image} alt={title} width={300} height={140} className='w-[300px] h-[140px] overflow-hidden object-cover' />
                )}
                </div>
              </div>
              </Link>
              <br />
              
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
