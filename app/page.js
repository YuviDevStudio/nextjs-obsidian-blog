
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
        <h2 className='text-bold text-center mt-2 mb-6 hidden md:block'>Bienvenidos al Blog de JotaEDRA</h2>
        <div className="max-w-[1100px] mx-auto">
          <FeaturedPosts />
        </div>
        <div className='bg-gray-100 py-1 mb-4'>
        <h1 className='text-[22px] text-gray-600 ml-6'>Lo Último</h1>
        </div>
        <ul>
          {allPostsData.map(({ id, date, title, description, tags, featured_image }) => (
            <li key={id}>
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
              {/* <div className='flex flex-row justify-center w-full mx-auto bg-gray-50 shadow-md'>
                <div className='flex flex-col leading-tight ml-4 md:ml-0 mr-4'>
                <h1 className='text-[26px] font-semibold max-w-[345px]'>{title}</h1>
                <p className='text-gray-400 text-[12px] my-1'>
                <Date dateString={date} />
              </p>
                
                <p className="text-gray-600 text-[14px] max-w-[345px]">{description}</p>
                <p className='text-gray-400 text-[12px] mb-1 md:mb-4'>
                  {tags && tags.map((tag, index) => (
                    <span key={index} className='mr-2'>#{tag}</span>
                  ))}
                </p>
                </div>
                <div>
                {featured_image && (
                  <Image src={featured_image} alt={title} width={365} height={140} className='max-w-[365px] h-[90px] md:h-[140px] overflow-hidden object-cover' />
                )}
                </div>
              </div> */}
              </Link>
              <br />
              
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
