import BrandMark from '../../components/BrandMark.jsx';
import './DashboardPlaceholder.css';

// Placeholder destinations after demo sign-in for the User and Astrologer
// roles. Those apps live in their own folders and will be connected later;
// Admin sessions open the Platform Admin layout instead (App.jsx).

const DESTINATIONS = {
  user: {
    title: 'User App Dashboard',
    note: 'The User App opens here once it is connected to AstroConnect.',
  },
  astrologer: {
    title: 'Astrologer App Dashboard',
    note: 'The Astrologer App opens here once it is connected to AstroConnect.',
  },
};

export default function DashboardPlaceholder({ session, onSignOut }) {
  const destination = DESTINATIONS[session.role];
  return (
    <main className="dash">
      <header className="dash__bar">
        <BrandMark />
        <button type="button" className="dash__signout" onClick={onSignOut}>
          Sign Out
        </button>
      </header>
      <section className="dash__card" aria-labelledby="dash-title">
        <p className="dash__eyebrow">Signed in as {session.fullName}</p>
        <h1 id="dash-title" className="dash__title">
          {destination.title}
        </h1>
        <p className="dash__email">{session.email}</p>
        <p className="dash__note">{destination.note}</p>
      </section>
    </main>
  );
}
