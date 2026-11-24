import React from "react";
import { useApp } from "../../context/AppContext";
import "./Login.css";

function Login() {
  const app = useApp();
  return (
    <div className="login-page page">
      <section className="card login-1">
        {app.login1 ? (
          <>
            <h1 className="login-2">Welcome to Astrum</h1>
            <p className="u-23">Log in to ask questions and book consultations.</p>
            <label className="u-7" htmlFor="ph">Mobile number</label>
            <input className="inp" id="ph" placeholder="Enter your number" />
            <button className="btn-p" onClick={app.loginNext}>Continue</button>
            <button className="btn-g" onClick={app.goHome}>Continue as guest</button>
            <div className="u-12">
              
            </div>
          </>
        ) : null}
        {app.login2 ? (
          <>
            <h1 className="login-2">Add your birth details</h1>
            <p className="u-23">Optional. Astrologers use these to prepare your Kundli.</p>
            <input className="inp" aria-label="Date of birth" placeholder="Date of birth" />
            <input className="inp" aria-label="Time of birth" placeholder="Time of birth" />
            <input className="inp" aria-label="Place of birth" placeholder="Place of birth" />
            <button className="btn-p" onClick={app.goHome}>Get started</button>
            <button className="btn-g" onClick={app.goHome}>Skip for now</button>
          </>
        ) : null}
      </section>
    </div>
  );
}

export default Login;
