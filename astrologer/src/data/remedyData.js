// Illustrative sample data only — Remedy Tracker (spec 17_REMEDY_TRACKER.md, AD-174 – AD-178).
// Sample values come from the reference prototype ("Remedy Tracker"). The Users, assignments and
// Platform templates below are samples, not real records; Platform templates are provided by
// Platform Admin and read-only here. Real Users' daily updates and photos come from the User App.

import { TODAY, addD, plural, nowT } from '@/lib/remedyModel.js';

export { TODAY };
export const SERVICES = { text: 'Text Questions', appt: 'Appointments', chat: 'Instant Chat', call: 'Instant Call' };
export const TONES = ['tone-saffron', 'tone-teal', 'tone-rose', 'tone-gold', 'tone-indigo'];
export const TIMES = ['06:42', '19:15', '07:05', '18:30', '21:10', '06:55', '20:20'];
export const CATEGORIES = ['Homam', 'Pooja', 'Parihara', 'Mantra'];

function cloneList(l) { return l.map((x) => ({ ...x })); }

export const TEMPLATES = [
{id:'t1',name:'Ganapathi Homam',category:'Homam',duration:7,tone:'tone-saffron',short:'Removes obstacles before new beginnings and invokes Lord Ganesha’s blessings.',description:'A sacred fire ritual dedicated to Lord Ganesha, traditionally performed before important beginnings such as a new home, business or venture. Best begun on a Chaturthi or a Wednesday morning.',materials:[['Pure ghee','250 g'],['Durva grass','21 blades daily'],['Modakam','5 pieces'],['Coconut','1'],['Camphor','1 pack'],['Red hibiscus flowers','As available']],steps:[['Prepare the space','Clean the pooja area at sunrise and draw a simple kolam at the entrance.'],['Light the lamp','Light a ghee lamp facing east and offer a short prayer of intent.'],['Chant the mantra','Chant “Om Gam Ganapataye Namaha” 108 times using a mala.'],['Make the offering','Offer durva grass, red flowers and modakam to Lord Ganesha.'],['Conclude with aarti','Perform aarti with camphor and share the prasadam with family.']]},
{id:'t2',name:'Navagraha Pooja',category:'Pooja',duration:9,tone:'tone-teal',short:'Balances the influence of all nine planets in the birth chart.',description:'A comprehensive pooja to the nine celestial deities, recommended when several planets are weak or afflicted. Each day honours the Navagrahas together, with attention to the ruling planet of the day.',materials:[['Navadhanyam (nine grains)','1 set'],['Sesame oil','200 ml'],['Nine coloured cloth pieces','1 set'],['Fresh flowers','Daily'],['Agarbathi','1 pack']],steps:[['Arrange the Navagrahas','Place the Navagraha yantra or picture on a clean cloth facing east.'],['Light the lamp','Light a sesame oil lamp and offer agarbathi.'],['Recite the stotram','Recite the Navagraha stotram once, slowly and clearly.'],['Offer the grains','Offer a small portion of navadhanyam with flowers.'],['Pradakshina','Complete nine pradakshinas around the pooja space or temple shrine.']]},
{id:'t3',name:'Rahu Ketu Pariharam',category:'Parihara',duration:10,tone:'tone-indigo',short:'Eases Rahu–Ketu dosha; traditionally performed during Rahu Kalam.',description:'A parihara for the shadow planets Rahu and Ketu, recommended during Rahu or Ketu dasa or when Kala Sarpa dosha is indicated. Perform daily during Rahu Kalam.',materials:[['Black gram (urad dal)','250 g'],['Dark blue cloth','1 piece'],['Sesame oil lamp','1'],['Durva grass','Daily'],['Milk for abhishekam','Small quantity']],steps:[['Begin in Rahu Kalam','Check the day’s Rahu Kalam and begin within that window.'],['Light the lamp','Light a sesame oil lamp near a Naga idol or picture.'],['Chant the mantras','Chant the Rahu and Ketu beeja mantras 108 times each.'],['Offer urad dal','Offer black gram and durva grass with a short prayer.'],['Daanam on the last day','On the final day, donate urad dal and a dark blue cloth.']]},
{id:'t4',name:'Sani Pariharam',category:'Parihara',duration:7,tone:'tone-indigo',short:'Reduces Saturn’s challenging influence; best started on a Saturday.',description:'A gentle parihara for Sani during Ezharai Sani, Ashtama Sani or Sani dasa. Emphasises discipline, service and simple daily offerings at sunset.',materials:[['Sesame oil','200 ml'],['Black sesame seeds','100 g'],['Blue flowers','Daily'],['Iron or clay lamp','1']],steps:[['Light the lamp at sunset','Light a sesame oil lamp at sunset facing west.'],['Chant the mantra','Chant “Om Sham Shanaischaraya Namaha” 108 times.'],['Offer sesame','Offer black sesame seeds and blue flowers.'],['Seva','Feed crows or donate food to someone in need.']]},
{id:'t5',name:'Guru Peyarchi Pooja',category:'Pooja',duration:5,tone:'tone-gold',short:'Seeks Jupiter’s blessings during the Guru transit.',description:'Performed around Guru Peyarchi for those whose rasi is affected by the transit. Thursdays are ideal for beginning, with yellow offerings throughout.',materials:[['Yellow cloth','1 piece'],['Chana dal','100 g'],['Yellow flowers','Daily'],['Turmeric','1 small pack'],['Ghee lamp','1']],steps:[['Dress in yellow','Wear yellow or keep a yellow cloth at the altar.'],['Light the ghee lamp','Light the lamp and offer turmeric and yellow flowers.'],['Recite the Guru stotram','Recite the Brihaspati stotram once.'],['Offer chana dal','Offer chana dal and seek the blessings of elders.']]},
{id:'t6',name:'Surya Pariharam',category:'Mantra',duration:7,tone:'tone-saffron',short:'Strengthens the Sun for health, confidence and recognition.',description:'A sunrise practice for a weak or afflicted Sun. Daily arghya and recitation of the Aditya Hridayam build steadiness and vitality.',materials:[['Copper vessel','1'],['Water with red flowers','Daily'],['Red sandalwood','Small quantity'],['Jaggery','100 g']],steps:[['Wake before sunrise','Bathe and be ready before sunrise.'],['Offer arghya','Offer water from the copper vessel to the rising Sun.'],['Recite Aditya Hridayam','Recite the Aditya Hridayam once, facing east.'],['Offer jaggery','Offer jaggery and share it as prasadam.']]},
{id:'t7',name:'Mangal Dosha Nivarana',category:'Parihara',duration:7,tone:'tone-rose',short:'Calms Mars-related dosha, often recommended before marriage.',description:'A parihara for Chevvai dosha. Begin on a Tuesday, with worship of Lord Murugan and offerings of red lentils and flowers.',materials:[['Red cloth','1 piece'],['Red lentils (masoor dal)','200 g'],['Red flowers','Daily'],['Ghee lamp','1']],steps:[['Begin on a Tuesday','Start the parihara on a Tuesday morning.'],['Worship Lord Murugan','Light a ghee lamp before Lord Murugan.'],['Chant the mantra','Chant “Om Angarakaya Namaha” 108 times.'],['Offer red lentils','Offer red lentils and red flowers.']]},
{id:'t8',name:'Lakshmi Kubera Pooja',category:'Pooja',duration:5,tone:'tone-gold',short:'Invites prosperity and stability at home and work.',description:'An evening pooja to Goddess Lakshmi and Lord Kubera for financial stability. Keep the entrance clean and lamps lit at dusk throughout.',materials:[['Lotus or rose flowers','Daily'],['Kumkum','1 pack'],['Coins','9'],['Ghee lamps','2'],['Sweet pongal','Small portion daily']],steps:[['Clean the entrance','Clean the entrance and draw a kolam before dusk.'],['Light lamps at dusk','Light two ghee lamps at the entrance and altar.'],['Chant the mantra','Chant the Lakshmi Kubera mantra 108 times.'],['Offer naivedyam','Offer sweet pongal, flowers and coins.']]}
].map(t=>Object.assign({},t,{materials:t.materials.map(m=>({name:m[0],qty:m[1]})),steps:t.steps.map(x=>({title:x[0],detail:x[1]}))}));

export function seedMethods(){
  const T = id=>TEMPLATES.find(t=>t.id===id);
  const fromT = (id,tid,o)=>{ const t = T(tid); const m = Object.assign({id,name:t.name,category:t.category,duration:t.duration,short:t.short,description:t.description,materials:cloneList(t.materials),steps:cloneList(t.steps),notes:'',source:'template',templateId:tid,templateName:t.name,status:'active',image:null,tone:t.tone},o); m.edited = o.edited||o.created; return m; };
  return [
    fromT('m1','t1',{created:'2026-03-12',edited:'2026-11-20',image:'img1',notes:'For working professionals, the chant can be shortened to 54 times on weekdays.'}),
    fromT('m2','t2',{created:'2026-04-02'}),
    fromT('m3','t3',{created:'2026-05-18'}),
    fromT('m4','t4',{created:'2026-06-07',source:'me',templateId:null,templateName:null,notes:'Begin on a Saturday. Keep the practice simple and consistent.'}),
    fromT('m5','t5',{created:'2026-09-01',name:'Guru Peyarchi Pariharam'}),
    fromT('m6','t6',{created:'2026-07-21',source:'me',templateId:null,templateName:null,image:'img3'}),
    {id:'m7',name:'Chandra Shanti Japam',category:'Mantra',duration:10,short:'Calms the mind and strengthens a weak Moon.',description:'A Monday-evening japa for emotional steadiness when the Moon is weak or afflicted. Ideally completed on a Pournami.',materials:[{name:'White flowers',qty:'Daily'},{name:'Raw rice',qty:'100 g'},{name:'Silver or white vessel with water',qty:'1'}],steps:[{title:'Evening preparation',detail:'Bathe and sit facing north-west after sunset.'},{title:'Chant the mantra',detail:'Chant “Om Somaya Namaha” 108 times.'},{title:'Offer white flowers',detail:'Offer white flowers and raw rice.'}],notes:'',source:'me',templateId:null,templateName:null,status:'active',image:null,tone:'tone-indigo',created:'2026-02-10',edited:'2026-02-10'},
    fromT('m8','t8',{created:'2026-11-20',image:'img2'}),
    {id:'m9',name:'Hanuman Chalisa Parayanam',category:'Mantra',duration:11,short:'Builds courage and protection through daily recitation.',description:'Eleven days of Hanuman Chalisa recitation for courage, protection and relief from fear. Tuesdays and Saturdays are ideal for starting.',materials:[{name:'Sindoor',qty:'1 pack'},{name:'Jasmine oil lamp',qty:'1'},{name:'Bananas',qty:'Daily'}],steps:[{title:'Light the lamp',detail:'Light a lamp before Lord Hanuman.'},{title:'Recite the Chalisa',detail:'Recite the Hanuman Chalisa 11 times.'},{title:'Offer naivedyam',detail:'Offer bananas and share them as prasadam.'}],notes:'',source:'me',templateId:null,templateName:null,status:'archived',image:null,tone:'tone-rose',created:'2026-01-15',edited:'2026-09-30'},
    fromT('m10','t7',{created:'2026-11-25',status:'draft'})
  ];
}

export const USERS = [['u1','Priya S','AC-U-48213'],['u2','Kumar R','AC-U-39107'],['u3','Divya M','AC-U-51264'],['u4','Arun K','AC-U-27731'],['u5','Meena P','AC-U-44019'],['u6','Lakshmi N','AC-U-33582'],['u7','Vignesh T','AC-U-50876'],['u8','Sathya R','AC-U-41290'],['u9','Karthik S','AC-U-46655'],['u10','Anitha V','AC-U-52318'],['u11','Ramesh B','AC-U-30944'],['u12','Deepa K','AC-U-47720'],['u13','Gowtham P','AC-U-52041'],['u14','Suresh M','AC-U-21876'],['u15','Bhavani S','AC-U-18342'],['u16','Harish V','AC-U-49903'],['u17','Revathi J','AC-U-50122'],['u18','Senthil K','AC-U-52677'],['u19','Nandhini R','AC-U-52790']].map(x=>({id:x[0],name:x[1],ref:x[2]}));

export const SEED = [
 {id:'AS-2041',u:'u1',m:'m1',sv:'text',as:'2026-11-21',st:'2026-11-24',dur:5,logs:'cc',instr:'Shorter 5-day course. Perform at sunrise facing east and keep the lamp lit through the full chant.',note:'Priya travels for work next week, so the course is shortened to 5 days.',notes:[['2026-11-26','10:20','Follow up with the User next week about the missed Day 3.']]},
 {id:'AS-1876',u:'u1',m:'m1',sv:'appt',as:'2026-09-02',st:'2026-09-03',dur:7,logs:'ccccccc',fin:{d:'2026-09-09',t:'19:48',ph:[['Homam setup on the final day','tone-saffron',0],['Modakam offering','tone-gold',0],['Lotus and durva offering','tone-rose',1]],note:'Completed all seven days with my family. Felt very peaceful. Thank you, Guruji.'}},
 {id:'AS-2003',u:'u2',m:'m1',sv:'appt',as:'2026-11-08',st:'2026-11-10',dur:7,logs:'ccccccc',fin:{d:'2026-11-16',t:'20:05',ph:[['Final day homam','tone-saffron',0],['Prasadam for the family','tone-gold',0]],note:''}},
 {id:'AS-2050',u:'u3',m:'m1',sv:'chat',as:'2026-11-26',st:'2026-11-27',dur:3,logs:''},
 {id:'AS-2032',u:'u4',m:'m1',sv:'call',as:'2026-11-14',st:'2026-11-15',dur:5,logs:'cs',stop:{d:'2026-11-19',reason:'User is travelling abroad for work; will reassign after return.'}},
 {id:'AS-2022',u:'u5',m:'m1',sv:'text',as:'2026-11-23',st:'2026-11-24',dur:7,logs:'',notes:[['2026-11-26','18:02','No update for 3 days. Call before the next appointment.']]},
 {id:'AS-1990',u:'u6',m:'m2',sv:'call',as:'2026-10-30',st:'2026-11-01',dur:9,logs:'ccscccccc',fin:{d:'2026-11-09',t:'21:12',ph:[],note:'Missed Day 3 due to a family function, completed the rest.'}},
 {id:'AS-2015',u:'u7',m:'m2',sv:'text',as:'2026-11-17',st:'2026-11-18',dur:10,dur0:7,durCh:'2026-11-21',logs:'cccccsccc',notes:[['2026-11-21','11:40','Extended to 10 days after the follow-up call. User requested additional guidance.']]},
 {id:'AS-2011',u:'u8',m:'m4',sv:'appt',as:'2026-11-11',st:'2026-11-12',dur:7,logs:'ccccccc',notes:[['2026-11-20','09:15','Remind the User to submit final completion.']]},
 {id:'AS-2027',u:'u9',m:'m3',sv:'chat',as:'2026-11-19',st:'2026-11-20',dur:10,logs:'ccc-cc'},
 {id:'AS-2060',u:'u10',m:'m5',sv:'text',as:'2026-11-27',st:'2026-12-03',dur:5,logs:''},
 {id:'AS-1958',u:'u11',m:'m3',sv:'appt',as:'2026-10-10',st:'2026-10-20',dur:10,logs:'',cancel:{d:'2026-10-14',reason:'User rescheduled the consultation; will reassign after Deepavali.'}},
 {id:'AS-2038',u:'u12',m:'m6',sv:'call',as:'2026-11-18',st:'2026-11-19',dur:7,logs:'ccccccc',fin:{d:'2026-11-25',t:'07:30',ph:[['Surya arghya at sunrise','tone-gold',0],['Copper vessel and red flowers','tone-rose',1],['Aditya Hridayam recital','tone-saffron',0],['Jaggery offering','tone-teal',0]],note:'Did arghya every morning before 6:30. Photos from the last day and a few earlier ones.'}},
 {id:'AS-2044',u:'u13',m:'m6',sv:'text',as:'2026-11-24',st:'2026-11-25',dur:3,logs:'cc'},
 {id:'AS-1802',u:'u14',m:'m9',sv:'appt',as:'2026-08-02',st:'2026-08-04',dur:11,logs:'ccccccccccc',fin:{d:'2026-08-14',t:'19:00',ph:[],note:''}},
 {id:'AS-1712',u:'u15',m:'m7',sv:'chat',as:'2026-06-29',st:'2026-07-01',dur:10,logs:'cccccccccc',fin:{d:'2026-07-10',t:'20:40',ph:[['Final day japam setup','tone-indigo',1]],note:'Completed on Pournami.'}},
 {id:'AS-2019',u:'u16',m:'m4',sv:'text',as:'2026-11-21',st:'2026-11-22',dur:5,logs:'ccscc'},
 {id:'AS-2008',u:'u2',m:'m3',sv:'text',as:'2026-11-06',st:'2026-11-08',dur:10,logs:'cccccccccc',fin:{d:'2026-11-17',t:'18:10',ph:[['Naga shrine offering','tone-indigo',0],['Daanam on the final day','tone-teal',1]],note:'Donated urad dal and cloth at the temple on the last day.'}},
 {id:'AS-2029',u:'u17',m:'m2',sv:'chat',as:'2026-11-19',st:'2026-11-20',dur:9,logs:'cccc-cc'}
];

export function snap(m,date){ return {name:m.name,category:m.category,short:m.short,description:m.description,materials:cloneList(m.materials),steps:cloneList(m.steps),defaultDuration:m.duration,takenOn:date}; }
export function addAct(a,k,text,d,t){ return Object.assign({},a,{activity:a.activity.concat([{d:d||TODAY,t:t||nowT(),k,text}])}); }

export function seedA(s,methods){
  const m = methods.find(x=>x.id===s.m);
  const logs = {};
  for(let i=0;i<s.logs.length;i++){ const ch = s.logs[i]; if(ch==='c'||ch==='s') logs[i] = {s:ch==='c'?'completed':'skipped',d:addD(s.st,i),t:TIMES[i%TIMES.length]}; }
  const act = [{d:s.as,t:'10:30',k:'create',text:'Assignment created · '+(s.dur0||s.dur)+' days via '+SERVICES[s.sv]}];
  Object.keys(logs).forEach(i=>{ const l = logs[i]; act.push({d:l.d,t:l.t,k:l.s,text:'User marked Day '+(+i+1)+' as '+(l.s==='completed'?'Completed':'Skipped')}); });
  if(s.dur0) act.push({d:s.durCh,t:'11:35',k:'edit',text:'Duration changed from '+s.dur0+' to '+s.dur+' days · recorded days preserved'});
  if(s.fin){ act.push({d:s.fin.d,t:s.fin.t,k:'final',text:'Final completion submitted · '+(s.fin.ph.length?plural(s.fin.ph.length,'photo'):'no photos')}); }
  if(s.stop) act.push({d:s.stop.d,t:'16:20',k:'stop',text:'Remedy stopped by you · '+s.stop.reason});
  if(s.cancel) act.push({d:s.cancel.d,t:'12:10',k:'cancel',text:'Assignment cancelled · '+s.cancel.reason});
  return {id:s.id,userId:s.u,methodId:s.m,service:s.sv,assigned:s.as,start:s.st,duration:s.dur,logs,
    final:s.fin?{d:s.fin.d,t:s.fin.t,note:s.fin.note,photos:s.fin.ph.map((p,j)=>({id:s.id+'-p'+j,caption:p[0],tone:p[1],lotus:!!p[2]}))}:null,
    stopped:s.stop||null,cancelled:s.cancel||null,
    instructions:s.instr||m.description,astroNote:s.note||'',
    notes:(s.notes||[]).map((n,j)=>({id:s.id+'-n'+j,d:n[0],t:n[1],text:n[2]})),
    activity:act,followUp:s.id==='AS-2022',snapshot:snap(m,s.as)};
}


// Sample remedy images (placeholders — a method image the astrologer adds comes from their device).
export const IMGS = [
  { key: 'img1', file: 'ganapathi_altar.jpg', size: '2.4 MB', tone: 'tone-saffron', lotus: false },
  { key: 'img2', file: 'lotus_offering.jpg', size: '1.8 MB', tone: 'tone-rose', lotus: true },
  { key: 'img3', file: 'temple_lamp.jpg', size: '3.1 MB', tone: 'tone-gold', lotus: false },
  { key: 'img4', file: 'navagraha_mandala.jpg', size: '2.0 MB', tone: 'tone-teal', lotus: true },
];
/** A method image as {url?, tone, lotus, file, size}: a sample key (img1…) or an image from the device. */
export const imgOf = (im) => (typeof im === 'string' ? IMGS.find((x) => x.key === im) || null : im || null);
