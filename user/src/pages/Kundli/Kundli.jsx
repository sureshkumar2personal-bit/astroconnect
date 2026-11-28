import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PLACES, RELS, CHARTS, TYPES, SEED_PROFILES, SEED_DOCS, SEED_SHARES, ini, fmtD, fmtT, typeLbl, fsize, describe, chartCells } from "./kundliData";
import "./Kundli.css";

const Ic = ({ d, size = 18, w = 1.9 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>);
const P = { plus: "M12 5v14M5 12h14", eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z", edit: "M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4", trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3", back: "M15 18l-6-6 6-6", doc: "M7 3h7l5 5v13H7zM14 3v5h5", up: "M12 16V5M7 10l5-5 5 5M5 20h14", star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" };
const blank = () => ({ id: "n" + Date.now(), type: "Self", rel: "Self", gender: "", name: "", dob: "", time: "", unk: false, place: "0", sample: false });

// Birth Profiles & Kundli: list, add/edit form and a profile view with a mock Kundli, documents and sharing history (D-12, D-13, D-14, D-37).
// Routes: /kundli, /kundli/new, /kundli/:id, /kundli/:id/edit. Prototype data only.
function Kundli() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const seg = pathname.replace(/^\/kundli\/?/, "").split("/").filter(Boolean);
  const mode = seg[0] === "new" ? "new" : seg[0] ? (seg[1] === "edit" ? "edit" : "view") : "list";
  const pid = seg[0] && seg[0] !== "new" ? seg[0] : null;
  const [profiles, setProfiles] = useState(SEED_PROFILES);
  const [docs, setDocs] = useState(SEED_DOCS);
  const [shares] = useState(SEED_SHARES);
  const [bf, setBf] = useState(blank());
  const [bErr, setBErr] = useState("");
  const [chart, setChart] = useState("Rasi");
  const [docOpen, setDocOpen] = useState("");
  const [delId, setDelId] = useState("");
  const [toast, setToast] = useState("");
  const tt = useRef(null);
  const flash = (m) => { setToast(m); clearTimeout(tt.current); tt.current = setTimeout(() => setToast(""), 2600); };
  useEffect(() => () => clearTimeout(tt.current), []);
  useEffect(() => {
    if (mode === "new") { setBf(blank()); setBErr(""); }
    if (mode === "edit") { const p = profiles.find((x) => x.id === pid); if (p) setBf({ ...p }); setBErr(""); }
    if (mode === "view") { setChart("Rasi"); setDocOpen(""); }
  }, [mode, pid]);
  useEffect(() => {
    if (!delId) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setDelId(""); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [delId]);

  const prof = profiles.find((p) => p.id === pid);
  const setF = (k, v) => { setBf((f) => ({ ...f, [k]: v })); setBErr(""); };
  const setType = (t) => { setBf((f) => ({ ...f, type: t, rel: t === "Self" ? "Self" : t === "Family Member" ? "Son" : "" })); setBErr(""); };
  const save = () => {
    if (!bf.name.trim() || !bf.dob || (!bf.unk && !bf.time)) { setBErr("Enter name, date of birth and time of birth (or mark it unknown)."); return; }
    const fixed = { ...bf, name: bf.name.trim(), time: bf.unk ? "" : bf.time, rel: bf.type === "Self" ? "Self" : bf.rel || (bf.type === "Other" ? "Other" : bf.rel) };
    if (mode === "edit") { setProfiles((l) => l.map((p) => (p.id === fixed.id ? fixed : p))); flash("Profile updated. Kundli refreshed."); navigate("/kundli/" + fixed.id); }
    else { setProfiles((l) => l.concat([fixed])); setDocs((d) => ({ ...d, [fixed.id]: [] })); flash("Profile saved. Kundli generated."); navigate("/kundli"); }
  };
  const upload = (e) => {
    const f = e.target.files[0]; e.target.value = ""; if (!f) return;
    if (!/\.(jpe?g|png|pdf)$/i.test(f.name)) { flash("Only JPG, PNG or PDF files are allowed"); return; }
    setDocs((d) => ({ ...d, [pid]: (d[pid] || []).concat([{ name: f.name, size: fsize(f) }]) })); flash("Document added");
  };
  const confirmDelete = () => { setProfiles((l) => l.filter((p) => p.id !== delId)); setDelId(""); flash("Birth profile deleted"); if (mode === "view") navigate("/kundli"); };

  const card = (p) => (
    <article key={p.id} className="kd-card">
      <div className="kd-chead">
        <div className="kd-av">{ini(p.name)}</div>
        <div className="kd-rt"><div className="kd-name">{p.name}</div><div className="kd-badges"><span className="kd-b nt">{typeLbl(p)}</span>{p.sample ? null : <span className="kd-b ok">Added by you</span>}</div></div>
      </div>
      <div className="kd-mut">{fmtD(p.dob) + " · " + fmtT(p) + " · " + describe(p).place}</div>
      <div className="kd-btns"><button className="kd-btn2" onClick={() => navigate("/kundli/" + p.id)}><Ic d={P.eye} size={16} />View Details</button><button className="kd-btn2" onClick={() => navigate("/kundli/" + p.id + "/edit")}><Ic d={P.edit} size={16} />Edit</button><button className="kd-btn2 kd-danger" onClick={() => setDelId(p.id)}><Ic d={P.trash} size={16} />Delete</button></div>
    </article>
  );

  const head = (title, back) => (<div className="kd-top"><button className="kd-ib" aria-label="Back" onClick={() => navigate(back)}><Ic d={P.back} size={20} /></button><h1>{title}</h1></div>);
  const info = prof ? describe(prof) : null;
  const cells = prof ? chartCells(prof, chart) : [];
  const myDocs = (docs[pid] || []);
  const myShares = shares.filter((x) => x.pid === pid);

  return (
    <div className="kundli-page page">
      <div className="kdp">
        <main className="kd-wrap">
          {mode === "list" ? (
            <>
              <div className="kd-top"><button className="kd-ib" aria-label="Back to Profile" onClick={() => navigate("/profile")}><Ic d={P.back} size={20} /></button><h1>Birth Profiles &amp; Kundli</h1></div>
              <div className="kd-listhead"><h2 className="kd-h">{"Saved birth profiles (" + profiles.length + ")"}</h2><button className="kd-btn" onClick={() => navigate("/kundli/new")}><Ic d={P.plus} />Add Birth Profile</button></div>
              <div className="kd-grid">{profiles.map(card)}</div>
              {profiles.length === 0 ? (<div className="kd-empty"><span className="kd-eico"><Ic d={P.star} size={26} /></span><div className="kd-t">No birth profiles yet</div><div className="kd-mut">Add your own or a family member’s birth details to generate a Kundli.</div><button className="kd-btn" onClick={() => navigate("/kundli/new")}>Add Birth Profile</button></div>) : null}
            </>
          ) : null}

          {(mode === "new" || mode === "edit") ? (
            <>
              {head(mode === "edit" ? "Edit Birth Profile" : "Add Birth Profile", mode === "edit" ? "/kundli/" + pid : "/kundli")}
              {mode === "edit" && !prof ? <div className="kd-note">This profile was not found.</div> : (
                <section className="kd-panel kd-form">
                  <div className="kd-fld"><span className="kd-lbl">Profile type</span><div className="kd-seg">{TYPES.map((t) => (<button key={t} className={bf.type === t ? "on" : ""} aria-pressed={bf.type === t} onClick={() => setType(t)}>{t}</button>))}</div></div>
                  {bf.type === "Family Member" ? (<div className="kd-fld"><label className="kd-lbl" htmlFor="kd-b0">Relationship</label><select id="kd-b0" className="kd-inp" value={bf.rel} onChange={(e) => setF("rel", e.target.value)}>{RELS.map((r) => (<option key={r}>{r}</option>))}</select></div>) : null}
                  {bf.type === "Other" ? (<div className="kd-fld"><label className="kd-lbl" htmlFor="kd-b0o">Relationship / label (optional)</label><input id="kd-b0o" className="kd-inp" placeholder="e.g. Friend, Colleague" value={bf.rel} onChange={(e) => setF("rel", e.target.value)} /></div>) : null}
                  <div className="kd-two">
                    <div className="kd-fld"><label className="kd-lbl" htmlFor="kd-b1">Full name</label><input id="kd-b1" className="kd-inp" value={bf.name} onChange={(e) => setF("name", e.target.value)} /></div>
                    <div className="kd-fld"><label className="kd-lbl" htmlFor="kd-b5">Gender</label><select id="kd-b5" className="kd-inp" value={bf.gender} onChange={(e) => setF("gender", e.target.value)}><option value="">Prefer not to say</option><option>Female</option><option>Male</option><option>Other</option></select></div>
                    <div className="kd-fld"><label className="kd-lbl" htmlFor="kd-b2">Date of birth</label><input id="kd-b2" type="date" className="kd-inp" value={bf.dob} onChange={(e) => setF("dob", e.target.value)} /></div>
                    <div className="kd-fld"><label className="kd-lbl" htmlFor="kd-b3">Time of birth</label><input id="kd-b3" type="time" className="kd-inp" disabled={bf.unk} value={bf.time} onChange={(e) => setF("time", e.target.value)} /></div>
                  </div>
                  <label className="kd-ck"><input type="checkbox" checked={bf.unk} onChange={() => setF("unk", !bf.unk)} />I don’t know the birth time</label>
                  <div className="kd-fld"><label className="kd-lbl" htmlFor="kd-b4">Place of birth</label><select id="kd-b4" className="kd-inp" value={bf.place} onChange={(e) => setF("place", e.target.value)}>{PLACES.map((p, i) => (<option key={p[0]} value={String(i)}>{p[0] + ", " + p[1] + ", India"}</option>))}</select></div>
                  {bErr ? <div className="kd-err">{bErr}</div> : null}
                  <div className="kd-btns kd-end"><button className="kd-btn2" onClick={() => navigate(mode === "edit" ? "/kundli/" + pid : "/kundli")}>Cancel</button><button className="kd-btn" onClick={save}>Save Profile</button></div>
                </section>
              )}
            </>
          ) : null}

          {mode === "view" ? (
            <>
              {head("Birth Profile Details", "/kundli")}
              {!prof ? <div className="kd-note">This profile was not found.</div> : (
                <>
                  <section className="kd-panel">
                    <div className="kd-chead"><div className="kd-av lg">{ini(prof.name)}</div><div className="kd-rt"><div className="kd-name">{prof.name}</div><div className="kd-badges"><span className="kd-b nt">{typeLbl(prof)}</span>{prof.sample ? null : <span className="kd-b ok">Added by you</span>}</div></div><button className="kd-btn2" onClick={() => navigate("/kundli/" + prof.id + "/edit")}><Ic d={P.edit} size={16} />Edit</button></div>
                    <dl className="kd-kv"><dt>Date of birth</dt><dd>{fmtD(prof.dob)}</dd><dt>Time of birth</dt><dd>{fmtT(prof)}</dd><dt>Birth place</dt><dd>{info.placeFull}</dd><dt>Gender</dt><dd>{info.gender}</dd></dl>
                  </section>

                  <h2 className="kd-h">{"Kundli · " + prof.name}</h2>
                  <section className="kd-panel">
                    <div className="kd-pills" role="tablist" aria-label="Chart">{CHARTS.map((c) => (<button key={c} role="tab" aria-selected={chart === c} className={"kd-pill" + (chart === c ? " on" : "")} onClick={() => setChart(c)}>{c}</button>))}</div>
                    <div className="kd-chartwrap">
                      <div className="kd-chart" aria-label={chart + " chart"}>
                        {cells.map((c) => (<div key={c.sign} className="kd-cell" style={{ gridRow: c.r, gridColumn: c.c }}><span className="kd-sign">{c.sign}</span><span className="kd-pl">{c.pl}</span></div>))}
                        <div className="kd-centre"><div className="kd-t">{chart + " chart"}</div><div className="kd-mut">{prof.name}</div></div>
                      </div>
                      <dl className="kd-kv kd-side"><dt>Moon sign</dt><dd>{info.moon}</dd><dt>Lagna</dt><dd>{info.lagna}</dd><dt>Nakshatra</dt><dd>{info.nak}</dd></dl>
                    </div>
                    <div className="kd-mut">{prof.unk ? "Birth time unknown: ascendant-based views are approximate." : ""}</div>
                  </section>

                  <h2 className="kd-h">Uploaded documents</h2>
                  <section className="kd-panel kd-list">
                    {myDocs.map((d, i) => (
                      <div key={d.name + i}>
                        <div className="kd-row"><span className="kd-ico"><Ic d={P.doc} /></span><div className="kd-rt"><div className="kd-t">{d.name}</div><div className="kd-mut">{d.size}</div></div>
                          <button className="kd-btn2" onClick={() => setDocOpen(docOpen === d.name ? "" : d.name)}>{docOpen === d.name ? "Hide" : "View"}</button>
                          <button className="kd-btn2 kd-danger" onClick={() => setDocs((x) => ({ ...x, [pid]: myDocs.filter((_, j) => j !== i) }))}>Remove</button></div>
                        {docOpen === d.name ? <div className="kd-prev">{"Preview: " + d.name}</div> : null}
                      </div>
                    ))}
                    {myDocs.length === 0 ? <div className="kd-pad kd-mut">No documents uploaded.</div> : null}
                    <div className="kd-pad"><label className="kd-btn2 kd-file"><Ic d={P.up} size={16} />Upload JPG, PNG or PDF<input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={upload} /></label><div className="kd-mut">Documents are separate from the generated Kundli.</div></div>
                  </section>

                  <h2 className="kd-h">Sharing history &amp; consent</h2>
                  <section className="kd-panel kd-list">
                    {myShares.map((x, i) => (<div className="kd-row" key={i}><div className="kd-rt"><div className="kd-t">{x.astro}</div><div className="kd-mut">{x.svc + " · Consent " + x.at}</div></div><span className={"kd-b " + (x.status === "Active" ? "ok" : x.status === "Revoked" ? "bd" : "nt")}>{x.status}</span></div>))}
                    {myShares.length === 0 ? <div className="kd-pad kd-mut">This Kundli has never been shared.</div> : null}
                  </section>
                  <div className="kd-note">Kundli is shared only with your consent and only for the selected paid service.</div>
                </>
              )}
            </>
          ) : null}
        </main>

        {delId ? (
          <div className="kd-ov" onMouseDown={(e) => { if (e.target === e.currentTarget) setDelId(""); }}>
            <div className="kd-sheet" role="dialog" aria-modal="true" aria-label="Delete birth profile">
              <div className="kd-sh">Delete this birth profile?</div>
              <div className="kd-mut">{(profiles.find((p) => p.id === delId) || { name: "" }).name + "’s details, Kundli and uploaded documents will be removed from your account."}</div>
              <div className="kd-btns kd-end"><button className="kd-btn2" onClick={() => setDelId("")}>Cancel</button><button className="kd-btn3" onClick={confirmDelete}>Delete</button></div>
            </div>
          </div>
        ) : null}
        {toast ? <div role="status" className="kd-toast">{toast}</div> : null}
      </div>
    </div>
  );
}

export default Kundli;
