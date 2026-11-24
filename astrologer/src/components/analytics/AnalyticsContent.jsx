import { Facts, Sec } from '@/components/ui/sectionKit.jsx';
import ExpandTable from '@/components/ui/ExpandTable.jsx';
import useContent from '@/hooks/useContent.js';
import { dt, fmtDateTime } from '@/lib/format.js';
import { contentPosts } from '@/data/mockAnalytics.js';

// Content analytics: post-wise Views, Likes, Comments and Audience type (spec 13, AD-145).
// Each row expands in place to show the post's details (no separate page).
function PostDetails({ a, post }) {
  const items = post
    ? [['Post ID', post.id], ['Type', post.kind], ['Format', post.fmt], ['Audience', post.aud], ['Status', post.st],
      ['Date', fmtDateTime(dt(post.at))], ['Views', a.views], ['Likes', a.likes], ['Comments', a.comments]]
    : [['Post ID', a.id], ['Audience', a.aud], ['Views', a.views], ['Likes', a.likes], ['Comments', a.comments]];
  return (
    <>
      <Facts items={items} />
      {post?.text && <p className="cm-pv-text">{post.text}</p>}
    </>
  );
}

export default function AnalyticsContent() {
  const { posts } = useContent();
  return (
    <Sec title="Content">
      <ExpandTable multi cols={['Post', 'Audience', 'Views', 'Likes', 'Comments']}
        rows={contentPosts.map((p) => ({
          key: p.id,
          cells: [p.title, p.aud, p.views, p.likes, p.comments],
          detail: () => <PostDetails a={p} post={posts.find((x) => x.id === p.id)} />,
        }))} />
    </Sec>
  );
}
