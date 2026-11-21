// Sample data copied unchanged from the reference HTML (reference/web-view.html).
export const GR=['var(--acc2),#5a3cc0','var(--acc),#7a54e6','var(--gold),#c47a1d','#4cd585,#1f8a52','#e8a0ff,#8a3cc0','#7cc4ff,#3c64c0'];
export const ASTRO=[
{id:0,name:'Meenakshi Iyer',spec:'Vedic · Marriage & Family',langs:'Tamil, English',online:true,cats:['Vedic'],bio:'Sample profile text. Horoscope reading with a focus on relationships and family decisions.'},
{id:1,name:'Arvind Nair',spec:'KP · Career & Finance',langs:'Malayalam, English',online:true,cats:['KP','Vedic'],bio:'Sample profile text. Career timing and finance questions answered with clear next steps.'},
{id:2,name:'Lakshmi Varma',spec:'Tarot · Guidance',langs:'Hindi, English',online:false,cats:['Tarot'],bio:'Sample profile text. Intuitive tarot sessions for everyday decisions.'},
{id:3,name:'Karthik Subramanian',spec:'Numerology',langs:'Tamil, English',online:true,cats:['Numerology'],bio:'Sample profile text. Name and date-based numerology guidance.'},
{id:4,name:'Sunita Deshmukh',spec:'Vastu · Home & Office',langs:'Marathi, Hindi',online:false,cats:['Vastu'],bio:'Sample profile text. Space and direction advice for homes and workplaces.'},
{id:5,name:'Rahul Menon',spec:'Palmistry',langs:'Malayalam, English',online:true,cats:['Palmistry'],bio:'Sample profile text. Palm reading with practical interpretation.'}];
export const CATS=['All','Vedic','KP','Tarot','Numerology','Vastu','Palmistry'];
// Sample campaigns: prices, discounts and expiry are sample values (P-06-13 is still open).
export const CAMPS=[
{id:'open',name:'Open Question',note:'Ask without a campaign',general:{price:129,disc:0},personal:{price:179,disc:0},daysLeft:null},
{id:'c1',name:'Quick Answer',note:'Short, focused reply',general:{price:99,disc:0},personal:{price:149,disc:20},daysLeft:30},
{id:'c2',name:'Detailed Reading',note:'In-depth written answer',general:{price:199,disc:10},personal:{price:299,disc:25},daysLeft:2},
{id:'c3',name:'Festival Special',special:'Special Campaign · Festival',note:'Occasion-based offer',general:{price:149,disc:30},personal:null,daysLeft:20}];
export const ACTS0=[
{id:1,type:'Question',kind:'General',astro:0,who:'Meenakshi Iyer',when:'2 days ago',title:'Will a job change this year work out for me?',submittedAt:Date.now()-3*86400000,openedAt:Date.now()-3*86400000+10000,answeredAt:Date.now()-2*86400000,answer:'Sample answer: your chart shows a supportive period for change between March and June. Prepare early and avoid signing anything in the first week of April.',paid:99},
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
{id:4,astro:0,stars:1,text:'Sample review hidden by the astrologer.',source:'Instant Call',status:'Hidden'},
{id:5,astro:1,stars:5,text:'Very practical career guidance.',source:'Appointment'},
{id:6,astro:1,stars:4,text:'Good timing advice for my job switch.',source:'Text Question'},
{id:7,astro:2,stars:4,text:'Gentle and insightful tarot reading.',source:'Text Question'},
{id:8,astro:3,stars:5,text:'Numerology made simple and accurate.',source:'Instant Call'},
{id:9,astro:3,stars:3,text:'Helpful, though the call was short.',source:'Instant Call'},
{id:10,astro:4,stars:5,text:'Great Vastu tips for my office layout.',source:'Appointment'},
{id:11,astro:5,stars:4,text:'Palm reading with practical interpretation.',source:'Instant Chat'}];

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
{id:9,astro:5,kind:'General',title:'Reading the heart line',text:'A beginner guide to the heart line in palmistry.'}];
