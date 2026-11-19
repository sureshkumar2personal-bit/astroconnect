import React, { createContext, useContext, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GR, ASTRO, CATS, CAMPS, ACTS0, ICON } from "../data/mockData";

// Converts an inline-style string ("a:b;c:d") into a React style object.
export function cssToStyle(str) {
  const o = {};
  if (!str) return o;
  str.split(/;(?![^(]*\))/).forEach((d) => {
    const i = d.indexOf(":");
    if (i < 0) return;
    const k = d.slice(0, i).trim();
    const v = d.slice(i + 1).trim();
    if (!k) return;
    o[k.startsWith("--") ? k : k.replace(/^-ms-/, "ms-").replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
  });
  return o;
}

const T0=(function(){try{return localStorage.getItem('ac-theme')==='light'?'light':'dark';}catch(e){return 'dark';}})();

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const pathOf = (screen) => (screen === "home" ? "/" : "/" + screen);

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const st = pathname === "/" ? "home" : pathname.slice(1);

  const [state, setRaw] = useState(() => ({astro:0,q:'',cat:'All',online:false,subs:[0],slots:[],qty:1,wallet:500,txns:[{label:'Money added',when:'Last week',amt:500,sign:1}],actTab:'All',acts:ACTS0,disputed:{},reviewed:{},toggles:{push:true,inapp:true},modal:false,amt:500,toast:'',notifOpen:false,theme:T0,draft:'',day:0,time:0,kind:'Call',phase:'idle',msgs:[],chatDraft:'',lastId:0,bps:[{name:'Self',dob:'01 Jan 1990',tob:'06:30 AM',pob:'Chennai'},{name:'Family member',dob:'12 Aug 1962',tob:'09:10 PM',pob:'Madurai'}],bp:0,files:[],remedies:[{title:'Sample remedy: chant a short mantra on Thursday mornings.',src:'Text Question · Meenakshi Iyer'}],faq:-1,loginStep:1,dlg:null,rate:0,note:'',ansId:1,pname:'Guest User',empty:false}));
  const ref = useRef(state);
  const timer = useRef(null);

  // Same merge semantics as the original DCLogic.setState.
  const setState = (s) => {
    const patch = typeof s === "function" ? s(ref.current) : s;
    ref.current = { ...ref.current, ...patch };
    setRaw(ref.current);
  };
  const showToast = (m) => {
    setState({ toast: m });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState({ toast: "" }), 2600);
  };
  const navTo = (screen, patch) => {
    setState(patch || {});
    navigate(pathOf(screen));
  };
  const go = (screen, extra) => () => {
    setState({ notifOpen: false, dlg: null, ...(extra || {}) });
    navigate(pathOf(screen));
  };

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  const renderVals = () => {
const s=state,cur=ASTRO[s.astro];
const isSub=i=>s.subs.indexOf(i)>=0;
const av=(i,z)=>'width:'+z+'px;height:'+z+'px;border-radius:99px;flex:none;display:flex;align-items:center;justify-content:center;font:700 '+Math.round(z*0.42)+'px "Cormorant Garamond",serif;color:#fff;background-image:linear-gradient(135deg,'+GR[i%GR.length]+')';
const ini=a=>a.name.split(' ').map(w=>w[0]).slice(0,2).join('');
const card=a=>({...a,ini:ini(a),av:av(a.id,52),sub:isSub(a.id),open:()=>navTo('astro',{astro:a.id,notifOpen:false})});
const chipSt=t=>t==='Answered'||t==='Completed'||t==='Review submitted'?'background:rgba(var(--gn),.15);color:var(--green)':t==='Dispute raised'?'background:rgba(195,169,255,.2);color:var(--em)':'background:rgba(var(--gd),.16);color:var(--gold)';
const top={Home:'home',Explore:'explore',astro:'explore',Services:'services',text:'services',Activity:'activity',Profile:'profile',wallet:'profile'};
const keyOf={home:'Home',explore:'Explore',astro:'Explore',services:'Services',text:'Services',appt:'Services',session:'Services',activity:'Activity',profile:'Profile',wallet:'Profile',kundli:'Profile',follow:'Profile',notifs:'Profile',remedy:'Profile',help:'Profile',answer:'Activity',edit:'Profile'};
const nav=['Home','Explore','Services','Activity','Profile'].map(l=>{const on=keyOf[st]===l;return{label:l,d:ICON[l],cls:'nv'+(on?' on':''),mcls:'mt'+(on?' on':''),go:go(l.toLowerCase())};});
const svc=(n,b,go,pend,pid)=>({name:n,blurb:b,go,pend,pid});
const soon=()=>showToast('This flow is designed in the next pass');
const services=[svc('Text Question','Ask an astrologer a written question and receive an answer.',go('text'),false,''),svc('Appointment','Book a scheduled consultation.',go('appt'),true,'P-07-09'),svc('Instant Call','Talk to an astrologer now.',go('session',{kind:'Call',phase:'idle'}),true,'P-08-07'),svc('Instant Chat','Chat with an astrologer now.',go('session',{kind:'Chat',phase:'idle'}),true,'P-09-07')];
const list=ASTRO.filter(a=>(s.cat==='All'||a.cats.indexOf(s.cat)>=0)&&(!s.online||a.online)&&(!s.q||(a.name+a.spec+a.langs).toLowerCase().indexOf(s.q.toLowerCase())>=0)).map(card);
const openDlg=(k,e)=>()=>setState({dlg:{k,...(e||{})},rate:0,note:''});
const slotsOf=i=>s.slots.filter(x=>x===i).length;
const slotsN=slotsOf(s.astro);
const tabType={Questions:'Question',Appointments:'Appointment',Calls:'Call',Chats:'Chat'};
const actList=s.acts.filter(x=>s.actTab==='All'||x.type===tabType[s.actTab]).map(x=>{const dsp=!!s.disputed[x.id],rv=!!s.reviewed[x.id];const status=dsp?'Dispute raised':x.status;return{...x,status,st:chipSt(status)+';',canDispute:x.type==='Question'&&x.status==='Answered'&&!dsp,dispute:openDlg('dispute',{id:x.id}),canView:x.type==='Question',viewLabel:x.status==='Awaiting answer'?'View question':'View answer',view:()=>navTo('answer',{ansId:x.id}),canResched:x.type==='Appointment'&&x.status==='Upcoming',resched:openDlg('resched'),canReview:(x.type==='Call'||x.type==='Chat'||x.type==='Appointment')&&x.status==='Completed'&&!rv,reviewed:rv,review:openDlg('review',{id:x.id})};});

const DAYS=['Thu 19 Nov','Fri 20 Nov','Sat 21 Nov','Sun 22 Nov','Mon 23 Nov'],TIMES=['10:00 AM','11:30 AM','2:00 PM','4:30 PM','6:00 PM','7:30 PM'];
const isCall=s.kind==='Call';
const pids=isCall?['P-08-01','P-08-02','P-08-06']:['P-09-01','P-09-02','P-09-06'];
const sess=(patch)=>setState(patch);
const addAct=(type,title,status,when)=>{const id=Date.now();setState({acts:[{id,type,who:cur.name,when,title,status}].concat(ref.current.acts),lastId:id});return id;};
const bp=s.bps[s.bp];
const setBp=k=>e=>{const b=s.bps.slice();b[s.bp]={...b[s.bp],[k]:e.target.value};setState({bps:b});};
const faqs=[['Can I dispute an answer?','Only Text Questions can be disputed, within 7 days after you receive the answer, to request an additional answer (D-08). Appointments, Instant Calls and Instant Chats have no dispute option (D-09).'],['When do question slots expire?','A purchased slot must be used within 7 days of purchase. Holding it does not extend this, and expired slots are not refunded (D-06, D-07).'],['Which notifications can I turn off?','Critical alerts — appointment, question, payment/wallet, subscription, security and account — are always on (D-15). Push and in-app are the confirmed channels (D-16).'],['Can I review a consultation?','Yes. You can submit a review after an Appointment, Instant Call or Instant Chat (D-10).']];
const NT=[['Question','Your question to Meenakshi Iyer was answered.','2 days ago','answer','View answer'],['Question','A held question slot expires in 2 days.','Today','text','Use a slot'],['Payment/wallet','₹500 was added to your wallet.','Last week','wallet','Open wallet'],['Subscription','Your subscription to Meenakshi Iyer is active.','Last week','follow','Manage subscriptions'],['Security','New login to your account.','Last week','profile','Open profile'],['Appointment','Appointment with Arvind Nair is on Saturday.','Yesterday','activity','Open Activity']];
const NL=NT.map((n,i)=>({cat:n[0],text:n[1],open:openDlg('notif',{i})}));
const dn=s.dlg&&s.dlg.k==='notif'?NT[s.dlg.i]:NT[0];
const ansItem=s.acts.find(x=>x.id===s.ansId)||s.acts[0]||{who:'',when:'',title:'',status:'Answered'};
const ansDone=ansItem.status!=='Awaiting answer',ansDsp=!!s.disputed[ansItem.id];
const dk=s.dlg?s.dlg.k:'';
const heldMap={};s.slots.forEach(i=>{heldMap[i]=(heldMap[i]||0)+1;});
const heldKeys=Object.keys(heldMap);
const buy=c=>()=>{const tot=c.price*s.qty;if(s.wallet<tot){setState({modal:true,amt:Math.max(100,Math.ceil((tot-s.wallet)/100)*100)});showToast('Add money to continue');return;}
const add=[];for(let k=0;k<s.qty;k++)add.push(s.astro);
setState({wallet:s.wallet-tot,slots:s.slots.concat(add),txns:[{label:s.qty+' question slot(s) · '+cur.name,when:'Just now',amt:tot,sign:-1}].concat(s.txns)});showToast(s.qty+' slot(s) added · valid for 7 days');};
const amts=[100,250,500,1000].map(v=>({v,cls:'chip'+(s.amt===v?' on':''),go:()=>setState({amt:v})}));
const tgl=(k,label,note)=>({label,note,on:s.toggles[k]?'true':'false',just:s.toggles[k]?'justify-content:flex-end':'justify-content:flex-start',go:()=>setState({toggles:{...s.toggles,[k]:!s.toggles[k]}})});
return{
nav,sHome:st==='home',sExplore:st==='explore',sAstro:st==='astro',sServices:st==='services',sText:st==='text',sActivity:st==='activity',sWallet:st==='wallet',sProfile:st==='profile',sAppt:st==='appt',sSession:st==='session',sKundli:st==='kundli',sFollow:st==='follow',sNotifs:st==='notifs',sRemedy:st==='remedy',sHelp:st==='help',sLogin:st==='login',goNotifs:go('notifs'),goRemedy:go('remedy'),
goHome:go('home'),goExplore:go('explore'),goServices:go('services'),goActivity:go('activity'),goWallet:go('wallet'),goProfile:go('profile'),goText:go('text'),
toggleNotif:()=>setState({notifOpen:!s.notifOpen}),notifOpen:s.notifOpen,wallet:s.wallet,services,
onlineList:ASTRO.filter(a=>a.online).slice(0,3).map(card),lastAct:s.acts.length?{...s.acts[0],st:chipSt(s.acts[0].status)+';'}:{type:'New',title:'No activity yet — start with a Text Question.',status:'Start',st:'background:rgba(var(--gd),.16);color:var(--gold);'},lastGo:s.acts.length?go('activity'):go('services'),
q:s.q,onQ:e=>setState({q:e.target.value}),onlineCls:'chip'+(s.online?' on':''),toggleOnline:()=>setState({online:!s.online}),
cats:CATS.map(c=>({label:c,cls:'chip'+(s.cat===c?' on':''),go:()=>setState({cat:c})})),exploreList:list,noResults:list.length===0,
cur:{...cur,ini:ini(cur),avL:av(cur.id,96)},subCls:isSub(cur.id)?'btn-g':'btn-p',subLabel:isSub(cur.id)?'Subscribed ✓':'Subscribe',
toggleSub:()=>{if(isSub(cur.id)){setState({subs:s.subs.filter(x=>x!==cur.id)});showToast('Unsubscribed');}else{setState({subs:s.subs.concat(cur.id)});showToast('Subscribed to '+cur.name);}},
astroSvc:[{name:'Text Question',note:isSub(cur.id)?'Subscribed — ready to ask':'Subscribe first (D-04)',go:go('text')},{name:'Appointment',note:'Scheduled consultation',go:go('appt')},{name:'Instant Call',note:'Talk now',go:go('session',{kind:'Call',phase:'idle'})},{name:'Instant Chat',note:'Chat now',go:go('session',{kind:'Chat',phase:'idle'})}],
pickList:ASTRO.map(a=>({name:a.name,cls:'chip'+(s.astro===a.id?' on':''),go:()=>setState({astro:a.id})})),
notSub:!isSub(cur.id),isSub:isSub(cur.id),subscribeNow:()=>{setState({subs:s.subs.concat(cur.id)});showToast('Subscribed to '+cur.name);},
camps:CAMPS.map(c=>({...c,total:c.price*s.qty,buy:buy(c)})),qty:s.qty,qtyUp:()=>setState({qty:Math.min(5,s.qty+1)}),qtyDown:()=>setState({qty:Math.max(1,s.qty-1)}),
slotsN,slotStyle:slotsN?'background:rgba(var(--gn),.15);color:var(--green)':'background:rgba(var(--gd),.16);color:var(--gold)',
draft:s.draft,onDraft:e=>setState({draft:e.target.value}),
submitQ:()=>{if(!isSub(cur.id)){showToast('Subscribe to this astrologer first');return;}if(!slotsN){showToast('Buy a question slot first');return;}if(!s.draft.trim()){showToast('Write your question first');return;}
const i=s.slots.indexOf(s.astro);const sl=s.slots.slice();sl.splice(i,1);
setState({slots:sl,draft:'',acts:[{id:Date.now(),type:'Question',who:cur.name,when:'Just now',title:s.draft.trim(),status:'Awaiting answer'}].concat(s.acts)});showToast('Question sent — see it in Activity');},
actTabs:['All','Questions','Appointments','Calls','Chats'].map(t=>({label:t,cls:'chip'+(s.actTab===t?' on':''),go:()=>setState({actTab:t})})),actList,noActs:actList.length===0,
hasHeld:heldKeys.length>0,heldText:heldKeys.map(k=>heldMap[k]+' slot(s) with '+ASTRO[k].name).join(' · ')+' · expire 7 days after purchase',
txns:s.txns.map(t=>({label:t.label,when:t.when,amt:(t.sign>0?'+ ₹':'− ₹')+t.amt,st:'font-size:19px;font-weight:600;color:'+(t.sign>0?'var(--green)':'var(--ink)')})),
openTop:()=>setState({modal:true}),closeTop:()=>setState({modal:false}),modal:s.modal,amts,amt:s.amt,
payNow:()=>{setState({wallet:s.wallet+s.amt,modal:false,txns:[{label:'Money added',when:'Just now',amt:s.amt,sign:1}].concat(s.txns)});showToast('₹'+s.amt+' added to wallet');},
menu:[{label:'Wallet',go:go('wallet')},{label:'Birth profiles & Kundli',go:go('kundli')},{label:'Following & subscriptions',go:go('follow')},{label:'Remedy Tracker',go:go('remedy')},{label:'Notifications',go:go('notifs')},{label:'Help & support',go:go('help')},{label:'Log out',go:go('login',{loginStep:1})},{label:s.empty?'Demo: restore sample data':'Demo: first-time user (empty states)',go:()=>setState(s.empty?{empty:false,acts:ACTS0,txns:[{label:'Money added',when:'Last week',amt:500,sign:1}],wallet:500,remedies:[{title:'Sample remedy: chant a short mantra on Thursday mornings.',src:'Text Question · Meenakshi Iyer'}],subs:[0]}:{empty:true,acts:[],txns:[],wallet:0,remedies:[],subs:[],slots:[],files:[]})}],
toggles:[tgl('push','Push notifications','Channel confirmed (D-16)'),tgl('inapp','In-app notifications','Channel confirmed (D-16)'),{label:'Critical alerts',note:'Always on (D-15)',on:'true',just:'justify-content:flex-end;opacity:.6',go:()=>showToast('Critical alerts cannot be turned off')}],
soon,
isDark:s.theme==='dark',isLight:s.theme==='light',themeLabel:s.theme==='dark'?'Switch to light mode':'Switch to dark mode',toggleTheme:()=>{const n=s.theme==='dark'?'light':'dark';try{localStorage.setItem('ac-theme',n);}catch(e){}setState({theme:n});},
sAnswer:st==='answer',sEdit:st==='edit',goEdit:go('edit'),
ans:{...ansItem,status:ansDsp?'Dispute raised':ansItem.status,st:chipSt(ansDsp?'Dispute raised':ansItem.status)+';',left:5,bar:'height:100%;width:71%;background:var(--acc)',canDispute:ansDone&&!ansDsp,disputed:ansDsp,dispute:openDlg('dispute',{id:ansItem.id})},ansWaiting:!ansDone,ansDone,
pname:s.pname,pini:(s.pname||'G')[0].toUpperCase(),onName:e=>setState({pname:e.target.value}),saveName:()=>showToast('Profile saved'),
dlgOn:!!s.dlg,dlgTitle:{review:'Write a review',dispute:'Raise a dispute',notif:'Notification',resched:'Reschedule or cancel',report:'Share or report',terms:'Subscription terms'}[dk]||'',
dReview:dk==='review',dDispute:dk==='dispute',dNotif:dk==='notif',dResched:dk==='resched',dReport:dk==='report',dTerms:dk==='terms',closeDlg:()=>setState({dlg:null}),
stars:[1,2,3,4,5].map(n=>({label:n+' star'+(n>1?'s':''),cls:'chip'+(s.rate>=n?' on':''),go:()=>setState({rate:n})})),note:s.note,onNote:e=>setState({note:e.target.value}),
submitReview:()=>{if(!s.rate){showToast('Select a rating first');return;}setState({reviewed:{...s.reviewed,[s.dlg.id]:1},dlg:null});showToast('Review submitted. Thank you!');},
submitDispute:()=>{setState({disputed:{...s.disputed,[s.dlg.id]:1},dlg:null});showToast('Dispute raised — additional answer requested');},
dn:{cat:dn[0],text:dn[1],time:dn[2],cta:dn[4],go:go(dn[3])},openTerms:openDlg('terms'),openReport:openDlg('report'),
terms:[['Price','P-14-02'],['Duration','P-14-03'],['Renewal','P-14-04'],['Cancellation & refund','P-14-05']].map(x=>({l:x[0],p:x[1]})),
noTxns:s.txns.length===0,noRem:s.remedies.length===0,
days:DAYS.map((l,i)=>({label:l,cls:'chip'+(s.day===i?' on':''),go:()=>setState({day:i})})),times:TIMES.map((l,i)=>({label:l,cls:'chip'+(s.time===i?' on':''),go:()=>setState({time:i})})),dayLabel:DAYS[s.day],timeLabel:TIMES[s.time],
bookAppt:()=>{if(s.wallet<299){setState({modal:true,amt:300});showToast('Add money to continue');return;}setState({wallet:s.wallet-299,txns:[{label:'Appointment · '+cur.name,when:'Just now',amt:299,sign:-1}].concat(s.txns)});addAct('Appointment','Consultation with '+cur.name,'Upcoming',DAYS[s.day]+', '+TIMES[s.time]);showToast('Appointment booked');},
sesTitle:'Instant '+s.kind,isCall,isChat:!isCall,sesIdle:s.phase==='idle',sesConn:s.phase==='connecting',sesLive:s.phase==='live',sesEnd:s.phase==='ended',
pidPrice:pids[0],pidMin:pids[1],pidSub:pids[2],onlineTxt:cur.online?'online':'offline',onlineSt:'color:'+(cur.online?'var(--green)':'var(--gold)'),startLabel:isCall?'Start call':'Start chat',
startSes:()=>{if(!cur.online){showToast(cur.name+' is offline right now');return;}setState({phase:'connecting',msgs:isCall?[]:[{me:false,t:'Namaste! How can I help you today?'}]});setTimeout(()=>setState({phase:'live'}),1400);},
msgs:s.msgs.map(m=>({t:m.t,st:'max-width:80%;padding:10px 14px;border-radius:16px;line-height:1.35;'+(m.me?'align-self:flex-end;background:#5a3cc0':'align-self:flex-start;background:rgba(var(--gl),.15)')})),chatDraft:s.chatDraft,onChat:e=>setState({chatDraft:e.target.value}),
sendChat:()=>{const t=s.chatDraft.trim();if(!t)return;setState({msgs:s.msgs.concat([{me:true,t}]),chatDraft:''});setTimeout(()=>setState({msgs:ref.current.msgs.concat([{me:false,t:'Thank you. This is a sample reply from the astrologer.'}])}),1000);},
endSes:()=>{const id=addAct(s.kind,'Instant '+s.kind+' · '+(isCall?'6 min':s.msgs.length+' messages'),'Completed','Just now');setState({phase:'ended',lastId:id,remedies:[{title:'Sample remedy: light a diya on Thursday evenings.',src:'Instant '+s.kind+' · '+cur.name}].concat(s.remedies)});},
reviewLast:openDlg('review',{id:s.lastId}),
bps:s.bps.map((b,i)=>({name:b.name,cls:'chip'+(s.bp===i?' on':''),go:()=>setState({bp:i})})),bp,addBp:()=>setState({bps:s.bps.concat([{name:'New profile',dob:'',tob:'',pob:''}]),bp:s.bps.length}),
setName:setBp('name'),setDob:setBp('dob'),setTob:setBp('tob'),setPob:setBp('pob'),saveBp:()=>showToast('Saved — Kundli updated automatically. Uploaded files unchanged.'),
files:s.files.map(n=>({name:n})),onFile:e=>{const f=e.target.files&&e.target.files[0];if(!f)return;if(!/\.(jpe?g|png|pdf)$/i.test(f.name)){showToast('Only JPG, PNG or PDF files');return;}setState({files:s.files.concat([f.name])});showToast('Uploaded '+f.name);},
subList:ASTRO.filter(a=>isSub(a.id)).map(a=>({...card(a),unsub:()=>{setState({subs:s.subs.filter(x=>x!==a.id)});showToast('Unsubscribed');}})),noSubs:s.subs.length===0,
otherList:ASTRO.filter(a=>!isSub(a.id)).slice(0,3).map(a=>({...card(a),sub:()=>{setState({subs:s.subs.concat(a.id)});showToast('Subscribed to '+a.name);}})),
notifs:NL,bellList:NL.slice(0,3),
remedies:s.remedies,faqs:faqs.map((f,i)=>({q:f[0],a:f[1],open:s.faq===i,sign:s.faq===i?'−':'+',go:()=>setState({faq:s.faq===i?-1:i})})),contact:()=>showToast('Support channels are not decided yet'),
login1:s.loginStep===1,login2:s.loginStep===2,loginNext:()=>setState({loginStep:2}),
toast:s.toast};

  };

  return <AppContext.Provider value={renderVals()}>{children}</AppContext.Provider>;
}
