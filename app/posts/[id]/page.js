import { getAllPostIds, getPostData } from '../../../lib/posts';
import Date from '../../components/date';

import utilStyles from '../../../styles/utils.module.css';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from '../../components/code-block';

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

        <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({node, ...props}) => <Link href={props.href} {...props} />,
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <CodeBlock
                codestring={String(children).replace(/\n$/, '')}
                language={match[1]}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}>
          {postData.content}
        </ReactMarkdown>

        {/* <div dangerouslySetInnerHTML={{ __html: postData.content }} /> */}
      </article>
    </>
  );
}

export async function generateStaticParams() {
  const allPostIds = getAllPostIds();
  return allPostIds;
}
