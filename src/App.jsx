import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Post from './pages/Post.jsx';
import Archive from './pages/Archive.jsx';
import ArchiveDate from './pages/ArchiveDate.jsx';
import Bookmarks from './pages/Bookmarks.jsx';
import NotFound from './pages/NotFound.jsx';

// URLs are identical to the Jekyll site (including the .html endings) so existing links,
// search results and Utterances comment threads (keyed by pathname) keep working.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="archive.html" element={<Archive />} />
        <Route path="archive-date.html" element={<ArchiveDate />} />
        <Route path="bookmarks.html" element={<Bookmarks />} />
        <Route path=":year/:month/:day/:slug" element={<Post />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
