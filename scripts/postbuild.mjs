/**
 * Runs after `vite build`. Replaces what Jekyll plugins used to do and makes the static host
 * behave like the old site:
 *
 *  1. Writes a real HTML file for every URL (e.g. dist/2025/05/15/<slug>.html) with that page's
 *     <title>, description, canonical and Open Graph tags already in <head>. Link-preview
 *     crawlers (Slack, LinkedIn, X...) don't run JavaScript, so they need this.
 *  2. Writes dist/404.html, a copy of the app shell. GitHub Pages serves it for unknown URLs, so
 *     the React router can still handle them.
 *  3. Generates feed.xml (jekyll-feed) and sitemap.xml (jekyll-sitemap).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';

import { site } from '../src/config.js';
import { buildPosts } from '../src/lib/parsePost.js';
import { buildMeta } from '../src/lib/seo.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const postsDir = path.join(root, 'src', 'posts');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function loadPosts() {
  const names = (await fs.readdir(postsDir)).filter((n) => n.endsWith('.md'));
  const files = await Promise.all(
    names.map(async (n) => ({ path: n, raw: await fs.readFile(path.join(postsDir, n), 'utf8') })),
  );
  return buildPosts(files, Date.now()); // newest first, future-dated posts excluded
}

function withMeta(template, meta) {
  const tags = [
    `<link rel="canonical" href="${esc(meta.canonical)}" />`,
    ...Object.entries(meta.og).map(([k, v]) => {
      const attr = k.startsWith('twitter:') ? 'name' : 'property';
      return `<meta ${attr}="${k}" content="${esc(v)}" />`;
    }),
  ].join('\n    ');

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(meta.description)}" />`)
    .replace('</head>', `    ${tags}\n  </head>`);
}

async function writeFileDeep(rel, contents) {
  const full = path.join(dist, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, contents);
}

async function renderHtml(markdown) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown);
  // Feed readers need absolute URLs, and spaces in paths (img/ML 101/...) must be percent-encoded
  return String(file)
    .replace(/(src|href)="\//g, `$1="${site.url}/`)
    .replace(/(src|href)="([^"]*)"/g, (_, attr, url) => `${attr}="${url.replace(/ /g, '%20')}"`);
}

const cdata = (s) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

async function buildFeed(posts) {
  const entries = [];
  for (const p of posts.slice(0, 10)) {
    const link = site.url + p.url;
    const iso = new Date(p.date).toISOString();
    entries.push(`  <entry>
    <title type="html">${esc(p.title)}</title>
    <link href="${link}" rel="alternate" type="text/html" title="${esc(p.title)}" />
    <published>${iso}</published>
    <updated>${iso}</updated>
    <id>${link}</id>
    <content type="html" xml:base="${link}">${cdata(await renderHtml(p.content))}</content>
    <author><name>${esc(p.author || site.author)}</name></author>
${p.tags.map((t) => `    <category term="${esc(t)}" />`).join('\n')}
${p.description ? `    <summary type="html">${cdata(p.description)}</summary>\n` : ''}  </entry>`);
  }
  const updated = new Date(posts[0]?.date ?? Date.now()).toISOString();
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <generator>hardy07-github-io build script</generator>
  <link href="${site.url}/feed.xml" rel="self" type="application/atom+xml" />
  <link href="${site.url}/" rel="alternate" type="text/html" />
  <updated>${updated}</updated>
  <id>${site.url}/feed.xml</id>
  <title type="html">${esc(site.title)}</title>
  <subtitle>${esc(site.description)}</subtitle>
  <author><name>${esc(site.author)}</name></author>
${entries.join('\n')}
</feed>
`;
}

function buildSitemap(posts) {
  const urls = [
    { loc: '/', lastmod: posts[0] && new Date(posts[0].date) },
    { loc: '/archive.html' },
    { loc: '/archive-date.html' },
    { loc: '/bookmarks.html' },
    ...posts.map((p) => ({ loc: p.url, lastmod: new Date(p.date) })),
  ];
  const body = urls
    .map((u) => `  <url>\n    <loc>${site.url}${u.loc === '/' ? '/' : u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod.toISOString()}</lastmod>` : ''}\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
const posts = await loadPosts();

const pages = [
  { file: 'index.html', meta: buildMeta({ path: '/' }) },
  { file: 'archive.html', meta: buildMeta({ title: 'Blog Archive', path: '/archive.html' }) },
  { file: 'archive-date.html', meta: buildMeta({ title: 'Blog Archive', path: '/archive-date.html' }) },
  {
    file: 'bookmarks.html',
    meta: buildMeta({ title: 'Bookmarks', description: 'Useful online tools and resources', path: '/bookmarks.html' }),
  },
  { file: '404.html', meta: buildMeta({ title: 'Page not found', path: '/404.html' }) },
  ...posts.map((p) => ({
    file: p.url.slice(1),
    meta: buildMeta({ title: p.title, description: p.description, path: p.url, type: 'article' }),
  })),
];

for (const { file, meta } of pages) await writeFileDeep(file, withMeta(template, meta));
await writeFileDeep('feed.xml', await buildFeed(posts));
await writeFileDeep('sitemap.xml', buildSitemap(posts));
await writeFileDeep('.nojekyll', ''); // tell GitHub Pages not to run Jekyll over the output

console.log(`postbuild: wrote ${pages.length} pages, feed.xml, sitemap.xml`);
