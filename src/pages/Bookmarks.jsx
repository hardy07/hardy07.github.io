import { bookmarks } from '../data/bookmarks.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import Markdown from '../components/Markdown.jsx';
import Utterances from '../components/Utterances.jsx';
import intro from '../content/bookmarks.md?raw';

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });

// Equivalent of _layouts/bookmarks.html + bookmarks.md
export default function Bookmarks() {
  useDocumentMeta({ title: 'Bookmarks', description: 'Useful online tools and resources', path: '/bookmarks.html' });
  return (
    <>
      <Markdown>{intro}</Markdown>

      {Object.entries(bookmarks).map(([category, items]) => (
        <section key={category}>
          <h3>{capitalize(category)}</h3>
          <ul>
            {[...items].sort(byName).map((item) => (
              <li key={item.link}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.name}
                </a>
                <ul>
                  <li>{item.description}</li>
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <hr />

      <Utterances key="bookmarks" label="comments" theme="preferred-color-scheme" style={{ marginTop: '2rem' }} />
    </>
  );
}
