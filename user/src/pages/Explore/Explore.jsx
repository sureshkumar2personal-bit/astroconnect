import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import AstroAvatar from "../../components/AstroAvatar/AstroAvatar";
import { IC } from "./exploreIcons";
import "./Explore.css";

function Icon({ d, size = 16, fill }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
  );
}

const CATS = [
  ["Vedic Astrology", "spec", "sun"], ["Marriage", "topic", "rings"], ["Career", "topic", "briefcase"], ["Finance", "topic", "coin"], ["Health", "topic", "health"],
  ["Vastu", "spec", "house"], ["Numerology", "spec", "hash"], ["Palmistry", "spec", "hand"], ["Prashna", "spec", "question"], ["Lal Kitab", "spec", "book"],
  ["Family", "topic", "users"], ["Relationships", "topic", "heart"], ["Horoscope", "topic", "moon"], ["Education", "topic", "cap"], ["Kundli Matching", "topic", "kundli"],
];
const EXTRA = [["KP Astrology", "spec", "target"], ["Tarot Reading", "spec", "cards"], ["Nadi Astrology", "spec", "leaf"], ["Gemstones", "topic", "gem"], ["Muhurtham", "topic", "calendar"]];
const SUGGEST = ["Meenakshi Iyer", "Vedic Astrology", "Numerology", "Marriage", "Career", "Tamil", "Health and Wellbeing"];
const KW = {
  Health: "health wellbeing wellness", Marriage: "marriage wedding matchmaking", Career: "career job work promotion business", Finance: "finance money wealth investment",
  Family: "family children parents", Education: "education studies exams", Relationships: "relationships love partner", "Home & Office": "home office property",
  Horoscope: "horoscope birth chart jathagam", "Kundli Matching": "kundli matching porutham compatibility", Muhurtham: "muhurtham muhurat auspicious dates", Gemstones: "gemstones remedies",
};
export const GROUPS = [
  { key: "avail", title: "Availability", opts: ["Online", "Offline"] },
  { key: "spec", title: "Specialization", opts: ["Vedic Astrology", "KP Astrology", "Numerology", "Vastu", "Palmistry", "Prashna", "Lal Kitab", "Tarot Reading", "Nadi Astrology"] },
  { key: "topic", title: "Expertise and topics", opts: ["Marriage", "Career", "Finance", "Family", "Health", "Education", "Relationships", "Home & Office", "Horoscope", "Kundli Matching", "Muhurtham", "Gemstones"] },
  { key: "lang", title: "Language", opts: ["Tamil", "English", "Hindi", "Malayalam", "Telugu", "Kannada", "Marathi", "Bengali", "Gujarati"] },
  { key: "exp", title: "Experience", opts: ["0–5 years", "5–10 years", "10–15 years", "15+ years"] },
  { key: "rating", title: "Rating", opts: ["4.0+", "4.5+", "4.8+"], single: true },
  { key: "rel", title: "Relationship", opts: ["Following", "Subscribed", "Not following"] },
];
export const EMPTY_F = () => ({ avail: [], spec: [], topic: [], lang: [], exp: [], rating: [], rel: [] });
const SORTS = [["recommended", "Recommended"], ["rating", "Highest rated"], ["exp", "Most experienced"], ["followers", "Most followed"], ["newest", "Newest first"]];
const STOP = ["and", "&", "the", "of", "for", "in", "astrologer", "astrologers"];

const expOk = (y, o) => (o === "0–5 years" ? y < 5 : o === "5–10 years" ? y >= 5 && y < 10 : o === "10–15 years" ? y >= 10 && y < 15 : y >= 15);
export function matchF(a, f) {
  if (f.avail.length && f.avail.indexOf(a.online ? "Online" : "Offline") < 0) return false;
  if (f.spec.length && f.spec.indexOf(a.specLabel) < 0) return false;
  if (f.topic.length && !f.topic.some((t) => a.topics.indexOf(t) > -1)) return false;
  if (f.lang.length && !f.lang.some((l) => a.langList.indexOf(l) > -1)) return false;
  if (f.exp.length && !f.exp.some((o) => expOk(a.yearsN, o))) return false;
  if (f.rating.length && Number(a.ratingAvg) < parseFloat(f.rating[0])) return false;
  if (f.rel.length && !f.rel.some((r) => (r === "Following" ? a.fol || a.sub : r === "Subscribed" ? a.sub : !a.fol && !a.sub))) return false;
  return true;
}
export const nSel = (f) => Object.keys(f).reduce((n, k) => n + f[k].length, 0);

export function ExCard({ a, onFollow, mode }) {
  const tags = a.expertise.slice(0, 3);
  const more = a.expertise.length - tags.length;
  return (
    <article className="card xp-card">
      <div className="xp-top">
        <button className="xp-who" onClick={a.open} aria-label={"Open " + a.name + " profile"}>
          <span className="xp-ph"><AstroAvatar id={a.id} size={56} name={a.name} />{a.online ? <i className="xp-on" /> : null}</span>
          <span className="xp-id">
            <span className="xp-name">{a.name}{a.isNew ? <em className="xp-new">New</em> : null}</span>
          </span>
        </button>
        <div className="xp-side">
          {a.sub ? (
            <span className="xp-subbadge"><Icon d={IC.check} size={13} />Subscribed</span>
          ) : mode ? null : (
            <button className={"xp-follow" + (a.fol ? " on" : "")} aria-pressed={a.fol} aria-label={(a.fol ? "Unfollow " : "Follow ") + a.name} onClick={() => onFollow(a)}>
              <Icon d={a.fol ? IC.check : IC.plus} size={14} />{a.fol ? "Following" : "Follow"}
            </button>
          )}

        </div>
      </div>
      <div className="xp-meta">
        {a.planText ? <span className="xp-plan">{a.planText}</span> : null}
        <span className={"xp-avail" + (a.online ? " on" : "")}><i />{a.online ? "Online now" : "Offline"}</span>
      </div>
      <div className="xp-stats">
        <div><b><Icon d={IC.star} size={14} fill />{a.ratingAvg}</b><span>{a.ratingN + (a.ratingN === 1 ? " review" : " reviews")}</span></div>
        <div><b>{a.yearsN + (a.yearsN === 1 ? " yr" : " yrs")}</b><span>Experience</span></div>
        <div><b>{a.followers.replace(" Followers", "")}</b><span>Followers</span></div>
      </div>
      <div className="xp-tags">
        {tags.map((t, i) => (<span key={i} className="xp-tag">{t}</span>))}
        {more > 0 ? <span className="xp-tag xp-more">{"+" + more + " more"}</span> : null}
      </div>
      <p className="xp-langs"><Icon d={IC.globe} size={14} />{a.langList.join(", ")}</p>
      <p className="xp-price" title={a.priceText}>{"Call from ₹" + a.callFrom + " · Chat from ₹" + a.chatFrom}<span>Prepaid, 5 min minimum</span></p>
      <div className="xp-actions">
        {a.canContact ? (
          <>
            {mode !== "chat" ? (
              <button className="xp-btn xp-call" onClick={a.call} aria-label={"Call " + a.name}><Icon d={IC.phone} />Call</button>
            ) : null}
            {mode !== "call" ? (
              <button className="xp-btn xp-chat" onClick={a.chat} aria-label={"Chat with " + a.name}><Icon d={IC.chat} />Chat</button>
            ) : null}
          </>
        ) : (
          <span className="xp-off">{a.avail}</span>
        )}
        <button className="xp-btn xp-view" onClick={a.open}>Profile</button>
      </div>
    </article>
  );
}

function Block({ id, title, desc, count, onMore, moreLabel, tools, children, empty, loadMore, shown }) {
  return (
    <section className="xp-block" id={id} aria-label={title}>
      <div className="xp-bhead">
        <div>
          <div className="xp-btitle"><h2>{title}</h2>{count ? <span className="xp-count">{count}</span> : null}</div>
          {desc ? <p className="xp-bdesc">{desc}</p> : null}
        </div>
        {onMore ? <button className="xp-more-btn" onClick={onMore} aria-label={moreLabel}>View more<Icon d={IC.right} size={14} /></button> : null}
        {tools}
      </div>
      {empty ? <div className="card xp-empty"><p className="xp-et">{empty[0]}</p><p>{empty[1]}</p>{empty[2]}</div> : children}
      {loadMore}
      {shown ? <p className="xp-shown">{shown}</p> : null}
    </section>
  );
}

export function FiltersDrawer({ cards, draft, setDraft, onClose, onApply, groups = GROUPS }) {
  const total = cards.filter((a) => matchF(a, draft)).length;
  const toggle = (g, o) => {
    setDraft((d) => {
      const cur = d[g.key];
      const next = g.single ? (cur[0] === o ? [] : [o]) : cur.indexOf(o) > -1 ? cur.filter((x) => x !== o) : cur.concat(o);
      return { ...d, [g.key]: next };
    });
  };
  return (
    <>
      <button className="xp-scrim" tabIndex={-1} aria-label="Close filters" onClick={onClose} />
      <aside className="xp-drawer" role="dialog" aria-modal="true" aria-label="Filters">
        <div className="xp-dhead">
          <div><h2>Filters</h2><p>{nSel(draft) ? nSel(draft) + " selected" : "No filters selected"}</p></div>
          <button className="ico" onClick={onClose} aria-label="Close filters"><Icon d={IC.close} /></button>
        </div>
        <div className="xp-dbody">
          {groups.map((g) => (
            <div key={g.key} role="group" aria-label={g.title} className="xp-group">
              <div className="xp-ghead"><h3>{g.title}</h3>{draft[g.key].length ? <span>{g.single ? draft[g.key][0] : draft[g.key].length + " selected"}</span> : null}</div>
              <div className="xp-opts">
                {g.opts.map((o) => {
                  const on = draft[g.key].indexOf(o) > -1;
                  const count = cards.filter((a) => matchF(a, { ...EMPTY_F(), [g.key]: [o] })).length;
                  return (
                    <button key={o} className={"xp-opt" + (on ? " on" : "")} aria-pressed={on} onClick={() => toggle(g, o)}>
                      {on ? <Icon d={IC.check} size={13} /> : null}{o}<span>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="xp-dfoot">
          <button className="btn-g" onClick={() => setDraft(EMPTY_F())}>Clear all</button>
          <button className="btn-p" onClick={onApply}>{"Show " + total + " astrologer" + (total === 1 ? "" : "s")}</button>
        </div>
      </aside>
    </>
  );
}

function ExploreMain() {
  const app = useApp();
  const q = app.q || "";
  const cards = app.exCards;
  const [cat, setCat] = useState(null);
  const [catsOpen, setCatsOpen] = useState(false);
  const [view, setView] = useState(null);
  const [filters, setFilters] = useState(EMPTY_F());
  const [draft, setDraft] = useState(EMPTY_F());
  const [drawer, setDrawer] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [more, setMore] = useState(0);
  const [toast, setToast] = useState(null);
  const tRef = useRef(null);
  const appRef = useRef(app);
  appRef.current = app;
  useEffect(() => () => clearTimeout(tRef.current), []);
  useEffect(() => {
    if (!drawer) return undefined;
    const k = (e) => { if (e.key === "Escape") setDrawer(false); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [drawer]);

  const say = (msg, undo) => { clearTimeout(tRef.current); setToast({ msg, undo }); tRef.current = setTimeout(() => setToast(null), 3600); };
  const onFollow = (a) => {
    const was = a.fol;
    a.toggleFollow();
    say(was ? "Unfollowed " + a.name : "You’re now following " + a.name, () => { appRef.current.exSetFollow(a.id, was); setToast(null); });
  };

  const catObj = cat ? CATS.concat(EXTRA).find((c) => c[0] === cat) : null;
  const words = q.toLowerCase().split(/\s+/).filter((x) => x && STOP.indexOf(x) < 0);
  const hay = (a) => [a.name, a.spec, a.specLabel].concat(a.topics, a.langList, a.topics.map((t) => KW[t] || "")).join(" ").toLowerCase();
  const matchQ = (a) => words.every((x) => hay(a).indexOf(x) > -1);
  const matchCat = (a) => !catObj || (catObj[1] === "spec" ? a.specLabel === catObj[0] : a.topics.indexOf(catObj[0]) > -1);
  const fCount = nSel(filters);
  const active = !!(q.trim() || catObj || fCount);
  const sorted = (list) => {
    const l = list.slice();
    const rank = (a) => (a.sub ? 2 : a.fol ? 1 : 0);
    if (sort === "rating") l.sort((x, y) => Number(y.ratingAvg) - Number(x.ratingAvg) || y.ratingN - x.ratingN);
    else if (sort === "exp") l.sort((x, y) => y.yearsN - x.yearsN);
    else if (sort === "followers") l.sort((x, y) => y.followersN - x.followersN);
    else if (sort === "newest") l.sort((x, y) => x.joinedDays - y.joinedDays);
    else l.sort((x, y) => rank(y) - rank(x) || Number(y.ratingAvg) - Number(x.ratingAvg));
    return l;
  };
  const results = useMemo(() => sorted(cards.filter((a) => matchQ(a) && matchCat(a) && matchF(a, filters))), [cards, q, cat, filters, sort]); // eslint-disable-line
  const base = 6, lim = base * (1 + more);

  const subs = cards.filter((a) => a.sub);
  const followed = cards.filter((a) => a.fol && !a.sub);
  const SECS = {
    subscribed: { title: "Subscribed astrologers", list: subs, empty: ["No subscriptions yet", "Subscribe to an astrologer to ask questions and book appointments."] },
    followed: { title: "Astrologers you follow", list: followed, empty: ["You are not following anyone yet", "Follow astrologers you like and they’ll appear here."] },
    popular: { title: "Popular astrologers", list: cards.slice().sort((x, y) => y.followersN * Number(y.ratingAvg) - x.followersN * Number(x.ratingAvg)) },
  };
  const grid = (list) => (<div className="xp-grid">{list.map((a) => (<ExCard key={a.id} a={a} onFollow={onFollow} />))}</div>);

  const chips = [];
  if (q.trim()) chips.push(["q", "Search: " + q.trim(), () => app.onQ({ target: { value: "" } })]);
  if (catObj) chips.push(["cat", catObj[0], () => setCat(null)]);
  GROUPS.forEach((g) => filters[g.key].forEach((o) => chips.push([g.key + o, o, () => setFilters({ ...filters, [g.key]: filters[g.key].filter((x) => x !== o) })])));
  const clearAll = () => { app.onQ({ target: { value: "" } }); setCat(null); setFilters(EMPTY_F()); setMore(0); };
  const sortTools = (
    <div className="xp-tools">
      <label className="xp-sort">Sort by
        <select className="inp" value={sort} onChange={(e) => setSort(e.target.value)}>{SORTS.map((s) => (<option key={s[0]} value={s[0]}>{s[1]}</option>))}</select>
      </label>
      <button className="xp-filterbtn" onClick={() => { setDraft(filters); setDrawer(true); }}><Icon d={IC.sliders} />{fCount ? "Filters · " + fCount : "Filters"}</button>
    </div>
  );
  const loadMore = (list) => (list.length > lim ? (
    <div className="xp-loadmore"><p>{"Showing " + lim + " of " + list.length + " astrologers"}</p><button className="btn-g" onClick={() => setMore(more + 1)}>Load more astrologers</button></div>
  ) : null);
  const cats = (catsOpen ? CATS.concat(EXTRA) : CATS);

  return (
    <div className="explore-page page xp-page">
      <section className="xp-intro">
        <h1>Explore</h1>
        <div className="xp-searchrow">
          <label className="xp-search">
            <Icon d={IC.search} size={18} />
            <span className="sr-only">Search astrologers</span>
            <input type="text" value={q} onChange={app.onQ} placeholder="Search by astrologer name, expertise, topic, language..." />
            {q ? <button type="button" onClick={() => app.onQ({ target: { value: "" } })} aria-label="Clear search"><Icon d={IC.close} size={15} /></button> : null}
          </label>
          <button className="xp-filterbtn" onClick={() => { setDraft(filters); setDrawer(true); }} aria-label={fCount ? "Filters, " + fCount + " selected" : "Filters"}>
            <Icon d={IC.sliders} />Filters{fCount ? <span className="xp-badge">{fCount}</span> : null}
          </button>
        </div>
        <div className="xp-try"><span>Try</span>{SUGGEST.map((s) => (<button key={s} onClick={() => { app.onQ({ target: { value: s } }); setMore(0); }}>{s}</button>))}</div>
      </section>

      <section className="xp-cats" aria-labelledby="cat-h">
        <div className="xp-bhead">
          <div><h2 id="cat-h">Explore by category</h2></div>
          {cat ? <button className="xp-more-btn" onClick={() => setCat(null)}>Clear category</button> : null}
        </div>
        <div className="xp-tiles">
          {cats.map((c, i) => (
            <button key={c[0]} className={"xp-tile t" + (i % 7) + (cat === c[0] ? " on" : "")} aria-pressed={cat === c[0]} onClick={() => { setCat(cat === c[0] ? null : c[0]); setView(null); setMore(0); }}>
              <span><Icon d={IC[c[2]]} size={20} /></span>{c[0]}
            </button>
          ))}
          <button className="xp-tile t6" onClick={() => setCatsOpen(!catsOpen)}><span><Icon d={catsOpen ? IC.minus : IC.dots} size={20} /></span>{catsOpen ? "Show less" : "More"}</button>
        </div>
      </section>

      {active ? (
        <Block id="results" title={catObj ? catObj[0] : "Search results"} desc="Astrologers matching your search, category and filters." count={results.length + " astrologer" + (results.length === 1 ? "" : "s")} tools={sortTools}
          empty={results.length === 0 ? ["No astrologers match", "Try different words, or clear some filters.", <button key="c" className="btn-g" onClick={clearAll}>Clear all</button>] : null}
          loadMore={loadMore(results)} shown={results.length && results.length <= lim ? "You’ve seen all " + results.length + " astrologers" : null}>
          {chips.length ? (
            <div className="xp-chips">
              {chips.map((c) => (<button key={c[0]} className="xp-chip" onClick={c[2]} aria-label={"Remove " + c[1]}>{c[1]}<Icon d={IC.close} size={12} /></button>))}
              <button className="xp-clear" onClick={clearAll}>Clear all</button>
            </div>
          ) : null}
          {results.length ? grid(results.slice(0, lim)) : null}
        </Block>
      ) : view && SECS[view] ? (
        <div>
          <button className="xp-back" onClick={() => setView(null)}><Icon d={IC.left} size={15} />Back to Explore</button>
          <Block id="view" title={SECS[view].title} desc={SECS[view].desc} count={SECS[view].list.length + " astrologers"} empty={SECS[view].list.length ? null : SECS[view].empty}>
            {grid(SECS[view].list)}
          </Block>
        </div>
      ) : (
        <>
          {Object.keys(SECS).map((k) => (
            <Block key={k} id={"sec-" + k} title={SECS[k].title} desc={SECS[k].desc} onMore={SECS[k].list.length ? () => { setView(k); window.scrollTo({ top: 0 }); } : null} moreLabel={"View more: " + SECS[k].title}
              empty={SECS[k].list.length ? null : SECS[k].empty}>
              {grid(SECS[k].list.slice(0, 3))}
            </Block>
          ))}
          <Block id="all" title="Explore all astrologers" count={cards.length + " astrologers"} tools={sortTools} loadMore={loadMore(sorted(cards))}
            shown={cards.length <= lim ? "You’ve seen all " + cards.length + " astrologers" : null}>
            {grid(sorted(cards).slice(0, lim))}
          </Block>
        </>
      )}

      {drawer ? <FiltersDrawer cards={cards} draft={draft} setDraft={setDraft} onClose={() => setDrawer(false)} onApply={() => { setFilters(draft); setDrawer(false); setMore(0); setView(null); }} /> : null}
      {toast ? (
        <div className="xp-toast" role="status"><span>{toast.msg}</span>{toast.undo ? <button onClick={toast.undo}>Undo</button> : null}</div>
      ) : null}
    </div>
  );
}

function Full({ section }) {
  const app = useApp();
  const g = app.exAll(section);
  const [shown, setShown] = useState(6);
  if (!g) {
    return (
      <div className="explore-page page">
        <div><button className="btn-g u-16" onClick={app.goExplore}>← Back</button></div>
        <div className="card u-39"><div className="u-40">This list was not found</div></div>
      </div>
    );
  }
  return (
    <div className="explore-page page xp-page">
      <div className="xp-bhead">
        <h1 className="xp-h1">{g.title}</h1>
        <button className="btn-g u-16" onClick={app.goExplore}>← Back</button>
      </div>
      {g.items.length ? (
        <div className="xp-grid">{g.items.slice(0, shown).map((a) => (<ExCard key={a.id} a={a} onFollow={(x) => x.toggleFollow()} />))}</div>
      ) : <p className="u-15">{g.empty}</p>}
      {g.items.length > shown ? <div><button className="btn-g" onClick={() => setShown(shown + 6)}>See More</button></div> : null}
    </div>
  );
}

function Explore() {
  const { section } = useParams();
  return section ? <Full key={section} section={section} /> : <ExploreMain />;
}

export default Explore;
