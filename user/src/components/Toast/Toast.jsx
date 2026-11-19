import React from "react";
import { useApp } from "../../context/AppContext";
import "./Toast.css";

function Toast() {
  const app = useApp();
  if (!app.toast) return null;
  return (
    <div className="toast" role="status">{app.toast}</div>
  );
}

export default Toast;
