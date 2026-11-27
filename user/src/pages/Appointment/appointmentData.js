// Sample (prototype) data and date/format helpers for the Appointment page.
// These methods use `this` and are mixed into the Appointment component.
export const apptHelpers = {
  iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); },
  parse(s) { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); },
  add(s, n) { const d = this.parse(s); d.setDate(d.getDate() + n); return this.iso(d); },
  diff(a, b) { return Math.round((this.parse(a) - this.parse(b)) / 86400000); },
  todayIso() { return this.iso(new Date()); },
  nowMin() { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); },
  dow() { return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; },
  mon() { return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; },
  monFull() { return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; },
  fShort(s) { const d = this.parse(s); return d.getDate() + ' ' + this.mon()[d.getMonth()]; },
  fDate(s) { const d = this.parse(s); return this.dow()[d.getDay()] + ', ' + d.getDate() + ' ' + this.mon()[d.getMonth()]; },
  fLong(s) { const d = this.parse(s); return this.dow()[d.getDay()] + ', ' + d.getDate() + ' ' + this.mon()[d.getMonth()] + ' ' + d.getFullYear(); },
  fTime(m) { let h = Math.floor(m / 60); const mm = m % 60; const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ':' + String(mm).padStart(2, '0') + ' ' + ap; },
  money(n) { return '₹' + Number(n).toLocaleString('en-IN'); },
  hash(str) { let h = 5381; for (let i = 0; i < str.length; i++) { h = ((h << 5) + h + str.charCodeAt(i)) | 0; } return Math.abs(h); },
  astroBase() {
    return [
      { id: 'a1', name: 'Pandit Raghav Iyer', init: 'RI', spec: 'Vedic Astrology · Career', rating: '4.8', following: true, durations: [{ min: 15, price: 300 }, { min: 30, price: 550 }], days: [1, 2, 3, 4, 5, 6], start: 600, end: 1200, leave: 0 },
      { id: 'a2', name: 'Meera Subramanian', init: 'MS', spec: 'KP Astrology · Relationships', rating: '4.6', following: true, durations: [{ min: 20, price: 400 }, { min: 40, price: 750 }, { min: 60, price: 1050 }], days: [0, 1, 2, 3, 4, 5], start: 1020, end: 1260, leave: 4 },
      { id: 'a3', name: 'Dr. Arvind Nair', init: 'AN', spec: 'Numerology · Vastu', rating: '4.9', following: false, durations: [{ min: 30, price: 600 }], days: [1, 3, 5], start: 540, end: 960, leave: 0 },
      { id: 'a4', name: 'Lakshmi Venkat', init: 'LV', spec: 'Tarot · Palmistry', rating: '4.5', following: false, durations: [{ min: 10, price: 200 }, { min: 15, price: 280 }], days: [0, 6], start: 660, end: 1080, leave: 0 }
    ];
  },
  baseAppts() {
    const T = this.todayIso(); const o = (n) => this.add(T, n);
    const e = { notes: null, remedies: null, attach: [], payMode: 'Wallet', payRef: null, resched: [], cancel: null, refund: null };
    const mk = (x) => Object.assign({}, e, x);
    return [
      mk({ id: 'AC-APT-2041', astro: 'a1', dateIso: o(2), time: 1080, dur: 30, status: 'booked', amount: 550, bookedOn: o(-3), bookedAt: 1005 }),
      mk({ id: 'AC-APT-2042', astro: 'a4', dateIso: o(2), time: 1200, dur: 10, status: 'booked', amount: 200, bookedOn: o(-1), bookedAt: 650 }),
      mk({ id: 'AC-APT-2038', astro: 'a3', dateIso: o(5), time: 660, dur: 30, status: 'booked', amount: 600, bookedOn: o(-6), bookedAt: 840, resched: [{ by: 'Astrologer', from: o(3), fromTime: 1080, reason: null }] }),
      mk({ id: 'AC-APT-2033', astro: 'a2', dateIso: o(12), time: 1140, dur: 40, status: 'booked', amount: 750, bookedOn: o(-2), bookedAt: 1230 }),
      mk({ id: 'AC-APT-2027', astro: 'a1', dateIso: o(-3), time: 1020, dur: 15, status: 'completed', amount: 300, bookedOn: o(-8), bookedAt: 780 }),
      mk({ id: 'AC-APT-2019', astro: 'a3', dateIso: o(-10), time: 600, dur: 30, status: 'completed', amount: 600, bookedOn: o(-16), bookedAt: 915, resched: [{ by: 'You', from: o(-12), fromTime: 600, reason: null }] }),
      mk({ id: 'AC-APT-2012', astro: 'a2', dateIso: o(-18), time: 1080, dur: 20, status: 'completed', amount: 400, bookedOn: o(-22), bookedAt: 1010 }),
      mk({ id: 'AC-APT-2016', astro: 'a4', dateIso: o(-7), time: 720, dur: 15, status: 'cancelled', amount: 280, bookedOn: o(-12), bookedAt: 700, cancel: { by: 'You', atIso: o(-9), atTime: 600, reason: null }, refund: { status: 'Refunded', amount: 280, ref: null } }),
      mk({ id: 'AC-APT-2007', astro: 'a2', dateIso: o(-14), time: 1140, dur: 20, status: 'cancelled', amount: 400, bookedOn: o(-19), bookedAt: 1100, cancel: { by: 'You', atIso: o(-16), atTime: 900, reason: null } }),
      mk({ id: 'AC-APT-2003', astro: 'a1', dateIso: o(-25), time: 660, dur: 30, status: 'noshow', amount: 550, bookedOn: o(-30), bookedAt: 890, refund: { status: 'Refunded', amount: 550, ref: null } })
    ];
  }
};
