import useProfile, { profileStore } from '@/hooks/useProfile.js';
import ProfileOverview from '@/components/profile/ProfileOverview.jsx';
import ProfileEdit from '@/components/profile/ProfileEdit.jsx';
import ProfilePreview from '@/components/profile/ProfilePreview.jsx';

// Profile & Verification (spec 04_PROFILE_AND_VERIFICATION.md, AD-79 – AD-87). Routes:
//   #/profile             overview: completion, section cards, Service Information, Verification
//   #/profile/<section>   edit one section (personal | professional | expertise | media) — AD-79
//   #/profile/preview     how users see the profile in the User App — AD-86
// Any other sub-path shows the overview (as in the reference).
const sectionOf = (route) => {
  const k = route.parts[0];
  return k && profileStore.get().sections[k] ? k : null;
};

export function meta(route) {
  if (route.parts[0] === 'preview') {
    return { title: 'Profile Preview', subtitle: 'How users see your profile in the User App', parent: '/profile' };
  }
  const k = sectionOf(route);
  if (k) return { title: `Edit ${profileStore.get().sections[k].title}`, subtitle: 'Only this section is changed', parent: '/profile' };
  return { title: 'Profile', subtitle: 'Each section is edited separately' };
}

export default function ProfilePage({ route, mobile, ui, ctx }) {
  const s = useProfile();
  if (route.parts[0] === 'preview') return <ProfilePreview s={s} ctx={ctx} />;
  const k = sectionOf(route);
  if (k) return <ProfileEdit key={k} sectionKey={k} section={s.sections[k]} ui={ui} />;
  return <ProfileOverview s={s} mobile={mobile} ui={ui} />;
}
