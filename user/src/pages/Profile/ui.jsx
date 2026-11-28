import React from "react";

const PATHS = {
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  help: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 16.8v.01",
  lock: "M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM8 11V7a4 4 0 0 1 8 0v4",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  logout: "M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H9",
  chev: "M9 18l6-6-6-6",
  back: "M15 18l-6-6 6-6",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  mail: "M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM3 7l9 6 9-6",
  key: "M15 7a4 4 0 1 1-3.9 4.9L3 20v-3l2-2v-2h2l2.1-2.1A4 4 0 0 1 15 7z",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18",
  device: "M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0",
  warn: "M12 3.5 2.5 20h19zM12 10v4.5M12 17.5v.01",
  camera: "M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM12 10a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z",
  pause: "M8 5v14M16 5v14",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6L6 18",
};
export const Ic = ({ n, size = 20, w = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={PATHS[n]} /></svg>
);
export const Badge = ({ tone = "nt", children }) => <span className={"pf-b pf-b-" + tone}>{children}</span>;
export const Group = ({ children }) => <div className="pf-grp">{children}</div>;
export const H = ({ children }) => <h2 className="pf-h">{children}</h2>;
export const Note = ({ tone = "i", children }) => <div className={"pf-note pf-note-" + tone}>{children}</div>;
export const Switch = ({ on, label, onClick, locked }) => (
  <button className={"pf-sw" + (on ? " on" : "") + (locked ? " locked" : "")} role="switch" aria-checked={on} aria-label={label} onClick={onClick}><span /></button>
);
// Row: icon | text (label + sub) | right slot, optionally a button
export function Row({ icon, tone, label, sub, right, onClick, chev, expanded, children }) {
  const inner = (
    <>
      {icon ? <span className={"pf-ico" + (tone ? " " + tone : "")}><Ic n={icon} /></span> : null}
      <span className="pf-rt"><span className="pf-t">{label}</span>{sub ? <span className="pf-mut">{sub}</span> : null}</span>
      {right}
      {chev ? <span className={"pf-chev" + (expanded ? " open" : "")}><Ic n="chev" size={18} /></span> : null}
    </>
  );
  return onClick ? <button className="pf-row" onClick={onClick} aria-expanded={expanded}>{inner}</button> : <div className="pf-row">{inner}{children}</div>;
}
export const Field = ({ id, label, children }) => (<div className="pf-fld"><label className="pf-lbl" htmlFor={id}>{label}</label>{children}</div>);
export function Sheet({ title, onClose, children, label }) {
  return (
    <div className="pf-ov" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pf-sheet" role="dialog" aria-modal="true" aria-label={label || title}>
        <div className="pf-t pf-sh">{title}</div>
        {children}
      </div>
    </div>
  );
}
export const Back = ({ title, onBack }) => (
  <div className="pf-top"><button className="pf-ib" aria-label="Back" onClick={onBack}><Ic n="back" /></button><h1>{title}</h1></div>
);
