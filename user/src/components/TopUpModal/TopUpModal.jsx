import React, { Fragment } from "react";
import { useApp } from "../../context/AppContext";
import "./TopUpModal.css";

function TopUpModal() {
  const app = useApp();
  if (!app.modal) return null;
  return (
    <div className="topup-modal">
      <div className="card top-up-modal-1" role="dialog" aria-label="Add money">
        <h2 className="u-47">Add money</h2>
        <div className="u-12">
          {app.amts.map((a, i1) => (
            <Fragment key={i1}>
              <button className={`${a.cls}`} onClick={a.go}>₹{a.v}</button>
            </Fragment>
          ))}
        </div>
        <div className="u-1">
          <button className="btn-p" onClick={app.payNow}>Pay ₹{app.amt}</button>
          <button className="btn-g" onClick={app.closeTop}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default TopUpModal;
