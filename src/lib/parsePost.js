import { load as loadYaml, CORE_SCHEMA } from 'js-yaml';

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const FILENAME = /(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/;
const DATE = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?\s*(Z|[+-]\d{2}:?\d{2})?$/;

const pad = (n) => String(n).padStart(2, '0');

/**
 * Parse "2023-07-31 23:02:44 +0530" the way Jekyll does.
 * Returns the real instant (for sorting / the "future" check) plus the date exactly as
 * written (y/m/d), which is what Jekyll shows and uses in URLs. Using the written date avoids
 * a post dated 01:15 +0530 showing up as the previous day for readers west of India.
 */
function parseDate(value, fallback) {
  const str = String(value ?? '').trim();
  const m = DATE.exec(str);
  if (!m) return fallback;
  const [, y, mo, d, hh = '00', mm = '00', ss = '00', tzRaw = 'Z'] = m;
  let tz = tzRaw;
  if (tz !== 'Z' && !tz.includes(':')) tz = `${tz.slice(0, 3)}:${tz.slice(3)}`;
  const instant = new Date(`${y}-${mo}-${d}T${hh}:${mm}:${ss}${tz}`);
  return { instant, parts: { y: +y, m: +mo, d: +d } };
}

/** Turn one markdown file (filename + raw text) into a post object. */
export function parsePost(filename, raw) {
  const text = raw.replace(/^\uFEFF/, '');
  const name = FILENAME.exec(filename);
  if (!name) throw new Error(`Post filename must look like YYYY-MM-DD-title.md: ${filename}`);
  const [, fy, fmo, fd, slug] = name;

  const fm = FRONT_MATTER.exec(text);
  // CORE_SCHEMA keeps dates as strings, so we control timezone handling ourselves
  const data = fm ? loadYaml(fm[1], { schema: CORE_SCHEMA }) ?? {} : {};
  const content = fm ? fm[2] : text;

  const fileDate = {
    instant: new Date(`${fy}-${fmo}-${fd}T00:00:00Z`),
    parts: { y: +fy, m: +fmo, d: +fd },
  };
  const { instant, parts } = parseDate(data.date, fileDate);

  // Jekyll accepts `tags: a b` (string) or a YAML list. Posts without tags get "Other".
  let tags = data.tags ?? [];
  if (typeof tags === 'string') tags = tags.split(/[\s,]+/);
  tags = tags.filter(Boolean);
  if (tags.length === 0) tags = ['Other'];

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    author: data.author ?? null,
    tags,
    date: instant.getTime(),
    dateParts: parts,
    // Jekyll's default permalink: /:year/:month/:day/:title.html
    url: `/${parts.y}/${pad(parts.m)}/${pad(parts.d)}/${slug}.html`,
    content,
  };
}

/**
 * Parse every post, drop future-dated ones, sort newest-first and link prev/next.
 * `previous` is the older post, `next` the newer one (same as Jekyll's page.previous / page.next).
 */
export function buildPosts(files, now = Date.now()) {
  const posts = files
    .map(({ path, raw }) => parsePost(path.split('/').pop(), raw))
    .filter((p) => p.date <= now)
    .sort((a, b) => b.date - a.date);

  return posts.map((p, i) => ({
    ...p,
    next: posts[i - 1] ? { url: posts[i - 1].url, title: posts[i - 1].title } : null,
    previous: posts[i + 1] ? { url: posts[i + 1].url, title: posts[i + 1].title } : null,
  }));
}
