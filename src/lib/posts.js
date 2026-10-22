import { buildPosts } from './parsePost.js';

// Vite inlines every markdown file in src/posts as a raw string at build time.
const modules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });
const files = Object.entries(modules).map(([path, raw]) => ({ path, raw }));

const now = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : Date.now();

export const posts = buildPosts(files, now); // newest first
export const getPostByUrl = (url) => posts.find((p) => p.url === url);

/** Posts grouped by tag, newest first within each tag (tags in order of first appearance, oldest post first, like Jekyll's site.tags). */
export function postsByTag() {
  const map = new Map();
  for (const post of [...posts].reverse()) {
    for (const tag of post.tags) {
      if (!map.has(tag)) map.set(tag, []);
      map.get(tag).unshift(post);
    }
  }
  return [...map.entries()];
}
