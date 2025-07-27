
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
        <div className="max-w-[1100px] mx-auto">
          <FeaturedPosts />
        </div>
        <ul>
          {allPostsData.map(({ id, date, title, description, tags, featured_image }) => (
            <li key={id}>
              <Link href={`/${id}`} className='!no-underline'>
              <div className='flex flex-col md:flex-row justify-center items-center w-full mx-auto'>
                <div className='flex flex-col leading-tight ml-4 md:ml-0 mr-4'>
                <h1 className='text-[22px] max-w-[345px]'>{title}</h1>
                <p className='text-gray-600 text-[12px] mb-1'>
                <Date dateString={date} />
              </p>
                <p className='text-gray-600 text-[12px] mb-4'>
                  {tags && tags.map((tag, index) => (
                    <span key={index} className='mr-2'>#{tag}</span>
                  ))}
                </p>
                <p className="text-gray-600 text-[14px] max-w-[345px]">{description}</p>
                </div>
                <div className="mt-4 md:mt-0">
                {featured_image && (
                  <Image src={featured_image} alt={title} width={365} height={140} className='w-[365px] h-[140px] overflow-hidden object-cover' />
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
