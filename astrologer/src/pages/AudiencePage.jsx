import { useCallback } from 'react';
import useAudience, { audienceActions, findUser } from '@/hooks/useAudience.js';
import AudienceList from '@/components/audience/AudienceList.jsx';
import CustomerProfile, { ProfilePanel } from '@/components/audience/CustomerProfile.jsx';

// Audience (spec 11_AUDIENCE.md, AD-135 – AD-137). Routes:
//   #/audience                one customer list (All Users / Followers / Subscribers)
//   #/audience/user/<uid>     the exact User Profile (AD-78), for links from other pages;
//                             on the list, View Profile opens the same profile in a side panel
const userId = (route) => (route.parts[0] === 'user' ? route.parts[1] : null);

export function meta(route, ctx) {
  const uid = userId(route);
  if (uid) return { title: findUser(uid, ctx).name, subtitle: uid, parent: '/audience' };
  // Back goes to the Home dashboard.
  return { title: 'Audience', parent: '/' };
}

export default function AudiencePage({ route, ctx }) {
  const s = useAudience();
  const uid = userId(route);
  const close = useCallback(() => audienceActions.closeProfile(), []);
  if (uid) return <div className="au"><div className="au-card au-page-prof"><CustomerProfile u={findUser(uid, ctx)} /></div></div>;
  // View Profile opens the customer's profile in a side panel; the list keeps its tab, search, filters and page.
  const open = s.profile ? s.list.find((u) => u.uid === s.profile) : null;
  return (
    <>
      <div className="au"><AudienceList s={s} onView={(u) => audienceActions.openProfile(u.uid)} /></div>
      {open && <div className="au au--ovl"><ProfilePanel u={open} onClose={close} /></div>}
    </>
  );
}
