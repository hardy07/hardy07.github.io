import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from '../lib/rehypeHighlight.js';
import bash from 'highlight.js/lib/languages/bash';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import ini from 'highlight.js/lib/languages/ini';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import plaintext from 'highlight.js/lib/languages/plaintext';
import powershell from 'highlight.js/lib/languages/powershell';
import python from 'highlight.js/lib/languages/python';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import dot from '../lib/dot.js';
import tsql from '../lib/tsql.js';

// Only the languages this blog uses, to keep the bundle small. Your old site shipped plaintext,
// powershell, tsql, dot, python and csharp; the rest are common extras for the kinds of posts you
// write. To highlight another language, import it from 'highlight.js/lib/languages/<name>' and add it here.
const languages = {
  bash, csharp, css, diff, ini, javascript, json, plaintext, powershell,
  python, shell, sql, typescript, xml, yaml,
  dot, tsql, // custom grammars carried over from the Jekyll site (src/lib)
};

const remarkPlugins = [remarkGfm];
// rehype-raw lets posts keep their inline HTML (<p align="center"><img ...></p>)
const rehypePlugins = [rehypeRaw, rehypeSlug, [rehypeHighlight, { languages }]];

/** Port of js/copy-code-button.js: a "Copy" button above each code block. */
function CodeBlock({ node, children, ...props }) {
  const preRef = useRef(null);
  const [label, setLabel] = useState('Copy');

  const copy = async (e) => {
    const button = e.currentTarget; // React clears currentTarget after the handler returns, so grab it before awaiting
    try {
      await navigator.clipboard.writeText(preRef.current.textContent);
      button.blur();
      setLabel('Copied!');
      setTimeout(() => setLabel('Copy'), 2000);
    } catch {
      setLabel('Error');
    }
  };

  return (
    <>
      <button type="button" className="copy-code-button" onClick={copy}>
        {label}
      </button>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </>
  );
}

const isInternal = (href) => href && href.startsWith('/') && !href.startsWith('//') && !/\.(xml|png|jpe?g|gif|webp|svg|pdf|zip)$/i.test(href);

function MarkdownLink({ node, href, children, ...props }) {
  return isInternal(href) ? (
    <Link to={href} {...props}>
      {children}
    </Link>
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

export default function Markdown({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      components={{ pre: CodeBlock, a: MarkdownLink }}
    >
      {children}
    </ReactMarkdown>
  );
}
