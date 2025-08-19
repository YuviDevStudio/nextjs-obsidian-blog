import posts from './posts.json';

export function getSortedPostsData() {
  // Sort posts by date
  return posts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  return posts.map((post) => {
    return {
      params: {
        id: post.id,
      },
    };
  });
}

export async function getPostData(id) {
  const post = posts.find((post) => post.id === id);
  if (!post) {
    return null;
  }
  return {
    id,
    ...post,
  };
}
