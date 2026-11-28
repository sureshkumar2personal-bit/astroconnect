import useProfile from '@/hooks/useProfile.js';
import ProfileOverview from '@/components/profile/ProfileOverview.jsx';
import ProfilePreview from '@/components/profile/ProfilePreview.jsx';
import { tabOf } from '@/components/profile/ProfileTabs.jsx';

// My Profile (spec 04_PROFILE_AND_VERIFICATION.md, AD-79 – AD-87). Routes:
//   #/profile             profile header + six horizontal section tabs, one section shown at a time
//   #/profile/<section>   Edit Profile on that section's tab — personal | professional | expertise |
//                         media (edited separately, AD-79) | verification | services
//   #/profile/preview     how users see the profile in the User App — AD-86
// Any other sub-path shows the profile (as in the reference).
const sectionOf = (route) => {
  const k = route.parts[0];
  return k && tabOf(k) ? k : null;
};

export function meta(route) {
  if (route.parts[0] === 'preview') return { title: 'Profile Preview', parent: '/profile' };
  if (sectionOf(route)) return { title: 'Edit Profile', subtitle: 'Only this section is changed', parent: '/profile' };
  // Back goes to the Home dashboard.
  return { title: 'My Profile', parent: '/' };
}

export default function ProfilePage({ route, mobile, ui, ctx }) {
  const s = useProfile();
  if (route.parts[0] === 'preview') return <ProfilePreview s={s} ctx={ctx} />;
  return <ProfileOverview s={s} mobile={mobile} ui={ui} ctx={ctx} editKey={sectionOf(route)} />;
}
