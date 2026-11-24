// Sample data copied unchanged from the reference HTML (reference/web-view.html).
export const GR=['var(--acc2),#5a3cc0','var(--acc),#7a54e6','var(--gold),#c47a1d','#4cd585,#1f8a52','#e8a0ff,#8a3cc0','#7cc4ff,#3c64c0'];
export const ASTRO=[
{id:0,name:'Meenakshi Iyer',spec:'Vedic · Marriage & Family',langs:'Tamil, English',online:true,cats:['Vedic'],bio:'Horoscope reading with a focus on relationships and family decisions.'},
{id:1,name:'Arvind Nair',spec:'KP · Career & Finance',langs:'Malayalam, English',online:true,cats:['KP','Vedic'],bio:'Career timing and finance questions answered with clear next steps.'},
{id:2,name:'Lakshmi Varma',spec:'Tarot · Guidance',langs:'Hindi, English',online:false,cats:['Tarot'],bio:'Intuitive tarot sessions for everyday decisions.'},
{id:3,name:'Karthik Subramanian',spec:'Numerology',langs:'Tamil, English',online:true,cats:['Numerology'],bio:'Name and date-based numerology guidance.'},
{id:4,name:'Sunita Deshmukh',spec:'Vastu · Home & Office',langs:'Marathi, Hindi',online:false,cats:['Vastu'],bio:'Space and direction advice for homes and workplaces.'},
{id:5,name:'Rahul Menon',spec:'Palmistry',langs:'Malayalam, English',online:true,cats:['Palmistry'],bio:'Palm reading with practical interpretation.'},
{id:6,name:'Vasanthi Raghavan',spec:'Vedic · Health & Wellbeing',langs:'Tamil, English',online:true,cats:['Vedic'],bio:'Gentle guidance on health routines and wellbeing using the birth chart.'},
{id:7,name:'Tarun Verma',spec:'Lal Kitab · Remedies',langs:'Hindi, Punjabi, English',online:true,cats:['Vedic'],bio:'Simple, practical remedies explained step by step.'},
{id:8,name:'Anjali Pillai',spec:'Prashna · Quick Answers',langs:'Malayalam, English',online:false,cats:['KP'],bio:'Short, focused answers to a single pressing question.'},
{id:9,name:'Mohan Krishnan',spec:'Jaimini · Career',langs:'Tamil, Telugu, English',online:true,cats:['Vedic'],bio:'Career direction and timing using the Jaimini system.'}];
export const CATS=['All','Vedic','KP','Tarot','Numerology','Vastu','Palmistry'];
// Sample campaigns: prices, discounts and expiry are sample values (P-06-13 is still open).
export const CAMPS=[
{id:'open',name:'Open Question',note:'Ask without a campaign',general:{price:129,disc:0},personal:{price:179,disc:0},daysLeft:null},
{id:'c1',name:'Quick Answer',note:'Short, focused reply',general:{price:99,disc:0},personal:{price:149,disc:20},daysLeft:30},
{id:'c2',name:'Detailed Reading',note:'In-depth written answer',general:{price:199,disc:10},personal:{price:299,disc:25},daysLeft:2},
{id:'c3',name:'Festival Special',special:'Special Campaign · Festival',note:'Occasion-based offer',general:{price:149,disc:30},personal:null,daysLeft:20}];
// Local time of day, `days` from today (used for the sample appointment history).
const apptAt=(days,h,m)=>{const t=new Date(Date.now()+days*86400000);t.setHours(h,m,0,0);return t.getTime();};
export const ACTS0=[
{id:1,type:'Question',kind:'General',astro:0,who:'Meenakshi Iyer',when:'2 days ago',title:'Will a job change this year work out for me?',submittedAt:Date.now()-3*86400000,openedAt:Date.now()-3*86400000+10000,answeredAt:Date.now()-2*86400000,answer:'Your chart shows a supportive period for change between March and June. Prepare early and avoid signing anything in the first week of April.',paid:99,camp:'Quick Answer',attachments:[{name:'job-timing-chart.pdf'},{name:'summary.txt'}],links:[{label:'Understanding dasha periods',url:'https://example.com/dasha'}]},
{id:6,type:'Question',kind:'Personal',astro:2,who:'Lakshmi Varma',when:'2 days ago',title:'I feel low on energy for a few weeks. Does my chart show a good window for recovery?',submittedAt:Date.now()-2*86400000,openedAt:Date.now()-2*86400000+10000,simStart:0,paid:149,camp:'Detailed Reading',consentAt:Date.now()-2*86400000},
{id:7,type:'Question',kind:'General',astro:0,who:'Meenakshi Iyer',when:'4 days ago',title:'When is a good time for marriage discussions to move forward?',submittedAt:Date.now()-6*86400000,openedAt:Date.now()-6*86400000+10000,answeredAt:Date.now()-4*86400000,answer:'The second half of next month looks favourable for family discussions. Keep the first meeting simple and unhurried.',paid:99,camp:'Open Question',rating:4,review:'Clear and kind.',dispute:{raisedAt:Date.now()-2*86400000,simStart:0,answeredAt:Date.now()-86400000,answer:'Here is more detail on the timing, with a clearer weekly outline.'}},
{id:8,type:'Question',kind:'General',astro:4,who:'Sunita Deshmukh',when:'Last month',title:'Is this a good direction for my new office entrance?',submittedAt:Date.now()-35*86400000,openedAt:null,simStart:0,paid:99,camp:'Quick Answer',cancelled:true},
{id:9,type:'Question',kind:'General',astro:1,who:'Arvind Nair',when:'3 weeks ago',title:'Is this the right time to accept the new role I was offered?',submittedAt:Date.now()-22*86400000,openedAt:Date.now()-22*86400000+10000,answeredAt:Date.now()-20*86400000,answer:'The offer looks well timed. Confirm the joining date in the second week of the month.',paid:99,camp:'Career & Education',rating:5,review:'Practical and clear.'},
{id:10,type:'Question',kind:'Personal',astro:0,who:'Meenakshi Iyer',when:'6 weeks ago',title:'Which period suits expanding my business into a second city?',submittedAt:Date.now()-44*86400000,openedAt:Date.now()-44*86400000+10000,answeredAt:Date.now()-41*86400000,answer:'The quarter after next is the stronger window. Start preparations early and avoid signing in the first week.',paid:250,camp:'Business & Finance',rating:4,consentAt:Date.now()-44*86400000},
{id:11,type:'Appointment',astro:0,who:'Meenakshi Iyer',when:'',title:'Voice consultation · 30 min',status:'Completed',start:apptAt(-3,10,0),dur:30,price:349,bookedAt:apptAt(-8,18,20),payVia:'Wallet',txn:'TXN-A1B2C3',sent:[],reschedCount:0,rating:5},
{id:12,type:'Appointment',astro:1,who:'Arvind Nair',when:'',title:'Voice consultation · 15 min',status:'Completed',start:apptAt(-7,16,0),dur:15,price:199,bookedAt:apptAt(-12,11,5),payVia:'UPI',txn:'TXN-D4E5F6',sent:[],reschedCount:1,rating:4},
{id:13,type:'Appointment',astro:3,who:'Karthik Subramanian',when:'',title:'Voice consultation · 30 min',status:'Cancelled · refunded',start:apptAt(-10,11,30),dur:30,price:349,bookedAt:apptAt(-15,9,40),payVia:'Wallet',txn:'TXN-G7H8I9',sent:[],reschedCount:0},
{id:14,type:'Appointment',astro:5,who:'Rahul Menon',when:'',title:'Voice consultation · 15 min',status:'Completed',start:apptAt(-14,18,30),dur:15,price:199,bookedAt:apptAt(-19,20,10),payVia:'Bank / card',txn:'TXN-J1K2L3',sent:[],reschedCount:0,rating:5},
{id:15,type:'Appointment',astro:2,who:'Lakshmi Varma',when:'',title:'Voice consultation · 30 min',status:'Astrologer no-show · refunded',start:apptAt(-20,14,0),dur:30,price:349,bookedAt:apptAt(-24,13,15),payVia:'Wallet',txn:'TXN-M4N5O6',sent:[],reschedCount:0},
{id:16,type:'Appointment',astro:0,who:'Meenakshi Iyer',when:'',title:'Voice consultation · 30 min',status:'Completed',start:apptAt(-32,10,30),dur:30,price:349,bookedAt:apptAt(-36,19,0),payVia:'UPI',txn:'TXN-P7Q8R9',sent:[],reschedCount:0,rating:4},
{id:17,type:'Appointment',astro:1,who:'Arvind Nair',when:'',title:'Voice consultation · 15 min',status:'Upcoming',start:apptAt(6,17,30),dur:15,price:199,bookedAt:apptAt(-1,12,0),payVia:'Wallet',txn:'TXN-S1T2U3',sent:[],reschedCount:0},
{id:2,type:'Appointment',astro:1,who:'Arvind Nair',when:'Sat, 10:30 AM',title:'Career consultation',status:'Upcoming',start:Date.now()+3*86400000+3600000,dur:30,price:349,bookedAt:Date.now()-86400000,sent:[],reschedCount:0},
{id:3,type:'Call',who:'Karthik Subramanian',when:'Last week',title:'Instant Call · 12 min',status:'Completed'},
{id:4,type:'Chat',who:'Rahul Menon',when:'Last week',title:'Instant Chat · 9 min',status:'Completed'}];
export const ICON={Home:'M3 11 12 3l9 8M5 10v10h14V10',Explore:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5Z',Services:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',Activity:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',Profile:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c0-4 4-6 8-6s8 2 8 6'};

// Sample appointment prices per duration (voice only, 15 or 30 minutes - D-40). Values are samples.
export const APPT_PRICE={15:199,30:349};

// Sample prepaid packages for Instant Call / Instant Chat (minimum 5 minutes - D-45). Prices are samples.
export const PKGS={Call:[{mins:5,price:149},{mins:10,price:279},{mins:15,price:399}],Chat:[{mins:5,price:99},{mins:10,price:189},{mins:15,price:269}]};
// Sample astrologer behaviour when a request arrives (D-44): anything not listed accepts.
export const REQ_BEHAVIOR={1:'decline',3:'busy',5:'ignore'};

// Sample reviews (D-49): only Published reviews are shown and counted in the public rating.
export const REVIEWS=[
{id:1,astro:0,stars:5,text:'Clear, kind and specific. I knew exactly what to do next.',source:'Instant Chat'},
{id:2,astro:0,stars:4,text:'The appointment ran on time and the answers were thoughtful.',source:'Appointment'},
{id:3,astro:0,stars:5,text:'Detailed answer to my question, with a useful remedy.',source:'Text Question'},
{id:4,astro:0,stars:1,text:'Review hidden by the astrologer.',source:'Instant Call',status:'Hidden'},
{id:5,astro:1,stars:5,text:'Very practical career guidance.',source:'Appointment'},
{id:6,astro:1,stars:4,text:'Good timing advice for my job switch.',source:'Text Question'},
{id:7,astro:2,stars:4,text:'Gentle and insightful tarot reading.',source:'Text Question'},
{id:8,astro:3,stars:5,text:'Numerology made simple and accurate.',source:'Instant Call'},
{id:9,astro:3,stars:3,text:'Helpful, though the call was short.',source:'Instant Call'},
{id:10,astro:4,stars:5,text:'Great Vastu tips for my office layout.',source:'Appointment'},
{id:11,astro:5,stars:4,text:'Palm reading with practical interpretation.',source:'Instant Chat'},
{id:12,astro:6,stars:5,text:'Calm and caring advice for my daily routine.',source:'Appointment'},
{id:13,astro:6,stars:4,text:'Clear guidance on what to focus on this month.',source:'Text Question'},
{id:14,astro:7,stars:5,text:'The remedy steps were easy to follow.',source:'Text Question'},
{id:15,astro:7,stars:4,text:'Practical and to the point.',source:'Instant Chat'},
{id:16,astro:8,stars:4,text:'A quick answer when I needed one.',source:'Text Question'},
{id:17,astro:9,stars:5,text:'Very helpful on career timing.',source:'Appointment'},
{id:18,astro:9,stars:5,text:'Detailed and encouraging.',source:'Text Question'},
{id:19,astro:9,stars:3,text:'Good insight, call was a little rushed.',source:'Instant Call'}];

// Sample subscription tiers (D-31). Benefit questions are confirmed (1 / 3 / 4); prices and the term are
// sample values because price, duration, renewal and cancellation are on hold (P-14-02 to P-14-05).
export const TIERS=[{name:'Silver',price:199,benefit:1},{name:'Gold',price:449,benefit:3},{name:'Platinum',price:699,benefit:4}];
export const TIER_DAYS=30;
// Sample posts (D-50): General posts are open to everyone; Subscriber posts need an active subscription of a listed tier.
export const POSTS=[
{id:1,astro:0,kind:'General',title:'Mercury retrograde: what to expect',text:'A short, calm guide to communication and travel during the retrograde period.'},
{id:2,astro:0,kind:'Subscriber',tiers:['Silver','Gold','Platinum'],title:'Monthly rashi outlook',text:'Subscriber outlook for the coming month with focus areas for each moon sign.'},
{id:3,astro:1,kind:'General',title:'Choosing a good week to change jobs',text:'Simple timing pointers before you sign an offer.'},
{id:4,astro:1,kind:'Subscriber',tiers:['Gold','Platinum'],title:'Career timing deep dive',text:'Detailed dasha-based timing notes for Gold and Platinum subscribers.'},
{id:5,astro:2,kind:'General',title:'A card for the week',text:'One tarot card and a reflection prompt for the week ahead.'},
{id:6,astro:3,kind:'General',title:'Your name number, explained',text:'How a name number is calculated and what it suggests.'},
{id:7,astro:3,kind:'Subscriber',tiers:['Platinum'],title:'Lucky dates (Platinum)',text:'Personal lucky-date notes for Platinum subscribers.'},
{id:8,astro:4,kind:'General',title:'Entrance direction basics',text:'Why the direction of your front door matters in Vastu.'},
{id:9,astro:5,kind:'General',title:'Reading the heart line',text:'A beginner guide to the heart line in palmistry.'},
{id:10,astro:6,kind:'General',title:'Small daily habits and your chart',text:'Three simple habits that fit most charts.'},
{id:11,astro:7,kind:'General',title:'Lal Kitab basics',text:'A short introduction to Lal Kitab remedies.'},
{id:12,astro:9,kind:'General',title:'Career timing in Jaimini',text:'How the Jaimini system looks at career periods.'}];

// Sample profile facts shown on Explore cards (profile fields are not decided yet - P-05-01).
export const ASTRO_META={
0:{years:8,followers:'8.4K',exp:['Marriage','Family','Vedic']},
1:{years:12,followers:'6.2K',exp:['Career','Finance','KP']},
2:{years:5,followers:'1.2K',exp:['Tarot','Guidance']},
3:{years:9,followers:'2.8K',exp:['Name numbers','Lucky dates']},
4:{years:11,followers:'3.2K',exp:['Home','Office','Direction']},
5:{years:6,followers:'1.9K',exp:['Palm reading','Practical advice']},
6:{years:10,followers:'4.1K',exp:['Health','Wellbeing','Routines']},
7:{years:7,followers:'2.3K',exp:['Remedies','Lal Kitab']},
8:{years:4,followers:'900',exp:['Quick answers','Prashna']},
9:{years:13,followers:'5.6K',exp:['Career','Timing','Jaimini']}};

// Traits used to draw each astrologer's illustrated portrait (original artwork, no photos).
export const AVATARS={
0:{female:true,skin:'#c98f5a',shade:'#b57d4a',hair:'#1f1512',style:'long',beard:'none',bindi:true,earrings:true,outfit:'#8e2f4f',bg:['#6e4fd0','#3a2a86']},
1:{skin:'#b97c4a',shade:'#a56b3d',hair:'#1b1411',style:'short',beard:'mustache',glasses:true,outfit:'#3c6fa8',bg:['#2f9aa0','#1c5a73']},
2:{female:true,skin:'#d6a46c',shade:'#c39157',hair:'#2a1a14',style:'wavy',beard:'none',bindi:true,earrings:true,outfit:'#2f8a63',bg:['#e0a33d','#a8691d']},
3:{skin:'#a9693a',shade:'#965a30',hair:'#171210',style:'short',beard:'short',tilak:true,outfit:'#e27b22',bg:['#4cb583','#1f7a53']},
4:{female:true,skin:'#c48a56',shade:'#b07846',hair:'#2d211c',style:'bun',beard:'none',bindi:true,earrings:true,outfit:'#2a7f8f',bg:['#d9778f','#9a3f63']},
5:{skin:'#bf8450',shade:'#ab7342',hair:'#1c1512',style:'wavy',beard:'none',outfit:'#26356b',bg:['#7a8be0','#3d4aa0']},
6:{female:true,skin:'#b87c4c',shade:'#a56b3e',hair:'#201714',style:'long',beard:'none',glasses:true,bindi:true,outfit:'#d9692d',bg:['#e5895c','#b24a28']},
7:{skin:'#cf9760',shade:'#bb844f',hair:'#1a1310',style:'short',beard:'full',outfit:'#5a5148',bg:['#8d6bd8','#533a9e']},
8:{female:true,skin:'#dba76f',shade:'#c8945c',hair:'#2a1c16',style:'long',beard:'none',bindi:true,earrings:true,outfit:'#c75a8d',bg:['#e6b25a','#b9742c']},
9:{skin:'#9b6035',shade:'#88532d',hair:'#d9d6d0',style:'older',beard:'mustache',glasses:true,vibhuti:true,outfit:'#e8dfcf',bg:['#58a888','#2c6b57']}};
