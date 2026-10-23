import { Link } from "react-router-dom";
import { site } from "../config.js";
import { posts } from "../lib/posts.js";
import { formatDate } from "../lib/format.js";
import { useDocumentMeta } from "../lib/useDocumentMeta.js";
import Markdown from "../components/Markdown.jsx";
import intro from "../content/home.md?raw";

// Equivalent of _layouts/home.html + index.md
export default function Home() {
  useDocumentMeta({ path: "/" });
  return (
    <div className="home">
      <Markdown>{intro}</Markdown>

      {posts.length > 0 && (
        <>
          <h2 className="post-list-heading">Latest Posts</h2>
          <ul className="post-list">
            {posts.slice(0, site.homePostLimit).map((post) => (
              <li key={post.url}>
                <span className="post-meta">{formatDate(post.dateParts)}</span>
                <h3 style={{ fontSize: "inherit" }}>
                  <Link
                    className="post-link"
                    to={post.url}
                    style={{ fontSize: "inherit" }}
                  >
                    {post.title}
                  </Link>
                </h3>
              </li>
            ))}
          </ul>

          <p className="rss-subscribe">
            subscribe <a href="/feed.xml">via RSS</a>
          </p>
        </>
      )}
    </div>
  );
}
