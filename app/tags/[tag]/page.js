import PostsList from '../../components/postsList';
import { getPostsByTag, getAllTags } from '../../../lib/posts';

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(tag => ({
    tag: tag,
  }));
}

export default async function TagPage({ params }) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-8">Posts tagged with "{tag}"</h1>
      <PostsList posts={posts} />
    </div>
  );
}
