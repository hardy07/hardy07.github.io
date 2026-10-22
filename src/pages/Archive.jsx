import { Link } from 'react-router-dom';
import { postsByTag } from '../lib/posts.js';
import { formatMonthYear } from '../lib/format.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';

// archive.html: posts grouped by tag
export default function Archive() {
  useDocumentMeta({ title: 'Blog Archive', path: '/archive.html' });
  return (
    <article className="post">
      <header className="post-header">
        <h1 className="post-title">Blog Archive</h1>
      </header>
      <div className="post-content">
        <Link to="/archive-date.html">Sort by date</Link>
        {postsByTag().map(([tag, tagPosts]) => (
          <div key={tag}>
            <h3>{tag}</h3>
            <ul>
              {tagPosts.map((post) => (
                <li key={post.url}>
                  <Link to={post.url}>
                    {formatMonthYear(post.dateParts)} - {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}
