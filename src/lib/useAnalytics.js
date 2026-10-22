import { useEffect } from 'react';
import { site } from '../config.js';

const dnt = () =>
  window.doNotTrack === '1' || navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes' || navigator.msDoNotTrack === '1';

/**
 * Google Analytics 4. Production only, and respects Do Not Track (same as the old minima include).
 * A single-page app has to report each route change itself, which is what the second effect does.
 */
export function useAnalytics(pathname) {
  useEffect(() => {
    if (!import.meta.env.PROD || !site.googleAnalyticsId || dnt()) return;
    if (window.gtag) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${site.googleAnalyticsId}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', site.googleAnalyticsId, { send_page_view: false });
  }, []);

  useEffect(() => {
    if (!import.meta.env.PROD || !window.gtag) return;
    window.gtag('event', 'page_view', { page_path: pathname, page_location: window.location.href });
  }, [pathname]);
}
