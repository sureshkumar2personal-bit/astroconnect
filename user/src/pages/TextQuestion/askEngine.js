import drRani from "../../assets/astrologers/dr-rani.png";
import arjunSharma from "../../assets/astrologers/arjun-sharma.png";
import acharyaMeena from "../../assets/astrologers/acharya-meena.png";
import ishitaSen from "../../assets/astrologers/ishita-sen.png";
import priyaSharma from "../../assets/astrologers/priya-sharma.png";
import devMalhotra from "../../assets/astrologers/dev-malhotra.png";

// Profile pictures are re-used from the app's existing astrologer photos, matched by gender.
const PHOTO = { a1:devMalhotra, a2:drRani, a3:arjunSharma, a4:ishitaSen, a5:priyaSharma, a6:acharyaMeena };
/* Ported from the approved "Ask an Astrologer" prototype. Sample data is local to this screen. */
export function mountAsk(root,initialTab){
const $id=id=>root.querySelector('#'+CSS.escape(id));
const cleanups=[];
const on=(t,fn)=>{ root.addEventListener(t,fn); cleanups.push(()=>root.removeEventListener(t,fn)); };
const onDoc=(t,fn)=>{ document.addEventListener(t,fn); cleanups.push(()=>document.removeEventListener(t,fn)); };

const NOW = new Date();
const DAY = 864e5, HR = 36e5;
const ago = (d,h=0)=> new Date(NOW.getTime() - d*DAY - h*HR);
const ahead = d => new Date(NOW.getTime() + d*DAY);
const at = (dAgo,hh,mm)=>{const x=ago(dAgo);x.setHours(hh,mm||0,0,0);return x;};
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fD = d => d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
const fT = d => d.toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'});
const fDT = d => fD(d)+', '+fT(d);
const inr = n => '₹'+Math.round(n).toLocaleString('en-IN');
const disc = (b,p)=> Math.round(b*(1-(p||0)/100));
const rnd = n => Math.floor(Math.random()*Math.pow(10,n)).toString().padStart(n,'0');
const txnId = ()=> 'TXN'+NOW.toISOString().slice(2,10).replace(/-/g,'')+rnd(6);
/* Question types: General and Personal only. Regular / Special is a campaign type, not a question type. */
const TYPE = {
  general:{name:'General question', d:'One focused question on any part of life.'},
  personal:{name:'Personal question', d:'A deeper reading based on your birth chart.'}
};
const CATS = ['Marriage','Career','Health','Wealth','Family','Education'];
/* The browse chips show four categories; the rest sit behind Others until it is expanded. */
const MAIN_CATS = CATS.slice(0,4), OTHER_CATS = CATS.slice(4);
const LANGS = ['English','Tamil','Tanglish'];

/* ---------- Sample images (inline, prototype only) ---------- */
const svgURI = s => 'data:image/svg+xml,'+encodeURIComponent(s);
const IMG_CHART = svgURI(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 120'><rect width='160' height='120' fill='#F6EEDC'/><g fill='none' stroke='#7E5F1C' stroke-width='1.2'><rect x='20' y='10' width='120' height='100'/><path d='M50 10v100M110 10v100M80 10v25M80 85v25M20 35h120M20 85h120M20 60h30M110 60h30'/></g><text x='80' y='58' font-size='10' text-anchor='middle' fill='#1C2B4A' font-family='Georgia'>Rasi</text><text x='80' y='71' font-size='7' text-anchor='middle' fill='#7E5F1C' font-family='Georgia'>chart scan</text><g font-size='7' fill='#1C2B4A' font-family='Georgia'><text x='26' y='26'>Gu</text><text x='86' y='26'>Sa</text><text x='116' y='50'>Ma</text><text x='56' y='100'>Su Bu</text><text x='26' y='76'>Ra</text></g></svg>`);
const IMG_TAROT = svgURI(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 120'><rect width='160' height='120' fill='#1C2B4A'/><g fill='#F6EEDC' stroke='#C9A55A' stroke-width='1.5'><rect x='22' y='22' width='34' height='60' rx='3'/><rect x='63' y='16' width='34' height='60' rx='3'/><rect x='104' y='22' width='34' height='60' rx='3'/></g><g fill='#A9822F'><circle cx='39' cy='52' r='6'/><path d='M80 34l4 10 10 1-8 7 3 10-9-6-9 6 3-10-8-7 10-1z'/><path d='M121 44a8 8 0 1 0 0 16a6 6 0 1 1 0-16z'/></g><text x='80' y='102' font-size='8' text-anchor='middle' fill='#E7C77F' font-family='Georgia'>Family spread, three cards</text></svg>`);
const IMG_NAVAMSA = svgURI(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 120'><rect width='160' height='120' fill='#FFFDF8'/><g fill='none' stroke='#1D756D' stroke-width='1.2'><rect x='30' y='10' width='100' height='100'/><path d='M30 10l100 100M130 10L30 110M80 10L30 60l50 50 50-50z'/></g><text x='80' y='64' font-size='9' text-anchor='middle' fill='#1C2B4A' font-family='Georgia'>Navamsa</text><g font-size='7' fill='#1D756D' font-family='Georgia'><text x='76' y='30'>Ve</text><text x='44' y='62'>Ju</text><text x='108' y='62'>Sa</text><text x='76' y='96'>Me</text></g></svg>`);
const IMGS=[]; const imgRef = src => { let i=IMGS.indexOf(src); if(i<0){IMGS.push(src); i=IMGS.length-1;} return i; };

/* ---------- Saved horoscopes ---------- */
const ME = {id:'h0',name:'Priya Sundaram',rel:'Myself',group:'self',dob:'1994-03-12',time:'05:45',place:'Coimbatore, Tamil Nadu',gender:'Female'};
let SAVED = [ME,
 {id:'h1',name:'Karthik Sundaram',rel:'Husband',group:'family',dob:'1991-08-27',time:'22:10',place:'Madurai, Tamil Nadu',gender:'Male'},
 {id:'h2',name:'Lakshmi Ramesh',rel:'Mother',group:'family',dob:'1966-01-04',time:'07:30',place:'Erode, Tamil Nadu',gender:'Female'},
 {id:'h3',name:'Vignesh Ramesh',rel:'Brother',group:'family',dob:'2008-05-19',time:'14:05',place:'Erode, Tamil Nadu',gender:'Male'},
 {id:'h4',name:'Divya Menon',rel:'Friend',group:'others',dob:'1995-06-21',time:'',place:'Kochi, Kerala',gender:'Female'}
];
let hSeq=5;
const fTime24 = t => { if(!t) return 'birth time unknown'; const [h,m]=t.split(':').map(Number); return `${(h%12)||12}:${String(m).padStart(2,'0')} ${h<12?'am':'pm'}`; };
const fDob = d => new Date(d+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
const birthLine = h => `${fDob(h.dob)}, ${fTime24(h.time)}, ${h.place}`;
const snap = h => ({name:h.name,rel:h.rel,dob:h.dob,time:h.time,place:h.place,gender:h.gender});

/* ---------- Astrologers & campaigns ---------- */
const ASTROS = [
 {id:'a1',name:'Pandit Raghavan Iyer',ini:'RI',color:'#7A5C2E',spec:'Vedic astrology, marriage matching',rating:4.9,reviews:1240,exp:22,sub:true,subUntil:ahead(18),subPrice:299,prices:{general:199,personal:349},offers:{}},
 {id:'a2',name:'Dr. Meera Krishnan',ini:'MK',color:'#2E5E6B',spec:'Career and numerology',rating:4.8,reviews:986,exp:15,sub:true,subUntil:ahead(4),subPrice:349,prices:{general:249,personal:449},offers:{personal:15}},
 {id:'a3',name:'Acharya Vikram Sharma',ini:'VS',color:'#5B3B5E',spec:'KP astrology, wealth and property',rating:4.7,reviews:712,exp:18,sub:false,subPrice:399,prices:{general:299,personal:499},offers:{}},
 {id:'a4',name:'Lakshmi Narayanan',ini:'LN',color:'#3E6B4A',spec:'Medical astrology, wellbeing',rating:4.6,reviews:431,exp:11,sub:false,subPrice:249,prices:{general:179,personal:299},offers:{general:10}},
 {id:'a5',name:'Sanjana Rao',ini:'SR',color:'#8A4A3C',spec:'Tarot, family and relationships',rating:4.8,reviews:854,exp:9,sub:true,subUntil:ahead(23),subPrice:199,prices:{general:149,personal:279},offers:{}},
 {id:'a6',name:'Guru Arvind Desai',ini:'AD',color:'#3A4E7A',spec:'Education and career guidance',rating:4.5,reviews:388,exp:14,sub:false,subPrice:299,prices:{general:199,personal:329},offers:{}}
];
const A = id => ASTROS.find(a=>a.id===id);
const shortName = a => a.name.startsWith('Dr.') ? a.name.split(' ').slice(0,2).join(' ') : a.name.split(' ').slice(0,2).join(' ');

/* kind: 'regular' | 'special' (campaign type). Each campaign sets its own General and Personal prices and offers. */
const CAMPS = [
 {id:'c1',astro:'a1',kind:'special',cat:'Marriage',name:'Marriage Timing 2027',short:'When is the right window to marry? A dasha-based look at the year ahead.',long:'Pandit Raghavan studies your 7th house, Venus and current dasha periods to identify favourable marriage windows through 2027, and flags periods to avoid for engagement or wedding dates.',from:ago(6),to:ahead(24),total:100,left:40,prices:{general:249,personal:449},offers:{general:20,personal:20},offer:'New-year offer'},
 {id:'c2',astro:'a1',kind:'regular',cat:'Marriage',name:'Kundli Matching Clarity',short:'Already have a match in mind? Get a clear compatibility reading.',long:'Share both birth details and get a guna-milan score explained in plain words, along with manglik considerations and what to discuss with family.',from:ago(10),to:ahead(40),total:60,left:25,prices:{general:299,personal:499},offers:{}},
 {id:'c11',astro:'a1',kind:'regular',cat:'Marriage',name:'Manglik Dosha Guidance',short:'Understand what your Mars placement really means for marriage.',long:'A clear, calm explanation of manglik dosha in your chart, whether it is cancelled by other factors, and practical remedies if needed.',from:ago(7),to:ahead(33),total:50,left:31,prices:{general:199,personal:379},offers:{personal:10},offer:'Personal reading offer'},
 {id:'c15',astro:'a1',kind:'regular',cat:'Marriage',name:'Second Marriage Prospects',short:'A sensitive, private reading on remarriage and timing.',long:'Pandit Raghavan reviews the 7th and 2nd houses, current dasha and transits to guide you on remarriage prospects and favourable periods.',from:ago(9),to:ahead(26),total:30,left:19,prices:{general:299,personal:499},offers:{general:10,personal:10},offer:'Festive offer'},
 {id:'c12',astro:'a1',kind:'special',cat:'Family',name:'Child Birth Timing',short:'Planning a family? A focused look at the 5th house and timing.',long:'A careful reading of the 5th house, Jupiter and dasha periods for couples planning a child, with suitable periods and simple remedies.',from:ago(4),to:ahead(38),total:40,left:22,prices:{general:349,personal:599},offers:{}},
 {id:'c13',astro:'a1',kind:'regular',cat:'Wealth',name:'Griha Pravesam Muhurtham',short:'Find auspicious dates for moving into your new home.',long:'Share your family’s birth details and preferred months, and get a short list of suitable griha pravesam dates and times.',from:ago(3),to:ahead(21),total:60,left:44,prices:{general:179,personal:329},offers:{general:15},offer:'Home-move offer'},
 {id:'c14',astro:'a1',kind:'regular',cat:'Career',name:'Foreign Settlement Prospects',short:'Is settling abroad in your chart? When could it happen?',long:'Looks at the 9th and 12th houses and Rahu’s influence to assess the likelihood and timing of moving abroad for work or study.',from:ago(11),to:ahead(29),total:45,left:27,prices:{general:249,personal:449},offers:{}},
 {id:'c16',astro:'a5',kind:'regular',cat:'Marriage',name:'Love or Arranged?',short:'A tarot reading on where your relationship path is heading.',long:'Sanjana draws a relationship spread to explore whether a love or arranged path suits you now, and what to keep in mind either way.',from:ago(5),to:ahead(19),total:50,left:37,prices:{general:179,personal:329},offers:{}},
 {id:'c3',astro:'a2',kind:'special',cat:'Career',name:'Career Shift Window',short:'Thinking of switching jobs or fields? Find the timing that works for you.',long:'Dr. Meera combines your 10th house and personal-year number to point out strong months for a job change, a promotion push or starting something of your own.',from:ago(3),to:ahead(15),total:50,left:18,prices:{general:299,personal:449},offers:{general:10,personal:10},offer:'Launch offer'},
 {id:'c4',astro:'a2',kind:'regular',cat:'Career',name:'Job Offer or Stay?',short:'Weighing an offer against your current role? Ask for a focused reading.',long:'Describe both options and get a reading on growth, stability and timing for each, so you can decide with more confidence.',from:ago(8),to:ahead(30),total:80,left:60,prices:{general:199,personal:399},offers:{}},
 {id:'c5',astro:'a4',kind:'regular',cat:'Health',name:'Wellness Through the Year',short:'A planetary view of energy, rest and wellbeing across the coming months.',long:'Lakshmi looks at your 6th house and transits to suggest periods to slow down, routines to build and simple remedies. This complements, never replaces, medical advice.',from:ago(5),to:ahead(20),total:40,left:30,prices:{general:199,personal:349},offers:{general:15,personal:15},offer:'Wellness week'},
 {id:'c6',astro:'a3',kind:'special',cat:'Wealth',name:'Wealth Yoga Reading',short:'Discover the wealth combinations in your chart and how to make the most of them.',long:'Acharya Vikram identifies dhana yogas, the 2nd and 11th house strength, and the dasha periods most supportive for savings and growth.',from:ago(2),to:ahead(12),total:30,left:12,prices:{general:349,personal:599},offers:{general:25,personal:20},offer:'Limited slots'},
 {id:'c7',astro:'a5',kind:'regular',cat:'Family',name:'Family Harmony Check-in',short:'Tension at home? A gentle tarot reading on what each person needs.',long:'Sanjana draws a family spread to explore the dynamics at home and suggests small, practical steps to ease communication.',from:ago(12),to:ahead(35),total:70,left:50,prices:{general:179,personal:329},offers:{}},
 {id:'c8',astro:'a6',kind:'regular',cat:'Education',name:'Board Exams and Higher Studies',short:'For students and parents planning exams, entrance tests or studies abroad.',long:'Guru Arvind reads the 4th, 5th and 9th houses to guide subject choices, exam-period focus and the best timing for applications.',from:ago(4),to:ahead(45),total:120,left:80,prices:{general:149,personal:279},offers:{general:20,personal:20},offer:'Exam season'},
 {id:'c9',astro:'a3',kind:'regular',cat:'Wealth',name:'Property and Investment Timing',short:'Buying a home or land? Check the timing before you commit.',long:'A focused reading on the 4th house and current transits for property purchases, registrations and large investments.',from:ago(9),to:ahead(28),total:40,left:20,prices:{general:399,personal:649},offers:{}},
 {id:'c10',astro:'a5',kind:'special',cat:'Family',name:'Sibling and Parent Bonds',short:'Understand and repair relationships with siblings or parents.',long:'A tarot and intuitive reading focused on one relationship, what is blocking it and what could help bring you closer again.',from:ago(15),to:ahead(10),total:30,left:6,prices:{general:149,personal:279},offers:{general:10,personal:10},offer:'Last few slots'}
];
const C = id => CAMPS.find(c=>c.id===id);
const cPct = (c,t) => (c.offers&&c.offers[t])||0;
const cFrom = c => Math.min(...Object.keys(TYPE).filter(t=>c.prices[t]).map(t=>disc(c.prices[t],cPct(c,t))));
const cFromOrig = c => { const t=Object.keys(TYPE).filter(t=>c.prices[t]).sort((x,y)=>disc(c.prices[x],cPct(c,x))-disc(c.prices[y],cPct(c,y)))[0]; return {orig:c.prices[t],pct:cPct(c,t)}; };
const maxOff = c => Math.max(0,...Object.values(c.offers||{}));
const offBadge = c => { const vals=Object.keys(TYPE).filter(t=>c.prices[t]).map(t=>cPct(c,t)); const mx=Math.max(...vals); if(!mx) return ''; return `<span class="off">${vals.every(v=>v===mx)?'':'Up to '}${mx}% off</span>`; };
const spc = c => c.kind==='special'?'<span class="spc">✦ Special Campaign</span>':'';

let QUESTIONS = [
 {id:'Q-24140',astro:'a5',camp:null,cat:'Ask Anything',type:'personal',submitted:at(1,21,40),amount:279,status:'waiting',lang:'Tamil',who:snap(ME),
  text:'I have been offered a chance to move to Bengaluru with my husband’s family business, but my parents here in Coimbatore are getting older. Will this move bring peace to our family, or should we wait another year?',
  files:[{linked:true,name:'Horoscope of Priya Sundaram'}]},
 {id:'Q-24118',astro:'a1',camp:'c1',cat:'Marriage',type:'personal',submitted:at(3,10,15),amount:359,status:'waiting',lang:'English',who:snap(ME),
  text:'My family is looking for alliances for me this year. Based on my chart, which months in 2027 are favourable for marriage, and is there any dosha I should be aware of before finalising?',
  files:[{linked:true,name:'Horoscope of Priya Sundaram'},{name:'Horoscope_scan.jpg',size:'1.2 MB',src:IMG_CHART}]},
 {id:'Q-24097',astro:'a2',camp:null,cat:'Ask Anything',type:'general',submitted:at(12,18,5),amount:249,status:'answered',answeredAt:at(2,11,30),lang:'English',who:snap(ME),
  text:'I am a software tester with 6 years’ experience. Is 2027 a good time to move into product management?',
  answer:'Your personal year number for 2027 is 1, which is a strong year for new beginnings. Saturn moving out of your 10th house in April 2027 removes much of the delay you have felt in your career. I suggest preparing through the first quarter and applying for product roles from May onwards. June and September look especially supportive for interviews and offers.',
  refs:[{name:'Navamsa_career_notes.png',size:'320 KB',src:IMG_NAVAMSA}]},
 {id:'Q-24130',astro:'a4',camp:'c5',cat:'Health',type:'general',submitted:at(32,9,20),amount:169,status:'refund_processing',lang:'Tanglish',who:snap(ME),
  text:'I feel low on energy every winter. Which months next year should I be extra careful with my routine?'},
 {id:'Q-24005',astro:'a1',camp:null,cat:'Ask Anything',type:'general',submitted:at(20,16,45),amount:199,status:'answered',answeredAt:at(5,9,10),lang:'Tamil',who:snap(SAVED[1]),
  text:'Is the coming Panguni month good for a griha pravesam for our new flat?',
  answer:'Yes, Panguni works well for your family. The most suitable dates fall in the bright fortnight; avoid the days around Ashtami. Please confirm the exact muhurtham time with your family priest using the dates I have marked in the attached note.',
  refs:[{name:'Muhurtham_dates.pdf',size:'240 KB'}]},
 {id:'Q-23950',astro:'a5',camp:'c7',cat:'Family',type:'general',submitted:at(40,20,0),amount:179,status:'completed',answeredAt:at(31,12,0),lang:'English',who:snap(ME),
  text:'My brother and I have stopped talking after a property disagreement. Will things improve between us?',
  answer:'The cards show the Six of Cups and Temperance, which point to old affection that is still there beneath the hurt. The Five of Pentacles suggests the disagreement is more about feeling unsupported than about money. A calm, private conversation after mid-January is likely to go much better than a family meeting.',
  refs:[{name:'Family_spread.jpg',size:'860 KB',src:IMG_TAROT}],
  review:{stars:5,text:'Very thoughtful and practical. We spoke last week and it went well.',date:at(28,19,30)}},
 {id:'Q-23881',astro:'a3',camp:null,cat:'Ask Anything',type:'personal',submitted:at(46,11,0),amount:499,status:'refunded',refund:{id:'RF-60912',date:at(14,15,20)},lang:'English',who:snap(ME),
  text:'Should I invest in a plot near Pollachi this year or wait until my Rahu dasha ends?',
  files:[{linked:true,name:'Horoscope of Priya Sundaram'}]},
 {id:'Q-23720',astro:'a6',camp:'c8',cat:'Education',type:'personal',submitted:at(60,8,30),amount:223,status:'disputed',answeredAt:at(52,17,0),dispute:{date:at(49,10,0)},lang:'English',who:snap(SAVED[3]),
  text:'My brother is choosing between engineering and medicine after Class 12. Which field suits his chart better?',
  answer:'Both fields show potential. He should pick the one he is more interested in.',
  files:[{linked:true,name:'Horoscope of Vignesh Ramesh'},{name:'Vignesh_marksheet.pdf',size:'410 KB'}]},
 {id:'Q-23610',astro:'a2',camp:'c3',cat:'Career',type:'personal',submitted:at(70,13,0),amount:404,status:'completed',answeredAt:at(55,10,0),lang:'Tanglish',who:snap(ME),
  text:'I want to start my own consulting firm. Which year gives the best chance of success, and what should I avoid?',
  answer:'Your chart favours partnership-based ventures. Late 2027 is the strongest window to register the firm. Avoid signing long-term leases during Mercury retrograde periods, and keep finances separate from friends for the first two years. I have attached a detailed month-by-month plan.',
  files:[{linked:true,name:'Horoscope of Priya Sundaram'}],
  refs:[{name:'Business_timing_plan.pdf',size:'1.8 MB'}],
  review:{stars:4,text:'Detailed and useful. Would have liked a bit more on remedies.',date:at(50,9,0)}},
 {id:'Q-24090',astro:'a2',camp:null,cat:'Career',type:'general',submitted:at(16,6,10),amount:249,status:'answered',answeredAt:at(9,11,0),lang:'English',who:snap(ME),
  text:'Is it a good time to ask for a salary revision this quarter?',
  answer:'Thank you for your question. Based on your chart, the coming months look supportive, and I suggest you proceed after the first fortnight while keeping your plans flexible. Please review again if circumstances change.'},
 {id:'Q-24060',astro:'a5',camp:null,cat:'Family',type:'general',submitted:at(8,15,30),amount:149,status:'completed',answeredAt:at(5,11,0),lang:'Tamil',who:snap(ME),
  text:'Will my cousin’s wedding date clash with any bad period for our family?',
  answer:'Thank you for your question. Based on your chart, the coming months look supportive, and I suggest you proceed after the first fortnight while keeping your plans flexible. Please review again if circumstances change.',
  review:{stars:5,text:'Clear and helpful answer.',date:at(4,20,0)}},
 {id:'Q-24041',astro:'a1',camp:null,cat:'Marriage',type:'personal',submitted:at(9,11,0),amount:349,status:'completed',answeredAt:at(6,11,0),lang:'Tanglish',who:snap(ME),
  text:'Are there any doshas I should check before my engagement?',
  answer:'Thank you for your question. Based on your chart, the coming months look supportive, and I suggest you proceed after the first fortnight while keeping your plans flexible. Please review again if circumstances change.',files:[{linked:true,name:'Horoscope of Priya Sundaram'}],
  review:{stars:5,text:'Clear and helpful answer.',date:at(5,20,0)}},
 {id:'Q-23990',astro:'a3',camp:null,cat:'Wealth',type:'general',submitted:at(22,17,20),amount:299,status:'completed',answeredAt:at(19,11,0),lang:'English',who:snap(ME),
  text:'Is it wise to book a flat now or wait for the next financial year?',
  answer:'Thank you for your question. Based on your chart, the coming months look supportive, and I suggest you proceed after the first fortnight while keeping your plans flexible. Please review again if circumstances change.',
  review:{stars:5,text:'Clear and helpful answer.',date:at(18,20,0)}},
 {id:'Q-23900',astro:'a4',camp:null,cat:'Health',type:'general',submitted:at(35,9,45),amount:179,status:'completed',answeredAt:at(32,11,0),lang:'English',who:snap(ME),
  text:'Which months need extra care for my father’s health?',
  answer:'Thank you for your question. Based on your chart, the coming months look supportive, and I suggest you proceed after the first fortnight while keeping your plans flexible. Please review again if circumstances change.',
  review:{stars:5,text:'Clear and helpful answer.',date:at(31,20,0)}},
 {id:'Q-23860',astro:'a6',camp:null,cat:'Education',type:'general',submitted:at(38,12,10),amount:199,status:'completed',answeredAt:at(35,11,0),lang:'Tamil',who:snap(ME),
  text:'Will my daughter get her preferred college seat this year?',
  answer:'Thank you for your question. Based on your chart, the coming months look supportive, and I suggest you proceed after the first fortnight while keeping your plans flexible. Please review again if circumstances change.',
  review:{stars:5,text:'Clear and helpful answer.',date:at(34,20,0)}},
 {id:'Q-23820',astro:'a2',camp:null,cat:'Career',type:'personal',submitted:at(42,10,0),amount:449,status:'completed',answeredAt:at(39,11,0),lang:'English',who:snap(ME),
  text:'Should I accept a transfer to Chennai or stay in my current city?',
  answer:'Thank you for your question. Based on your chart, the coming months look supportive, and I suggest you proceed after the first fortnight while keeping your plans flexible. Please review again if circumstances change.',files:[{linked:true,name:'Horoscope of Priya Sundaram'}],
  review:{stars:5,text:'Clear and helpful answer.',date:at(38,20,0)}},
 {id:'Q-23780',astro:'a5',camp:null,cat:'Family',type:'personal',submitted:at(47,19,30),amount:279,status:'completed',answeredAt:at(44,11,0),lang:'English',who:snap(ME),
  text:'Will a family dispute over our ancestral house be settled soon?',
  answer:'Thank you for your question. Based on your chart, the coming months look supportive, and I suggest you proceed after the first fortnight while keeping your plans flexible. Please review again if circumstances change.',files:[{linked:true,name:'Horoscope of Priya Sundaram'}],
  review:{stars:5,text:'Clear and helpful answer.',date:at(43,20,0)}},
 {id:'Q-23690',astro:'a1',camp:null,cat:'Marriage',type:'general',submitted:at(63,14,0),amount:199,status:'completed',answeredAt:at(60,11,0),lang:'Tamil',who:snap(ME),
  text:'Is the match proposed for my sister suitable in terms of horoscope?',
  answer:'Thank you for your question. Based on your chart, the coming months look supportive, and I suggest you proceed after the first fortnight while keeping your plans flexible. Please review again if circumstances change.',
  review:{stars:5,text:'Clear and helpful answer.',date:at(59,20,0)}},
 {id:'Q-23650',astro:'a3',camp:null,cat:'Wealth',type:'general',submitted:at(68,8,15),amount:299,status:'completed',answeredAt:at(65,11,0),lang:'Tanglish',who:snap(ME),
  text:'Which period is favourable to invest in gold?',
  answer:'Thank you for your question. Based on your chart, the coming months look supportive, and I suggest you proceed after the first fortnight while keeping your plans flexible. Please review again if circumstances change.',
  review:{stars:5,text:'Clear and helpful answer.',date:at(64,20,0)}},
 {id:'Q-23560',astro:'a4',camp:null,cat:'Health',type:'personal',submitted:at(78,16,40),amount:299,status:'completed',answeredAt:at(75,11,0),lang:'English',who:snap(ME),
  text:'Do my planets suggest any long-term health concern to plan for?',
  answer:'Thank you for your question. Based on your chart, the coming months look supportive, and I suggest you proceed after the first fortnight while keeping your plans flexible. Please review again if circumstances change.',files:[{linked:true,name:'Horoscope of Priya Sundaram'}],
  review:{stars:5,text:'Clear and helpful answer.',date:at(74,20,0)}},
 {id:'Q-23510',astro:'a6',camp:null,cat:'Education',type:'general',submitted:at(92,11,5),amount:199,status:'completed',answeredAt:at(89,11,0),lang:'English',who:snap(ME),
  text:'Is it better to pursue a master’s abroad or in India?',
  answer:'Thank you for your question. Based on your chart, the coming months look supportive, and I suggest you proceed after the first fortnight while keeping your plans flexible. Please review again if circumstances change.',
  review:{stars:5,text:'Clear and helpful answer.',date:at(88,20,0)}}
];

let PURCHASES = [
 {id:'P-81260',astro:'a2',camp:null,type:'general',date:ago(0,4),count:3,used:0,txn:'TXN261126482913',unit:249,paid:747},
 {id:'P-81233',astro:'a5',camp:'c7',type:'general',date:ago(3,2),count:4,used:1,txn:'TXN261123391057',unit:179,paid:716},
 {id:'P-81204',astro:'a1',camp:'c1',type:'personal',date:ago(5,14),count:2,used:1,txn:'TXN261120773402',unit:359,paid:718},
 {id:'P-81177',astro:'a5',camp:null,type:'personal',date:ago(2,1),count:1,used:1,txn:'TXN261124118830',unit:279,paid:279},
 {id:'P-81102',astro:'a2',camp:'c3',type:'personal',date:ago(12),count:2,used:1,txn:'TXN261114550291',unit:404,paid:808},
 {id:'P-81050',astro:'a1',camp:null,type:'general',date:ago(25),count:1,used:1,txn:'TXN261101902277',unit:199,paid:199}
];
PURCHASES.forEach(p=>p.expiry=new Date(p.date.getTime()+7*DAY));
const P = id => PURCHASES.find(p=>p.id===id);
let qSeq = 24141, pSeq = 81261;

/* ---------- State ---------- */
const S = {
  tab:initialTab||'questions',
  mq:{q:'',status:'',cat:'',date:''}, openQ:new Set(),
  ps:{q:'',status:'',type:''}, openP:new Set(),
  selAstro:null, cat:'Marriage', openCamp:new Set(), browseAll:{},
  aa:{}, cs:{}, apc:{},
  pay:null, form:null, confirm:false, lb:null, rev:null, catMore:false
};

/* ---------- Helpers ---------- */
const ic = {
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  chev:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 9 6 6 6-6"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>',
  file:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
  img:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-9 8"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m5 12 5 5 9-10"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  refund:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
  plus:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>',
  upload:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 16V4M7 9l5-5 5 5M4 20h16"/></svg>',
  warn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 2 21h20z"/><path d="M12 10v4M12 17h.01"/></svg>'
};
const av = (a,s='sm') => `<span class="av av-${s}" style="--av:${a.color}" aria-hidden="true">${PHOTO[a.id]?`<img src="${PHOTO[a.id]}" alt="">`:a.ini}</span>`;
const isImg = n => /\.(jpe?g|png|gif|webp|heic)$/i.test(n);
function left(ms){ if(ms<=0) return 'Expired'; const d=Math.floor(ms/DAY), h=Math.floor((ms%DAY)/HR); if(d>0) return `${d} day${d>1?'s':''} ${h} hr left`; const m=Math.max(1,Math.floor((ms%HR)/6e4)); return `${h} hr ${m} min left`; }

const QS = {
  waiting:{l:'Waiting for answer',c:'p-amber'},
  answered:{l:'Answered',c:'p-blue'},
  completed:{l:'Completed',c:'p-teal'},
  refunded:{l:'Cancelled, refunded',c:'p-grey'},
  refund_processing:{l:'Cancelled, refund processing',c:'p-red'},
  cancelled:{l:'Cancelled',c:'p-grey'},
  disputed:{l:'Disputed',c:'p-red'}
};
function pState(p){
  const avail = p.count-p.used;
  if(avail===0) return 'used';
  if(NOW>=p.expiry) return 'expired';
  if(p.expiry-NOW < 2*DAY) return 'expiring';
  return 'active';
}
/* An answer can be rated or disputed for 7 days. After that, with no action, it completes by itself. */
const WINDOW = 7;
const winLeft = x => Math.ceil(WINDOW - (NOW - x.answeredAt)/DAY);
const settle = x => { if(x.status==='answered' && x.answeredAt && winLeft(x)<=0){ x.status='completed'; x.auto=true; x.autoAt=new Date(x.answeredAt.getTime()+WINDOW*DAY); } };
const doneTag = x => x.status!=='completed' ? '' : x.review ? '' : x.auto ? '<span class="done-tag auto">Auto-completed, 7 days passed</span>' : '';
QUESTIONS.forEach(settle);
const PS = {active:{l:'Active',c:'p-teal'},expiring:{l:'Expiring soon',c:'p-amber'},expired:{l:'Expired',c:'p-grey'},used:{l:'Used',c:'p-blue'}};
const availNow = p => pState(p)==='expired'?0:p.count-p.used;
const pill = (s,map)=>`<span class="pill ${map[s].c}">${map[s].l}</span>`;

function toast(msg){
  const h=$id('toast-host');
  h.innerHTML=`<div class="toast">${msg}</div>`;
  clearTimeout(toast.t); toast.t=setTimeout(()=>h.innerHTML='',3200);
}

/* ---------- Tabs ---------- */
function renderTabs(){
  const avail = PURCHASES.reduce((s,p)=>s+availNow(p),0);
  const tabs=[['questions','My Questions'],['new','Ask New'],['slots','Purchased Slots']];
  $id('tabs').innerHTML = tabs.map(([k,l])=>
    `<button class="tab" role="tab" aria-selected="${S.tab===k}" data-action="tab" data-k="${k}">${l}${k==='slots'&&avail?`<span class="count" aria-label="${avail} slots available">${avail}</span>`:''}</button>`).join('');
}
function renderPanel(){
  renderTabs();
  const el=$id('panel');
  if(S.tab==='questions'){ el.innerHTML=renderMQ(); renderMQList(); }
  else if(S.tab==='slots'){ el.innerHTML=renderPS(); renderPSList(); }
  else { el.innerHTML=renderAN(); }
}

/* ---------- My Questions (statuses unchanged: Answered -> Completed only when the user rates) ---------- */
function renderMQ(){
  const f=S.mq;
  const opt=(v,l,cur)=>`<option value="${v}"${v===cur?' selected':''}>${l}</option>`;
  return `<div class="filters">
    <label class="search">${ic.search}<span class="sr">Search</span><input id="mq-q" type="search" placeholder="Search by astrologer or question ID" value="${esc(f.q)}"></label>
    <select class="sel" id="mq-status" aria-label="Filter by status">${opt('','All statuses',f.status)}${Object.entries(QS).filter(([k])=>k!=='cancelled').map(([k,v])=>opt(k,v.l,f.status)).join('')}</select>
    <select class="sel" id="mq-cat" aria-label="Filter by category">${opt('','All categories',f.cat)}${['Ask Anything',...CATS].map(c=>opt(c,c,f.cat)).join('')}</select>
    <select class="sel" id="mq-date" aria-label="Filter by date">${opt('','Any date',f.date)}${opt('7','Last 7 days',f.date)}${opt('30','Last 30 days',f.date)}${opt('90','Last 90 days',f.date)}</select>
  </div>
  <div id="mq-list"></div>`;
}
function renderMQList(){
  const f=S.mq, q=f.q.trim().toLowerCase();
  const rows=QUESTIONS.filter(x=>{
    const a=A(x.astro);
    if(q && !(a.name.toLowerCase().includes(q)||x.id.toLowerCase().includes(q))) return false;
    if(f.status && x.status!==f.status) return false;
    if(f.cat && x.cat!==f.cat) return false;
    if(f.date && (NOW-x.submitted)>(+f.date)*DAY) return false;
    return true;
  });
  const filtered = f.q||f.status||f.cat||f.date;
  const el=$id('mq-list');
  if(!rows.length){
    el.innerHTML=`<div class="list"><div class="empty"><h3>No questions match these filters</h3><p>Try a different search or clear the filters.</p><p style="margin-top:12px"><button class="btn btn-ghost btn-sm" data-action="clear-mq">Clear filters</button></p></div></div>`;
    return;
  }
  rows.sort((a,b)=>b.submitted-a.submitted);
  const PAGE=5, pages=Math.max(1,Math.ceil(rows.length/PAGE)), cur=Math.min(Math.max(1,f.page||1),pages); f.page=cur;
  const shown=rows.slice((cur-1)*PAGE,cur*PAGE);
  const mLabel=d=>d.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
  let body='', last='';
  shown.forEach(x=>{ const m=mLabel(x.submitted); if(m!==last){ const n=rows.filter(r=>mLabel(r.submitted)===m).length; body+=`<div class="month-h"><h3>${m}</h3><span>${n} question${n>1?'s':''}</span></div>`; last=m; } body+=qRow(x); });
  const pg=(p,l,dis,aria)=>`<button class="pg${p===cur&&!dis?' on':''}" data-action="mq-page" data-p="${p}"${dis?' disabled':''}${p===cur&&!dis?' aria-current="page"':''}${aria?` aria-label="${aria}"`:''}>${l}</button>`;
  let nums=''; for(let p=1;p<=pages;p++) nums+=pg(p,p,false,'Page '+p);
  const pager=pages>1?`<nav class="pager" aria-label="Questions pages">${pg(cur-1,'Previous',cur===1)}${nums}${pg(cur+1,'Next',cur===pages)}</nav>`:'';
  el.innerHTML=`<div class="result-line"><span>${rows.length} question${rows.length>1?'s':''}${pages>1?` · page ${cur} of ${pages}`:''}</span>${filtered?'<button class="btn-text" data-action="clear-mq">Clear filters</button>':''}</div>
  <div class="list">
    <div class="lh q-cols"><span>Astrologer</span><span>Question ID</span><span>Category</span><span>Submitted</span><span>Paid</span><span>Status</span><span></span></div>
    ${body}
  </div>${pager}`;
}
function qRow(x){
  const a=A(x.astro), c=x.camp?C(x.camp):null, open=S.openQ.has(x.id);
  return `<article class="row q-row${open?' open':''}" data-id="${x.id}">
    <button class="row-main q-cols" data-action="toggle-q" data-id="${x.id}" aria-expanded="${open}">
      <span class="c-astro ga">${av(a)}<span><b>${esc(a.name)}</b><small>${TYPE[x.type].name}${c?', '+esc(c.name):''}</small></span></span>
      <span class="cell gid"><span class="lbl">Question ID</span><span class="mono">${x.id}</span></span>
      <span class="cell gcat"><span class="lbl">Category</span>${x.cat}</span>
      <span class="cell gdt"><span class="lbl">Submitted</span>${fD(x.submitted)}<small>${fT(x.submitted)}</small></span>
      <span class="cell gamt"><span class="lbl">Paid</span><span class="mono">${inr(x.amount)}</span></span>
      <span class="gs">${pill(x.status,QS)}${doneTag(x)}${x.status==='answered'?`<span class="done-tag left">${Math.max(1,winLeft(x))} day${winLeft(x)>1?'s':''} left to act</span>`:''}</span>
      <span class="chev gch">${ic.chev}</span>
    </button>
    <div class="row-detail"><div>${qDetail(x)}</div></div>
  </article>`;
}
function timeline(x){
  const dl=new Date(x.submitted.getTime()+30*DAY), ev=[];
  ev.push({t:'Question submitted',d:x.submitted,s:''});
  if(x.status==='waiting'){
    const dleft=Math.max(0,Math.ceil((dl-NOW)/DAY));
    ev.push({t:'Answer expected by',d:dl,s:'next',n:`${dleft} days left. If there’s no answer by then, the question is cancelled and you’re refunded automatically.`});
  }
  if(x.answeredAt){
    ev.push({t:'Answer received',d:x.answeredAt,s:''});
    ev.push({t:'Answer deadline',d:dl,s:'muted',n:'Answered within the 30-day commitment.'});
  }
  if(x.auto) ev.push({t:'7-day review window closed',d:x.autoAt,s:'muted',n:'No rating or dispute, so the question was completed automatically.'});
  if(x.review) ev.push({t:'You rated this answer',d:x.review.date,s:''});
  if(x.dispute) ev.push({t:'Dispute raised',d:x.dispute.date,s:'alert',n:'AstroConnect support is reviewing this. Updates will appear here.'});
  if(x.status==='refunded'||x.status==='refund_processing'){
    ev.push({t:'30-day deadline missed',d:dl,s:'alert',n:'The astrologer didn’t answer in time, so the question was cancelled automatically.'});
    ev.push({t:`Refund of ${inr(x.amount)} started`,d:new Date(dl.getTime()+HR),s:''});
    if(x.refund) ev.push({t:'Refund credited to your original payment method',d:x.refund.date,s:'',n:`Refund ID ${x.refund.id}`});
    else ev.push({t:'Refund in progress',d:null,s:'next',n:'Usually credited within 5–7 working days to your original payment method.'});
  }
  ev.sort((a,b)=>(a.d?a.d.getTime():Infinity)-(b.d?b.d.getTime():Infinity));
  return `<ul class="tl">${ev.map(e=>`<li class="${e.s}"><b>${e.t}</b>${e.d?`<span class="when">${fDT(e.d)}</span>`:''}${e.n?`<span class="note">${e.n}</span>`:''}</li>`).join('')}</ul>`;
}
function attView(f){
  if(f.src) return `<button class="thumb" data-action="lightbox" data-img="${imgRef(f.src)}" data-name="${esc(f.name)}" aria-label="View ${esc(f.name)}"><img src="${f.src}" alt=""><span>${esc(f.name)}</span></button>`;
  if(f.linked) return `<span class="file">${ic.chart}<span>${esc(f.name)}</span><small>Linked horoscope</small></span>`;
  if(f.saved) return `<span class="file">${ic.chart}<span>${esc(f.name)}</span><small>Saved horoscope</small></span>`;
  return `<span class="file">${isImg(f.name)?ic.img:ic.file}<span>${esc(f.name)}</span>${f.size?`<small>${f.size}</small>`:''}</span>`;
}
function attGroup(title,list){
  const imgs=list.filter(f=>f.src), rest=list.filter(f=>!f.src);
  return `<div class="att-group"><h5>${title}</h5>${imgs.length?`<div class="thumbs">${imgs.map(attView).join('')}</div>`:''}${rest.length?`<div class="files"${imgs.length?' style="margin-top:8px"':''}>${rest.map(attView).join('')}</div>`:''}</div>`;
}
function actionBanner(x){
  if(x.status==='answered'){ const d=Math.max(1,winLeft(x)); return `<div class="act-banner"><div><b>Your answer has arrived</b><span>You have ${d} day${d>1?'s':''} left to rate it or raise a dispute. With no action, the question completes automatically after 7 days.</span></div><button class="btn btn-primary" data-action="review-open" data-id="${x.id}">Rate or dispute</button></div>`; }
  if(x.status==='completed' && x.review) return `<div class="act-banner ok"><div><b>Completed after your rating</b><span>You rated this answer ${x.review.stars} out of 5 on ${fD(x.review.date)}.</span></div></div>`;
  if(x.status==='completed' && x.auto) return `<div class="act-banner muted"><div><b>Completed automatically</b><span>You did not rate or dispute this answer within 7 days (closed ${fD(x.autoAt)}), so it was marked completed. Rating and disputes are now closed.</span></div></div>`;
  return '';
}
function qDetail(x){
  const mine=(x.type==='personal'?(x.files||[]):[]), theirs=x.refs||[];
  const meta = (x.who||x.lang)?`<div class="qmeta">${x.who?`<span>Question for <b>${esc(x.who.name)}</b> (${esc(x.who.rel)}), ${esc(birthLine(x.who))}</span>`:''}${x.lang?`<span>Answer language: <b>${x.lang}</b></span>`:''}</div>`:'';
  let h=`<div class="detail">${actionBanner(x)}
    <section class="sec"><h4>Question timeline</h4>${timeline(x)}</section>
    <section class="sec"><h4>Your question</h4><p>${esc(x.text)}</p>${meta}</section>`;
  if(x.answer) h+=`<section class="sec${mine.length||theirs.length||x.review?'':' full'}"><h4>Astrologer’s answer</h4><p class="answer">${esc(x.answer)}</p></section>`;
  if(mine.length||theirs.length) h+=`<section class="sec"><h4>Attachments and references</h4>${theirs.length?attGroup('From the astrologer',theirs):''}${mine.length?attGroup('From you',mine):''}</section>`;
  if(x.review) h+=`<section class="sec"><h4>Your review</h4><div class="stars" aria-label="${x.review.stars} out of 5 stars">${'★'.repeat(x.review.stars)}${'☆'.repeat(5-x.review.stars)}</div><p style="margin-top:4px">${esc(x.review.text)}</p></section>`;
  return h+'</div>';
}

/* ---------- Purchased Slots ---------- */
function renderPS(){
  const f=S.ps, opt=(v,l,cur)=>`<option value="${v}"${v===cur?' selected':''}>${l}</option>`;
  return `<div class="filters f3">
    <label class="search">${ic.search}<span class="sr">Search</span><input id="ps-q" type="search" placeholder="Search by astrologer or purchase ID" value="${esc(f.q)}"></label>
    <select class="sel" id="ps-status" aria-label="Filter by status">${opt('','All statuses',f.status)}${Object.entries(PS).map(([k,v])=>opt(k,v.l,f.status)).join('')}</select>
    <select class="sel" id="ps-type" aria-label="Filter by question type">${opt('','All question types',f.type)}${Object.entries(TYPE).map(([k,v])=>opt(k,v.name,f.type)).join('')}</select>
  </div>
  <div id="ps-list"></div>`;
}
function renderPSList(){
  const f=S.ps, q=f.q.trim().toLowerCase();
  const rows=PURCHASES.filter(p=>{
    const a=A(p.astro);
    if(q && !(a.name.toLowerCase().includes(q)||p.id.toLowerCase().includes(q))) return false;
    if(f.status && pState(p)!==f.status) return false;
    if(f.type && p.type!==f.type) return false;
    return true;
  });
  const el=$id('ps-list');
  if(!rows.length){
    el.innerHTML=`<div class="list"><div class="empty"><h3>No purchases match these filters</h3><p>Clear the filters, or buy slots from Ask New.</p><p style="margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" data-action="clear-ps">Clear filters</button><button class="btn btn-primary btn-sm" data-action="tab" data-k="new">Go to Ask New</button></p></div></div>`;
    return;
  }
  el.innerHTML=`<div class="result-line"><span>${rows.length} purchase${rows.length>1?'s':''}</span>${(f.q||f.status||f.type)?'<button class="btn-text" data-action="clear-ps">Clear filters</button>':''}</div>
  <div class="list">
    <div class="lh p-cols"><span>Astrologer</span><span>Purchase ID</span><span>Purchased</span><span>Type</span><span>Available</span><span>Expires</span><span>Status</span><span></span></div>
    ${rows.map(pRow).join('')}
  </div>`;
}
function pRow(p){
  const a=A(p.astro), c=p.camp?C(p.camp):null, st=pState(p), open=S.openP.has(p.id);
  const av_=availNow(p);
  return `<article class="row p-row${open?' open':''}" data-id="${p.id}">
    <button class="row-main p-cols" data-action="toggle-p" data-id="${p.id}" aria-expanded="${open}">
      <span class="c-astro ga">${av(a)}<span><b>${esc(a.name)}</b><small>${c?esc(c.name):'Ask Anything'}</small></span></span>
      <span class="cell gid"><span class="lbl">Purchase ID</span><span class="mono">${p.id}</span></span>
      <span class="cell gdt"><span class="lbl">Purchased</span>${fD(p.date)}<small>${fT(p.date)}</small></span>
      <span class="cell gty"><span class="lbl">Type</span>${TYPE[p.type].name.replace(' question','')}</span>
      <span class="cell gsl"><span class="lbl">Available</span><span class="mono"><b>${av_}</b> of ${p.count}</span></span>
      <span class="cell gex"><span class="lbl">Expires</span>${st==='used'?'<small style="display:inline">Not applicable</small>':fD(p.expiry)}${(st==='active'||st==='expiring')?`<small style="color:${st==='expiring'?'var(--amber)':'var(--muted)'}">${left(p.expiry-NOW)}</small>`:''}</span>
      <span class="gs">${pill(st,PS)}</span>
      <span class="chev gch">${ic.chev}</span>
    </button>
    <div class="row-detail"><div>${pDetail(p)}</div></div>
  </article>`;
}
function pDetail(p){
  const a=A(p.astro), c=p.camp?C(p.camp):null, st=pState(p), exp=st==='expired'?p.count-p.used:0;
  const note = st==='expired'
    ? `<div class="callout co-red">${ic.info}<span>${exp} unused slot${exp>1?'s':''} expired on ${fDT(p.expiry)}. Expired slots can’t be used or refunded.</span></div>`
    : st==='used'
    ? `<div class="callout co-teal">${ic.check}<span>All slots from this purchase have been used. Track your questions in My Questions.</span></div>`
    : `<div class="callout ${st==='expiring'?'co-amber':'co-gold'}">${ic.clock}<span>Use ${availNow(p)>1?'these slots':'this slot'} by <b>${fDT(p.expiry)}</b> (${left(p.expiry-NOW)}). Unused slots expire 7 days after payment and aren’t refunded.</span></div>`;
  return `<div class="detail">
    <section class="sec"><h4>Purchase details</h4><dl class="kv">
      <dt>Purchase ID</dt><dd class="mono">${p.id}</dd>
      <dt>Astrologer</dt><dd>${esc(a.name)}</dd>
      <dt>Campaign</dt><dd>${c?esc(c.name)+(c.kind==='special'?' '+spc(c):''):'Ask Anything (no campaign)'}</dd>
      <dt>Purchased</dt><dd>${fDT(p.date)}</dd>
      <dt>Question type</dt><dd>${TYPE[p.type].name}</dd>
      <dt>Expiry</dt><dd>${fDT(p.expiry)}</dd>
    </dl></section>
    <section class="sec"><h4>Slots</h4><dl class="kv">
      <dt>Purchased</dt><dd>${p.count}</dd>
      <dt>Used</dt><dd>${p.used}</dd>
      ${exp?`<dt>Expired unused</dt><dd>${exp}</dd>`:''}
      <dt>Available</dt><dd><b>${availNow(p)}</b></dd>
      <dt>Slot status</dt><dd>${pill(st,PS)}</dd>
    </dl>
    <h4 style="margin-top:14px">Transaction</h4><dl class="kv">
      <dt>Transaction ID</dt><dd class="mono">${p.txn}</dd>
      <dt>Price per slot</dt><dd>${inr(p.unit)}</dd>
      <dt>Amount paid</dt><dd>${inr(p.paid)}</dd>
    </dl></section>
    <div class="full" style="display:grid;gap:10px">${note}
      ${availNow(p)?`<div class="detail-actions"><button class="btn btn-primary" data-action="ask-now" data-id="${p.id}">Ask now</button><small>Opens the question form for ${esc(a.name)}, ${TYPE[p.type].name.toLowerCase()}${c?', '+esc(c.name):''}.</small></div>`:''}
    </div>
  </div>`;
}

/* ---------- Ask New ---------- */
const constellation = `<svg class="constellation" viewBox="0 0 240 150" aria-hidden="true"><g stroke="#C9A55A" stroke-width=".8" opacity=".55" fill="none"><path d="M30 110 L78 76 L120 92 L162 48 L208 64 L190 118 L120 92"/></g><g fill="#E7C77F"><circle cx="30" cy="110" r="2.2"/><circle cx="78" cy="76" r="3"/><circle cx="120" cy="92" r="2.4"/><circle cx="162" cy="48" r="3.4"/><circle cx="208" cy="64" r="2.2"/><circle cx="190" cy="118" r="2.6"/><circle cx="60" cy="30" r="1.2"/><circle cx="140" cy="20" r="1"/><circle cx="226" cy="24" r="1.4"/><circle cx="100" cy="132" r="1"/></g></svg>`;
const BROWSE_LIMIT = 4;
function renderAN(){
  const counts={}; CAMPS.forEach(c=>counts[c.cat]=(counts[c.cat]||0)+1);
  return `<section class="aa" aria-labelledby="aa-h">
    <div class="aa-hero">${constellation}
      <h2 id="aa-h">Ask Anything</h2>
      <div class="chips-mini"><span>Answer within 30 days</span><span>Slots valid for 7 days</span><span>Full refund if unanswered</span></div>
    </div>
    <div class="aa-body">
      <div class="step-h"><span class="n">1</span><h3>Choose an astrologer</h3></div>
      <div class="astro-grid">${ASTROS.map(astroCard).join('')}</div>
      <div id="ap">${S.selAstro?astroPanel(A(S.selAstro)):`<p class="hint">${ic.info.replace('<svg','<svg width="16" height="16"')}Select an astrologer to see their subscription, Ask Anything pricing and active campaigns.</p>`}</div>
    </div>
  </section>
  <section aria-labelledby="bc-h">
    <div class="browse-head"><div><h2 id="bc-h">Browse campaigns by category</h2></div></div>
    <div class="chips" id="cat-chips" role="group" aria-label="Categories">${chipsHtml()}</div>
    <div id="camp-list">${campList()}</div>
  </section>`;
}
function chipsHtml(){
  const counts={}; CAMPS.forEach(c=>counts[c.cat]=(counts[c.cat]||0)+1);
  const chip=c=>`<button class="chip" aria-pressed="${S.cat===c}" data-action="cat" data-k="${c}">${c}<span>${counts[c]||0}</span></button>`;
  const hidden=OTHER_CATS.reduce((n,c)=>n+(counts[c]||0),0);
  if(S.catMore) return MAIN_CATS.map(chip).join('')+OTHER_CATS.map(chip).join('')+`<button class="chip chip-hide" data-action="cat-hide" aria-expanded="true">Hide</button>`;
  return MAIN_CATS.map(chip).join('')+`<button class="chip" aria-pressed="${OTHER_CATS.includes(S.cat)}" data-action="cat-more" aria-expanded="false">Others<span>${hidden}</span></button>`;
}
function campList(){
  const list=CAMPS.filter(c=>c.cat===S.cat);
  if(!list.length) return `<div class="empty">No active ${S.cat} campaigns right now. Try Ask Anything instead.</div>`;
  const all=!!S.browseAll[S.cat];
  const shown = all? list : list.slice(0,BROWSE_LIMIT);
  return `<div class="camps two">${shown.map(c=>campCard(c,'b')).join('')}</div>
    ${list.length>BROWSE_LIMIT?`<div class="browse-more"><button class="btn btn-ghost" data-action="browse-all" aria-expanded="${all}">${all?'Show fewer':`View all ${list.length} ${S.cat} campaigns`}</button></div>`:''}`;
}
function astroCard(a){
  const sel=S.selAstro===a.id;
  const pr=t=>{const p=disc(a.prices[t],a.offers[t]);return `<span>${t==='general'?'General':'Personal'}<strong>${inr(p)}</strong>${a.offers[t]?`<s>${inr(a.prices[t])}</s>`:''}</span>`;};
  return `<button class="astro-card" aria-pressed="${sel}" data-action="pick-astro" data-id="${a.id}">
    <span class="tick" aria-hidden="true"></span>
    <span class="ac-head">${av(a,'md')}<span class="ac-id"><b>${esc(a.name)}</b><span class="spec">${esc(a.spec)}</span></span></span>
    <span class="ac-flag">${a.sub?`<span class="pill p-teal">Subscribed</span><small>until ${a.subUntil.toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</small>`:`<span class="pill p-grey">Not subscribed</span><small>${inr(a.subPrice)}/month</small>`}</span>
    <span class="ac-meta"><span class="rate">★ ${a.rating}</span><small>(${a.reviews.toLocaleString('en-IN')})</small></span>
    <span class="ac-price">${pr('general')}${pr('personal')}</span>
  </button>`;
}
function subGate(a, compact){
  return `<div class="gate">
    <div><h4>Subscribe to ${esc(a.name)} first</h4></div>
    <div class="gate-price">${inr(a.subPrice)} <small>per month, renews monthly</small></div>
    ${compact?'':`<ul class="ticks"><li>Buy Ask Anything and campaign question slots</li><li>Weekly forecasts and posts from ${esc(shortName(a))}</li><li>Early access to new campaigns and live sessions</li></ul>`}
    <div><button class="btn btn-gold" data-action="subscribe" data-id="${a.id}">Subscribe for ${inr(a.subPrice)}</button></div>
  </div>`;
}
function astroPanel(a){
  return `<div class="ap" id="ap-box">
    <div class="ap-head">${av(a,'md')}<div><h3>${esc(a.name)}</h3><small>${esc(a.spec)}</small></div>
      <button class="icon-btn x" data-action="close-astro" aria-label="Clear selection">${ic.x}</button></div>
    ${a.sub?`<div class="sub-line"><span class="pill p-teal">Subscription active</span><small>Valid until ${fD(a.subUntil)}</small></div>
      <div class="ap-grid">
        <div class="box opt" id="aa-config">${aaConfig(a)}</div>
        <div class="box opt" id="apc-box">${apcInner(a,false)}</div>
      </div>`
    :`<div class="box" style="margin-bottom:14px">${subGate(a)}</div>
      <div class="lockline" style="justify-content:flex-start;margin:0 2px 8px">${ic.lock} Unlocks after subscribing</div>
      <div class="ap-grid locked" inert>
        <div class="box opt">${aaConfig(a,true)}</div>
        <div class="box opt">${apcInner(a,true)}</div>
      </div>`}
  </div>`;
}
function typeOptions(prices,offers,sel,scope,disabled){
  return `<div class="types" role="radiogroup" aria-label="Question type">${Object.keys(TYPE).filter(t=>prices[t]).map(t=>{
    const pct=(offers&&offers[t])||0, base=prices[t], now=disc(base,pct);
    return `<button class="type" role="radio" aria-checked="${sel===t}" ${disabled?'tabindex="-1"':''} ${scope?`data-action="set-type" ${scope} data-t="${t}"`:''}>
      <span class="radio"></span><b>${TYPE[t].name}</b>
      <span class="price"><span class="now">${inr(now)}</span>${pct?`<s>${inr(base)}</s> <span class="off">${pct}% off</span><span class="save">Save ${inr(base-now)}</span>`:''}</span>
      <span class="td">${TYPE[t].d}</span>
    </button>`;}).join('')}</div>`;
}
function summaryBlock(unit,pct,qty){
  const now=disc(unit,pct), orig=unit*qty, fin=now*qty;
  return `<div class="summary">
    <div><span>Original price (${inr(unit)} × ${qty})</span><span>${inr(orig)}</span></div>
    ${pct?`<div class="disc"><span>Offer (${pct}% off)</span><span>−${inr(orig-fin)}</span></div>`:''}
    <div class="tot"><span>Total payable</span><span>${inr(fin)}</span></div>
  </div>`;
}
function qtyRow(qty,max,scope){
  return `<div class="qty-row"><span class="lab">Number of slots<small>Up to ${max}. One slot = one question.</small></span>
    <span class="stepper"><button data-action="qty" data-d="-1" ${scope} aria-label="Fewer slots" ${qty<=1?'disabled':''}>−</button><output aria-live="polite">${qty}</output><button data-action="qty" data-d="1" ${scope} aria-label="More slots" ${qty>=max?'disabled':''}>+</button></span></div>`;
}
function aaConfig(a,locked){
  const st=S.aa[a.id]||(S.aa[a.id]={type:'general',qty:1});
  const scope=`data-scope="aa" data-id="${a.id}"`, pct=a.offers[st.type]||0;
  return `<div class="opt-h"><h4>Ask Anything</h4></div>
    ${typeOptions(a.prices,a.offers,st.type,locked?null:scope,locked)}
    ${locked?'':`${qtyRow(st.qty,5,scope)}
    ${summaryBlock(a.prices[st.type],pct,st.qty)}
    <button class="btn btn-primary btn-block" data-action="buy-aa" data-id="${a.id}">Review and pay ${inr(disc(a.prices[st.type],pct)*st.qty)}</button>`}`;
}
/* Selected astrologer's campaigns: compact rows, first 3, View all, category chips at 6+, single purchase area */
const APC_LIMIT = 3;
function apcInner(a,locked){
  const st=S.apc[a.id]||(S.apc[a.id]={sel:null,all:false,cat:'',info:new Set()});
  const all=CAMPS.filter(c=>c.astro===a.id);
  const head=`<div class="opt-h"><h4>Or pick one campaign</h4></div>`;
  if(!all.length) return head+`<p style="margin-top:12px;font-size:14px;color:var(--muted)">No active campaigns from this astrologer right now. Ask Anything is always available.</p>`;
  const cats=[...new Set(all.map(c=>c.cat))];
  const chips = st.all && all.length>=6 && cats.length>1;
  let list = chips && st.cat ? all.filter(c=>c.cat===st.cat) : all;
  let shown = st.all ? list : list.slice(0,APC_LIMIT);
  if(!st.all && st.sel && !shown.some(c=>c.id===st.sel)) shown=[...shown,C(st.sel)];
  const rows=shown.map(c=>{
    const on=st.sel===c.id, fo=cFromOrig(c), from=cFrom(c), info=st.info.has(c.id);
    return `<div class="crow${on?' on':''}">
      <button class="crow-main" role="radio" aria-checked="${on}" data-action="pick-camp" data-a="${a.id}" data-id="${c.id}">
        <span class="radio"></span>
        <span class="crow-t"><b>${esc(c.name)}</b><small>${c.cat}, valid until ${fD(c.to)}</small></span>
        <span class="crow-p">from<b>${inr(from)}</b>${fo.pct?`<s>${inr(fo.orig)}</s>`:''}</span>
      </button>
      <div class="crow-f">${spc(c)}${offBadge(c)}<span>${c.left} slots left</span><button class="btn-text" data-action="camp-info" data-a="${a.id}" data-id="${c.id}" aria-expanded="${info}">${info?'Hide details':'Details'}</button></div>
      ${info?`<p class="crow-d">${esc(c.long)}</p>`:''}
    </div>`;}).join('');
  const chipHTML = chips?`<div class="cat-chips" role="group" aria-label="Filter campaigns">${['',...cats].map(k=>`<button class="chip" aria-pressed="${st.cat===k}" data-action="apc-cat" data-a="${a.id}" data-k="${k}">${k||'All'}<span>${k?all.filter(c=>c.cat===k).length:all.length}</span></button>`).join('')}</div>`:'';
  const more = all.length>APC_LIMIT?`<button class="btn btn-ghost btn-sm more" data-action="apc-all" data-a="${a.id}" aria-expanded="${st.all}">${st.all?'Show fewer':`View all ${all.length} campaigns`}</button>`:'';
  let buy='';
  if(st.sel && !locked){
    const c=C(st.sel), cs=S.cs[c.id]||(S.cs[c.id]={type:'general',qty:1});
    const scope=`data-scope="camp" data-id="${c.id}" data-ctx="p"`, pct=cPct(c,cs.type), max=Math.min(5,c.left);
    buy=`<div class="buy-area" id="apc-buy"><h5>${esc(c.name)} ${spc(c)}</h5>
      ${typeOptions(c.prices,c.offers,cs.type,scope)}
      ${qtyRow(cs.qty,max,scope)}
      ${summaryBlock(c.prices[cs.type],pct,cs.qty)}
      <button class="btn btn-primary btn-block" data-action="buy-camp" data-id="${c.id}">Review and pay ${inr(disc(c.prices[cs.type],pct)*cs.qty)}</button></div>`;
  } else if(!locked){
    buy='';
  }
  return head+chipHTML+`<div class="crows" role="radiogroup" aria-label="Campaigns">${rows}</div>`+more+buy;
}
function refreshApc(aid){ const el=$id('apc-box'); if(el) el.innerHTML=apcInner(A(aid),false); }
function campCard(c,ctx){
  const a=A(c.astro), key=ctx+':'+c.id, open=S.openCamp.has(key);
  const st=S.cs[c.id]||(S.cs[c.id]={type:'general',qty:1});
  const fo=cFromOrig(c), fromNow=cFrom(c);
  const scope=`data-scope="camp" data-id="${c.id}" data-ctx="${ctx}"`;
  const max=Math.min(5,c.left), pct=cPct(c,st.type);
  return `<article class="camp${open?' open':''}" id="camp-${ctx}-${c.id}">
    <div class="camp-top">${av(a)}<div class="who"><b>${esc(a.name)}</b><small>★ ${a.rating}</small></div><span class="tag">${c.cat}</span>${spc(c)}${offBadge(c)}</div>
    <h3>${esc(c.name)}</h3>
    <p class="short">${esc(c.short)}</p>
    <dl class="camp-meta">
      <div><dt>Valid until</dt><dd>${fD(c.to)}</dd></div>
      <div><dt>Slots left</dt><dd>${c.left}${c.left<=10?' <span style="color:var(--amber);font-weight:500;font-size:12px">few left</span>':''}</dd></div>
      <div><dt>From</dt><dd>${inr(fromNow)}${fo.pct?`<s>${inr(fo.orig)}</s>`:''}</dd></div>
    </dl>
    <div class="camp-foot"><span class="offer-note">${maxOff(c)?esc(c.offer||'Offer price'):''}</span>
      <button class="btn btn-ghost btn-sm" data-action="toggle-camp" data-id="${c.id}" data-ctx="${ctx}" aria-expanded="${open}">${open?'Hide details':'View campaign'}</button></div>
    <div class="camp-detail"><div><div class="in">
      <p class="long">${esc(c.long)}</p>
      <div class="two-col">
        <div class="mini"><span class="lbl2">Astrologer</span><b>${esc(a.name)}</b><br><small>${esc(a.spec)}, ${a.exp} yrs, ★ ${a.rating}</small></div>
        <div class="mini"><span class="lbl2">Campaign validity</span><b>${fD(c.from)} to ${fD(c.to)}</b><br><small>${c.left} of ${c.total} slots left</small><div class="bar"><i style="width:${Math.round(c.left/c.total*100)}%"></i></div></div>
      </div>
      ${a.sub
        ? `<div><div class="fl" style="font-weight:600;font-size:14px">Choose question type</div>${typeOptions(c.prices,c.offers,st.type,scope)}
           ${qtyRow(st.qty,max,scope)}
           ${summaryBlock(c.prices[st.type],pct,st.qty)}
           <button class="btn btn-primary btn-block" data-action="buy-camp" data-id="${c.id}">Review and pay ${inr(disc(c.prices[st.type],pct)*st.qty)}</button>
           <p class="fine">You’re subscribed to ${esc(a.name)}. Slots must be used within 7 days of payment.</p></div>`
        : `<div><div class="fl" style="font-weight:600;font-size:14px;margin-bottom:-4px">Question prices</div>${typeOptions(c.prices,c.offers,null,null,true)}<div class="box" style="background:var(--surface-2)">${subGate(a,true)}</div></div>`}
    </div></div></div>
  </article>`;
}
function refreshCamp(id){
  const el=$id(`camp-b-${id}`); if(el) el.outerHTML=campCard(C(id),'b');
}

/* ---------- Payment (unchanged flow) ---------- */
function openPay(o){ S.pay={status:'review',fail:false,...o}; renderOverlay(); }
function payBody(){
  const p=S.pay, a=A(p.astro), c=p.camp?C(p.camp):null;
  if(p.status==='success'){
    if(p.kind==='sub') return {title:'Subscription active',body:`
      <div class="ok-head"><span class="ok-ic">${ic.check}</span><h4>You’re subscribed to ${esc(a.name)}</h4><p style="color:var(--muted);font-size:14px">You can now buy question slots from this astrologer.</p></div>
      <dl class="kv"><dt>Transaction ID</dt><dd class="mono">${p.txn}</dd><dt>Plan</dt><dd>Monthly subscription</dd><dt>Amount paid</dt><dd>${inr(p.final)}</dd><dt>Valid until</dt><dd>${fD(a.subUntil)}</dd></dl>`,
      foot:`<button class="btn btn-primary btn-block" data-action="pay-close">Continue to question slots</button>`};
    const pur=P(p.purchaseId);
    return {title:'Payment successful',body:`
      <div class="ok-head"><span class="ok-ic">${ic.check}</span><h4>Payment successful</h4><p style="color:var(--muted);font-size:14px">Your slots are ready to use.</p></div>
      <dl class="kv"><dt>Transaction ID</dt><dd class="mono">${p.txn}</dd><dt>Astrologer</dt><dd>${esc(a.name)}</dd>${c?`<dt>Campaign</dt><dd>${esc(c.name)}</dd>`:''}<dt>Question type</dt><dd>${TYPE[p.type].name}</dd><dt>Slots purchased</dt><dd>${p.qty}</dd><dt>Amount paid</dt><dd>${inr(p.final)}</dd></dl>
      <div class="callout co-gold">${ic.clock}<span>Use your slot${p.qty>1?'s':''} by <b>${fDT(pur.expiry)}</b>. Unused slots expire after 7 days and aren’t refunded.</span></div>`,
      foot:`<div class="row2"><button class="btn btn-ghost" data-action="pay-later">Ask later</button><button class="btn btn-primary" data-action="pay-now">Ask now</button></div>`};
  }
  const proc=p.status==='processing';
  const failBox=p.status==='failed'?`<div class="callout co-red" role="alert">${ic.warn}<span><b>Payment failed.</b> You weren’t charged and ${p.kind==='sub'?'your subscription wasn’t activated':'no slots were added'}. Check your payment method and try again.</span></div>`:'';
  const btn=`<button class="btn btn-primary btn-block" data-action="pay-go" ${proc?'disabled':''}>${proc?'<span class="spin"></span> Processing payment…':(p.status==='failed'?`Try again, pay ${inr(p.final)}`:`Pay ${inr(p.final)}`)}</button>`;
  if(p.kind==='sub') return {title:'Subscribe',body:`${failBox}
    <div style="display:flex;gap:12px;align-items:center">${av(a,'md')}<div><b>${esc(a.name)}</b><br><small>${esc(a.spec)}</small></div></div>
    <dl class="kv"><dt>Plan</dt><dd>Monthly subscription</dd><dt>Valid for</dt><dd>30 days from payment</dd><dt>Subscription price</dt><dd><b>${inr(p.final)}</b></dd></dl>
    <div class="callout co-gold">${ic.info}<span>This payment covers only the subscription. Question slots are paid separately, with their own transaction ID.</span></div>`,
    foot:btn};
  return {title:'Purchase summary',body:`${failBox}
    <dl class="kv"><dt>Astrologer</dt><dd>${esc(a.name)}</dd>${c?`<dt>Campaign</dt><dd>${esc(c.name)}</dd>`:'<dt>Campaign</dt><dd>Ask Anything (none)</dd>'}<dt>Question type</dt><dd>${TYPE[p.type].name}</dd><dt>Slot quantity</dt><dd>${p.qty}</dd></dl>
    ${summaryBlock(p.unit,p.pct,p.qty)}
    <div class="callout co-gold">${ic.clock}<span>Slots must be used within 7 days of payment. Unused slots expire and aren’t refunded.</span></div>`,
    foot:btn};
}
function doPay(){
  const p=S.pay; if(!p||p.status==='processing'||p.status==='success') return;
  p.status='processing'; renderOverlay();
  setTimeout(()=>{
    if(!S.pay||S.pay!==p) return;
    if(p.fail){ p.status='failed'; renderOverlay(); return; }
    if(!p.txn){
      p.txn=txnId();
      const a=A(p.astro);
      if(p.kind==='sub'){ a.sub=true; a.subUntil=ahead(30); }
      else {
        const pur={id:'P-'+(pSeq++),astro:p.astro,camp:p.camp,type:p.type,date:new Date(),count:p.qty,used:0,txn:p.txn,unit:disc(p.unit,p.pct),paid:p.final};
        pur.expiry=new Date(pur.date.getTime()+7*DAY);
        PURCHASES.unshift(pur); p.purchaseId=pur.id;
        if(p.camp) C(p.camp).left-=p.qty;
      }
    }
    p.status='success'; renderOverlay(); renderTabs();
  },1300);
}
function closePay(){
  const p=S.pay; S.pay=null; renderOverlay();
  if(p && p.status==='success'){
    if(S.tab==='new'){ renderPanel(); if(p.kind==='sub'){ const el=$id(p.camp?`camp-b-${p.camp}`:'ap-box'); el&&el.scrollIntoView({behavior:'smooth',block:'start'}); } }
  }
}

/* ---------- Question form ---------- */
const blankNP = () => ({name:'',rel:'',dob:'',time:'',unknown:false,place:'',gender:'',save:true});
function openForm(pid){
  S.form={pid,step:'form',text:'',lang:'',who:'',personId:null,adding:false,np:blankNP(),npErr:'',temp:[],files:[],picker:null,replaceIdx:null,qid:null};
  renderOverlay();
}
const people = f => SAVED.concat(f.temp);
const personById = (f,id) => people(f).find(h=>h.id===id);
const isPersonal = f => P(f.pid).type==='personal';
function missing(f){
  if(!f.text.trim()) return 'Write your question to continue.';
  if(!f.lang) return 'Choose a preferred answer language to continue.';
  if(!f.who) return 'Choose who this question is for to continue.';
  if(!f.personId) return 'Select or add a horoscope to continue.';
  return '';
}
const formValid = f => !missing(f);
function prefill(f){
  const p=P(f.pid), a=A(p.astro), c=p.camp?C(p.camp):null;
  return `<div class="prefill"><dl class="kv">
    <dt>Astrologer</dt><dd>${esc(a.name)}</dd>${c?`<dt>Campaign</dt><dd>${esc(c.name)} ${spc(c)}</dd>`:''}
    <dt>Question type</dt><dd>${TYPE[p.type].name}</dd>
    <dt>Slot</dt><dd>${p.id}, ${availNow(p)} of ${p.count} available, use by ${fD(p.expiry)}</dd>
  </dl></div>`;
}
function seg(items,cur,action,label){
  return `<div class="seg" role="radiogroup" aria-label="${label}">${items.map(([v,l])=>`<button role="radio" aria-checked="${cur===v}" data-action="${action}" data-v="${v}">${l}</button>`).join('')}</div>`;
}
function personArea(f){
  if(!f.who) return '';
  const list = f.who==='self' ? [ME] : people(f).filter(h=>h.group===f.who);
  const cards = list.map(h=>`<button class="pcard" role="radio" aria-checked="${f.personId===h.id}" data-action="pick-person" data-id="${h.id}">
      <span class="radio"></span><span><b>${esc(h.name)}</b><span class="tag">${esc(h.rel)}</span>${h.temp?'<span class="tag">This question only</span>':''}</span>
      <small>${esc(birthLine(h))}</small></button>`).join('');
  let extra='';
  if(f.who==='self') extra=`<small>From your profile. To change these details, edit your profile.</small>`;
  else if(f.adding) extra=addPersonForm(f);
  else extra=`${list.length?'':`<p style="font-size:13.5px;color:var(--muted)">No saved ${f.who==='family'?'family':'other'} horoscopes yet.</p>`}<button class="att-add" data-action="addp-open">${ic.plus} Add a person</button>`;
  return `<div class="people" role="radiogroup" aria-label="Horoscope">${cards}${extra}</div>`;
}
function addPersonForm(f){
  const n=f.np, fam=f.who==='family';
  const rels=['Husband','Wife','Father','Mother','Son','Daughter','Brother','Sister','Grandparent','Other'];
  return `<div class="addp"><h5>Add a ${fam?'family member':'person'}</h5>
    <div class="grid2">
      <div class="field"><label for="np-name">Name</label><input id="np-name" data-np="name" value="${esc(n.name)}" autocomplete="off"></div>
      <div class="field"><label for="np-rel">Relationship</label>${fam?`<select id="np-rel" data-np="rel"><option value="">Select</option>${rels.map(r=>`<option${n.rel===r?' selected':''}>${r}</option>`).join('')}</select>`:`<input id="np-rel" data-np="rel" placeholder="e.g. Friend, colleague" value="${esc(n.rel)}">`}</div>
      <div class="field"><label for="np-dob">Date of birth</label><input type="date" id="np-dob" data-np="dob" value="${n.dob}"></div>
      <div class="field"><label for="np-time">Birth time</label><input type="time" id="np-time" data-np="time" value="${n.time}" ${n.unknown?'disabled':''}></div>
      <div class="field"><label for="np-place">Birth place</label><input id="np-place" data-np="place" placeholder="City, state" value="${esc(n.place)}"></div>
      <div class="field"><label for="np-gen">Gender</label><select id="np-gen" data-np="gender"><option value="">Select</option>${['Female','Male','Other'].map(g=>`<option${n.gender===g?' selected':''}>${g}</option>`).join('')}</select></div>
    </div>
    <label class="chk"><input type="checkbox" data-np="unknown" ${n.unknown?'checked':''}> Birth time unknown</label>
    <label class="chk"><input type="checkbox" data-np="save" ${n.save?'checked':''}> Save to my horoscopes for next time</label>
    ${f.npErr?`<p class="err" role="alert">${f.npErr}</p>`:''}
    <div class="row2" style="display:flex;gap:8px;justify-content:flex-end"><button class="btn btn-ghost btn-sm" data-action="addp-cancel">Cancel</button><button class="btn btn-primary btn-sm" data-action="addp-save">Add and select</button></div>
  </div>`;
}
/* Attachments: rendered ONLY for Personal questions. The check depends solely on the purchased question type. */
function attSection(f){
  const linked=f.personId?personById(f,f.personId):null;
  const items=f.files.map((x,i)=>`<div class="att-item"><span class="ai-ic">${x.src?`<img src="${x.src}" alt="">`:ic.chart}</span>
      <span class="ai-t"><b>${esc(x.name)}</b><small>${x.saved?'Saved horoscope':'Image, '+x.size}</small></span>
      <button class="btn-text" data-action="att-replace" data-i="${i}">Replace</button><button class="btn-text" style="color:var(--red)" data-action="att-remove" data-i="${i}" aria-label="Remove ${esc(x.name)}">Remove</button></div>`).join('');
  const pinned = linked?`<div class="att-item pinned"><span class="ai-ic">${ic.chart}</span><span class="ai-t"><b>Horoscope of ${esc(linked.name)}</b><small>Linked horoscope, included automatically</small></span></div>`:'';
  let picker='';
  if(f.picker!==null){
    const taken=new Set(f.files.filter(x=>x.saved).map(x=>x.hid)); if(linked) taken.add(linked.id);
    const opts=people(f).filter(h=>!taken.has(h.id));
    picker=`<div class="picker"><h5>${f.picker==='new'?'Add a saved horoscope':'Replace with a saved horoscope'}</h5>
      ${opts.length?opts.map(h=>`<div class="pick-row"><span><b>${esc(h.name)}</b> (${esc(h.rel)})<small>${esc(birthLine(h))}</small></span><button class="btn btn-ghost btn-sm" data-action="att-pick" data-id="${h.id}">Attach</button></div>`).join(''):'<p style="font-size:13.5px;color:var(--muted)">All your saved horoscopes are already included.</p>'}
      <div style="text-align:right"><button class="btn-text" data-action="att-picker-cancel">Cancel</button></div></div>`;
  }
  const full=f.files.length>=2;
  return `<div class="att-list">${pinned}${items}</div>
    ${picker || (full?`<small>Attachment limit reached. Remove or replace one to change it.</small>`:`<div class="att-btns"><button class="att-add" data-action="att-upload">${ic.upload} Upload image</button><button class="att-add" data-action="att-saved">${ic.chart.replace('<svg','<svg width="16" height="16"')} Add saved horoscope</button></div>`)}`;
}
function formBody(){
  const f=S.form, p=P(f.pid), a=A(p.astro), c=p.camp?C(p.camp):null, personal=isPersonal(f);
  const steps=`<div class="steps"><span class="${f.step==='form'?'on':''}">1. Write</span><span class="${f.step==='preview'?'on':''}">2. Preview</span><span class="${f.step==='done'?'on':''}">3. Submitted</span></div>`;
  if(f.step==='done'){
    const q=QUESTIONS.find(x=>x.id===f.qid), dl=new Date(q.submitted.getTime()+30*DAY);
    return {title:'Question submitted',steps,body:`
      <div class="ok-head"><span class="ok-ic">${ic.check}</span><h4>Question submitted successfully</h4><p style="color:var(--muted);font-size:14px">Your astrologer will answer within 30 days.</p></div>
      <dl class="kv"><dt>Question ID</dt><dd class="mono">${q.id}</dd><dt>Astrologer</dt><dd>${esc(a.name)}</dd><dt>Question for</dt><dd>${esc(q.who.name)} (${esc(q.who.rel)})</dd><dt>Answer language</dt><dd>${q.lang}</dd><dt>Submitted</dt><dd>${fDT(q.submitted)}</dd><dt>Answer expected by</dt><dd>${fDT(dl)}</dd></dl>
      <div class="callout co-teal">${ic.refund}<span>If there’s no answer by ${fD(dl)}, the question is cancelled and ${inr(q.amount)} is refunded automatically.</span></div>`,
      foot:`<button class="btn btn-primary btn-block" data-action="view-q">View My Questions</button>`};
  }
  const person=f.personId?personById(f,f.personId):null;
  if(f.step==='preview'){
    const atts = personal ? [{linked:true,name:'Horoscope of '+person.name},...f.files.map(x=>x.saved?{saved:true,name:x.name}:{name:x.name,size:x.size,src:x.src})] : [];
    return {title:'Preview your question',steps,body:`
      <dl class="kv"><dt>Astrologer</dt><dd>${esc(a.name)}</dd>${c?`<dt>Campaign</dt><dd>${esc(c.name)} ${spc(c)}</dd>`:''}<dt>Question type</dt><dd>${TYPE[p.type].name}</dd><dt>Answer language</dt><dd>${f.lang}</dd></dl>
      <div class="field"><span class="fl">Your question</span><div class="pv-q">${esc(f.text.trim())}</div></div>
      <div class="field"><span class="fl">Question for</span><dl class="kv"><dt>Name</dt><dd>${esc(person.name)} (${esc(person.rel)})</dd><dt>Date of birth</dt><dd>${fDob(person.dob)}</dd><dt>Birth time</dt><dd>${person.time?fTime24(person.time):'Unknown'}</dd><dt>Birth place</dt><dd>${esc(person.place)}</dd><dt>Gender</dt><dd>${esc(person.gender)}</dd></dl></div>
      ${personal?`<div class="field"><span class="fl">Attachments</span><div class="thumbs">${atts.filter(x=>x.src).map(attView).join('')}</div><div class="files">${atts.filter(x=>!x.src).map(attView).join('')}</div></div>`:''}
      <div class="notice"><b>Important Notice</b><p>Please review your question and attachments carefully before submitting.</p><p>Once submitted, your question cannot be edited or modified. The astrologer will provide an answer within 30 days of submission.</p></div>`,
      foot:`<div class="row2"><button class="btn btn-ghost" data-action="form-edit">Edit question</button><button class="btn btn-primary" data-action="form-submit">Final submit</button></div>`};
  }
  const n=f.text.length, miss=missing(f);
  return {title:'Ask your question',steps,body:`
    ${prefill(f)}
    <div class="field"><label for="qf-text">Your question <span class="counter ${n>=1000?'full':n>=900?'near':''}" id="qf-count">${n.toLocaleString('en-IN')} / 1,000</span></label>
      <textarea id="qf-text" maxlength="1000" placeholder="Describe your situation and what you’d like to know. Include any dates or details that matter.">${esc(f.text)}</textarea></div>
    <div class="field"><span class="fl">Preferred answer language</span>${seg(LANGS.map(l=>[l,l]),f.lang,'set-lang','Preferred answer language')}</div>
    <div class="field"><span class="fl">Who is this question for?</span>${seg([['self','Myself'],['family','Family'],['others','Others']],f.who,'set-who','Who is this question for')}
      <div id="qf-people">${personArea(f)}</div></div>
    ${personal?`<div class="field"><span class="fl">Attachments <small>Optional, up to 2 images or saved horoscopes</small></span><div id="qf-att" style="display:grid;gap:8px">${attSection(f)}</div>
      <input type="file" id="qf-file" accept="image/jpeg,image/png,image/webp" hidden></div>`:''}
    <div class="callout co-teal">${ic.clock}<span>Your astrologer will answer within 30 days.</span></div>`,
    foot:`<p class="lockline">${ic.lock} Once submitted, this question cannot be edited.</p>
      <button class="btn btn-primary btn-block" id="qf-preview" data-action="form-preview" ${miss?'disabled':''}>Preview question</button>
      <small id="qf-hint" style="text-align:center">${miss}</small>`};
}
function updateFormState(){
  const f=S.form, b=$id('qf-preview'), h=$id('qf-hint');
  if(!b) return;
  const m=missing(f); b.disabled=!!m; h.textContent=m;
}
function rerenderAtt(){ const el=$id('qf-att'); if(el) el.innerHTML=attSection(S.form); }
function rerenderPeople(){ const el=$id('qf-people'); if(el) el.innerHTML=personArea(S.form); rerenderAtt(); updateFormState(); }
function submitQuestion(){
  const f=S.form, p=P(f.pid);
  if(availNow(p)<1){ toast('This slot is no longer available.'); return; }
  p.used++;
  const c=p.camp?C(p.camp):null, person=personById(f,f.personId);
  const files = isPersonal(f) ? [{linked:true,name:'Horoscope of '+person.name},...f.files.map(x=>x.saved?{saved:true,name:x.name}:{name:x.name,size:x.size,src:x.src})] : [];
  const q={id:'Q-'+(qSeq++),astro:p.astro,camp:p.camp,cat:c?c.cat:'Ask Anything',type:p.type,submitted:new Date(),amount:p.unit,status:'waiting',text:f.text.trim(),lang:f.lang,who:snap(person),files};
  QUESTIONS.unshift(q); f.qid=q.id; f.step='done'; S.confirm=false;
  renderOverlay(); renderTabs();
  if(S.tab!=='new') renderPanel();
}

/* ---------- Overlay rendering ---------- */
function sheet(o,wide,closeAction,closeDisabled,backAction){
  return `<div class="scrim" data-scrim="${closeAction}"><div class="sheet${wide?' wide':''}" role="dialog" aria-modal="true" aria-labelledby="sh-t">
    <div class="sh-head">${backAction?`<button class="icon-btn" data-action="${backAction}" aria-label="Back">${ic.back}</button>`:''}<h3 id="sh-t">${o.title}</h3><button class="icon-btn" data-action="${closeAction}" aria-label="Close" ${closeDisabled?'disabled':''}>${ic.x}</button></div>
    ${o.steps||''}
    <div class="sh-body">${o.body}</div>
    <div class="sh-foot">${o.foot}</div>
  </div></div>`;
}
let lastKey='';
function renderOverlay(){
  const host=$id('overlay'); let h='';
  const prevBody=host.querySelector('.sh-body'), prevScroll=prevBody?prevBody.scrollTop:0;
  const key = S.pay?'pay':(S.form?'form-'+S.form.step:(S.rev?'rev-'+S.rev.mode:''));
  if(S.pay){
    const proc=S.pay.status==='processing', succ=S.pay.status==='success';
    h=sheet(payBody(),false,succ&&S.pay.kind==='slots'?'pay-later':'pay-close',proc);
  } else if(S.form){
    h=sheet(formBody(),true,'form-close',false,S.form.step==='preview'?'form-edit':null);
  }
  if(S.rev){
    const x=QUESTIONS.find(q=>q.id===S.rev.id), r=S.rev, a=A(x.astro);
    const stars=[1,2,3,4,5].map(n=>`<button class="star${n<=r.stars?' on':''}" data-action="rev-star" data-n="${n}" aria-label="${n} star${n>1?'s':''}" aria-pressed="${n<=r.stars}">★</button>`).join('');
    h+=r.mode==='rate'
      ? sheet({title:'Rate this answer',body:`<p>${esc(a.name)}, question ${x.id}</p><div class="star-row" role="group" aria-label="Rating">${stars}</div><label class="fld"><span>Comment (optional)</span><textarea id="rev-text" rows="3" maxlength="300" placeholder="Share what was helpful">${esc(r.text)}</textarea></label>`,foot:`<button class="btn btn-primary" data-action="rev-rate"${r.stars?'':' disabled'}>Submit rating</button><button class="btn btn-ghost" data-action="rev-to-dispute">Not satisfied? Raise a dispute</button>`},false,'rev-close')
      : sheet({title:'Raise a dispute',body:`<p>Tell us what was wrong with the answer. AstroConnect support will review it.</p><label class="fld"><span>Reason</span><textarea id="rev-reason" rows="4" maxlength="500" placeholder="Describe the problem">${esc(r.reason)}</textarea></label>`,foot:`<button class="btn btn-primary" data-action="rev-dispute"${r.reason.trim()?'':' disabled'}>Raise dispute</button><button class="btn btn-ghost" data-action="rev-to-rate">Back to rating</button>`},false,'rev-close');
  }
  if(S.confirm){
    h+=`<div class="scrim dialog-scrim"><div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="cf-t" aria-describedby="cf-d">
      <h3 id="cf-t">Submit this question?</h3><p id="cf-d">Are you sure you want to submit? You won’t be able to edit this question after submission.</p>
      <div class="row2"><button class="btn btn-ghost" data-action="confirm-no">Cancel</button><button class="btn btn-primary" data-action="confirm-yes">Yes, submit</button></div></div></div>`;
  }
  if(S.lb){
    h+=`<div class="lb" role="dialog" aria-modal="true" aria-label="${esc(S.lb.name)}"><button class="icon-btn" data-action="lb-close" aria-label="Close">${ic.x}</button><figure><img src="${IMGS[S.lb.i]}" alt="${esc(S.lb.name)}"><figcaption>${esc(S.lb.name)}</figcaption></figure></div>`;
  }
  host.innerHTML=h;
  document.body.classList.toggle('no-scroll',!!h);
  const nb=host.querySelector('.sh-body'); if(nb && key===lastKey) nb.scrollTop=prevScroll;
  const changed = key!==lastKey; lastKey=key;
  if(S.lb){ const b=host.querySelector('.lb .icon-btn'); b&&b.focus({preventScroll:true}); return; }
  if(S.confirm){ const b=host.querySelector('[data-action="confirm-yes"]'); b&&b.focus({preventScroll:true}); return; }
  if(changed && !(S.form&&S.form.step==='form')){ const b=host.querySelector('.sh-foot .btn-primary:not([disabled])'); b&&b.focus({preventScroll:true}); }
}

/* ---------- Events ---------- */
const act = {
  tab:t=>{ S.tab=t.dataset.k; renderPanel(); window.scrollTo({top:0,behavior:'smooth'}); },
  'toggle-q':t=>toggleRow(t,S.openQ),
  'toggle-p':t=>toggleRow(t,S.openP),
  'mq-page':t=>{ S.mq.page=+t.dataset.p; renderMQList(); const l=$id('mq-list'); l&&l.scrollIntoView({behavior:'smooth',block:'start'}); },
  'clear-mq':()=>{ S.mq={q:'',status:'',cat:'',date:''}; renderPanel(); },
  'clear-ps':()=>{ S.ps={q:'',status:'',type:''}; renderPanel(); },
  'pick-astro':t=>{
    const id=t.dataset.id; S.selAstro = S.selAstro===id?null:id;
    renderPanel();
    if(S.selAstro){ const el=$id('ap-box'); el&&el.scrollIntoView({behavior:'smooth',block:'nearest'}); }
  },
  'close-astro':()=>{ S.selAstro=null; renderPanel(); },
  cat:t=>{ S.cat=t.dataset.k; $id('cat-chips').innerHTML=chipsHtml(); $id('camp-list').innerHTML=campList(); focusSame(`#cat-chips [data-k="${S.cat}"]`); },
  'cat-more':()=>{ S.catMore=true; $id('cat-chips').innerHTML=chipsHtml(); focusSame('#cat-chips [data-action="cat-hide"]'); },
  'cat-hide':()=>{ S.catMore=false; $id('cat-chips').innerHTML=chipsHtml(); focusSame('#cat-chips [data-action="cat-more"]'); },
  'browse-all':()=>{ S.browseAll[S.cat]=!S.browseAll[S.cat]; $id('camp-list').innerHTML=campList(); focusSame('[data-action="browse-all"]'); },
  'toggle-camp':t=>{
    const key=t.dataset.ctx+':'+t.dataset.id, card=$id(`camp-${t.dataset.ctx}-${t.dataset.id}`);
    const open=!S.openCamp.has(key); open?S.openCamp.add(key):S.openCamp.delete(key);
    card.classList.toggle('open',open); t.setAttribute('aria-expanded',open); t.textContent=open?'Hide details':'View campaign';
  },
  'pick-camp':t=>{ const st=S.apc[t.dataset.a]; st.sel = st.sel===t.dataset.id?null:t.dataset.id; refreshApc(t.dataset.a); focusSame(`#apc-box [data-action="pick-camp"][data-id="${t.dataset.id}"]`); if(st.sel){ const b=$id('apc-buy'); b&&b.scrollIntoView({behavior:'smooth',block:'nearest'}); } },
  'camp-info':t=>{ const st=S.apc[t.dataset.a]; st.info.has(t.dataset.id)?st.info.delete(t.dataset.id):st.info.add(t.dataset.id); refreshApc(t.dataset.a); focusSame(`#apc-box [data-action="camp-info"][data-id="${t.dataset.id}"]`); },
  'apc-all':t=>{ const st=S.apc[t.dataset.a]; st.all=!st.all; if(!st.all) st.cat=''; refreshApc(t.dataset.a); focusSame('#apc-box [data-action="apc-all"]'); },
  'apc-cat':t=>{ S.apc[t.dataset.a].cat=t.dataset.k; refreshApc(t.dataset.a); focusSame(`#apc-box [data-action="apc-cat"][data-k="${t.dataset.k}"]`); },
  'set-type':t=>{
    if(t.dataset.scope==='aa'){ S.aa[t.dataset.id].type=t.dataset.t; $id('aa-config').innerHTML=aaConfig(A(t.dataset.id)); focusSame(`#aa-config [data-t="${t.dataset.t}"]`); }
    else { S.cs[t.dataset.id].type=t.dataset.t; afterCampChange(t.dataset.id,t.dataset.ctx,`[data-t="${t.dataset.t}"]`); }
  },
  qty:t=>{
    const d=+t.dataset.d;
    if(t.dataset.scope==='aa'){ const st=S.aa[t.dataset.id]; st.qty=Math.max(1,Math.min(5,st.qty+d)); $id('aa-config').innerHTML=aaConfig(A(t.dataset.id)); focusSame(`#aa-config [data-d="${d}"]`); }
    else { const c=C(t.dataset.id), st=S.cs[c.id]; st.qty=Math.max(1,Math.min(Math.min(5,c.left),st.qty+d)); afterCampChange(c.id,t.dataset.ctx,`[data-d="${d}"]`); }
  },
  subscribe:t=>{ const a=A(t.dataset.id); const campEl=t.closest('.camp'); openPay({kind:'sub',astro:a.id,final:a.subPrice,camp:campEl?campEl.id.split('-').pop():null}); },
  'buy-aa':t=>{ const a=A(t.dataset.id), st=S.aa[a.id], pct=a.offers[st.type]||0; openPay({kind:'slots',astro:a.id,camp:null,type:st.type,qty:st.qty,unit:a.prices[st.type],pct,final:disc(a.prices[st.type],pct)*st.qty}); },
  'buy-camp':t=>{ const c=C(t.dataset.id), st=S.cs[c.id], pct=cPct(c,st.type); openPay({kind:'slots',astro:c.astro,camp:c.id,type:st.type,qty:st.qty,unit:c.prices[st.type],pct,final:disc(c.prices[st.type],pct)*st.qty}); },
  'pay-go':()=>doPay(),
  'pay-close':()=>{ if(S.pay&&S.pay.status==='processing') return; closePay(); },
  'pay-later':()=>{ const pur=P(S.pay.purchaseId); closePay(); toast(`Saved to Purchased Slots. Use ${pur.count>1?'them':'it'} by ${fD(pur.expiry)}.`); },
  'pay-now':()=>{ const id=S.pay.purchaseId; S.pay=null; if(S.tab==='new') renderPanel(); openForm(id); },
  'ask-now':t=>openForm(t.dataset.id),
  'form-close':()=>{
    const f=S.form; S.form=null; renderOverlay();
    if(f.step==='done') return;
    if(f.text.trim()) toast('Question not submitted. Your slot is still available in Purchased Slots.');
  },
  'form-preview':()=>{ if(!formValid(S.form)) return; S.form.step='preview'; renderOverlay(); },
  'form-edit':()=>{ S.form.step='form'; renderOverlay(); const ta=$id('qf-text'); ta&&ta.focus({preventScroll:true}); },
  'form-submit':()=>{ S.confirm=true; renderOverlay(); },
  'confirm-no':()=>{ S.confirm=false; renderOverlay(); },
  'confirm-yes':()=>submitQuestion(),
  'review-open':t=>{ S.rev={id:t.dataset.id,mode:'rate',stars:0,text:'',reason:''}; renderOverlay(); },
  'rev-close':()=>{ S.rev=null; renderOverlay(); },
  'rev-star':t=>{ S.rev.stars=+t.dataset.n; renderOverlay(); },
  'rev-to-dispute':()=>{ S.rev.mode='dispute'; renderOverlay(); },
  'rev-to-rate':()=>{ S.rev.mode='rate'; renderOverlay(); },
  'rev-rate':()=>{ const r=S.rev, x=QUESTIONS.find(q=>q.id===r.id); if(!x||!r.stars) return;
    x.review={stars:r.stars,text:r.text.trim(),date:new Date()}; x.status='completed'; S.rev=null; renderOverlay(); renderPanel(); toast('Thank you. Your rating was saved and the question is completed.'); },
  'rev-dispute':()=>{ const r=S.rev, x=QUESTIONS.find(q=>q.id===r.id); if(!x||!r.reason.trim()) return;
    x.dispute={date:new Date(),reason:r.reason.trim()}; x.status='disputed'; S.rev=null; renderOverlay(); renderPanel(); toast('Dispute raised. Support will review it.'); },
  'set-lang':t=>{ S.form.lang=t.dataset.v; t.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-checked',b===t)); updateFormState(); },
  'set-who':t=>{
    const f=S.form, v=t.dataset.v; if(f.who===v) return;
    f.who=v; f.adding=false; f.npErr=''; f.np=blankNP();
    f.personId = v==='self' ? ME.id : null;
    t.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-checked',b===t));
    dropDuplicateAtt(); rerenderPeople();
  },
  'pick-person':t=>{ S.form.personId=t.dataset.id; dropDuplicateAtt(); rerenderPeople(); focusSame(`#qf-people [data-id="${t.dataset.id}"]`); },
  'addp-open':()=>{ S.form.adding=true; rerenderPeople(); const el=$id('np-name'); el&&el.focus(); },
  'addp-cancel':()=>{ const f=S.form; f.adding=false; f.np=blankNP(); f.npErr=''; rerenderPeople(); },
  'addp-save':()=>{
    const f=S.form, n=f.np;
    if(!n.name.trim()||!n.rel.trim()||!n.dob||(!n.time&&!n.unknown)||!n.place.trim()||!n.gender){ f.npErr='Fill in all details. Tick “Birth time unknown” if you don’t know the time.'; rerenderPeople(); return; }
    const h={id:'h'+(hSeq++),name:n.name.trim(),rel:n.rel.trim(),group:f.who,dob:n.dob,time:n.unknown?'':n.time,place:n.place.trim(),gender:n.gender};
    if(n.save) SAVED.push(h); else { h.temp=true; f.temp.push(h); }
    f.personId=h.id; f.adding=false; f.np=blankNP(); f.npErr='';
    rerenderPeople();
    toast(n.save?`${h.name} added to your saved horoscopes.`:`${h.name} added for this question only.`);
  },
  'att-upload':()=>{ S.form.replaceIdx=null; const i=$id('qf-file'); i&&i.click(); },
  'att-saved':()=>{ S.form.picker='new'; rerenderAtt(); },
  'att-picker-cancel':()=>{ S.form.picker=null; rerenderAtt(); },
  'att-pick':t=>{
    const f=S.form, h=personById(f,t.dataset.id), item={saved:true,hid:h.id,name:'Horoscope of '+h.name};
    if(typeof f.picker==='number') f.files[f.picker]=item; else if(f.files.length<2) f.files.push(item);
    f.picker=null; rerenderAtt();
  },
  'att-replace':t=>{
    const f=S.form, i=+t.dataset.i;
    if(f.files[i].saved){ f.picker=i; rerenderAtt(); }
    else { f.replaceIdx=i; const inp=$id('qf-file'); inp&&inp.click(); }
  },
  'att-remove':t=>{ S.form.files.splice(+t.dataset.i,1); S.form.picker=null; rerenderAtt(); },
  lightbox:t=>{ S.lb={i:+t.dataset.img,name:t.dataset.name}; renderOverlay(); },
  'lb-close':()=>{ S.lb=null; renderOverlay(); },
  'view-q':()=>{ const id=S.form.qid; S.form=null; renderOverlay(); S.tab='questions'; S.mq={q:'',status:'',cat:'',date:''}; S.openQ.add(id); renderPanel(); const el=root.querySelector(`.q-row[data-id="${id}"]`); el&&el.scrollIntoView({behavior:'smooth',block:'center'}); }
};
function dropDuplicateAtt(){ const f=S.form; if(f.personId) f.files=f.files.filter(x=>!(x.saved&&x.hid===f.personId)); }
function afterCampChange(id,ctx,sel){
  if(ctx==='p'){ refreshApc(C(id).astro); focusSame(`#apc-buy ${sel}`); }
  else { refreshCamp(id); focusSame(`#camp-b-${id} ${sel}`); }
}
function focusSame(sel){ const el=root.querySelector(sel); el&&!el.disabled&&el.focus({preventScroll:true}); }
function toggleRow(t,set){
  const row=t.closest('.row'), id=t.dataset.id, open=!set.has(id);
  open?set.add(id):set.delete(id);
  row.classList.toggle('open',open); t.setAttribute('aria-expanded',open);
}
on('click',e=>{
  const t=e.target.closest('[data-action]');
  if(t){ if(t.disabled) return; const f=act[t.dataset.action]; if(f){ e.preventDefault(); f(t,e); } return; }
  if(e.target.classList&&e.target.classList.contains('lb')){ act['lb-close'](); return; }
  const scrim=e.target.classList&&e.target.classList.contains('scrim')&&e.target.dataset.scrim;
  if(scrim && !S.confirm){
    if(scrim==='form-close' && S.form && S.form.step!=='done' && S.form.text.trim()) return;
    const f=act[scrim]; f&&f(e.target);
  }
});
function npInput(el){
  const k=el.dataset.np, f=S.form;
  if(el.type==='checkbox'){ f.np[k]=el.checked; if(k==='unknown'){ const ti=$id('np-time'); if(ti){ ti.disabled=el.checked; if(el.checked){ ti.value=''; f.np.time=''; } } } }
  else f.np[k]=el.value;
}
on('input',e=>{
  const id=e.target.id;
  if(id==='rev-text'&&S.rev){ S.rev.text=e.target.value; return; }
  if(id==='rev-reason'&&S.rev){ S.rev.reason=e.target.value; const b=root.querySelector('[data-action="rev-dispute"]'); if(b) b.disabled=!e.target.value.trim(); return; }
  if(id==='mq-q'){ S.mq.page=1; S.mq.q=e.target.value; renderMQList(); }
  else if(id==='ps-q'){ S.ps.q=e.target.value; renderPSList(); }
  else if(id==='qf-text'){
    S.form.text=e.target.value.slice(0,1000);
    const n=S.form.text.length, c=$id('qf-count');
    c.textContent=`${n.toLocaleString('en-IN')} / 1,000`; c.className='counter'+(n>=1000?' full':n>=900?' near':'');
    updateFormState();
  }
  else if(e.target.dataset.np && e.target.type!=='checkbox'){ npInput(e.target); }
});
on('change',e=>{
  const id=e.target.id, v=e.target.value;
  if(id==='mq-status'){S.mq.page=1;S.mq.status=v;renderMQList();}
  else if(id==='mq-cat'){S.mq.page=1;S.mq.cat=v;renderMQList();}
  else if(id==='mq-date'){S.mq.page=1;S.mq.date=v;renderMQList();}
  else if(id==='ps-status'){S.ps.status=v;renderPSList();}
  else if(id==='ps-type'){S.ps.type=v;renderPSList();}
  else if(id==='pay-fail'){ if(S.pay) S.pay.fail=e.target.checked; }
  else if(e.target.dataset.np){ npInput(e.target); }
  else if(id==='qf-file'){
    const f=S.form, file=e.target.files[0]; e.target.value='';
    if(!file) return;
    if(!/^image\/(jpeg|png|webp)$/.test(file.type)){ toast('Please choose a JPG, PNG or WebP image.'); return; }
    if(file.size>5*1048576){ toast('Images must be 5 MB or smaller.'); return; }
    const r=new FileReader();
    r.onload=()=>{
      const item={name:file.name,size:file.size>1048576?(file.size/1048576).toFixed(1)+' MB':Math.max(1,Math.round(file.size/1024))+' KB',src:r.result};
      if(f.replaceIdx!==null && f.files[f.replaceIdx]) f.files[f.replaceIdx]=item; else if(f.files.length<2) f.files.push(item);
      f.replaceIdx=null; rerenderAtt();
    };
    r.readAsDataURL(file);
  }
});
onDoc('keydown',e=>{
  if(e.key!=='Escape') return;
  if(S.lb){ act['lb-close'](); }
  else if(S.rev){ act['rev-close'](); }
  else if(S.confirm){ S.confirm=false; renderOverlay(); }
  else if(S.pay && S.pay.status!=='processing'){ S.pay.status==='success'&&S.pay.kind==='slots'?act['pay-later']():closePay(); }
  else if(S.form && !(S.form.step==='form'&&S.form.text.trim())){ act['form-close'](); }
});

renderPanel();

return ()=>{ cleanups.forEach(f=>f()); clearTimeout(toast.t); document.body.classList.remove('no-scroll'); };
}
