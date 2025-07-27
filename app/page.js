
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from './components/date';
import utilStyles from '../styles/utils.module.css';

export default function Page() {
  const allPostsData = getSortedPostsData();
  return (
    <>
      <section>
        <h2 className='text-bold text-center'>Welcome to JotaEDRA's Blog!</h2>
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
                <p className='text-gray-600 text-[12px] mb-1'>
                  {tags && tags.map((tag, index) => (
                    <span key={index} className='mr-2'>#{tag}</span>
                  ))}
                </p>
                <p className="text-gray-600 text-[14px] max-w-[300px]">{description}</p>
                </div>
                <div>
                {featured_image && (
                  <img src={featured_image} alt={title} className='h-[140px] w-[300px]' />
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
