import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import AstroAvatar from "../../components/AstroAvatar/AstroAvatar";
import { PKGS } from "../../data/mockData";
import { inr, showDate, showTime } from "./instantUtils";

const P = {
  mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4" /></>,
  micoff: <path d="m2 2 20 20M9 9v2a3 3 0 0 0 5.1 2.1M15 9.3V5a3 3 0 0 0-5.9-.6M17 16.9A7 7 0 0 1 5 11v-1M19 10v1a7 7 0 0 1-.1 1.2M12 18v4" />,
  vol: <><path d="M11 5 6 9H2v6h4l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></>,
  voloff: <path d="M11 5 6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  end: <><path d="M10.7 13.3a16 16 0 0 0 3.4 2.6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L9 10.8" /><path d="M22 2 2 22" /></>,
  expand: <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />,
  shrink: <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />,
  minus: <path d="M5 12h14" />,
  down: <path d="m6 9 6 6 6-6" />,
  right: <path d="m9 18 6-6-6-6" />,
  clip: <path d="m21.4 11.1-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" />,
  send: <><path d="m22 2-7 20-4-9-9-4z" /><path d="M22 2 11 13" /></>,
  more: <><circle cx="5" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="19" cy="12" r="1.3" /></>,
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
  file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></>,
  chat: <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.5L3 21l2-5.7A8.4 8.4 0 1 1 21 11.5z" />,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
};
const Ic = ({ n, s = 18 }) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[n]}</svg>);
const mmss = (t) => { t = Math.max(0, Math.floor(t)); return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"); };

const hhmm = (t) => new Date(t).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
const sizeTxt = (b) => (b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB");

// Live Instant Call or Chat: a floating panel (compact, minimised or expanded). Calls have mute, speaker, extend and end; chats have messages, attachments, extend and end.
function InstantSession() {
  const app = useApp();
  const navigate = useNavigate();
  const si = app.sesInfo;
  const live = !!si && si.status === "live";
  const isChat = !!si && si.kind === "Chat";
  const word = isChat ? "chat" : "call";
  const [mode, setMode] = useState("compact");
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [ext, setExt] = useState(false);
  const [extMins, setExtMins] = useState(5);
  const [endAsk, setEndAsk] = useState(false);
  const [menu, setMenu] = useState(false);
  const [draft, setDraft] = useState("");
  const [attErr, setAttErr] = useState("");
  const [open, setOpen] = useState({ booking: true, birth: true, about: false });
  const [, tick] = useState(0);
  const was = useRef(false);
  const msgBox = useRef(null);
  const imgIn = useRef(null);
  const pdfIn = useRef(null);
  useEffect(() => {
    if (!live) return undefined;
    const t = setInterval(() => { tick((n) => n + 1); app.tickNow(); }, 1000);
    return () => clearInterval(t);
  }, [live]);
  // When a session ends (by the user or because the package ran out), show the ended page with the rating prompt.
  useEffect(() => {
    if (live) { was.current = true; return; }
    if (was.current && si && si.status === "ended") { was.current = false; setEndAsk(false); setExt(false); setMenu(false); navigate("/session"); }
  }, [live, si && si.status]);
  useEffect(() => { if (live) { setMode("compact"); setMuted(false); setSpeaker(true); setMenu(false); setDraft(""); } }, [live && si.startedAt]);
  const nMsgs = si ? si.msgs.length : 0;
  useEffect(() => { if (msgBox.current) msgBox.current.scrollTop = msgBox.current.scrollHeight; }, [nMsgs, mode, live]);
  if (!live) return null;
  const a = app.exCards.find((x) => x.id === si.astro);
  const total = si.mins * 60;
  // Recomputed from the end time on every one-second tick (the shared state only changes when something happens).
  const rem = si.disc ? si.remSec : Math.max(0, Math.floor((si.endsAt - Date.now() - si.skew) / 1000));
  const elapsed = Math.max(0, total - rem);
  const pct = Math.max(0, Math.min(100, (rem / total) * 100));
  const info = si.info || {};
  const f = info.file;
  const toggle = (k) => setOpen({ ...open, [k]: !open[k] });
  const doEnd = () => { setEndAsk(false); app.endNow("user")(); };
  const opts = PKGS[si.kind].filter((p) => [5, 10, 15].indexOf(p.mins) > -1);
  const pk = opts.find((p) => p.mins === extMins) || opts[0];
  const status = si.disc ? "Reconnecting…" : isChat ? "Active chat, " + mmss(elapsed) : "On call, " + mmss(elapsed);
  const last = si.msgs[si.msgs.length - 1];
  const typing = isChat && last && last.me && Date.now() - last.at < 1700;
  const send = () => { const t = draft.trim(); if (!t) return; app.instantChatSend(t); setDraft(""); };
  const onAttach = (kind) => (ev) => {
    const file = ev.target.files && ev.target.files[0];
    ev.target.value = "";
    if (!file) return;
    const okType = kind === "pdf" ? file.type === "application/pdf" : /^image\/(png|jpeg|webp)$/.test(file.type);
    if (!okType) { setAttErr(kind === "pdf" ? "Choose a PDF file." : "Choose a PNG, JPG or WEBP image."); return; }
    if (file.size > 5 * 1048576) { setAttErr("That file is larger than 5 MB."); return; }
    setAttErr(""); setMenu(false);
    app.instantChatSend("", { name: file.name, kind, size: sizeTxt(file.size) });
  };

  const callBtns = (cls) => (
    <div className={cls}>
      <button className={"is-rb" + (muted ? " off" : "")} aria-pressed={muted} onClick={() => setMuted(!muted)}><span><Ic n={muted ? "micoff" : "mic"} /></span>{muted ? "Unmute" : "Mute"}</button>
      <button className={"is-rb sp" + (speaker ? "" : " off")} aria-pressed={speaker} onClick={() => setSpeaker(!speaker)}><span><Ic n={speaker ? "vol" : "voloff"} /></span>Speaker</button>
      <button className="is-rb ex" onClick={() => setExt(true)}><span><Ic n="plus" /></span>Extend</button>
      <button className="is-rb end" onClick={() => setEndAsk(true)}><span><Ic n="end" /></span>End</button>
    </div>
  );
  const msgList = (
    <div className="is-msgs" ref={msgBox} role="log" aria-live="polite" aria-label="Chat messages">
      {si.msgs.map((m, i) => (
        m.sys ? (<div key={i} className="is-sys"><span>{m.t}</span></div>) : (
          <div key={i} className={"is-m" + (m.me ? " me" : "")}>
            {m.att ? <div className="is-att"><Ic n={m.att.kind === "pdf" ? "file" : "image"} s={18} /><span><b>{m.att.name}</b><small>{(m.att.kind === "pdf" ? "PDF" : "Image") + ", " + m.att.size}</small></span></div> : null}
            {m.t ? <p>{m.t}</p> : null}
            <small>{hhmm(m.at)}</small>
          </div>
        )
      ))}
      {typing ? <div className="is-m"><p className="is-typing" aria-label="Typing">• • •</p></div> : null}
    </div>
  );
  const composer = (big) => (
    <div className="is-comp">
      <input ref={imgIn} type="file" className="sr-only" accept="image/png,image/jpeg,image/webp" onChange={onAttach("img")} tabIndex={-1} aria-hidden="true" />
      <input ref={pdfIn} type="file" className="sr-only" accept="application/pdf" onChange={onAttach("pdf")} tabIndex={-1} aria-hidden="true" />
      {attErr ? <p className="in-err">{attErr}</p> : null}
      {big ? (
        <div className="is-attrow"><button className="is-chipbtn" onClick={() => imgIn.current && imgIn.current.click()}><Ic n="image" s={16} />Attach image</button><button className="is-chipbtn" onClick={() => pdfIn.current && pdfIn.current.click()}><Ic n="file" s={16} />Attach PDF</button></div>
      ) : null}
      <div className="is-inrow">
        {!big ? (
          <div className="is-attwrap">
            <button className="is-ib" aria-label="Attach" aria-expanded={menu === "att"} onClick={() => setMenu(menu === "att" ? false : "att")}><Ic n="clip" /></button>
            {menu === "att" ? (
              <div className="is-pop" role="menu">
                <button role="menuitem" onClick={() => imgIn.current && imgIn.current.click()}><Ic n="image" s={16} /><span><b>Image</b><small>Photo of a chart or document</small></span></button>
                <button role="menuitem" onClick={() => pdfIn.current && pdfIn.current.click()}><Ic n="file" s={16} /><span><b>PDF</b><small>Horoscope or report</small></span></button>
              </div>
            ) : null}
          </div>
        ) : null}
        <input className="is-input" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); send(); } }} placeholder="Write a message" aria-label="Write a message" />
        <button className="is-send" onClick={send} aria-label="Send message" disabled={!draft.trim()}><Ic n="send" s={18} /></button>
      </div>
    </div>
  );
  const side = (
    <aside className="is-side">
      <div className="is-who"><AstroAvatar id={si.astro} size={52} name={si.name} /><div><b>{si.name}</b><span>{a ? a.specLabel : ""}</span><em><Ic n={isChat ? "chat" : "phone"} s={13} />{"Instant " + si.kind}</em></div></div>
      <div className="is-sec">
        <button className="is-sh" aria-expanded={open.booking} onClick={() => toggle("booking")}><b>Booking details</b><Ic n={open.booking ? "down" : "right"} s={16} /></button>
        {open.booking ? (
          <dl className="is-dl">
            <div><dt>Service</dt><dd>{"Instant " + si.kind}</dd></div>
            <div><dt>Amount paid</dt><dd>{inr(si.paid)}</dd></div>
            <div><dt>Prepaid duration</dt><dd>{si.mins + " min"}</dd></div>
            <div><dt>Session started</dt><dd>{hhmm(si.startedAt)}</dd></div>
            <div><dt>Remaining</dt><dd>{mmss(rem)}</dd></div>
          </dl>
        ) : null}
      </div>
      <div className="is-sec">
        <div className="is-sh static"><b>Horoscope files</b><small>{f ? "1 file" : "None"}</small></div>
        <p className="is-p">{f ? f.name : "You didn’t upload a horoscope." + (isChat ? " You can attach one in the chat." : "")}</p>
      </div>
      <div className="is-sec">
        <button className="is-sh" aria-expanded={open.birth} onClick={() => toggle("birth")}><b>Birth details</b><small>Shared</small><Ic n={open.birth ? "down" : "right"} s={16} /></button>
        {open.birth ? (
          <dl className="is-dl">
            <div><dt>Full name</dt><dd>{info.name || "—"}</dd></div>
            <div><dt>Date of birth</dt><dd>{showDate(info.dob)}</dd></div>
            <div><dt>Birth time</dt><dd>{showTime(info.tob)}</dd></div>
            <div><dt>Birth place</dt><dd>{info.pob || "Not provided"}</dd></div>
          </dl>
        ) : null}
      </div>
      <div className="is-sec">
        <button className="is-sh" aria-expanded={open.about} onClick={() => toggle("about")}><b>About the astrologer</b><Ic n={open.about ? "down" : "right"} s={16} /></button>
        {open.about && a ? <p className="is-p">{a.name + " · " + a.yearsN + " yrs experience · " + a.langList.join(", ")}</p> : null}
      </div>
    </aside>
  );

  return (
    <>
      {mode === "min" ? (
        <button className="is-mini" onClick={() => setMode("compact")} aria-label={"Open the " + word + " panel"}>
          <AstroAvatar id={si.astro} size={32} name={si.name} /><span><b>{si.name}</b><small>{si.disc ? "Reconnecting…" : (isChat ? "Chat · " : "On call · ") + mmss(rem) + " left"}</small></span><Ic n="expand" s={16} />
        </button>
      ) : null}

      {mode === "compact" && !isChat ? (
        <section className="is-compact" role="region" aria-label={"Call with " + si.name}>
          <div className="is-chead">
            <AstroAvatar id={si.astro} size={44} name={si.name} />
            <div className="is-cname"><b>{si.name}</b><span><i className="is-live" />{status}</span></div>
            <button className="is-ib" onClick={() => setMode("expanded")} aria-label="Expand call"><Ic n="expand" s={16} /></button>
            <button className="is-ib" onClick={() => setMode("min")} aria-label="Minimise call"><Ic n="minus" s={16} /></button>
          </div>
          <div className="is-row"><span>{"Prepaid " + si.mins + " min, " + inr(si.paid)}</span><b role="timer">{mmss(rem) + " left"}</b></div>
          <div className="is-prog" aria-hidden="true"><i style={{ width: pct + "%" }} /></div>
          {callBtns("is-btns")}
        </section>
      ) : null}

      {mode === "compact" && isChat ? (
        <section className="is-chat" role="region" aria-label={"Chat with " + si.name}>
          <div className="is-chead">
            <AstroAvatar id={si.astro} size={40} name={si.name} />
            <div className="is-cname"><b>{si.name}</b><span><i className="is-live" />{status}</span></div>
            <span className="is-left" role="timer">{mmss(rem) + " left"}</span>
            <button className="is-ib" onClick={() => setMode("expanded")} aria-label="Expand chat"><Ic n="expand" s={16} /></button>
            <button className="is-ib" onClick={() => setMode("min")} aria-label="Minimise chat"><Ic n="minus" s={16} /></button>
            <div className="is-attwrap">
              <button className="is-ib" aria-label="More options" aria-haspopup="menu" aria-expanded={menu === "more"} onClick={() => setMenu(menu === "more" ? false : "more")}><Ic n="more" s={16} /></button>
              {menu === "more" ? (
                <div className="is-pop right" role="menu">
                  <button role="menuitem" onClick={() => { setMenu(false); setExt(true); }}><Ic n="plus" s={16} /><span><b>Extend chat</b></span></button>
                  <button role="menuitem" onClick={() => { setMenu(false); setMode("expanded"); }}><Ic n="eye" s={16} /><span><b>Open details</b></span></button>
                  <button role="menuitem" onClick={() => { setMenu(false); setEndAsk(true); }}><Ic n="end" s={16} /><span><b>End chat</b></span></button>
                </div>
              ) : null}
            </div>
          </div>
          <div className="is-prog flat" aria-hidden="true"><i style={{ width: pct + "%" }} /></div>
          {msgList}
          {composer(false)}
        </section>
      ) : null}

      {mode === "expanded" ? (
        <section className="is-full" role="dialog" aria-label={(isChat ? "Chat with " : "Call with ") + si.name}>
          {side}
          <div className="is-mainp">
            <div className="is-fhead">
              <AstroAvatar id={si.astro} size={40} name={si.name} />
              <div className="is-cname"><b>{si.name}</b><span><i className="is-live" />{si.disc ? "Reconnecting…" : isChat ? "Active chat, prepaid " + si.mins + " min" : "On call, prepaid " + si.mins + " min"}</span></div>
              <div className="is-time"><small>{isChat ? "Elapsed" : "Duration"}</small><b>{mmss(elapsed)}</b></div>
              <div className="is-time"><small>Remaining</small><b role="timer">{mmss(rem)}</b></div>
              {isChat ? (
                <>
                  <button className="is-ib" aria-label="Collapse chat" onClick={() => setMode("compact")}><Ic n="shrink" s={16} /></button>
                  <button className="is-ib" aria-label="Minimise chat" onClick={() => setMode("min")}><Ic n="minus" s={16} /></button>
                  <button className="is-txtbtn ex" onClick={() => setExt(true)}><Ic n="plus" s={15} />Extend chat</button>
                  <button className="is-txtbtn end" onClick={() => setEndAsk(true)}>End chat</button>
                </>
              ) : (
                <>
                  <button className={"is-ib big" + (muted ? " off" : "")} aria-pressed={muted} aria-label={muted ? "Unmute" : "Mute"} onClick={() => setMuted(!muted)}><Ic n={muted ? "micoff" : "mic"} /></button>
                  <button className={"is-ib big sp" + (speaker ? "" : " off")} aria-pressed={speaker} aria-label="Speaker" onClick={() => setSpeaker(!speaker)}><Ic n={speaker ? "vol" : "voloff"} /></button>
                  <button className="is-ib big ex" aria-label="Extend call" onClick={() => setExt(true)}><Ic n="plus" /></button>
                  <button className="is-ib big end" aria-label="End call" onClick={() => setEndAsk(true)}><Ic n="end" /></button>
                  <button className="is-ib" aria-label="Collapse call" onClick={() => setMode("compact")}><Ic n="shrink" s={16} /></button>
                  <button className="is-ib" aria-label="Minimise call" onClick={() => setMode("min")}><Ic n="minus" s={16} /></button>
                </>
              )}
            </div>
            {isChat ? (
              <>
                <div className="is-prog flat" aria-hidden="true"><i style={{ width: pct + "%" }} /></div>
                {msgList}
                {composer(true)}
              </>
            ) : (
              <div className="is-body">
                <div className="is-card">
                  <h3>Your birth details</h3>
                  <p>{(f ? "Your horoscope was uploaded. " : "No horoscope was uploaded. ") + si.name + " sees these details."}</p>
                  <dl className="is-dl">
                    <div><dt>Full name</dt><dd>{info.name || "—"}</dd></div>
                    <div><dt>Date of birth</dt><dd>{showDate(info.dob)}</dd></div>
                    <div><dt>Birth time</dt><dd>{showTime(info.tob)}</dd></div>
                    <div><dt>Birth place</dt><dd>{info.pob || "Not provided"}</dd></div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {ext ? (
        <>
          <button className="in-scrim" aria-label="Close" onClick={() => setExt(false)} />
          <div className="in-modal is-modal" role="dialog" aria-modal="true" aria-label={"Extend " + word}>
            <h3>{"Extend " + word}</h3>
            <p>{"Your " + word + " stays connected while you choose. Time left " + mmss(rem) + "."}</p>
            <div className="in-opts" role="radiogroup" aria-label="Additional duration">
              {opts.map((p) => (
                <button key={p.mins} role="radio" aria-checked={extMins === p.mins} className={"in-opt" + (extMins === p.mins ? " on" : "")} onClick={() => setExtMins(p.mins)}><b>{"+" + p.mins} <small>min</small></b><span>{inr(p.price)}</span></button>
              ))}
            </div>
            <div className="is-total"><span>Total amount</span><b>{inr(pk.price)}</b></div>
            <p className="is-bal">{"Wallet balance " + inr(app.walletNow)}</p>
            <div className="in-modal-acts"><button className="btn-g" onClick={() => setExt(false)}>Not now</button><button className="btn-p" onClick={() => { app.instantExtend(extMins); setExt(false); }}>{"Extend " + extMins + " min · " + inr(pk.price)}</button></div>
          </div>
        </>
      ) : null}
      {endAsk ? (
        <>
          <button className="in-scrim" aria-label="Close" onClick={() => setEndAsk(false)} />
          <div className="in-modal is-modal" role="alertdialog" aria-modal="true" aria-label={"End " + word}>
            <h3>Are you sure you want to end this consultation?</h3>
            <p>{mmss(rem) + " of your prepaid time is left. Ending early is not refunded (D-45)."}</p>
            <div className="in-modal-acts"><button className="btn-g" onClick={() => setEndAsk(false)}>Continue Consultation</button><button className="btn-p is-endbtn" onClick={doEnd}>{isChat ? "End Chat" : "End Call"}</button></div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default InstantSession;
