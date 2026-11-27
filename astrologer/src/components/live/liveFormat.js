import { TODAY, dt } from '@/lib/format.js';

// Formatting helpers shared by the Live screens (reference style: "18 Oct 2026, 7:00 pm").
export const fmtWhen = (iso) => dt(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
export const fmtLong = (iso) => dt(iso).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
export const monthName = (k) => dt(`${k}-01T00:00`).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
export const thisMonthName = () => TODAY.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
export const nextMonthStart = () => new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 1).toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
export const NA = 'Not available';
