import { site } from '../config.js';

/**
 * Everything that goes in <head> for a page. Used by the browser (to keep the tab title and
 * meta tags in sync while navigating) and by the build script (to bake the same tags into the
 * static HTML that link-preview crawlers read).
 */
export function buildMeta({ title, description, path = '/', type = 'website' }) {
  const isHome = path === '/';
  const fullTitle = title ? `${title} | ${site.title}` : `${site.title} | ${site.description}`;
  const desc = description || site.description;
  const url = site.url + (isHome ? '' : path);
  return {
    title: fullTitle,
    description: desc,
    canonical: url,
    og: {
      'og:title': title || site.title,
      'og:description': desc,
      'og:url': url,
      'og:type': type,
      'og:site_name': site.title,
      'og:image': site.image,
      'og:locale': 'en_US',
      'twitter:card': 'summary',
    },
    isHome,
  };
}
