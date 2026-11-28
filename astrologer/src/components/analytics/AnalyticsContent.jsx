import { useState } from 'react';
import { analyticsActions } from '@/hooks/useAnalytics.js';
import { postDetail } from '@/data/mockAnalytics.js';
import { chg, dl, n, pct, row, wd, dateOf } from '@/lib/analytics.js';
import { C, LineChart } from './AnalyticsCharts.jsx';
import { Stat, prevTxt } from './Metric.jsx';
import RowChevron from '@/components/ui/RowChevron.jsx';

// Content performance (AD-145): posts published in the period with lifetime views, likes and comments,
// filtered by type and sorted. Open a post (row toggle, same ▶/▼ chevron as the rest of the app) for its
// trend and audience split. Posts and totals come from Benefits & Content (AD-147); a post's day-by-day
// trend and audience split are an illustrative sample (data/mockAnalytics.js) that adds up to those totals.
const TYPES = { general: 'General Post', daily: 'Daily Prediction', weekly: 'Weekly Prediction', monthly: 'Monthly Prediction', special: 'Special Prediction' };
const KIND = { 'General Post': 'general', 'Daily Prediction': 'daily', 'Weekly Prediction': 'weekly', 'Monthly Prediction': 'monthly', 'Special Prediction': 'special' };
const ICON = { general: 'M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.4 2.4M15.3 15.3l2.4 2.4M6.3 17.7l2.4-2.4M15.3 8.7l2.4-2.4', daily: 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4', weekly: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4', monthly: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z', special: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6l-5.4 2.9 1.2-6-4.5-4.2 6.1-.7z' };
const SORTS = [['views', 'Most viewed'], ['likes', 'Most liked'], ['comments', 'Most commented'], ['eng', 'Highest engagement']];
const eng = (p) => (p.views ? (p.likes + p.comments) / p.views * 100 : 0);
const typeOf = (p) => KIND[p.kind] || 'general';

function PostDetail({ p, avgV, avgE }) {
  const [hi, setHi] = useState(null);
  const d = postDetail(p); const e = eng(p);
  const tl = d.tViews.map((_, k) => ({ label: dl(p.day + k), long: wd(p.day + k) + ', ' + dl(p.day + k) }));
  const tipAt = (i) => {
    let cum = 0; for (let k = 0; k <= i; k++) cum += d.tViews[k];
    return { title: tl[i].long, rows: [row('Views', d.tViews[i], C.pri, 'strong'), row('Likes', d.tLikes[i], C.c4), row('Comments', d.tComments[i]), row('Cumulative views', n(cum) + ' of ' + n(p.views), null, 'sep'), row('Share of lifetime views', pct(d.tViews[i], p.views))], foot: 'Day ' + (i + 1) + ' after publishing' };
  };
  return (
    <div className="cdet">
      <div>
        <div className="kgrid k4">{[['Total views', n(p.views)], ['Likes', n(p.likes)], ['Comments', n(p.comments)], ['Engagement rate', e.toFixed(1) + '%']].map(([k, v]) => <div key={k}><div className="l">{k}</div><div className="v num">{v}</div></div>)}</div>
        {avgV > 0 && <p className="ccmp">{(p.views / avgV).toFixed(2)}× the period average views ({n(avgV)}) · engagement {e.toFixed(1)}% vs {avgE.toFixed(1)}% overall</p>}
        <div className="mini-leg mini-leg--gap"><span><i style={{ background: C.pri }} />Views per day</span><span><i style={{ background: C.c4 }} />Likes per day</span></div>
        {d.tViews.length < 2 && <p className="muted cdet-note">Published today — the trend fills in as days pass.</p>}
        <LineChart H={150} main={d.tViews} l2={d.tLikes} color={C.pri} color2={C.c4} labels={tl} hi={hi} si={null} maxLabels={7} fmt={n} fill={0.1} w2={2}
          aria={(i) => `${tl[i].long}: ${d.tViews[i]} views`} onHover={setHi} onClick={(i) => setHi((x) => (x === i ? null : i))} tipAt={tipAt} />
      </div>
      <div>
        <h4 className="bt bt-sm bt-gap">Audience distribution</h4>
        {d.audDist.map((a) => (
          <div key={a.name} className="abar"><div className="al"><span>{a.name}</span><span className="num"><b>{n(a.n)}</b> <span className="muted">{pct(a.n, p.views)}</span></span></div><div className="pbar pbar--8"><span style={{ width: (p.views ? a.n / p.views * 100 : 0).toFixed(1) + '%', background: C.sec }} /></div></div>
        ))}
        <p className="foot">Published {wd(p.day)}, {dl(p.day)} {dateOf(p.day).getUTCFullYear()} · Audience: {p.aud.join(', ')}</p>
        <p className="foot foot--4">Engagement rate = (likes + comments) ÷ views × 100 = ({p.likes} + {p.comments}) ÷ {p.views} × 100</p>
      </div>
    </div>
  );
}

export default function AnalyticsContent({ D, P, s, cur = '' }) {
  const [openId, setOpenId] = useState(null);
  const posts = D.POSTS.filter((p) => p.day >= P.s && p.day <= P.e);
  const postsP = D.POSTS.filter((p) => p.day >= P.s - P.len && p.day <= P.e - P.len);
  const totV = posts.reduce((a, p) => a + p.views, 0), totVP = postsP.reduce((a, p) => a + p.views, 0);
  const avgV = posts.length ? totV / posts.length : 0;
  const avgE = posts.reduce((a, p) => a + p.likes + p.comments, 0) / Math.max(1, totV) * 100;
  const avgEP = postsP.length ? postsP.reduce((a, p) => a + p.likes + p.comments, 0) / Math.max(1, totVP) * 100 : null;
  const filters = [['all', 'All'], ...Object.keys(TYPES).map((k) => [k, k === 'general' ? 'General Posts' : TYPES[k]])];
  const fl = (s.cFilter === 'all' ? posts.slice() : posts.filter((p) => typeOf(p) === s.cFilter))
    .sort((a, b) => (s.cSort === 'eng' ? eng(b) - eng(a) : b[s.cSort] - a[s.cSort]));
  const toggle = (id) => setOpenId((v) => (v === id ? null : id));

  return (
    <section className={'panel' + cur} aria-labelledby="s-c">
      <div className="sh"><h2 className="h2" id="s-c">How your posts are performing</h2></div>
      <div className="cards c3">
        <Stat name="Total posts published" val={n(posts.length)} chg={chg(posts.length, postsP.length)} sub={prevTxt(postsP.length)} />
        <Stat name="Total views" val={n(totV)} chg={chg(totV, totVP)} sub={prevTxt(totVP) + ' · lifetime views of these posts'} />
        <Stat name="Engagement rate" val={avgE.toFixed(1) + '%'} chg={avgEP == null ? chg(0, null) : chg(Math.round(avgE * 10), Math.round(avgEP * 10), false, (v) => (v / 10).toFixed(1) + '%')} sub="(likes + comments) ÷ views" />
      </div>
      <div className="block">
        <div className="tools tools--col">
          <div className="chips" role="group" aria-label="Content type">
            {filters.map(([id, label]) => (
              <button key={id} type="button" className={s.cFilter === id ? 'on' : ''} aria-pressed={s.cFilter === id} onClick={() => analyticsActions.set({ cFilter: id })}>
                {label} <small>{id === 'all' ? posts.length : posts.filter((p) => typeOf(p) === id).length}</small>
              </button>
            ))}
          </div>
          <div className="sortw"><span className="muted">Sort</span>
            <div className="chips" role="group" aria-label="Sort posts">
              {SORTS.map(([id, label]) => <button key={id} type="button" className={s.cSort === id ? 'on' : ''} aria-pressed={s.cSort === id} onClick={() => analyticsActions.set({ cSort: id })}>{label}</button>)}
            </div>
          </div>
        </div>
        <div className="chead"><span /><span>Post</span><span>Audience</span><span className="r">Views</span><span className="r">Likes</span><span className="r">Comments</span><span className="r">Engagement</span><span /></div>
        {!fl.length && <div className="empty empty--top">{posts.length ? `No posts of this type ${P.word}.` : `No posts were published ${P.word}.`}</div>}
        {fl.map((p) => {
          const t = typeOf(p), on = openId === p.id;
          return (
            <div key={p.id} className={'lrow' + (on ? ' on' : '')}>
              <div className="crh" role="button" tabIndex={0} aria-expanded={on} aria-label={`${on ? 'Collapse' : 'Expand'} ${p.title}`}
                onClick={() => toggle(p.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(p.id); } }}>
                <span className={'thumb t-' + t}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICON[t]} /></svg></span>
                <span className="lt"><span className="ct">{p.title}</span><span className="cm">{TYPES[t]} · {dl(p.day)}</span></span>
                <span className="hm caud">{p.aud.join(' · ')}</span>
                <span className="cnum num">{n(p.views)}<small>views</small></span>
                <span className="cnum num hm">{n(p.likes)}</span>
                <span className="cnum num hm">{n(p.comments)}</span>
                <span className="cnum num hm ceng">{eng(p).toFixed(1)}%</span>
                <RowChevron open={on} />
              </div>
              {on && <PostDetail p={p} avgV={avgV} avgE={avgE} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
