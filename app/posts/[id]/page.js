import { getAllPostIds, getPostData } from '../../../lib/posts';
import Date from '../../components/date';

import utilStyles from '../../../styles/utils.module.css';

import Link from 'next/link';
import MarkdownRenderer from '../../components/markdown-renderer'

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const postData = await getPostData(resolvedParams.id);
  return {
    title: postData.title,
  };
}

export default async function Post({ params }) {
  const resolvedParams = await params;
  const postData = await getPostData(resolvedParams.id);
  return (
    <>
      <article className='px-4'>
        <h1 className='text-3xl font-bold'>{postData.title}</h1>
        <div className='text-gray-600 dark:text-gray-400'>
          <Date dateString={postData.date} />
        </div>

  <MarkdownRenderer content={postData.content} />

        {/* <div dangerouslySetInnerHTML={{ __html: postData.content }} /> */}
      </article>
    </>
  );
}

export async function generateStaticParams() {
  const allPostIds = getAllPostIds();
  return allPostIds;
}

