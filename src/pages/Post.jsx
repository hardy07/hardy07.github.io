import { useParams } from 'react-router-dom';
import { site } from '../config.js';
import { getPostByUrl } from '../lib/posts.js';
import { formatDate } from '../lib/format.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import Markdown from '../components/Markdown.jsx';
import ShareLinks from '../components/ShareLinks.jsx';
import PostNav from '../components/PostNav.jsx';
import Utterances from '../components/Utterances.jsx';
import NotFound from './NotFound.jsx';

const pad = (n) => String(n).padStart(2, '0');

function PostView({ post }) {
  useDocumentMeta({ title: post.title, description: post.description, path: post.url, type: 'article' });
  const { dateParts } = post;
  const iso = `${dateParts.y}-${pad(dateParts.m)}-${pad(dateParts.d)}`;

  return (
    <>
      <article className="post h-entry" itemScope itemType="http://schema.org/BlogPosting">
        <header className="post-header">
          <h1 className="post-title p-name" itemProp="name headline">
            {post.title}
          </h1>
          <p className="post-meta">
            <time className="dt-published" dateTime={iso} itemProp="datePublished">
              {formatDate(dateParts)}
            </time>
            {' • '}
            <span itemProp="author" itemScope itemType="http://schema.org/Person">
              <span className="p-author h-card" itemProp="name">
                {post.author || site.author}
              </span>
            </span>
          </p>
        </header>

        <div className="share-links no-print">
          <ShareLinks post={post} />
        </div>

        <div className="post-content e-content" itemProp="articleBody">
          <Markdown>{post.content}</Markdown>
          <div className="no-print">
            <PostNav post={post} />
          </div>
        </div>

        <a className="u-url" href={post.url} hidden />
      </article>

      {/* key remounts the comment widget per post so each page gets its own thread */}
      <Utterances key={post.url} label="Comment" theme="github-dark" />
    </>
  );
}

export default function Post() {
  const { year, month, day, slug } = useParams();
  // Jekyll URLs end in .html; accept the bare form too
  const url = `/${year}/${month}/${day}/${slug.replace(/\.html$/, '')}.html`;
  const post = getPostByUrl(url);
  return post ? <PostView post={post} /> : <NotFound />;
}
