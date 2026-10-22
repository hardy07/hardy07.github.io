import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';

export default function NotFound() {
  useDocumentMeta({ title: 'Page not found', path: '/404.html' });
  return (
    <article className="post">
      <header className="post-header">
        <h1 className="post-title">Page not found</h1>
      </header>
      <div className="post-content">
        <p>
          That page doesn't exist. Try the <Link to="/">home page</Link> or the{' '}
          <Link to="/archive.html">archive</Link>.
        </p>
      </div>
    </article>
  );
}
