import React, { useEffect, useRef, useState } from "react";
import { SEED_TXNS, SEED_BANK, MIN_BALANCE, ICON, ST, inr, fmt, fmtD, rangeOf, inRange } from "./walletData";
import "./Wallet.css";

const Svg = ({ d, size = 18, w = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const TITLES = { add: "Add Money", withdraw: "Withdraw" };

// Wallet: balance, add money, withdraw, payout methods, transaction history and statement download. Prototype data only: nothing is charged or sent.
function Wallet() {
  const [balance, setBalance] = useState(2500);
  const [txns, setTxns] = useState(SEED_TXNS);
  const [banks, setBanks] = useState([{ id: "b1", ...SEED_BANK }]); // a user can save many bank accounts
  const [editId, setEditId] = useState(null);
  const [upis, setUpis] = useState([]); // a user can also save many UPI IDs
  const [def, setDef] = useState("b1");
  const [removing, setRemoving] = useState(null);
  const [view, setView] = useState(null); // add | withdraw | bank | upi
  const [step, setStep] = useState("form");
  const [amt, setAmt] = useState("");
  const [err, setErr] = useState("");
  const [payout, setPayout] = useState("b1");
  const [done, setDone] = useState({ ref: "", amt: 0 });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ holder: "", bankName: "", acct: "", ifsc: "", upi: "" });
  const [upiV, setUpiV] = useState("idle");
  const [formErr, setFormErr] = useState("");
  const [fType, setFType] = useState("all");
  const [fStatus, setFStatus] = useState("all");
  const [fRange, setFRange] = useState("all");
  const [fFrom, setFFrom] = useState("");
  const [fTo, setFTo] = useState("");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(6);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfPeriod, setPdfPeriod] = useState("this");
  const [pdfFrom, setPdfFrom] = useState("");
  const [pdfTo, setPdfTo] = useState("");
  const [pdfState, setPdfState] = useState("idle");
  const [toast, setToast] = useState("");
  const seq = useRef(0);
  const timers = useRef([]);
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.current.push(t); return t; };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const flash = (msg) => { setToast(msg); later(() => setToast((t) => (t === msg ? "" : t)), 2600); };
  useEffect(() => {
    if (!view) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setView(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [view]);

  const hold = txns.filter((t) => t.kind === "appointment" && t.status === "Pending").reduce((a, t) => a + Math.abs(t.amt), 0);
  const wdable = Math.max(0, balance - hold - MIN_BALANCE); // D-32: keep at least ₹500 in the Wallet
  const num = parseFloat(amt) || 0;
  const isAdd = view === "add", isWd = view === "withdraw";
  const amtSheet = isAdd || isWd;

  const addTxn = (kind, title, a, status) => {
    seq.current += 1;
    const t = { ref: "AC" + (48210 + seq.current * 7) + "X", kind, title, amt: a, status, ts: Date.now() };
    setTxns((l) => [t].concat(l)); setShown((n) => Math.max(n, 6));
    return t;
  };

  // payment methods: any number of bank accounts, plus one optional UPI ID
  const last4 = (b) => b.acct.slice(-4);
  const bankRows = banks.map((b) => ({ key: b.id, isB: true, saved: true, item: b, title: b.bankName, label: b.bankName + " •••• " + last4(b), sub: "Account ending in " + last4(b) + " · " + b.holder }));
  const upiRows = upis.map((u) => ({ key: u.id, isB: false, saved: true, item: u, title: u.vpa, label: u.vpa, sub: "UPI ID · Verified" }));
  const methods = bankRows.concat(upiRows);
  const savedMethods = methods.filter((m) => m.saved);
  const payLabel = (savedMethods.find((m) => m.key === payout) || {}).label || "";
  const openForm = (kind, edit, id) => {
    setEditing(edit); setFormErr(""); setEditId(edit ? id : null);
    if (kind === "bank") { const b = edit ? banks.find((x) => x.id === id) : null; setForm((f) => ({ ...f, holder: b ? b.holder : "", bankName: b ? b.bankName : "", acct: "", ifsc: b ? b.ifsc : "" })); }
    else { const u = edit ? upis.find((x) => x.id === id) : null; setForm((f) => ({ ...f, upi: u ? u.vpa : "" })); setUpiV(u ? "ok" : "idle"); }
    setView(kind);
  };
  const confirmRemove = (key) => {
    const rest = savedMethods.filter((m) => m.key !== key);
    const next = rest.length ? rest[0].key : null;
    if (upis.some((u) => u.id === key)) setUpis((l) => l.filter((u) => u.id !== key)); else setBanks((l) => l.filter((b) => b.id !== key));
    if (def === key) setDef(next); if (payout === key) setPayout(next);
    setRemoving(null); flash((upis.some((u) => u.id === key) ? "UPI ID" : "Bank account") + " removed");
  };

  // history
  const r = rangeOf(fRange, fFrom, fTo);
  const ql = q.trim().toLowerCase();
  const list = txns.slice().sort((a, b) => b.ts - a.ts).filter((t) =>
    (fType === "all" || (fType === "credit" ? t.amt > 0 : t.amt < 0)) && (fStatus === "all" || t.status === fStatus) && inRange(t.ts, r) &&
    (!ql || t.title.toLowerCase().includes(ql) || t.ref.toLowerCase().includes(ql)));
  const rows = list.slice(0, shown);
  const resetPage = () => setShown(6);
  const clearFilters = () => { setFType("all"); setFStatus("all"); setFRange("all"); setFFrom(""); setFTo(""); setQ(""); setShown(6); };

  // statement
  const pr = rangeOf(pdfPeriod, pdfFrom, pdfTo);
  const pl = txns.filter((t) => inRange(t.ts, pr) && t.status !== "Failed");
  const pCr = pl.filter((t) => t.amt > 0).reduce((a, t) => a + t.amt, 0);
  const pDb = pl.filter((t) => t.amt < 0).reduce((a, t) => a - t.amt, 0);
  const pdfLabel = pdfPeriod === "custom" && pr[0] === null && pr[1] === null ? "Pick a start and end date" : (pr[0] !== null ? fmtD(pr[0]) : "Beginning") + " – " + (pr[1] !== null ? fmtD(pr[1]) : "Today");
  const nowD = new Date();
  const lastD = new Date(nowD.getFullYear(), nowD.getMonth() - 1, 1);
  const ym = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
  const pdfFile = "AstroConnect-Statement-" + (pdfPeriod === "this" ? ym(nowD) : pdfPeriod === "last" ? ym(lastD) : "custom") + ".pdf";
  const downloadPdf = () => {
    if (pdfState === "busy") return;
    setPdfState("busy");
    later(() => { setPdfState("done"); flash("Statement downloaded"); }, 1200);
  };

  // amount sheets
  const openAdd = () => { setView("add"); setStep("form"); setAmt(""); setErr(""); };
  const openWd = () => { setView("withdraw"); setStep("form"); setAmt(""); setErr(""); setPayout(def || (savedMethods[0] ? savedMethods[0].key : null)); };
  const amtNext = () => {
    if (!(num > 0)) return setErr("Enter an amount to continue.");
    if (isAdd) {
      if (num < 100) return setErr("Minimum amount is ₹100.");
      if (num > 50000) return setErr("Maximum per recharge is ₹50,000.");
    } else {
      if (!payLabel) return setErr("Select a payout method to continue.");
      if (num < 100) return setErr("Minimum withdrawal is ₹100.");
      if (num > wdable) return setErr("Amount exceeds your withdrawable balance of " + inr(wdable) + ". The Wallet must keep at least ₹" + MIN_BALANCE + ".");
    }
    setStep("confirm"); setErr("");
  };
  const doConfirm = () => {
    setStep("busy");
    later(() => {
      if (isAdd) {
        const t = addTxn("recharge", "Wallet Recharge", num, "Successful");
        setBalance((b) => b + num); setDone({ ref: t.ref, amt: num }); setStep("done");
      } else {
        const t = addTxn("withdraw", "Withdrawal", -num, "Pending");
        setBalance((b) => b - num); setDone({ ref: t.ref, amt: num }); setStep("done");
        later(() => { setTxns((l) => l.map((x) => (x.ref === t.ref ? { ...x, status: "Successful" } : x))); flash("Withdrawal of " + inr(num) + " completed"); }, 5000);
      }
    }, 900);
  };
  const doneTxn = txns.find((t) => t.ref === done.ref);
  const doneStatus = isWd && doneTxn ? doneTxn.status : "Successful";

  const saveBank = () => {
    const old = editing ? banks.find((b) => b.id === editId) : null;
    const acct = form.acct || (old ? old.acct : "");
    if (!/^[A-Za-z][A-Za-z .'-]{2,}$/.test(form.holder.trim())) return setFormErr("Enter the account holder name as on the bank record.");
    if (form.bankName.trim().length < 2) return setFormErr("Enter the bank name.");
    if (!/^\d{9,18}$/.test(acct)) return setFormErr("Account number should be 9 to 18 digits.");
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc)) return setFormErr("IFSC should look like HDFC0001234.");
    if (!old && banks.some((b) => b.acct === acct)) return setFormErr("This account number is already saved.");
    const rec = { id: old ? old.id : "b" + Date.now(), holder: form.holder.trim(), bankName: form.bankName.trim(), acct, ifsc: form.ifsc };
    setBanks((l) => (old ? l.map((b) => (b.id === old.id ? rec : b)) : l.concat([rec])));
    setDef((d) => d || rec.id); setPayout((p) => p || rec.id); setView(null); setFormErr(""); flash(old ? "Bank account updated" : "Bank account added");
  };
  const verifyUpi = () => {
    if (!/^[\w.-]{2,}@[A-Za-z]{2,}$/.test(form.upi)) return setUpiV("bad");
    setUpiV("checking"); later(() => setUpiV("ok"), 1000);
  };
  const saveUpi = () => {
    if (upiV !== "ok") return setFormErr("Verify the UPI ID before saving.");
    const old = editing ? upis.find((u) => u.id === editId) : null;
    if (upis.some((u) => u.vpa.toLowerCase() === form.upi.toLowerCase() && (!old || u.id !== old.id))) return setFormErr("This UPI ID is already saved.");
    const rec = { id: old ? old.id : "u" + Date.now(), vpa: form.upi };
    setUpis((l) => (old ? l.map((u) => (u.id === old.id ? rec : u)) : l.concat([rec])));
    setDef((d) => d || rec.id); setPayout((p) => p || rec.id); setView(null); setFormErr(""); flash(old ? "UPI ID updated" : "UPI ID added");
  };
  const upiMsgs = { idle: "Enter your UPI ID and tap Verify", checking: "Verifying…", ok: "✓ Verified", bad: "Enter a valid UPI ID, like name@bank" };
  const sheetTitle = view === "bank" ? (editing ? "Edit Bank Account" : "Add Bank Account") : view === "upi" ? (editing ? "Edit UPI ID" : "Add UPI ID") : TITLES[view] || "";
  const setF = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setFormErr(""); };

  return (
    <div className="wallet-page page">
      <div className="wxp">
        <main className="wx-main">
          <header className="wx-head">
            <h1>Wallet</h1>
            <div className="wx-top">
            <section aria-label="Available balance" className="wx-bal">
              <span className="wx-lbl wx-mut">Available Balance</span>
              <div className="wx-num wx-balrow"><span className="wx-rupee">₹</span><span className="wx-big">{inr(balance).slice(1)}</span></div>
              <p className="wx-caution" role="note"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3.5 2.5 20h19z" /><path d="M12 10v4.5M12 17.5v.01" /></svg><span>{"Maintain a minimum balance of ₹" + MIN_BALANCE + ". It can't be withdrawn."}</span></p>
            </section>
            <section aria-label="Wallet actions" className="wx-actions">
              <button className="wx-btn wx-pri wx-bigbtn" onClick={openAdd}><Svg size={22} d="M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM4 7l2-3h10M15 14h2" />Add Money</button>
              <button className="wx-btn wx-sec wx-bigbtn" onClick={openWd}><Svg size={22} d={ICON.withdraw} />Withdraw</button>
            </section>
            </div>
          </header>


          <section aria-labelledby="wx-pm-h" className="wx-card wx-pad">
            <div className="wx-sechead"><h2 id="wx-pm-h">Payment Methods</h2></div>
            {[{ kind: "bank", title: "Banks", rows: methods.filter((m) => m.isB), add: "Add bank", aria: "Add a bank account", none: "No bank accounts added yet." },
              { kind: "upi", title: "UPI", rows: methods.filter((m) => !m.isB), add: "Add UPI", aria: "Add a UPI ID", none: "No UPI IDs added yet." }].map((g) => (
              <div key={g.kind} className="wx-group">
                <div className="wx-ghead"><h3>{g.title}</h3><button className="wx-btn wx-sec wx-small" aria-label={g.aria} onClick={() => openForm(g.kind, false)}><Svg size={18} w={2.2} d="M12 5v14M5 12h14" />{g.add}</button></div>
                {g.rows.length === 0 ? <p className="wx-empty wx-mut wx-s13">{g.none}</p> : null}
                <ul className="wx-mgrid">
                  {g.rows.map((m) => (
                <li key={m.key} className="wx-method">
                      <div className="wx-mrow">
                        <span className={"wx-ico" + (m.saved ? " on" : "")}><Svg size={20} d={m.isB ? ICON.withdraw : ICON.upi} /></span>
                        <div className="wx-mtxt">
                          <div className="wx-mt"><span className="wx-mtitle">{m.title}</span>
                            {m.saved && def === m.key ? <span className="wx-badge wx-gold">Default payout</span> : null}
                            {m.saved && !m.isB ? <span className="wx-badge wx-ok">Verified</span> : null}
                          </div>
                          <p className="wx-mut wx-s12">{m.sub}</p>
                        </div>
                      </div>
                      {m.saved ? (
                        <div className="wx-macts">
                          {def !== m.key ? <button className="wx-link" onClick={() => { setDef(m.key); flash((m.isB ? "Bank account" : "UPI ID") + " set as default payout"); }}>Set as default</button> : null}
                          <button className="wx-link" onClick={() => openForm(m.isB ? "bank" : "upi", true, m.key)}>Edit</button>
                          <button className="wx-link wx-danger" onClick={() => setRemoving(m.key)}>Remove</button>
                        </div>
                      ) : null}
                      {removing === m.key ? (
                        <div className="wx-remove" role="alert"><span>Remove this method?</span><button className="wx-link wx-danger" onClick={() => confirmRemove(m.key)}>Yes, remove</button><button className="wx-link" onClick={() => setRemoving(null)}>Keep</button></div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="wx-mut wx-hl wx-s11 wx-note">Never share your UPI PIN, banking password or OTP. We never ask for them.</p>
          </section>


          <section aria-labelledby="wx-th-h" className="wx-card wx-pad">
            <div className="wx-thhead">
              <h2 id="wx-th-h">Transaction History</h2>
              <button className="wx-btn wx-sec wx-small" aria-expanded={pdfOpen} onClick={() => { setPdfOpen(!pdfOpen); setPdfState("idle"); }}><Svg size={16} w={1.9} d="M12 4v11M7 11l5 5 5-5M5 20h14" />Download PDF</button>
            </div>
            {pdfOpen ? (
              <div className="wx-pdf">
                <span className="wx-lbl">Statement period</span>
                <div className="wx-pills">
                  {[["this", "This Month"], ["last", "Last Month"], ["custom", "Custom Range"]].map(([k, label]) => (
                    <button key={k} className="wx-pill" aria-pressed={pdfPeriod === k} onClick={() => { setPdfPeriod(k); setPdfState("idle"); }}>{label}</button>
                  ))}
                </div>
                {pdfPeriod === "custom" ? (
                  <div className="wx-two">
                    <div className="wx-fld"><label className="wx-lbl" htmlFor="wx-pdf-from">From</label><input id="wx-pdf-from" className="wx-inp" type="date" value={pdfFrom} onChange={(e) => { setPdfFrom(e.target.value); setPdfState("idle"); }} /></div>
                    <div className="wx-fld"><label className="wx-lbl" htmlFor="wx-pdf-to">To</label><input id="wx-pdf-to" className="wx-inp" type="date" value={pdfTo} onChange={(e) => { setPdfTo(e.target.value); setPdfState("idle"); }} /></div>
                  </div>
                ) : null}
                <div className="wx-num wx-s13"><div className="wx-b6">{pdfLabel}</div><div className="wx-mut">{pl.length + " transactions · Credits " + inr(pCr) + " · Debits " + inr(pDb)}</div></div>
                <button className="wx-btn wx-pri wx-small" onClick={downloadPdf} disabled={pdfState === "busy"}>{pdfState === "busy" ? "Preparing statement…" : pdfState === "done" ? "Download again" : "Download PDF Statement"}</button>
                {pdfState === "done" ? <p role="status" className="wx-okmsg">{pdfFile + " is ready."}</p> : null}
              </div>
            ) : null}

            <div className="wx-filters">
              <div role="group" aria-label="Filter by type" className="wx-seg">
                {[["all", "All"], ["credit", "Credit"], ["debit", "Debit"]].map(([k, label]) => (
                  <button key={k} aria-pressed={fType === k} onClick={() => { setFType(k); resetPage(); }}>{label}</button>
                ))}
              </div>
              <div>
                <label className="wx-lbl wx-vh" htmlFor="wx-q">Search transactions</label>
                <input id="wx-q" className="wx-inp" type="search" placeholder="Search title or reference ID" value={q} onChange={(e) => { setQ(e.target.value); resetPage(); }} />
              </div>
              <div className="wx-two">
                <div><label className="wx-lbl wx-vh" htmlFor="wx-st">Status</label>
                  <select id="wx-st" className="wx-inp" value={fStatus} onChange={(e) => { setFStatus(e.target.value); resetPage(); }}>
                    <option value="all">All statuses</option><option value="Successful">Successful</option><option value="Pending">Pending</option><option value="Failed">Failed</option><option value="Refunded">Refunded</option>
                  </select></div>
                <div><label className="wx-lbl wx-vh" htmlFor="wx-rg">Date range</label>
                  <select id="wx-rg" className="wx-inp" value={fRange} onChange={(e) => { setFRange(e.target.value); resetPage(); }}>
                    <option value="all">All dates</option><option value="this">This month</option><option value="last">Last month</option><option value="custom">Custom range</option>
                  </select></div>
              </div>
              {fRange === "custom" ? (
                <div className="wx-two">
                  <div className="wx-fld"><label className="wx-lbl" htmlFor="wx-f-from">From</label><input id="wx-f-from" className="wx-inp" type="date" value={fFrom} onChange={(e) => { setFFrom(e.target.value); resetPage(); }} /></div>
                  <div className="wx-fld"><label className="wx-lbl" htmlFor="wx-f-to">To</label><input id="wx-f-to" className="wx-inp" type="date" value={fTo} onChange={(e) => { setFTo(e.target.value); resetPage(); }} /></div>
                </div>
              ) : null}
            </div>

            <ul>
              {rows.map((t) => {
                const cr = t.amt > 0, fail = t.status === "Failed";
                return (
                  <li key={t.ref} className="wx-hl wx-tx">
                    <span className={"wx-ico sm" + (cr ? " cr" : "")}><Svg size={18} d={ICON[t.kind]} /></span>
                    <div className="wx-txbody">
                      <div className="wx-txline"><span className="wx-txtitle">{t.title}</span><span className={"wx-num wx-amt" + (cr ? " cr" : "") + (fail ? " fail" : "")}>{(cr ? "+" : "−") + inr(Math.abs(t.amt))}</span></div>
                      <div className="wx-txline wx-sub"><span className="wx-mut wx-s12">{fmt(t.ts) + " · " + t.ref}</span><span className={"wx-badge wx-" + ST[t.status]}>{t.status}</span></div>
                    </div>
                  </li>
                );
              })}
            </ul>
            {rows.length === 0 ? (
              <div className="wx-hl wx-none"><p className="wx-b6">No transactions found</p><p className="wx-mut wx-s12">Try changing the filters or search.</p><button className="wx-link" onClick={clearFilters}>Clear filters</button></div>
            ) : null}
            <div className="wx-hl wx-more"><span className="wx-mut wx-s12">{"Showing " + rows.length + " of " + list.length}</span>{list.length > shown ? <button className="wx-link" onClick={() => setShown(shown + 5)}>Load more</button> : null}</div>
          </section>
        </main>

        {toast ? <div role="status" className="wx-toast">{toast}</div> : null}

        {view ? (
          <div className="wx-ov" onMouseDown={(e) => { if (e.target === e.currentTarget) setView(null); }}>
            <div className="wx-sheet" role="dialog" aria-modal="true" aria-label={sheetTitle}>
              <div className="wx-shead"><h2>{sheetTitle}</h2><button aria-label="Close" className="wx-x" onClick={() => setView(null)}><Svg size={20} w={2} d="M6 6l12 12M18 6L6 18" /></button></div>

              {amtSheet && step === "form" ? (
                <div className="wx-col">
                  {isWd ? (
                    <div className="wx-num wx-twin"><span className="wx-mut">Available <strong>{inr(balance)}</strong></span><span className="wx-mut">Withdrawable <strong className="wx-teal">{inr(wdable)}</strong></span></div>
                  ) : <p className="wx-mut wx-num wx-s13">Current balance <strong>{inr(balance)}</strong></p>}
                  {isWd ? <p className="wx-mut wx-s12">The Wallet must keep at least ₹{MIN_BALANCE} after a withdrawal (D-32).</p> : null}
                  <div className="wx-fld"><label className="wx-lbl" htmlFor="wx-amt">Amount (₹)</label>
                    <input id="wx-amt" className="wx-inp wx-num wx-amtinp" inputMode="decimal" placeholder="0.00" value={amt} onChange={(e) => { setAmt(e.target.value.replace(/[^0-9.]/g, "")); setErr(""); }} /></div>
                  {isAdd ? (
                    <div className="wx-pills">
                      {[500, 1000, 2000, 5000].map((n) => (<button key={n} className="wx-pill" aria-pressed={num === n} onClick={() => { setAmt(String(n)); setErr(""); }}>{"₹" + n.toLocaleString("en-IN")}</button>))}
                    </div>
                  ) : (
                    <div className="wx-col wx-g8">
                      <div className="wx-spread"><span className="wx-lbl">Payout method</span><button className="wx-link" onClick={() => { setAmt(wdable > 0 ? String(wdable) : ""); setErr(""); }}>Withdraw all</button></div>
                      {savedMethods.length === 0 ? (
                        <div className="wx-col wx-g8 wx-start"><p className="wx-mut wx-s13">Add a bank account or UPI ID to receive withdrawals.</p><div className="wx-addrow"><button className="wx-btn wx-sec wx-small" onClick={() => openForm("bank", false)}>Add Bank Account</button><button className="wx-btn wx-sec wx-small" onClick={() => openForm("upi", false)}>Add UPI ID</button></div></div>
                      ) : null}
                      {savedMethods.map((m) => (
                        <button key={m.key} className="wx-opt" aria-pressed={payout === m.key} onClick={() => { setPayout(m.key); setErr(""); }}>
                          <span className="wx-radio"><span /></span>
                          <span className="wx-opttxt"><span className="wx-mtitle">{m.label}</span><span className="wx-mut wx-s12">{m.isB ? "Bank account · " + m.item.holder : "UPI ID"}</span></span>
                        </button>
                      ))}
                    </div>
                  )}
                  {err ? <p className="wx-err" role="alert">{err}</p> : null}
                  <button className="wx-btn wx-pri" onClick={amtNext}>Continue</button>
                </div>
              ) : null}

              {amtSheet && step === "confirm" ? (
                <div className="wx-col">
                  <p className="wx-mut wx-s13">Please review before you confirm.</p>
                  <dl className="wx-num wx-dl">
                    <div><dt className="wx-mut">Amount</dt><dd className="wx-b7">{inr(num)}</dd></div>
                    <div className="wx-hl"><dt className="wx-mut">{isAdd ? "Pay with" : "Send to"}</dt><dd className="wx-b6 wx-right">{isAdd ? "Payment gateway" : payLabel}</dd></div>
                    <div className="wx-hl"><dt className="wx-mut">Balance after</dt><dd className="wx-b6">{inr(isAdd ? balance + num : balance - num)}</dd></div>
                  </dl>
                  <div className="wx-two"><button className="wx-btn wx-sec" onClick={() => setStep("form")}>Back</button><button className="wx-btn wx-pri" onClick={doConfirm}>{isAdd ? "Confirm & Add" : "Confirm Withdrawal"}</button></div>
                </div>
              ) : null}

              {amtSheet && step === "busy" ? (
                <div role="status" className="wx-busy"><div className="wx-spin" /><p className="wx-b6">Processing…</p><p className="wx-mut wx-s12">Please wait a moment.</p></div>
              ) : null}

              {amtSheet && step === "done" ? (
                <>
                  <div className="wx-donebox">
                    <span className="wx-donemark"><Svg size={24} w={2.4} d="M5 12.5l4.5 4.5L19 7.5" /></span>
                    <p className="wx-b7 wx-s16">{isAdd ? inr(done.amt) + " added to wallet" : "Withdrawal requested"}</p>
                    <p className="wx-mut wx-num wx-s13">{isAdd ? "New balance " + inr(balance) : inr(done.amt) + " to " + payLabel}</p>
                    <div className="wx-doneref"><span className="wx-mut wx-s12">{"Ref " + done.ref}</span><span className={"wx-badge wx-" + ST[doneStatus]}>{doneStatus}</span></div>
                  </div>
                  <button className="wx-btn wx-pri" onClick={() => setView(null)}>Done</button>
                </>
              ) : null}

              {view === "bank" ? (
                <div className="wx-col">
                  <div className="wx-fld"><label className="wx-lbl" htmlFor="wx-b-h">Account holder name</label><input id="wx-b-h" className="wx-inp" autoComplete="off" value={form.holder} onChange={(e) => setF("holder", e.target.value)} /></div>
                  <div className="wx-fld"><label className="wx-lbl" htmlFor="wx-b-n">Bank name</label><input id="wx-b-n" className="wx-inp" autoComplete="off" value={form.bankName} onChange={(e) => setF("bankName", e.target.value)} /></div>
                  <div className="wx-fld"><label className="wx-lbl" htmlFor="wx-b-a">Account number</label><input id="wx-b-a" className="wx-inp wx-num" inputMode="numeric" autoComplete="off" placeholder={editing && banks.find((b) => b.id === editId) ? "•••• " + last4(banks.find((b) => b.id === editId)) + " (leave blank to keep)" : "Enter account number"} value={form.acct} onChange={(e) => setF("acct", e.target.value.replace(/\D/g, ""))} /><span className="wx-mut wx-s11">Only the last 4 digits are shown after saving.</span></div>
                  <div className="wx-fld"><label className="wx-lbl" htmlFor="wx-b-i">IFSC code</label><input id="wx-b-i" className="wx-inp" autoComplete="off" placeholder="e.g. HDFC0001234" value={form.ifsc} onChange={(e) => setF("ifsc", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11))} /></div>
                  {formErr ? <p className="wx-err" role="alert">{formErr}</p> : null}
                  <button className="wx-btn wx-pri" onClick={saveBank}>Save Bank Account</button>
                </div>
              ) : null}

              {view === "upi" ? (
                <div className="wx-col">
                  <div className="wx-fld"><label className="wx-lbl" htmlFor="wx-u-i">UPI ID</label>
                    <div className="wx-rowg"><input id="wx-u-i" className="wx-inp" autoComplete="off" placeholder="name@bank" value={form.upi} onChange={(e) => { setForm((f) => ({ ...f, upi: e.target.value.trim() })); setUpiV("idle"); setFormErr(""); }} /><button className="wx-btn wx-sec wx-small" onClick={verifyUpi}>Verify</button></div>
                    <span className={"wx-upimsg " + upiV}>{upiMsgs[upiV]}</span></div>
                  <p className="wx-mut wx-s11">We never ask for your UPI PIN or OTP.</p>
                  {formErr ? <p className="wx-err" role="alert">{formErr}</p> : null}
                  <button className="wx-btn wx-pri" onClick={saveUpi} disabled={upiV !== "ok"}>Save UPI ID</button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Wallet;
