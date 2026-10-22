import { useEffect } from 'react';
import { buildMeta } from './seo.js';

function upsert(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

function setMeta(attr, key, value) {
  const el = upsert(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta');
    m.setAttribute(attr, key);
    return m;
  });
  el.setAttribute('content', value);
}

/** Keeps <title>, description, canonical and Open Graph tags in sync with the current page. */
export function useDocumentMeta({ title, description, path, type }) {
  useEffect(() => {
    const meta = buildMeta({ title, description, path, type });
    document.title = meta.title;
    setMeta('name', 'description', meta.description);
    for (const [key, value] of Object.entries(meta.og)) {
      setMeta(key.startsWith('twitter:') ? 'name' : 'property', key, value);
    }
    const link = upsert('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.rel = 'canonical';
      return l;
    });
    link.href = meta.canonical;
  }, [title, description, path, type]);
}
