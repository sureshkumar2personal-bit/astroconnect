import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useApp, cssToStyle } from "../../context/AppContext";
import heroImg from "../../assets/images/hero.jpg";
import AstroAvatar from "../../components/AstroAvatar/AstroAvatar";
import HeroWheel from "../../components/HeroWheel/HeroWheel";
import "./Home.css";

const S = cssToStyle;
const SVC = {
  "Text Question": { k: "text", desc: "Have a question? Get a personal answer from an astrologer.", label: "Ask Now", bg: "var(--sv-text-bg)", ink: "var(--sv-text-ink)", btn: "var(--sv-text-btn)" },
  Appointment: { k: "appt", desc: "Schedule a personal session at your convenient time.", label: "Book Now", bg: "var(--sv-appt-bg)", ink: "var(--sv-appt-ink)", btn: "var(--sv-appt-btn)" },
  "Instant Call": { k: "call", desc: "Talk to an astrologer and get guidance right away.", label: "Call Now", bg: "var(--sv-call-bg)", ink: "var(--sv-call-ink)", btn: "var(--sv-call-btn)" },
  "Instant Chat": { k: "chat", desc: "Connect through chat and discuss what\u2019s on your mind.", label: "Chat Now", bg: "var(--sv-chat-bg)", ink: "var(--sv-chat-ink)", btn: "var(--sv-chat-btn)" },
};
const TINTS = [
  { bg: "var(--at-bg-0)", avBg: "var(--at-av-0)" },
  { bg: "var(--at-bg-1)", avBg: "var(--at-av-1)" },
  { bg: "var(--at-bg-2)", avBg: "var(--at-av-2)" },
];

const ICONS = {
  cal: <><rect x="3" y="5" width="18" height="16" rx="3"></rect><path d="M3 10h18M8 3v4M16 3v4"></path><path d="m9 15 2 2 4-4"></path></>,
  q: <><path d="M4 5h16v11H9l-5 4z"></path><path d="M9 10.5h6M12 7.5v6"></path></>,
};

// One card layout (the original Recent Activity card) used by both columns, so they line up row by row.
function DashCard({ num, icon, title, status, rows, desc, go, muted }) {
  return (
    <article className="ac-card" role="button" tabIndex={0} onClick={go} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }} style={S("background: var(--h-b-FFFCF6); border: 1px " + (muted ? "dashed" : "solid") + " var(--h-o-EFE4CF); border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 12px; cursor: pointer; min-width: 0")}>
      <div style={S("display: flex; align-items: center; justify-content: space-between; gap: 8px")}>
        <div style={S("display: flex; align-items: center; gap: 10px; min-width: 0")}>
          <span style={S("font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 700; color: var(--h-t-8A6A26); line-height: 1")}>{num}</span>
          <span style={S("width: 36px; height: 36px; flex-shrink: 0; border-radius: 11px; display: flex; align-items: center; justify-content: center")}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[icon] || ICONS.q}</svg>
          </span>
          <span style={S("font-weight: 700; font-size: 15.5px")}>{title}</span>
        </div>
        <span style={S("font-size: 12px; font-weight: 700; color: var(--h-t-4A5452); background: var(--h-b-EEE7D9); padding: 4px 10px; border-radius: 999px; white-space: nowrap")}>{status}</span>
      </div>
      <div style={S("display: grid; grid-template-columns: 96px 1fr; gap: 4px 10px; font-size: 14px")}>
        {rows.map((r, i) => (<Fragment key={i}><span style={S("color: var(--h-t-5E6866)")}>{r[0]}</span><span style={S("font-weight: 600")}>{r[1]}</span></Fragment>))}
      </div>
      <p style={S("margin: 0; font-size: 13px; color: var(--h-t-5E5440)")}>{desc}</p>
    </article>
  );
}

function Home() {
  const app = useApp();
  const hour = new Date().getHours();
  const greeting = hour >= 5 && hour < 12 ? "Good morning" : hour >= 12 && hour < 17 ? "Good afternoon" : "Good evening";
  const goExplore = app.goExplore, goServices = app.goServices, goActivity = app.goActivity;
  const tickerCount = app.homeTicker.length;
  const tickerLoop = app.homeTicker.concat(app.homeTicker).map((t) => ({ text: t.text, go: t.go }));
  const navigate = useNavigate();
  const svcs = app.services.map((v) => { const d = SVC[v.name] || SVC.Appointment; return { ...d, title: v.name, go: v.go, isText: d.k === "text", isAppt: d.k === "appt", isCall: d.k === "call", isChat: d.k === "chat" }; });
  const astros = app.onlineList.map((a, i) => ({
    id: a.id, name: a.name, spec: a.spec, online: true, offline: false, status: "Online", statusInk: "var(--green)", dot: "#2E9E6E",
    rating: a.ratingAvg, reviews: a.ratingN, exp: a.yearsN, call: a.callFrom, chat: a.chatFrom,
    hasRibbon: a.sub || a.fol, ribbon: a.sub ? "Subscribed" : "Following", ribbonBg: a.sub ? "var(--gold)" : "var(--acc2)",
    ...TINTS[i % 3], open: a.open, onCall: a.call, onChat: a.chat, onNotify: a.open,
  }));
  const who = (s) => (s || "").replace(/^(with|Astrologer:)\s*/, "");
  const actionCards = app.homeActions.map((x) => x.key === "appt"
    ? { key: x.key, icon: "cal", title: x.label, status: x.badge, rows: [["Service", "Voice consultation"], ["Astrologer", who(x.sub)], ["Date & time", x.rows[0][1] + ", " + x.rows[1][1]]], desc: x.rel + " · " + x.rows[2][1] + " · " + x.rows[3][1], go: x.go }
    : x.key === "slot"
      ? { key: x.key, icon: "q", title: x.label, status: x.badge, rows: [["Service", "Text Question"], ["Astrologer", who(x.sub)], ["Expires", x.exp.replace(/^Expires\s*/, "")]], desc: x.text + " " + x.left + ".", go: x.go }
      : { key: x.key, icon: "q", title: x.label, status: x.badge, rows: [["Service", "Text Question"], ["Astrologer", who(x.sub)], ["Answered on", x.rows[0][1]]], desc: x.rows[1][1], go: x.go });
  // Each dashboard column always shows 3 cards: real items first, then muted default suggestions.
  // Get Guidance Your Way: Text Question, Appointment, Instant Call / Chat (one card), Live.
  const guide = [
    svcs.find((v) => v.title === "Text Question"),
    svcs.find((v) => v.title === "Appointment"),
    { ...SVC["Instant Call"], title: "Instant Call / Chat", desc: "Talk or chat with an astrologer and get guidance right away.", label: "Call / Chat Now", go: () => navigate("/services/call"), isCall: true },
    { ...SVC["Instant Chat"], title: "Live", desc: "Join free live sessions from astrologers.", label: "Watch Live", go: () => navigate("/services/live"), isLive: true },
  ].filter(Boolean);
  const svcGo = (name) => (svcs.find((v) => v.title === name) || {}).go || goServices;
  const hasKey = (k) => actionCards.some((c) => c.key === k);
  const defaultActions = [
    !hasKey("appt") && { key: "d-appt", icon: "cal", title: "Book an appointment", status: "Suggested", rows: [["Service", "Voice consultation"], ["Astrologer", "Choose an astrologer"], ["Date & time", "Pick a slot"]], desc: "Schedule a personal session at your convenient time.", go: svcGo("Appointment"), muted: true },
    !hasKey("slot") && !hasKey("ans") && { key: "d-text", icon: "q", title: "Ask a Text Question", status: "Suggested", rows: [["Service", "Text Question"], ["Astrologer", "Choose an astrologer"], ["Answer in", "Within 30 days"]], desc: "Get a personal written answer from an astrologer.", go: svcGo("Text Question"), muted: true },
    { key: "d-instant", icon: "q", title: "Instant Call or Chat", status: "Suggested", rows: [["Service", "Instant Call / Chat"], ["Astrologer", "Choose an online astrologer"], ["Start", "Right away"]], desc: "Talk or chat with an available astrologer now.", go: svcGo("Instant Call"), muted: true },
  ].filter(Boolean);
  const shownActions = actionCards.concat(defaultActions).slice(0, 3);
  // Static sample shown when there is no real answered question yet (design preview).
  const ans = app.homeAnswer || { who: "Dr. Priya", topic: "Relationship guidance", ago: "20 min ago", go: () => {} };
  const rem = app.homeReminder;
  const activityCards = app.homeLog.slice(0, 3).map((x) => ({
    key: "a" + x.id, icon: x.type === "Appointment" ? "cal" : "q", title: x.type === "Question" ? "Text Question" : x.type, status: x.status,
    rows: [["Service", x.type === "Appointment" ? "Voice consultation" : "Text Question"], ["Astrologer", x.who || "—"], ["Date & time", x.dateText]], desc: x.title, go: x.open,
  }));
  const shownActivity = activityCards.concat(Array.from({ length: Math.max(0, 3 - activityCards.length) }, (_, i) => ({
    key: "p" + i, icon: "q", title: "No activity yet", status: "\u2014", rows: [["Service", "\u2014"], ["Astrologer", "\u2014"], ["Date & time", "\u2014"]], desc: "Your bookings and questions will appear here.", go: () => {}, muted: true,
  })));
  return (
    <div className="home-page page">
      <div className="home-dash">
<main className="d-wrap">
  <div className="d-top">
    <section className="d-hero" style={S("position: relative; overflow: hidden; border-radius: 28px; background: #0E4D4A; color: #FFFFFF; padding: 32px; min-height: 260px; display: flex; flex-direction: column; justify-content: space-between; gap: 20px; box-shadow: 0 14px 30px rgba(14,77,74,0.18)")}>
      <img src={heroImg} alt="" aria-hidden="true" style={S("position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; pointer-events: none")} />
      <HeroWheel />
      <div aria-hidden="true" style={S("position: absolute; inset: 0; background: linear-gradient(90deg, rgba(14,10,38,0.78), rgba(14,10,38,0.35) 55%, rgba(14,10,38,0.05)); pointer-events: none")} />
      <div style={S("position: relative; display: flex; flex-direction: column; gap: 4px")}>
        <div style={S("display: flex; gap: 10px; align-items: center; flex-wrap: wrap")}>
          <span style={S("color: #CFE3DF; font-size: 15px")}>{greeting},</span>
          
        </div>
        <h1 style={S("margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 44px; font-weight: 700; line-height: 1.05")}>{app.pname}{"\u00a0"}<span aria-hidden="true">🙏</span></h1>
      </div>
      <div style={S("position: relative; display: flex; flex-direction: column; gap: 10px; max-width: 440px")}>
        <span style={S("font-size: 12px; letter-spacing: 1.4px; text-transform: uppercase; color: #E8C987; font-weight: 700")}>Today's insight · Leo</span>
        <p style={S("margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 600; line-height: 1.2")}>A calm Moon favours steady decisions about work and money.</p>
        <button onClick={app.goKundli} style={S("align-self: flex-start; margin-top: 4px; height: 44px; padding: 0 18px; border-radius: 999px; border: 1px solid #E8C987; background: transparent; color: #F5DFAE; font-weight: 600; font-size: 14px")}>Read full horoscope →</button>
      </div>
    </section>
    <div style={S("display: flex; flex-direction: column; gap: 16px")}>
      {ans ? (
<div style={S("background: var(--h-b-FFFFFF); border: 1px solid var(--h-o-EFE7D8); border-radius: 22px; padding: 18px; display: flex; gap: 14px; align-items: center; box-shadow: 0 2px 10px rgba(28,43,42,0.04)")}>
        <div style={S("position: relative; width: 48px; height: 48px; flex-shrink: 0; border-radius: 15px; background: var(--h-b-E5F0E8); color: var(--h-t-2F6B47); display: flex; align-items: center; justify-content: center")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"></path><path d="M10 20a2 2 0 0 0 4 0"></path></svg>
          <span style={S("position: absolute; top: 9px; right: 10px; width: 8px; height: 8px; border-radius: 50%; background: #C2410C; border: 2px solid var(--h-o-E5F0E8)")}></span>
        </div>
        <div style={S("flex: 1; min-width: 0")}>
          <div style={S("font-weight: 700")}>{ans.who} answered your question</div>
          <div style={S("color: var(--h-t-5E6866); font-size: 13px")}>{ans.topic} · {ans.ago}</div>
        </div>
        <button onClick={ans.go} style={S("height: 40px; padding: 0 16px; border-radius: 999px; border: none; background: var(--h-b-E3EFEC); color: var(--h-t-0E4D4A); font-weight: 700; font-size: 13.5px")}>View</button>
      </div>
) : null}
{true ? (
<div style={S("flex: 1; background: var(--h-b-FBF1DE); border: 1px solid var(--h-o-F0DFBC); border-radius: 22px; padding: 16px; display: flex; flex-direction: column; gap: 10px; justify-content: space-between")}>
        <div style={S("display: flex; gap: 16px; align-items: center")}>
          <div style={S("width: 56px; height: 56px; flex-shrink: 0; border-radius: 50%; background: var(--h-b-FFF8EA); border: 1px solid var(--h-o-EBD5A6); display: flex; align-items: center; justify-content: center")}>
            <svg width="36" height="36" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 8c4 6 5 9 5 12a5 5 0 0 1-10 0c0-3 1-6 5-12z" fill="#E29A2E"></path>
              <path d="M24 14c2 3 2.5 5 2.5 6.5a2.5 2.5 0 0 1-5 0c0-1.5.5-3.5 2.5-6.5z" fill="#F7D27A"></path>
              <path d="M8 28h32c-1.5 7-8 11-16 11S9.5 35 8 28z" fill="#B8903F"></path>
              <path d="M14 39h20" stroke="#8A6A26" strokeWidth="2" strokeLinecap="round"></path>
            </svg>
          </div>
          <div style={S("display: flex; flex-direction: column; gap: 2px")}>
            <span style={S("font-size: 11.5px; letter-spacing: 1.1px; text-transform: uppercase; color: var(--h-t-7D5E1E); font-weight: 700")}>Daily atonement reminder</span>
            <span style={S("font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 700; line-height: 1.1")}>{rem.god}</span>
            <span style={S("color: var(--h-t-5E5440); font-size: 13.5px")}>{rem.when}</span>
          </div>
        </div>
        {rem.doneToday ? (
          <div style={S("height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: var(--h-b-DDF0E7); color: var(--h-t-135E4B); font-weight: 700; font-size: 14px")}>✓ Completed for today</div>
        ) : rem.snoozed ? (
          <div style={S("min-height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; text-align: center; padding: 6px 12px; background: var(--h-b-FFF8EA); color: var(--h-t-6E5218); font-weight: 600; font-size: 14px")}>{rem.snoozeText}</div>
        ) : (
          <div style={S("display: flex; gap: 10px")}>
            <button onClick={rem.done} style={S("flex: 1; height: 44px; border-radius: 14px; border: none; background: var(--h-b-0E4D4A); color: var(--h-t-FFFFFF); font-weight: 700; font-size: 14px")}>Mark as done</button>
            <button onClick={rem.snooze} style={S("flex: 1; height: 44px; border-radius: 14px; border: 1px solid var(--h-o-E0C78F); background: var(--h-b-FFF8EA); color: var(--h-t-6E5218); font-weight: 700; font-size: 14px")}>Remind later</button>
          </div>
        )}
        
      </div>
) : null}
    </div>
  </div>
  {tickerLoop.length ? (
<section aria-label="Latest updates" style={S("margin-top: -18px; display: flex; align-items: stretch; height: 46px; border-radius: 999px; background: var(--h-b-EEF4F1); border: 1px solid var(--h-o-D9E7E1); overflow: hidden")}>
    <div style={S("flex-shrink: 0; display: flex; align-items: center; gap: 7px; padding: 0 14px 0 16px; background: var(--h-b-0E4D4A); color: #F5DFAE; font-size: 12.5px; font-weight: 700; letter-spacing: 0.4px")}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"></path><path d="M10 20a2 2 0 0 0 4 0"></path></svg>
      Updates
    </div>
    <div className="ac-tick" tabindex="0" aria-label="Scrolling notifications, hover or focus to pause" style={S("flex: 1; min-width: 0; display: flex; align-items: center")}>
      <div className="ac-track">
        {tickerLoop.map((n, i_n) => (<Fragment key={i_n}>
          <span className="tk-item" role="button" tabIndex={i_n >= tickerCount ? -1 : 0} aria-hidden={i_n >= tickerCount ? "true" : undefined} title="Open" onClick={n.go} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); n.go(); } }} style={S("display: inline-flex; align-items: center; gap: 14px; padding: 0 0 0 18px; white-space: nowrap; font-size: 14px; color: var(--h-t-1F3B38); cursor: pointer")}>
            <span className="tk-text" style={S("font-weight: 500")}>{n.text}</span>
            <span aria-hidden="true" style={S("color: var(--h-t-B8903F); font-size: 12px")}>✦</span>
          </span>
        </Fragment>))}
      </div>
    </div>
  </section>
) : null}
  <section style={S("display: flex; flex-direction: column; gap: 18px")}>
    <div>
      <h2 className="d-h2" style={S("margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 700")}>Get Guidance Your Way</h2>
    </div>
    <div className="d-g2">
      {guide.map((c, i_c) => (<Fragment key={i_c}>
        <button onClick={c.go} className="g-card ac-card" style={S(`text-align: left; border: 1px solid rgba(28,43,42,0.05); border-radius: 22px; background: ${c.bg}; padding: 18px; color: var(--h-t-1C2B2A)`)}>
          <span style={S(`width: 52px; height: 52px; flex-shrink: 0; border-radius: 16px; background: var(--h-b-FFFFFF); color: ${c.ink}; display: flex; align-items: center; justify-content: center`)}>
            {c.isText ? (<><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"></path><path d="M8 9h8M8 12h5"></path></svg></>) : null}
            {c.isAppt ? (<><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"></rect><path d="M3 10h18M8 3v4M16 3v4"></path><circle cx="12" cy="15" r="1.4"></circle></svg></>) : null}
            {c.isCall ? (<><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"></path></svg></>) : null}
            {c.isChat ? (<><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8l-4 3V6z"></path><path d="M17 9h2a2 2 0 0 1 2 2v9l-3-2h-6a2 2 0 0 1-2-2v-1"></path></svg></>) : null}
            {c.isLive ? (<><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4z"></path><path d="M17 10.5 21.5 8v8L17 13.5"></path></svg></>) : null}
          </span>
          <span style={S("display: flex; flex-direction: column; gap: 3px; min-width: 0")}>
            <span style={S("font-weight: 700; font-size: 16.5px")}>{c.title}</span>
            <span className="g-desc" style={S("color: var(--h-t-484E50); font-size: 13.5px; line-height: 1.4")}>{c.desc}</span>
          </span>
          <span className="g-cta" style={S(`flex-shrink: 0; height: 38px; padding: 0 16px; border-radius: 999px; background: ${c.btn}; color: var(--h-t-FFFFFF); font-weight: 700; font-size: 13.5px; display: inline-flex; align-items: center; white-space: nowrap`)}>{c.label}</span>
        </button>
      </Fragment>))}
    </div>
  </section>
  <section style={S("display: flex; flex-direction: column; gap: 18px")}>
    <div style={S("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
      <h2 className="d-h2" style={S("margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 700")}>Astrologers Online</h2>
      <button onClick={goExplore} className="see-top" style={S("height: 40px; padding: 0 6px; align-items: center; border: none; background: transparent; color: var(--h-t-0E4D4A); font-weight: 700; font-size: 14.5px")}>See All →</button>
    </div>
    <div className="d-g3">
      {astros.map((a, i_a) => (<Fragment key={i_a}>
        <article className="ac-card" style={S(`position: relative; overflow: hidden; background: ${a.bg}; border-radius: 24px; padding: 24px 20px 18px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 4px 16px rgba(28,43,42,0.06); min-width: 0`)}>
          {a.hasRibbon ? (<>
            <span style={S(`position: absolute; top: 0; left: 0; background: ${a.ribbonBg}; color: var(--h-t-FFFFFF); font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; padding: 6px 14px 6px 12px; border-bottom-right-radius: 14px`)}>{a.ribbon}</span>
          </>) : null}
          <div style={S("display: flex; gap: 14px; align-items: center; padding-top: 6px")}>
            <span style={S("position: relative; width: 72px; height: 72px; flex-shrink: 0")}>
              <span style={S(`display: block; width: 72px; height: 72px; border-radius: 50%; overflow: hidden; background: ${a.avBg}; border: 3px solid var(--h-o-FFFFFF); box-shadow: 0 2px 8px rgba(28,43,42,0.10)`)}><AstroAvatar id={a.id} size={66} name={a.name} /></span>
              <span style={S(`position: absolute; bottom: 3px; right: 3px; width: 15px; height: 15px; border-radius: 50%; background: ${a.dot}; border: 2.5px solid var(--h-o-FFFFFF)`)}></span>
            </span>
            <div style={S("display: flex; flex-direction: column; gap: 2px; min-width: 0")}>
              <span style={S("font-family: 'Cormorant Garamond', Georgia, serif; font-size: 23px; font-weight: 700; line-height: 1.1")}>{a.name}</span>
              <span style={S("color: var(--h-t-4E5A58); font-size: 13.5px")}>{a.spec}</span>
              <span style={S(`margin-top: 3px; align-self: flex-start; font-size: 11.5px; font-weight: 700; color: ${a.statusInk}; background: var(--h-b-FFFFFF); padding: 2px 9px; border-radius: 999px`)}>● {a.status}</span>
            </div>
          </div>
          <div style={S("display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: var(--h-t-3E4A48); flex-wrap: wrap")}>
            <span style={S("font-weight: 700; color: var(--h-t-1C2B2A)")}><span style={S("color: var(--h-t-B07F1F)")}>★</span> {a.rating}</span>
            <span>{a.reviews} reviews</span>
            <span style={S("width: 3px; height: 3px; border-radius: 50%; background: #8B9593")}></span>
            <span>{a.exp} yrs experience</span>
          </div>
          <div style={S("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px")}>
            <div style={S("background: var(--h-w75); border-radius: 14px; padding: 9px 12px")}><div style={S("font-size: 12px; color: var(--h-t-5E6866)")}>Call</div><div style={S("font-weight: 700; font-size: 16px")}>₹{a.call}<span style={S("font-weight: 500; font-size: 12px; color: var(--h-t-5E6866)")}>/5 min</span></div></div>
            <div style={S("background: var(--h-w75); border-radius: 14px; padding: 9px 12px")}><div style={S("font-size: 12px; color: var(--h-t-5E6866)")}>Chat</div><div style={S("font-weight: 700; font-size: 16px")}>₹{a.chat}<span style={S("font-weight: 500; font-size: 12px; color: var(--h-t-5E6866)")}>/5 min</span></div></div>
          </div>
          {a.online ? (<>
            <div style={S("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px")}>
              <button onClick={a.onCall} style={S("height: 46px; border-radius: 14px; border: none; background: var(--h-b-0E4D4A); color: var(--h-t-FFFFFF); font-weight: 700; font-size: 14px")}>Call Now</button>
              <button onClick={a.onChat} style={S("height: 46px; border-radius: 14px; border: 1.5px solid var(--h-o-0E4D4A); background: var(--h-b-FFFFFF); color: var(--h-t-0E4D4A); font-weight: 700; font-size: 14px")}>Chat Now</button>
            </div>
          </>) : null}
          {a.offline ? (<>
            <div style={S("display: flex; flex-direction: column; gap: 8px")}>
              <div style={S("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px")}>
                <button disabled aria-disabled="true" style={S("height: 46px; border-radius: 14px; border: 1px dashed var(--h-o-A9B1AE); background: var(--h-w50); color: var(--h-t-6B7472); font-weight: 700; font-size: 14px; cursor: not-allowed")}>Call unavailable</button>
                <button onClick={a.onNotify} style={S("height: 46px; border-radius: 14px; border: 1.5px solid var(--h-o-0E4D4A); background: var(--h-b-FFFFFF); color: var(--h-t-0E4D4A); font-weight: 700; font-size: 14px")}>Notify me</button>
              </div>
              <span style={S("font-size: 12px; color: var(--h-t-5E6866); text-align: center")}>Usually online from 6:00 PM</span>
            </div>
          </>) : null}
          <button onClick={a.open} style={S("height: 40px; border: none; background: transparent; color: var(--h-t-0E4D4A); font-weight: 700; font-size: 14px; text-decoration: underline; text-underline-offset: 3px")}>View Profile</button>
        </article>
      </Fragment>))}
    </div>
    <button onClick={goExplore} className="see-bottom" style={S("height: 48px; border-radius: 14px; border: 1.5px solid var(--h-o-0E4D4A); background: var(--h-b-FFFFFF); color: var(--h-t-0E4D4A); font-weight: 700; font-size: 14.5px; align-items: center; justify-content: center; gap: 6px")}>See All Astrologers →</button>
  </section>
  <div className="d-split d-pair">
    <section className="d-panel" style={S("border-radius: 28px; padding: 24px; display: grid; grid-template-rows: subgrid; grid-row: span 4; row-gap: 14px; min-width: 0")}>
      <div style={S("display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px")}>
        <h2 className="d-h2" style={S("margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 30px; font-weight: 700")}>Your Next Actions</h2>
        <button onClick={goServices} style={S("height: 40px; padding: 0 6px; border: none; background: transparent; color: var(--h-t-0E4D4A); font-weight: 700; font-size: 14.5px; white-space: nowrap")}>View All →</button>
      </div>
      {shownActions.map((x, i) => (<DashCard key={x.key} num={"0" + (i + 1)} {...x} primary />))}
    </section>
    <section className="d-panel" style={S("border-radius: 28px; padding: 24px; display: grid; grid-template-rows: subgrid; grid-row: span 4; row-gap: 14px; min-width: 0")}>
      <div style={S("display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px")}>
        <h2 className="d-h2" style={S("margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 30px; font-weight: 700")}>Recent Activity</h2>
        <button onClick={goActivity} style={S("height: 40px; padding: 0 6px; border: none; background: transparent; color: var(--h-t-0E4D4A); font-weight: 700; font-size: 14.5px; white-space: nowrap")}>View More →</button>
      </div>
      {shownActivity.map((x, i) => (<DashCard key={x.key} num={"0" + (i + 1)} {...x} />))}
    </section>
  </div>
</main>
      </div>
    </div>
  );
}

export default Home;
