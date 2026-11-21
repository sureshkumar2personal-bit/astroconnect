import React, { Fragment } from "react";
import { useApp, cssToStyle } from "../../context/AppContext";
import "./AstrologerProfile.css";

function AstrologerProfile() {
  const app = useApp();
  return (
    <div className="astrologer-profile-page page">
      <div>
        <button className="btn-g u-16" onClick={app.goExplore}>← Back</button>
      </div>
      {app.pf.dnd ? (
        <section className="card ap-unavail">
          <h2 className="u-28">This astrologer is unavailable</h2>
          <p className="u-30">The profile is hidden while the astrologer is in Do Not Disturb. Nothing can be bought, booked, asked or started right now. Your existing confirmed appointments and valid slots keep their rules (D-30, D-38).</p>
          <div className="ap-ctl-row"><button className="chip" onClick={app.pf.toggleDnd}>Prototype: clear Do Not Disturb</button></div>
        </section>
      ) : (
      <>
      <section className="card astrologer-profile-1">
        <div style={cssToStyle(app.cur.avL)}>{app.cur.ini}</div>
        <div className="astrologer-profile-2">
          <h1 className="u-10">{app.cur.name}</h1>
          <div className="astrologer-profile-3">{app.cur.spec}</div>
          <div className="u-17">{app.cur.langs}</div>
          <div className="astrologer-profile-4">{app.pf.bio}</div>
          <div className="ap-rating">{app.pf.rating}{" · rating counts Published reviews only (D-49)"}</div>
        </div>
        <div className="astrologer-profile-5">
          <div className="ap-buttons">
            <button className={app.fp.followCls} onClick={app.fp.toggleFollow}>{app.fp.followLabel}</button>
            <button className={`${app.subCls}`} onClick={app.toggleSub}>{app.subLabel}</button>
          </div>
          <div className="u-13">{app.fp.subStatus}</div>
          <div className="u-12">
            <button className="btn-g astrologer-profile-6" onClick={app.openTerms}>Subscription terms</button>
            <button className="btn-g astrologer-profile-6" onClick={app.openReport}>Share or report</button>
          </div>
        </div>
      </section>
      <section>
        <h2 className="u-2">Services</h2>
        <div className="u-18">
          {app.astroSvc.map((v, i1) => (
            <Fragment key={i1}>
              <div className="card astrologer-profile-7">
                <div className="u-19">
                  <div className="u-6">{v.name}</div>
                  <div className="u-13">{v.note}</div>
                </div>
                <button className="btn-p u-20" onClick={v.go}>Start</button>
              </div>
            </Fragment>
          ))}
        </div>
      </section>
      <section>
        <h2 className="u-2">Instant Call and Instant Chat packages</h2>
        <div className="card ap-pkgs">
          {app.pf.pkgs.map((k, i1) => (
            <Fragment key={i1}>
              <div className="ap-pkg"><strong>{k.kind}</strong><span className="u-13">{k.items}</span></div>
            </Fragment>
          ))}
          <p className="u-15">Prepaid packages, minimum 5 minutes; pay the whole package before the session starts (D-45, D-48).</p>
        </div>
      </section>
      <section>
        <h2 className="u-2">Reviews</h2>
        <div className="u-18">
          {app.pf.reviews.map((r, i1) => (
            <Fragment key={i1}>
              <div className="card astrologer-profile-8">
                <div className="ap-stars">{r.stars}</div>
                <p className="astrologer-profile-9">{"“"}{r.text}{"”"}</p>
                <span className="u-21">{r.src}</span>
              </div>
            </Fragment>
          ))}
          {app.pf.noReviews ? <div className="card astrologer-profile-8"><p className="u-30">No reviews yet.</p></div> : null}
        </div>
        <span className="tag u-24">Review display and sorting · PENDING · P-05-03</span>
      </section>
      <section>
        <h2 className="u-2">Live sessions</h2>
        {app.fp.hasLive ? (
          app.fp.lives.map((l, i1) => (
            <Fragment key={i1}>
              <div className="card ap-live">
                <div className="ap-live-head"><strong>{l.title}</strong><span className="pill ap-live-pill">Live · free</span></div>
                <div className="u-13">{l.aud}{" · no recording or replay (D-50)"}</div>
                {!l.eligible ? <p className="u-15">You are not in the selected audience, so you cannot join or comment.</p> : null}
                {l.eligible && !l.joined ? <div><button className="btn-p" onClick={l.join}>Join live</button></div> : null}
                {l.joined ? (
                  <div className="ap-live-box">
                    {l.comments.map((c, i2) => (<Fragment key={i2}><div className="ap-cm">{c}</div></Fragment>))}
                    <div className="ap-row">
                      <input id="lc" className="inp" placeholder="Comment on the live session" value={app.fp.liveDraft ?? ""} onChange={app.fp.onLiveDraft} />
                      <button className="btn-p" onClick={l.send}>Send</button>
                      <button className="btn-g" onClick={l.leave}>Leave</button>
                    </div>
                  </div>
                ) : null}
              </div>
            </Fragment>
          ))
        ) : <p className="u-15">No live session right now. Only the audience the astrologer selects gets a Live notification (D-50).</p>}
      </section>
      <section>
        <h2 className="u-2">Posts</h2>
        <div className="u-18">
          {app.fp.posts.map((p, i1) => (
            <Fragment key={i1}>
              <div className="card astrologer-profile-8 ap-post">
                <div className="u-13">{p.kind}</div>
                <strong>{p.title}</strong>
                {p.locked ? <p className="ap-lock">{"🔒 "}{p.why}</p> : <p className="astrologer-profile-9">{p.text}</p>}
                {p.general ? (
                  <>
                    <div className="ap-row">
                      <button className={p.liked ? "chip on" : "chip"} onClick={p.like}>{p.liked ? "♥ Liked" : "♡ Like"}{" · "}{p.likes}</button>
                    </div>
                    {p.comments.map((c, i2) => (<Fragment key={i2}><div className="ap-cm">{c}</div></Fragment>))}
                    <div className="ap-row">
                      <input className="inp" aria-label={"Comment on " + p.title} placeholder="Write a comment" value={p.draft} onChange={p.onDraft} />
                      <button className="btn-g" onClick={p.comment}>Comment</button>
                    </div>
                  </>
                ) : null}
              </div>
            </Fragment>
          ))}
        </div>
        <span className="tag u-24">Where Live sessions and posts appear · PENDING · P-14-07</span>
      </section>
      <section className="card ap-ctl">
        <div className="ap-ctl-title">Prototype controls (sample)</div>
        <div className="u-13">Simulate astrologer and Platform Admin actions for {app.cur.name}.</div>
        <div className="ap-ctl-row">
          <button className="chip" onClick={app.pf.toggleDnd}>Put in Do Not Disturb</button>
          <button className="chip" onClick={app.pf.toggleSusp}>{app.pf.tqSusp ? "Resume Text Questions" : "Suspend Text Questions"}</button>
          <button className="chip" onClick={app.pf.submitChange} disabled={app.pf.hasPend}>Astrologer submits a profile change</button>
          <button className="chip" onClick={app.pf.approve} disabled={!app.pf.hasPend}>Platform Admin approves it</button>
          {app.fp.goLiveBtns.map((b, i1) => (<Fragment key={i1}><button className="chip" onClick={b.go}>{b.label}</button></Fragment>))}
        </div>
        {app.pf.hasPend ? <div className="u-13">{"Awaiting approval (users still see the verified details): "}{app.pf.pend}</div> : null}
        <div className="u-13">Reviews (hide or show as astrologer / Platform Admin):</div>
        {app.pf.allReviews.map((r, i1) => (
          <Fragment key={i1}>
            <div className="ap-rev-row">
              <span>{r.stars}{" "}{r.text}{" · "}<em>{r.status}</em></span>
              <button className="chip" onClick={r.toggle}>{r.hidden ? "Show" : "Hide"}</button>
            </div>
          </Fragment>
        ))}
      </section>
      </>
      )}
    </div>
  );
}

export default AstrologerProfile;
