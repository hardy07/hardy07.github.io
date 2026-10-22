import { site } from '../config.js';
import SocialLinks from './SocialLinks.jsx';

export default function Footer() {
  return (
    <footer className="site-footer h-card">
      <data className="u-url" value="/" />
      <div className="wrapper">
        <h2 className="footer-heading">{site.title}</h2>
        <div className="footer-col-wrapper">
          <div className="footer-col footer-col-1">
            <ul className="contact-list">
              <li className="p-name">{site.author}</li>
              <li>
                <a className="u-email" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col footer-col-2">
            <SocialLinks />
          </div>
          <div className="footer-col footer-col-3">
            <p>{site.description}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
