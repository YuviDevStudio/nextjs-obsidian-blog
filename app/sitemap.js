import { getSortedPostsData, getAllTags } from '../lib/posts';

const SITE_URL = 'https://jotaedra.com';

export default function sitemap() {
  const posts = getSortedPostsData();
  const tags = getAllTags();

  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/politica-de-privacidad`,
      lastModified: new Date('2026-09-18'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Public short URLs (/:slug) are canonical. Do NOT list /posts/:slug
    // to avoid duplicate-content confusion in Search Console.
    ...posts.map((post) => ({
      url: `${SITE_URL}/${post.id}`,
      lastModified: post.date ? new Date(post.date) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    ...tags.map((tag) => ({
      url: `${SITE_URL}/tags/${encodeURIComponent(tag)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    })),
  ];
}
