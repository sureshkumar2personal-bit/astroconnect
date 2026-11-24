import React, { Fragment } from "react";
import { useApp } from "../../context/AppContext";
import "./Help.css";

function Help() {
  const app = useApp();
  return (
    <div className="help-page page">
      <div><button className="btn-g u-16" onClick={app.goProfile}>← Profile</button></div>
      <h1 className="u-10">{"Help & support"}</h1>
      <section className="card u-37">
        {app.faqs.map((f, i1) => (
          <Fragment key={i1}>
            <div className="help-1">
              <button className="help-2" onClick={f.go} aria-expanded={f.open}>
                <span>{f.q}</span>
                <span className="u-17">{f.sign}</span>
              </button>
              {f.open ? (
                <p className="help-3">{f.a}</p>
              ) : null}
            </div>
          </Fragment>
        ))}
      </section>
      <div className="u-36">
        <button className="btn-p" onClick={app.contact}>Contact support</button>
        
      </div>
    </div>
  );
}

export default Help;
