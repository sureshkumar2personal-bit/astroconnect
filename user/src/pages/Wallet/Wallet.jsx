import React, { Fragment } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./Wallet.css";

function Wallet() {
  const app = useApp();
  return (
    <div className="wallet-page page">
      <h1 className="u-10">Wallet</h1>
      <section className="wallet-1">
        <div className="wallet-2">
          <div className="wallet-3">Available balance</div>
          <div className="wallet-4">₹{app.wallet}</div>
        </div>
        <button className="btn-p wallet-5" onClick={app.openTop}>Add money</button>
      </section>
      <section>
        <h2 className="wallet-6">Transactions</h2>
        <div className="card u-37">
          {app.txns.map((t, i1) => (
            <Fragment key={i1}>
              <div className="wallet-7">
                <div className="u-19">
                  <div className="u-38">{t.label}</div>
                  <div className="u-21">{t.when}</div>
                </div>
                <div style={cssToStyle(t.st)}>{t.amt}</div>
              </div>
            </Fragment>
          ))}
        </div>
      </section>
      {app.noTxns ? (
        <div className="card u-39">
          <div className="u-40">No transactions yet</div>
          <div className="u-32">Add money to start buying services.</div>
          <button className="btn-p" onClick={app.openTop}>Add money</button>
        </div>
      ) : null}
      <section className="card u-29">
        <h2 className="u-41">{"Payments & refunds"}</h2>
        <div className="u-12">
          <button className="btn-g u-42" disabled>Payment methods</button>
          <button className="btn-g u-42" disabled>Withdraw</button>
          <button className="btn-g u-42" disabled>Invoices</button>
        </div>
        <div className="u-12">
          <span className="tag">Currency · P-10-01</span>
          <span className="tag">Top-up methods · P-10-02</span>
          <span className="tag">Limits · P-10-03</span>
          <span className="tag">Direct pay · P-10-04</span>
          <span className="tag">Refunds · P-10-05</span>
          <span className="tag">Withdrawal · P-10-06</span>
          <span className="tag">Invoices · P-10-07</span>
          <span className="tag">Tax · P-10-08</span>
        </div>
        <span className="u-21">All PENDING — not decided yet.</span>
      </section>
    </div>
  );
}

export default Wallet;
