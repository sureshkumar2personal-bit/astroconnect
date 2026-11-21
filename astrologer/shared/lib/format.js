// Shared formatters for the section pages (same output as the reference helpers).
export { TODAY, DAY, dt, fmtDate, fmtDateTime } from './textQuestions.js';
export { fmtTime, inr, isoDay, sameDay } from '../hooks/useAppointments.js';

/** "2 min ago" style label relative to the prototype's fixed today. */
export function ago(d, now) {
  const mins = Math.max(0, Math.round((now - (typeof d === 'string' ? new Date(d) : d)) / 6e4));
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h} hr${h > 1 ? 's' : ''} ago`;
  const days = Math.round(h / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

/** ₹ with two decimals when the amount has paise. */
export const inr2 = (n) => '₹' + Number(n).toLocaleString('en-IN', Number(n) % 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { maximumFractionDigits: 0 });
