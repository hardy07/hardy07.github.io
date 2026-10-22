import { Link } from 'react-router-dom';

function Item({ post, dir }) {
  const isPrev = dir === 'prev';
  const cls = `post_navi-item ${isPrev ? 'nav_prev' : 'nav_next'}`;
  const arrow = <div className="post_navi-arrow">{isPrev ? '<' : '>'}</div>;
  if (!post) {
    return (
      <a className={`${cls} disabled`} href="#" title={`No ${isPrev ? 'Previous' : 'Next'} Post`} onClick={(e) => e.preventDefault()}>
        {arrow}
        <div className="post_navi-label">No {isPrev ? 'Previous' : 'Next'} Post</div>
        <div><span>End of posts</span></div>
      </a>
    );
  }
  return (
    <Link className={cls} to={post.url} title={post.title}>
      {arrow}
      <div className="post_navi-label">{isPrev ? 'Previous' : 'Next'} Post</div>
      <div><span>{post.title}</span></div>
    </Link>
  );
}

export default function PostNav({ post }) {
  return (
    <>
      <hr />
      <div className="post_navi">
        <Item post={post.previous} dir="prev" />
        <Item post={post.next} dir="next" />
      </div>
    </>
  );
}
