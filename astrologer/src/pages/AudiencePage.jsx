import useAudience, { findUser } from '@/hooks/useAudience.js';
import AudienceList from '@/components/audience/AudienceList.jsx';
import CustomerProfile from '@/components/audience/CustomerProfile.jsx';

// Audience (spec 11_AUDIENCE.md, AD-135 – AD-137). Routes:
//   #/audience                one customer list (All Users / Followers / Subscribers)
//   #/audience/user/<uid>     the exact User Profile (AD-78), for links from other pages;
//                             on the list, View Profile opens the same details in a popup
const userId = (route) => (route.parts[0] === 'user' ? route.parts[1] : null);

export function meta(route, ctx) {
  const uid = userId(route);
  if (uid) return { title: findUser(uid, ctx).name, subtitle: uid, parent: '/audience' };
  // Back goes to the Home dashboard.
  return { title: 'Audience', parent: '/' };
}

export default function AudiencePage({ route, ctx, ui }) {
  const s = useAudience();
  const uid = userId(route);
  if (uid) return <CustomerProfile u={findUser(uid, ctx)} />;
  // View Profile opens the customer's details in a popup on the Audience page (no navigation).
  const view = (u) => ui.dialog({ title: `${u.name} · ${u.uid}`, body: () => <CustomerProfile u={u} /> });
  return <AudienceList s={s} onView={view} />;
}
