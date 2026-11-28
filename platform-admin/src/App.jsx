import { useState } from 'react';
import LoginPage from './pages/Login/LoginPage.jsx';
import DashboardPlaceholder from './pages/Dashboard/DashboardPlaceholder.jsx';
import AdminLayout from './layout/AdminLayout.jsx';
import { getSession, signOut } from './auth/demoAuth.js';
import { clearRoute } from './router/useHashRoute.js';

// Common Login Screen (docs/03-platform-admin/02-platform-login.md), then
// role-based navigation: Admin → Platform Admin; User and Astrologer → a
// placeholder until those apps are connected. The demo session survives a
// refresh.
export default function App() {
  const [session, setSession] = useState(() => getSession());

  function handleSignOut() {
    signOut();
    clearRoute();
    setSession(null);
  }

  if (session?.role === 'admin') {
    return <AdminLayout session={session} onSignOut={handleSignOut} />;
  }
  if (session) {
    return <DashboardPlaceholder session={session} onSignOut={handleSignOut} />;
  }
  return <LoginPage onAuthenticated={setSession} />;
}
