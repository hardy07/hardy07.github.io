import { site } from '../config.js';

const SPRITE = '/assets/minima-social-icons.svg';

function Item({ href, icon, label }) {
  return (
    <li>
      <a href={href}>
        <svg className="svg-icon">
          <use xlinkHref={`${SPRITE}#${icon}`} />
        </svg>{' '}
        <span className="username">{label}</span>
      </a>
    </li>
  );
}

// Same icons and order as minima's social.html (github, linkedin, twitter, then RSS)
export default function SocialLinks() {
  return (
    <ul className="social-media-list">
      <Item href={`https://github.com/${site.githubUsername}`} icon="github" label={site.githubUsername} />
      <Item href={`https://www.linkedin.com/in/${site.linkedinUsername}`} icon="linkedin" label={site.linkedinUsername} />
      <Item href={`https://www.twitter.com/${site.twitterUsername}`} icon="twitter" label={site.twitterUsername} />
      <li>
        <a href="/feed.xml">
          <svg className="svg-icon">
            <use xlinkHref={`${SPRITE}#rss`} />
          </svg>{' '}
          <span>rss</span>
        </a>
      </li>
    </ul>
  );
}
