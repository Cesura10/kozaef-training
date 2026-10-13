'use client';

import { useEffect, useRef, useState } from 'react';

const fmt = (v: number, d: number) => v.toLocaleString('es-ES', { maximumFractionDigits: d, minimumFractionDigits: d });

/**
 * Número que se desliza hasta el nuevo valor (feedback del cálculo). Estático con reduced motion.
 * Sin Motion a propósito: está en la portada y así no carga la librería antes de pintar.
 */
export function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    if (start === value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      from.current = value;
      const t = setTimeout(() => setShown(value), 0);
      return () => clearTimeout(t);
    }
    const t0 = performance.now();
    const dur = 600;
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = start + (value - start) * eased;
      from.current = v;
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span>{fmt(shown, decimals)}</span>;
}
