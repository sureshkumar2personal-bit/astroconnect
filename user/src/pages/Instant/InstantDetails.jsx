import React, { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import AstroAvatar from "../../components/AstroAvatar/AstroAvatar";
import { useInstant } from "./InstantContext";
import { KIND } from "./instantUtils";

const OK_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
const MAX_MB = 5;
const sizeTxt = (b) => (b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB");

// Step 1 of the Instant flow: birth details and an optional horoscope.
function InstantDetails() {
  const app = useApp();
  const navigate = useNavigate();
  const { bk, det, setDet, fillFromProfile, validate } = useInstant();
  const input = useRef(null);
  const [preview, setPreview] = useState(false);
  const [fileErr, setFileErr] = useState("");
  const timer = useRef(null);
  useEffect(() => () => clearInterval(timer.current), []);
  if (!bk) return <Navigate to="/services/call" replace />;
  const a = app.exCards.find((x) => x.id === bk.astroId);
  if (!a) return <Navigate to="/services/call" replace />;
  const k = KIND[bk.kind];
  const wl = bk.mode === "waitlist";
  const e = det.err || {};
  const set = (key) => (ev) => setDet({ ...det, [key]: ev.target.value });
  const startUpload = (f) => {
    clearInterval(timer.current);
    let pct = 0;
    setDet((d) => ({ ...d, file: { ...f, status: "uploading", pct: 0 } }));
    timer.current = setInterval(() => {
      pct += 20;
      if (pct >= 100) { clearInterval(timer.current); setDet((d) => ({ ...d, file: d.file ? { ...d.file, status: "done", pct: 100 } : d.file })); }
      else setDet((d) => ({ ...d, file: d.file ? { ...d.file, pct } : d.file }));
    }, 250);
  };
  const onFile = (ev) => {
    const f = ev.target.files && ev.target.files[0];
    ev.target.value = "";
    if (!f) return;
    if (OK_TYPES.indexOf(f.type) < 0) { setFileErr("Choose a PDF, JPG, PNG or WEBP file."); return; }
    if (f.size > MAX_MB * 1048576) { setFileErr("That file is larger than " + MAX_MB + " MB."); return; }
    setFileErr("");
    startUpload({ name: f.name, kind: f.type === "application/pdf" ? "pdf" : "img", sizeTxt: sizeTxt(f.size), url: URL.createObjectURL(f), sample: false });
  };
  const useSample = () => { setFileErr(""); startUpload({ name: "sample-birth-chart.png", kind: "img", sizeTxt: "42 KB", url: "", sample: true }); };
  const f = det.file;
  const next = () => { if (validate()) navigate("/services/instant/pay"); };
  return (
    <div className="in-page page">
      <div><button className="in-crumb" onClick={() => navigate("/services/" + bk.kind)}>{"‹  " + (wl ? "Waiting-list booking" : k.label)}</button></div>
      <div className="in-head">
        <h1 className="in-h1">Your Consultation Details</h1>
        <p className="in-sub">{a.name + " will see these details when your " + k.name.toLowerCase() + " starts."}</p>
      </div>
      <div className="in-two-col">
        <section className="card in-card">
            <div className="in-row"><h2>Birth details</h2><button className="in-link" onClick={fillFromProfile}>Fill from my profile</button></div>
            <label className="in-f"><span className="in-cap">Full name</span><input className="inp" value={det.name} onChange={set("name")} autoComplete="name" aria-invalid={!!e.name} />{e.name ? <em>{e.name}</em> : null}</label>
            <div className="in-two">
              <label className="in-f"><span className="in-cap">Date of birth</span><input className="inp" type="date" value={det.dob} max={new Date().toISOString().slice(0, 10)} onChange={set("dob")} aria-invalid={!!e.dob} />{e.dob ? <em>{e.dob}</em> : null}</label>
              <label className="in-f"><span className="in-cap">Time of birth <small>If known</small></span><input className="inp" type="time" value={det.tob} onChange={set("tob")} /></label>
            </div>
            <label className="in-f"><span className="in-cap">Place of birth <small>Optional</small></span><input className="inp" value={det.pob} placeholder="City, State" onChange={set("pob")} /></label>
        </section>
        <section className="card in-card">
            <div className="in-row"><h2>Horoscope</h2><small className="in-opt-tag">Optional</small></div>
            <input ref={input} type="file" className="sr-only" accept="application/pdf,image/png,image/jpeg,image/webp" onChange={onFile} tabIndex={-1} aria-hidden="true" />
            {f ? (
              <div className="in-file">
                <div className="in-fileinfo">
                  <b>{f.name}</b>
                  <small>{f.status === "uploading" ? "Uploading… " + f.pct + "%" : "Uploaded, " + (f.kind === "pdf" ? "PDF" : "Image") + ", " + f.sizeTxt}</small>
                  {f.status === "uploading" ? <span className="in-bar"><i style={{ width: f.pct + "%" }} /></span> : null}
                </div>
                <div className="in-fileacts">
                  <button className="btn-g in-sm" disabled={f.status !== "done"} onClick={() => setPreview(true)}>Preview</button>
                  <button className="btn-g in-sm" onClick={() => input.current && input.current.click()}>Replace</button>
                  <button className="btn-g in-sm" onClick={() => { setDet({ ...det, file: null }); setFileErr(""); }}>Remove</button>
                </div>
              </div>
            ) : (
              <div className="in-drop">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                <b>Upload your horoscope</b>
                <span>PDF, JPG, PNG or WEBP, up to {MAX_MB} MB. Optional: you can continue without one.</span>
                <button className="btn-p in-choose" onClick={() => input.current && input.current.click()}>Choose file</button>
                <button className="in-link" onClick={useSample}>No file handy? Use a sample chart</button>
              </div>
            )}
            {fileErr ? <p className="in-err">{fileErr}</p> : null}
            <p className="in-note">{"Shared only with " + a.name + " for this consultation (D-37)."}</p>
        </section>
      </div>
      <div className="card in-foot">
        <div className="in-footwho"><AstroAvatar id={a.id} size={44} name={a.name} /><div><small>{a.name}</small><b>{k.label + (wl ? " waiting list" : "")}</b></div></div>
        <div className="in-footacts">
          <button className="btn-g" onClick={() => navigate("/services/" + bk.kind)}>Back</button>
          <button className="btn-p" onClick={next}>Continue to Payment</button>
        </div>
      </div>
      {preview && f ? (
        <>
          <button className="in-scrim" aria-label="Close preview" onClick={() => setPreview(false)} />
          <div className="in-modal in-prev" role="dialog" aria-modal="true" aria-label="Horoscope preview">
            <div className="in-row"><b>{f.name}</b><button className="ico" onClick={() => setPreview(false)} aria-label="Close preview">✕</button></div>
            {f.sample ? <div className="in-sample" aria-label="Sample chart">Sample birth chart</div> : f.kind === "pdf" ? <iframe title={f.name} src={f.url} /> : <img src={f.url} alt={f.name} />}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default InstantDetails;
