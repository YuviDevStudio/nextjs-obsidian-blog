import { getPostData, getAllPostIds } from '../../../lib/posts';
import Date from '../../components/date';
import MarkdownRenderer from '../../components/markdown-renderer';
import { notFound } from 'next/navigation';

// Force static generation for post pages and provide static params at build time
export const dynamic = 'force-static';

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const postData = await getPostData(resolvedParams.id);
  if (!postData) {
    return notFound();
  }
  return {
    title: postData.title,
  };
}

export async function generateStaticParams() {
  const posts = getAllPostIds();
  return posts.map((p) => ({ id: p.params.id }));
}

export default async function Post({ params }) {
  const resolvedParams = await params
  const postData = await getPostData(resolvedParams.id);
  if (!postData) {
    return notFound();
  }

  return (
    <>
      <article className='px-4'>
        <h1 className='text-3xl font-bold'>{postData.title}</h1>
        <div className='text-gray-600 dark:text-gray-400'>
          <Date dateString={postData.date} />
        </div>
        <MarkdownRenderer content={postData.content} />
      </article>
    </>
  );
}
