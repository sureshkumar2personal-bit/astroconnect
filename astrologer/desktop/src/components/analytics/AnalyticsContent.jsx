import { navigate } from '@shared/lib/router.js';
import { Sec, Table } from '../section/kit.jsx';
import { contentPosts } from '@shared/data/mockAnalytics.js';

// Content analytics: post-wise Views, Likes, Comments and Audience type (spec 13, AD-145).
// Each row opens the post in Benefits & Content.
export default function AnalyticsContent() {
  return (
    <Sec title="Content">
      <Table bare cols={['Post', 'Audience', 'Views', 'Likes', 'Comments']}
        rows={contentPosts.map((p) => ({
          key: p.id,
          cells: [p.title, p.aud, p.views, p.likes, p.comments],
          onOpen: () => navigate(`/content/p/${p.id}`),
        }))} />
    </Sec>
  );
}
