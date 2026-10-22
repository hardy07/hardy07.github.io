import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useAnalytics } from '../lib/useAnalytics.js';

// Equivalent of _layouts/default.html
export default function Layout() {
  const { pathname, hash } = useLocation();
  useAnalytics(pathname);

  // A browser does this for you on real page loads; in a single-page app we do it on navigation
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <div className="no-print">
        <Header />
      </div>
      <main className="page-content" aria-label="Content">
        <div className="wrapper">
          <Outlet />
        </div>
      </main>
      <div className="no-print">
        <Footer />
      </div>
    </>
  );
}
