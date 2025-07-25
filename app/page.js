
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from './components/date';
import utilStyles from '../styles/utils.module.css';

export default function Page() {
  const allPostsData = getSortedPostsData();
  return (
    <>
      <section>
        <h2 className='text-bold'>Blog</h2>
        <ul>
          {allPostsData.map(({ id, date, title }) => (
            <li key={id}>
              <Link href={`/${id}`}>{title}</Link>
              <br />
              <small className='text-gray-600'>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
