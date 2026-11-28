import { useLayoutEffect, useRef, useState } from 'react';

/** Width of an element, kept up to date with ResizeObserver. */
export function useElementWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setWidth(Math.floor(el.getBoundingClientRect().width));
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

function niceStep(raw) {
  const power = 10 ** Math.floor(Math.log10(raw));
  const f = raw / power;
  const n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return n * power;
}

/** Evenly spaced axis ticks from 0 to a rounded maximum. */
export function niceTicks(max, count = 4, integer = false) {
  if (!(max > 0)) return [0, 1];
  let step = niceStep(max / count);
  if (integer) step = Math.max(1, Math.ceil(step));
  const top = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = 0; v <= top + step / 1000; v += step) ticks.push(Number(v.toFixed(6)));
  return ticks;
}

export const formatNumber = (v) => new Intl.NumberFormat('en-IN').format(v);

export const formatRupees = (v) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(v);
