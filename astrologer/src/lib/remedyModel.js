// Remedy Tracker model: date helpers and the derived view of an assignment (status, flags,
// attention reasons, daily timeline). Pure functions — no UI. Sample "today" is fixed (2026-11-27).

export const TODAY = '2026-11-27';
export const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const SERVICE_NAMES = { text: 'Text Questions', appt: 'Appointments', chat: 'Instant Chat', call: 'Instant Call' };
export const DAYLABEL = { completed: 'Completed', skipped: 'Skipped', pending: 'Pending / No Update', today: 'Not Started · Today', upcoming: 'Upcoming', halted: 'Not tracked · Stopped', cancelled: 'Cancelled' };
export const DAYCLS = { completed: 's-completed', skipped: 's-skipped', pending: 's-pending', today: 's-today', upcoming: 's-upcoming', halted: 's-cancelled', cancelled: 's-cancelled' };

export function pd(s) { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
export function iso(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
export function addD(s, n) { const d = pd(s); d.setDate(d.getDate() + n); return iso(d); }
export function dDiff(a, b) { return Math.round((pd(b) - pd(a)) / 86400000); }
export function fD(s) { if (!s) return '—'; const d = pd(s); return `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`; }
export function fS(s) { if (!s) return '—'; const d = pd(s); return `${d.getDate()} ${MON[d.getMonth()]}`; }
export function fT(t) { if (!t) return ''; const p = t.split(':'); let h = +p[0]; const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${p[1]} ${ap}`; }
export function nowT() { const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; }
export function initials(n) { return n.split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase(); }
export function mono(n) { const w = n.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean); return ((w[0] || 'R')[0] + ((w[1] || '')[0] || '')).toUpperCase(); }
export function plural(n, w) { return `${n} ${w}${n === 1 ? '' : 's'}`; }
export const inRange = (date, f, t) => (!f || date >= f) && (!t || date <= t);

/** Derived view of one assignment. ctx = { U: users by id, consec, grace }. */
export function deriveAssignment(a, ctx){
    const u = ctx.U[a.userId]||{name:'Unknown User',ref:'—'};
    const dur = a.duration; const days = []; let c = 0, sk = 0, pe = 0, up = 0;
    const haltD = a.cancelled?a.cancelled.d:(a.stopped?a.stopped.d:null);
    for(let i=0;i<dur;i++){
      const date = addD(a.start,i); const l = a.logs[i]; let st;
      if(l) st = l.s; else if(a.cancelled) st = 'cancelled'; else if(a.stopped) st = date<haltD?'pending':'halted';
      else if(a.final||date<TODAY) st = 'pending'; else if(date===TODAY) st = 'today'; else st = 'upcoming';
      if(st==='completed') c++; else if(st==='skipped') sk++; else if(st==='pending') pe++; else if(st==='today'||st==='upcoming') up++;
      days.push({i,date,st,log:l||null});
    }
    const active = !a.cancelled&&!a.stopped&&!a.final;
    const hasLogs = Object.keys(a.logs).length>0;
    const started = a.start<=TODAY||hasLogs;
    let trail = 0;
    if(active){ for(let i=dur-1;i>=0;i--){ const x = days[i]; if(x.date>=TODAY&&!x.log) continue; if(x.st==='pending') trail++; else break; } }
    const end = addD(a.start,dur-1);
    const overdue = active&&dDiff(end,TODAY)>ctx.grace;
    let key, label, bucket;
    if(a.cancelled){ key='cancelled'; label='Cancelled'; bucket=null; }
    else if(a.stopped){ key='skipped'; label='Stopped / Skipped'; bucket='skipped'; }
    else if(a.final){ key='completed'; label=sk>0?'Completed with Skipped Days':'Completed'; bucket='completed'; }
    else if(!started){ key='started'; label='Scheduled'; bucket='started'; }
    else if(c+sk===0){ key='started'; label='Started'; bucket='started'; }
    else { key='ongoing'; label='Ongoing'; bucket='ongoing'; }
    const statusCls = 'pill s-'+key;
    const noUpdate = active&&pe>0;
    const flags = [];
    if(noUpdate) flags.push({label:'No update'+(pe>1?' · '+pe+' days':''),cls:'pill sm s-pending'});
    if(overdue) flags.push({label:'Overdue',cls:'pill sm s-overdue'});
    if(a.followUp&&!a.cancelled) flags.push({label:'Follow-up',cls:'pill sm s-gold'});
    const reasons = [];
    if(active&&started){
      if(trail>=ctx.consec) reasons.push({g:'consecutive',label:'No update for '+trail+' consecutive days',cls:'pill sm s-overdue'});
      else if(pe>0) reasons.push({g:'pending',label:'Pending / No Update · '+plural(pe,'day'),cls:'pill sm s-pending'});
      if(overdue) reasons.push({g:'overdue',label:'Overdue · ended '+fS(end)+', no final completion',cls:'pill sm s-overdue'});
      if(sk>0) reasons.push({g:'skipped',label:plural(sk,'skipped day'),cls:'pill sm s-skipped'});
    }
    if(a.stopped&&dDiff(a.stopped.d,TODAY)<=30) reasons.push({g:'skipped',label:'Stopped on '+fS(a.stopped.d),cls:'pill sm s-skipped'});
    if(a.followUp&&!a.cancelled) reasons.push({g:'followup',label:'Marked for follow-up',cls:'pill sm s-gold'});
    const acts = a.activity.slice().sort((x,y)=>(y.d+y.t).localeCompare(x.d+x.t));
    const lastUpd = acts.length?acts[0].d:a.assigned;
    let lastUser = null; Object.keys(a.logs).forEach(i=>{ if(!lastUser||a.logs[i].d>lastUser) lastUser = a.logs[i].d; }); if(a.final&&(!lastUser||a.final.d>lastUser)) lastUser = a.final.d;
    const outcome = a.cancelled?'cancelled':a.stopped?'stopped':a.final?(sk>0?'completed_skipped':'completed'):null;
    const closed = a.cancelled?a.cancelled.d:a.stopped?a.stopped.d:a.final?a.final.d:null;
        return {id:a.id,a,userId:a.userId,userName:u.name,userRef:u.ref,initials:initials(u.name),methodId:a.methodId,remedyName:a.snapshot.name,category:a.snapshot.category,
      service:a.service,serviceLabel:SERVICE_NAMES[a.service],svcCls:'svc svc-'+a.service,assigned:a.assigned,assignedF:fD(a.assigned),start:a.start,startF:fD(a.start),endF:fD(end),end,
      duration:dur,durationLabel:dur+' days',c,sk,pe,up,pct:Math.round(c/dur*100),progressLabel:c+' / '+dur+' days',days,
      dots:days.map(x=>({cls:'seg sg-'+x.st,title:'Day '+(x.i+1)+' · '+DAYLABEL[x.st]})),
      active,started,overdue,noUpdate,trail,key,label,bucket,statusCls,flags,reasons,outcome,closed,closedF:fD(closed),
      lastUpd,lastUpdF:fD(lastUpd),lastUser,lastUserF:lastUser?fD(lastUser):'No updates yet',acts,cancelled:!!a.cancelled,stopped:!!a.stopped,hasLogs,
      photosCount:a.final?a.final.photos.length:0,
      lastAct:acts[0]?acts[0].text:'',lastActF:acts[0]?fD(acts[0].d)+', '+fT(acts[0].t):'',
      instructions:a.instructions,doneLine:c+' completed · '+sk+' skipped · '+pe+' no update'};
}
