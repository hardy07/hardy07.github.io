/**
 * Renders every route to HTML (no browser needed) and checks the output.
 * Run with: npm run test:render
 */
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from '../src/App.jsx';
import { posts } from '../src/lib/posts.js';

const render = (url) =>
  renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );

let failed = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`);
  if (!cond) failed++;
};

check('3 posts loaded, newest first', posts.length === 3 && posts[0].date > posts[2].date);
console.log('      urls:', posts.map((p) => p.url).join('\n            '));

const home = render('/');
check('home: intro text', home.includes('mostly about ML, DL, LLMs'));
check('home: lists all posts', posts.every((p) => home.includes(p.title.replace(/&/g, '&amp;'))));
check('home: nav + footer', home.includes('Blog Archive') && home.includes('sakthiveloffcl@gmail.com'));
check('home: RSS link', home.includes('href="/feed.xml"'));

for (const p of posts) {
  const html = render(p.url);
  check(`post ${p.slug}: title + body`, html.includes('post-title') && html.length > 3000);
  check(`post ${p.slug}: share + comments`, html.includes('share-buttons') && html.includes('id="comments"'));
  check(`post ${p.slug}: prev/next nav`, html.includes('post_navi'));
}

const vc = render(posts.find((p) => p.slug.includes('version-control')).url);
check('version-control: inline <img> kept', vc.includes('/img/VersionControl/git_logo.png'));
check('version-control: code block has copy button + hljs', vc.includes('copy-code-button') && vc.includes('hljs'));
check('version-control: raw HTML style attr applied', vc.includes('display:inline') || vc.includes('display: inline'));

const mc = render(posts.find((p) => p.slug.includes('minecraft')).url);
check('minecraft: bash tokens highlighted', mc.includes('hljs-'));

check('archive by tag: has tag headings', ['version-control', 'machine-learning', 'aws'].every((t) => render('/archive.html').includes(`<h3>${t}</h3>`)));
check('archive by date: has "2025 May"', render('/archive-date.html').includes('<h3>2025 May</h3>'));
check('bookmarks: intro text', render('/bookmarks.html').includes('Various online tools'));
check('unknown URL -> 404 page', render('/nope/nothing.html').includes('Page not found'));
check('bad post URL -> 404 page', render('/2023/07/31/does-not-exist.html').includes('Page not found'));

console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed');
process.exit(failed ? 1 : 0);
