import React, { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

import Navbar from "./components/Navbar/Navbar";
import NotifDropdown from "./components/NotifDropdown/NotifDropdown";
import TopUpModal from "./components/TopUpModal/TopUpModal";
import Dialog from "./components/Dialog/Dialog";
import Toast from "./components/Toast/Toast";

import Home from "./pages/Home/Home";
import Explore from "./pages/Explore/Explore";
import AstrologerProfile from "./pages/AstrologerProfile/AstrologerProfile";
import Services from "./pages/Services/Services";
import TextQuestion from "./pages/TextQuestion/TextQuestion";
import Activity from "./pages/Activity/Activity";
import Wallet from "./pages/Wallet/Wallet";
import Profile from "./pages/Profile/Profile";
import Appointment from "./pages/Appointment/Appointment";
import Session from "./pages/Session/Session";
import Kundli from "./pages/Kundli/Kundli";
import Following from "./pages/Following/Following";
import Notifications from "./pages/Notifications/Notifications";
import Remedy from "./pages/Remedy/Remedy";
import AnswerDetail from "./pages/AnswerDetail/AnswerDetail";
import EditProfile from "./pages/EditProfile/EditProfile";
import Help from "./pages/Help/Help";
import Login from "./pages/Login/Login";
import InstantList from "./pages/InstantList/InstantList";
import { InstantProvider } from "./pages/Instant/InstantContext";
import InstantDetails from "./pages/Instant/InstantDetails";
import InstantPay from "./pages/Instant/InstantPay";
import InstantWaiting from "./pages/Instant/InstantWaiting";
import InstantRefund from "./pages/Instant/InstantRefund";

function Shell() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  // The original scrolled back to the top whenever the screen changed.
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="sky app-shell">
      <Navbar />
      <main className="scr app-main" ref={mainRef}>
        <div className="app-content">
          <InstantProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/:section" element={<Explore />} />
            <Route path="/astro" element={<AstrologerProfile />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/instant/details" element={<InstantDetails />} />
            <Route path="/services/instant/pay" element={<InstantPay />} />
            <Route path="/services/instant/waiting" element={<InstantWaiting />} />
            <Route path="/services/instant/refund" element={<InstantRefund />} />
            <Route path="/services/:kind" element={<InstantList />} />
            <Route path="/text" element={<TextQuestion />} />
            <Route path="/text/:tab" element={<TextQuestion />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/appt" element={<Appointment />} />
            <Route path="/appt/:tab" element={<Appointment />} />
            <Route path="/session" element={<Session />} />
            <Route path="/kundli" element={<Kundli />} />
            <Route path="/follow" element={<Following />} />
            <Route path="/notifs" element={<Notifications />} />
            <Route path="/remedy" element={<Remedy />} />
            <Route path="/remedy/:id" element={<Remedy />} />
            <Route path="/answer" element={<AnswerDetail />} />
            <Route path="/edit" element={<EditProfile />} />
            <Route path="/help" element={<Help />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </InstantProvider>
        </div>
      </main>
      <NotifDropdown />
      <TopUpModal />
      <Dialog />
      <Toast />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}

export default App;
