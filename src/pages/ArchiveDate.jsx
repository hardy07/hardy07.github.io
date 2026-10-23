import { Link } from "react-router-dom";
import { posts } from "../lib/posts.js";
import { formatYearMonthLong } from "../lib/format.js";
import { useDocumentMeta } from "../lib/useDocumentMeta.js";

// archive-date.html: posts grouped by "2025 May", newest first
export default function ArchiveDate() {
  useDocumentMeta({ title: "Blog Archive", path: "/archive-date.html" });

  const groups = [];
  for (const post of posts) {
    const name = formatYearMonthLong(post.dateParts);
    const last = groups[groups.length - 1];
    if (last && last.name === name) last.items.push(post);
    else groups.push({ name, items: [post] });
  }

  return (
    <article className="post">
      <header className="post-header">
        <h1 className="post-title">Blog Archive</h1>
      </header>
      <div className="post-content">
        <Link to="/archive.html">Sort by category</Link>
        {groups.map(({ name, items }) => (
          <div key={name}>
            <h3>{name}</h3>
            <ul>
              {items.map((post) => (
                <li key={post.url}>
                  <Link to={post.url}>{post.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}
