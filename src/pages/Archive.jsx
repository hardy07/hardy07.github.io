import { Link } from "react-router-dom";
import { posts } from "../lib/posts.js";
import { useDocumentMeta } from "../lib/useDocumentMeta.js";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// "29 August 2026"
const formatLongDate = ({ y, m, d }) => `${d} ${MONTHS[m - 1]} ${y}`;

// archive.html: every post, newest first, one per line
export default function Archive() {
  useDocumentMeta({ title: "Blog Archive", path: "/archive.html" });
  return (
    <article className="post">
      <header className="post-header">
        <h1 className="post-title">Archive</h1>
      </header>
      <div className="post-content">
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {posts.map((post) => (
            <li key={post.url} style={{ margin: "0 0 1.1rem" }}>
              {formatLongDate(post.dateParts)} -{" "}
              <Link to={post.url}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
