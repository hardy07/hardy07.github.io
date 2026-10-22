import { useEffect, useRef } from 'react';
import { site } from '../config.js';

/**
 * Utterances comments (GitHub issues). The script reads location.pathname when it loads, so
 * remount it (via `key`) on every route change; each page then maps to its own issue thread.
 */
export default function Utterances({ label = 'Comment', theme = 'github-dark', style }) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('repo', site.commentsRepo);
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('label', label);
    script.setAttribute('theme', theme);
    container.appendChild(script);
    return () => {
      container.innerHTML = '';
    };
  }, [label, theme]);

  return <section id="comments" ref={ref} style={style} />;
}
