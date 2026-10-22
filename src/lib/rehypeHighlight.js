import { createLowlight } from 'lowlight';

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

function walk(node, fn) {
  fn(node);
  (node.children ?? []).forEach((child) => walk(child, fn));
}

/**
 * Minimal syntax-highlighting plugin for react-markdown (rehype).
 * Same job as `rehype-highlight`, but that package always bundles all 37 "common" languages
 * even if you pass your own list. Using lowlight directly keeps only the ones we register.
 * Fenced blocks without a (known) language are left as plain text, like before.
 */
export default function rehypeHighlight({ languages }) {
  const lowlight = createLowlight(languages);
  return (tree) => {
    walk(tree, (node) => {
      if (node.type !== 'element' || node.tagName !== 'pre') return;
      const code = (node.children ?? []).find((c) => c.type === 'element' && c.tagName === 'code');
      if (!code) return;
      const classes = Array.isArray(code.properties?.className) ? code.properties.className : [];
      const lang = classes.find((c) => String(c).startsWith('language-'))?.slice('language-'.length);
      if (!lang || !lowlight.registered(lang)) return;
      code.children = lowlight.highlight(lang, textOf(code)).children;
      code.properties.className = [...classes, 'hljs'];
    });
  };
}
