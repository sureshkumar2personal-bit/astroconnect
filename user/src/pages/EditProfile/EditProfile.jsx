import React from "react";
import { useApp } from "../../context/AppContext";
import "./EditProfile.css";

function EditProfile() {
  const app = useApp();
  return (
    <div className="edit-profile-page page">
      <div>
        <button className="btn-g u-16" onClick={app.goProfile}>← Profile</button>
      </div>
      <h1 className="u-10">Edit profile</h1>
      <section className="card edit-profile-1">
        <label className="u-7" htmlFor="pn">Name</label>
        <input className="inp" id="pn" value={app.pname ?? ""} onChange={app.onName} />
        <label className="u-7" htmlFor="pl">Language</label>
        <select className="inp edit-profile-2" id="pl" disabled>
          <option>Not decided yet</option>
        </select>
        <span className="tag u-24">Language · PENDING · P-02-05, P-12-02</span>
        <label className="u-7" htmlFor="pv">Privacy</label>
        <select className="inp edit-profile-2" id="pv" disabled>
          <option>Not decided yet</option>
        </select>
        <span className="tag u-24">Privacy · PENDING · P-12-03</span>
        <div>
          <button className="btn-p" onClick={app.saveName}>Save changes</button>
        </div>
        <span className="tag u-24">Profile fields · PENDING · P-12-01</span>
        <div className="edit-profile-3">
          <button className="btn-g edit-profile-4" disabled>Delete account</button>
          <span className="tag">Account deletion · PENDING · P-02-06</span>
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
