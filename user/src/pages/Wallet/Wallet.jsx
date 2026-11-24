import React, { Fragment } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./Wallet.css";

function Wallet() {
  const app = useApp();
  return (
    <div className="wallet-page page">
      <div><button className="btn-g u-16" onClick={app.goProfile}>← Profile</button></div>
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
                  <div className="u-38">{t.label}{t.isRefund ? <span className="pill wl-refund">Refund</span> : null}</div>
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
        <h2 className="u-41">Withdraw</h2>
        <p className="u-33">Withdraw to your bank account. Your Wallet must keep at least ₹500, so only the amount above ₹500 can be withdrawn (D-32).</p>
        <div className="wl-row">
          <input id="wd" className="inp wl-input" inputMode="numeric" placeholder="Amount in ₹" value={app.wdAmt ?? ""} onChange={app.onWd} />
          <button className="chip" onClick={app.wdAll}>{"Max ₹"}{app.wdMax}</button>
          <button className="btn-p" onClick={app.withdraw} disabled={app.wdMax <= 0}>Withdraw</button>
        </div>
        {app.wdMax <= 0 ? <span className="u-21">Nothing to withdraw yet: your balance is at or below the ₹500 minimum.</span> : null}
      </section>
      <section className="card u-29">
        <h2 className="u-41">{"Payments & refunds"}</h2>
        <p className="u-33">Pay for services from your Wallet or directly with UPI or a bank payment; the Wallet is optional (D-33). Every refund is credited to your Wallet (D-32).</p>
        <div className="u-12">
          {app.payChips.map((c, i1) => (
            <Fragment key={i1}>
              <button className={c.cls} onClick={c.go}>{c.label}</button>
            </Fragment>
          ))}
        </div>
        <span className="u-21">{app.payModeText}</span>
        <div className="u-12">
          
          
          
        </div>
      </section>
    </div>
  );
}

export default Wallet;
