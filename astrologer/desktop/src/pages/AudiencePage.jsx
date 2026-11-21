import useAudience, { findUser } from '@shared/hooks/useAudience.js';
import AudienceList from '../components/audience/AudienceList.jsx';
import CustomerProfile from '../components/audience/CustomerProfile.jsx';

// Audience (spec 11_AUDIENCE.md, AD-135 – AD-137). Routes:
//   #/audience                one customer list (All Users / Followers / Subscribers)
//   #/audience/user/<uid>     the exact User Profile (AD-78)
const userId = (route) => (route.parts[0] === 'user' ? route.parts[1] : null);

export function meta(route, ctx) {
  const uid = userId(route);
  if (uid) return { title: findUser(uid, ctx).name, subtitle: uid, parent: '/audience' };
  return { title: 'Audience', subtitle: 'One list of your customers' };
}

export default function AudiencePage({ route, ctx }) {
  const s = useAudience();
  const uid = userId(route);
  if (uid) return <CustomerProfile u={findUser(uid, ctx)} />;
  return <AudienceList s={s} />;
}
