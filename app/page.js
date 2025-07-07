
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from './components/date';
import utilStyles from '../styles/utils.module.css';

export default function Page() {
  const allPostsData = getSortedPostsData();
  return (
    <>
      <section className={utilStyles.headingMd}>
        <p style={{fontSize: "0.9rem"}}>
          Some introductory text.
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
