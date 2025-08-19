import { getSortedPostsData } from '../lib/posts';
import FeaturedPosts from './components/featuredPosts';
import PostsList from './components/postsList';

export default function Page() {
  // Server component: safe to use fs-based helpers here
  const allPostsData = getSortedPostsData();

  return (
    <>
      <section>
        <h2 className='text-bold text-center mt-2 mb-6 hidden md:block'>Bienvenidos al Blog de JotaEDRA</h2>
        <div className="max-w-[1100px] mx-auto">
          <FeaturedPosts allPosts={allPostsData} />
        </div>
        <PostsList posts={allPostsData} />
      </section>
    </>
  );
}
